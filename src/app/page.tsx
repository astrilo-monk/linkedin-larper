"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ModeToggle } from "@/components/mode-toggle";
import { ProfileInput } from "@/components/profile-input";
import { LoadingState } from "@/components/loading-state";
import type { ScanMode, ApiError } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const [mode, setMode] = useState<ScanMode>("quick");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(
    async (text: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, mode }),
        });

        if (!response.ok) {
          const data = (await response.json()) as ApiError;
          throw new Error(data.error || "Something went wrong.");
        }

        const data = await response.json();
        router.push(`/result/${data.id}`);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong. Try again."
        );
        setIsLoading(false);
      }
    },
    [mode, router]
  );

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-24">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <LoadingState />
              </motion.div>
            ) : (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Hero */}
                <div className="mb-10">
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                    Find out how much you&apos;re
                    <br />
                    <span className="text-amber-500">LARPing</span> on LinkedIn
                  </h1>
                  <p className="text-neutral-400 text-base sm:text-lg">
                    Paste your headline or profile. We&apos;ll measure the gap
                    between your LinkedIn and reality.
                  </p>
                </div>

                {/* Mode Toggle */}
                <div className="mb-6">
                  <ModeToggle
                    mode={mode}
                    onChange={setMode}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-neutral-600 mt-2 font-mono">
                    {mode === "quick"
                      ? "Paste your post for analysis."
                      : "Paste your full profile for deep analysis."}
                  </p>
                </div>

                {/* Input */}
                <ProfileInput
                  mode={mode}
                  onAnalyze={handleAnalyze}
                  isLoading={isLoading}
                />

                {/* Error */}
                {error && (
                  <div className="mt-4 rounded-md border border-red-900/50 bg-red-950/30 px-4 py-3">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
