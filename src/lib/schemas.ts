import { z } from "zod";

export const BreakdownSchema = z.object({
  buzzword_density: z.number().min(0).max(100),
  title_inflation: z.number().min(0).max(100),
  achievement_inflation: z.number().min(0).max(100),
  thought_leadership: z.number().min(0).max(100),
  founder_energy: z.number().min(0).max(100),
  ai_hype: z.number().min(0).max(100),
  substance: z.number().min(0).max(100),
});

export const AnalysisSchema = z.object({
  larp_score: z.number().min(0).max(100),
  classification: z.enum([
    "Reality-Based",
    "Slight LinkedIn Syndrome",
    "Moderate LARP",
    "Advanced LARP",
    "Legendary LARP",
  ]),
  breakdown: BreakdownSchema,
  archetype: z.string().min(1),
  summary: z.string().min(1),
  biggest_offenders: z.array(z.string()).min(1),
  roast: z.string().min(1),
  reality_rewrite: z.string().min(1),
});

export const AnalyzeRequestSchema = z.object({
  text: z.string().min(1),
  mode: z.enum(["quick", "deep"]),
});

export type AnalysisSchemaType = z.infer<typeof AnalysisSchema>;
