import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { nanoid } from "nanoid";
import { AnalyzeRequestSchema, AnalysisSchema } from "@/lib/schemas";
import { getSystemPrompt, getUserPrompt } from "@/lib/prompt";
import { resultStore } from "@/lib/storage";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { INPUT_LIMITS } from "@/lib/constants";
import type { StoredResult } from "@/lib/types";

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
          error: `Too short. ${mode === "quick" ? "Headlines" : "Profiles"} need at least ${limits.min} characters.`,
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

    // Call Groq API
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: getSystemPrompt(mode) },
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
