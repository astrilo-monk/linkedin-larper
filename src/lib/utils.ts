import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AnalysisResult, Classification } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getClassification(score: number): Classification {
  if (score <= 20) return "Reality-Based";
  if (score <= 40) return "Slight LinkedIn Syndrome";
  if (score <= 60) return "Moderate LARP";
  if (score <= 80) return "Advanced LARP";
  return "Legendary LARP";
}

export function getScoreColor(score: number): string {
  if (score <= 20) return "text-green-400";
  if (score <= 40) return "text-green-300";
  if (score <= 60) return "text-amber-400";
  if (score <= 80) return "text-orange-400";
  return "text-red-400";
}

export function getBarColor(score: number): string {
  if (score <= 20) return "bg-green-400";
  if (score <= 40) return "bg-green-300";
  if (score <= 60) return "bg-amber-400";
  if (score <= 80) return "bg-orange-400";
  return "bg-red-400";
}

export function generateShareText(result: AnalysisResult, id: string): string {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/result/${id}`
      : "";
  return `My LinkedIn LARP Score: ${result.larp_score}/100\nArchetype: ${result.archetype}\nClassification: ${result.classification}\n\n${result.roast}\n\nCheck yours: ${url}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
