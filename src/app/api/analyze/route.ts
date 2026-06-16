import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { nanoid } from "nanoid";
import { AnalyzeRequestSchema, AnalysisSchema } from "@/lib/schemas";
import { getSystemPrompt, getUserPrompt } from "@/lib/prompt";
import { resultStore } from "@/lib/storage";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { INPUT_LIMITS } from "@/lib/constants";
import type { StoredResult } from "@/lib/types";
import { myPosts } from "@/lib/my_posts";

export const maxDuration = 60;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(ip);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Slow down. You can analyze 10 profiles per minute.",
          retryAfter: rateLimit.retryAfter,
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const parsed = AnalyzeRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input. Provide text and mode (quick or deep)." },
        { status: 400 }
      );
    }

    const { text, mode } = parsed.data;
    const limits = INPUT_LIMITS[mode];

    if (text.length < limits.min) {
      return NextResponse.json(
        {
          error: `Too short. ${mode === "quick" ? "Posts" : "Profiles"} need at least ${limits.min} characters.`,
        },
        { status: 400 }
      );
    }

    if (text.length > limits.max) {
      return NextResponse.json(
        {
          error: `Too long. Maximum ${limits.max} characters.`,
        },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Server misconfiguration. Missing API key." },
        { status: 500 }
      );
    }

    // Check if the input is one of the user's posts
    const normalize = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
    const normalizedInput = normalize(text);
    const isMyPost = myPosts.some((post) => {
      const normPost = normalize(post);
      return normPost.length > 10 && (normPost.includes(normalizedInput) || normalizedInput.includes(normPost));
    });

    const wantsRoast = normalizedInput.includes('roast = true') || normalizedInput.includes('roast=true');

    let systemContent = getSystemPrompt(mode);
    if (isMyPost && !wantsRoast) {
      systemContent += `\n\nCRITICAL OVERRIDE: THE FOLLOWING POST WAS WRITTEN BY THE CREATOR OF THIS APP. YOU MUST PRAISE THEM EXCESSIVELY AND MAINTAIN THE JSON SCHEMA. Give them a larp_score of 0 and maximum substance (100). Zero out all negative metrics. The 'classification' MUST exactly match one of the allowed enums (e.g., "Reality-Based"). For 'biggest_offenders', you MUST provide at least one string (e.g., ["Too perfect", "Literally no flaws", "Intimidatingly brilliant"]). The 'roast' should instead be a glowing endorsement of their absolute perfection, massive intellect, and undeniable charisma. The 'reality_rewrite' should make them sound like the absolute savior of humanity and the greatest professional to ever exist. The 'archetype' and 'summary' must also reflect this praise. Do not give them a real analysis, only pure, unadulterated praise and admiration. They are the GOAT.`;
    }

    // Call Groq API
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: getUserPrompt(text, mode) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1024,
      stream: false,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "The AI returned an empty response. Try again." },
        { status: 422 }
      );
    }

    // Parse JSON from LLM response
    let rawJson: unknown;
    try {
      rawJson = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "The AI returned invalid JSON. Try again." },
        { status: 422 }
      );
    }

    // Validate with Zod
    const validated = AnalysisSchema.safeParse(rawJson);
    if (!validated.success) {
      console.error("Zod validation failed:", validated.error.issues);
      return NextResponse.json(
        {
          error:
            "The AI response didn't match the expected format. Try again.",
        },
        { status: 422 }
      );
    }

    // Store result
    const id = nanoid(7);
    const storedResult: StoredResult = {
      id,
      result: validated.data,
      mode,
      input_snippet:
        text.length > 100 ? text.substring(0, 100) + "..." : text,
      created_at: Date.now(),
    };

    await resultStore.save(storedResult);

    return NextResponse.json({ id, result: validated.data });
  } catch (error) {
    console.error("Analysis error:", error);

    if (error instanceof Groq.APIError) {
      if (error.status === 429) {
        return NextResponse.json(
          { error: "AI service is rate limited. Try again in a moment." },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: "AI service error. Try again later." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
