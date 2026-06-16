"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScoreDisplay } from "@/components/score-display";
import { BreakdownSection } from "@/components/breakdown-section";
import { DetailsSection } from "@/components/details-section";
import { ResultActions } from "@/components/result-actions";
import { Separator } from "@/components/ui/separator";
import type { StoredResult } from "@/lib/types";

interface ResultPageClientProps {
  id: string;
}

export function ResultPageClient({ id }: ResultPageClientProps) {
  const [data, setData] = useState<StoredResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      try {
        const res = await fetch(`/api/result/${id}`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Result not found.");
        }
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load result."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [id]);

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="mx-auto w-full max-w-2xl px-6 py-12 sm:py-16">
          {loading && (
            <div className="flex flex-col items-center py-20">
              <div className="mb-4 flex gap-1">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                <span
                  className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-500"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-500"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
              <p className="font-mono text-sm text-neutral-500">
                Loading result...
              </p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center py-20">
              <p className="text-neutral-400 mb-4">{error}</p>
              <Link
                href="/"
                className="text-amber-500 underline underline-offset-4 hover:text-amber-400 font-mono text-sm"
              >
                Analyze a profile →
              </Link>
            </div>
          )}

          {data && (
            <div className="space-y-8">
              {/* Score Card */}
              <ScoreDisplay result={data.result} />

              <Separator className="bg-neutral-800" />

              {/* Breakdown */}
              <BreakdownSection breakdown={data.result.breakdown} />

              <Separator className="bg-neutral-800" />

              {/* Details */}
              <DetailsSection result={data.result} />

              <Separator className="bg-neutral-800" />

              {/* Actions */}
              <ResultActions result={data.result} resultId={id} />

              {/* CTA */}
              <div className="pt-4 text-center">
                <Link
                  href="/"
                  className="text-sm text-neutral-500 hover:text-neutral-300 font-mono transition-colors"
                >
                  Think you can do worse? →
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
