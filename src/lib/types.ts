export type ScanMode = "quick" | "deep";

export interface Breakdown {
  buzzword_density: number;
  title_inflation: number;
  achievement_inflation: number;
  thought_leadership: number;
  founder_energy: number;
  ai_hype: number;
  substance: number;
}

export type Classification =
  | "Reality-Based"
  | "Slight LinkedIn Syndrome"
  | "Moderate LARP"
  | "Advanced LARP"
  | "Legendary LARP";

export interface AnalysisResult {
  larp_score: number;
  classification: Classification;
  breakdown: Breakdown;
  archetype: string;
  summary: string;
  biggest_offenders: string[];
  roast: string;
  reality_rewrite: string;
}

export interface StoredResult {
  id: string;
  result: AnalysisResult;
  mode: ScanMode;
  input_snippet: string;
  created_at: number;
}

export interface AnalyzeRequest {
  text: string;
  mode: ScanMode;
}

export interface AnalyzeResponse {
  id: string;
  result: AnalysisResult;
}

export interface ApiError {
  error: string;
  retryAfter?: number;
}
