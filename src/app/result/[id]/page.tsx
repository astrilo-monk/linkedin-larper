import type { Metadata } from "next";
import { ResultPageClient } from "./client";

interface ResultPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ResultPageProps): Promise<Metadata> {
  const { id } = await params;

  // Try to fetch result for dynamic metadata
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/result/${id}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      return {
        title: `LARP Score: ${data.result.larp_score} — ${data.result.archetype} | LARPIn`,
        description: data.result.roast,
        openGraph: {
          title: `LARP Score: ${data.result.larp_score}/100 — ${data.result.archetype}`,
          description: data.result.roast,
          siteName: "LARPIn",
        },
        twitter: {
          card: "summary",
          title: `LARP Score: ${data.result.larp_score}/100`,
          description: data.result.roast,
        },
      };
    }
  } catch {
    // Fall through to default metadata
  }

  return {
    title: `Result ${id} | LARPIn`,
    description: "See the LinkedIn LARP Score analysis.",
  };
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { id } = await params;
  return <ResultPageClient id={id} />;
}
