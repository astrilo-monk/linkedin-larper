"use client";

import { useState, useEffect } from "react";
import type { AnalysisResult } from "@/lib/types";
import { getScoreColor } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ScoreDisplayProps {
  result: AnalysisResult;
}

export function ScoreDisplay({ result }: ScoreDisplayProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const realityScore = 100 - result.larp_score;

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = result.larp_score / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), result.larp_score);
      setDisplayScore(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [result.larp_score]);

  const larpBarWidth = `${result.larp_score}%`;
  const realBarWidth = `${realityScore}%`;

  return (
    <div id="score-card" className="border border-neutral-700 rounded-md p-6 sm:p-8 bg-neutral-950">
      {/* Reality Gap - Hero Number */}
      <div className="text-center mb-8">
        <p className="text-sm font-mono text-neutral-500 mb-2 uppercase tracking-widest">Reality Gap</p>
        <p className={`text-6xl sm:text-7xl font-bold font-mono tracking-tighter ${getScoreColor(result.larp_score)}`}>
          +{displayScore}%
        </p>
      </div>

      {/* LARP vs Reality bars */}
      <div className="space-y-3 mb-8">
        <div className="flex items-center gap-3">
          <span className="w-12 text-xs font-mono text-neutral-500 text-right shrink-0">LARP</span>
          <div className="flex-1 h-4 bg-neutral-800 rounded-sm overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-sm transition-all duration-1000 ease-out"
              style={{ width: larpBarWidth }}
            />
          </div>
          <span className="w-10 text-xs font-mono text-neutral-400 text-right">{result.larp_score}%</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-12 text-xs font-mono text-neutral-500 text-right shrink-0">Real</span>
          <div className="flex-1 h-4 bg-neutral-800 rounded-sm overflow-hidden">
            <div
              className="h-full bg-neutral-500 rounded-sm transition-all duration-1000 ease-out"
              style={{ width: realBarWidth }}
            />
          </div>
          <span className="w-10 text-xs font-mono text-neutral-400 text-right">{realityScore}%</span>
        </div>
      </div>

      {/* Archetype + Classification */}
      <div className="text-center space-y-2">
        <p className="text-lg font-mono text-neutral-200">
          「 {result.archetype} 」
        </p>
        <Badge variant="outline" className="border-neutral-600 text-neutral-400 font-mono text-xs">
          {result.classification}
        </Badge>
      </div>
    </div>
  );
}
