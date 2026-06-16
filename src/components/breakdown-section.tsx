"use client";

import { useEffect, useState } from "react";
import type { Breakdown } from "@/lib/types";
import { BREAKDOWN_LABELS } from "@/lib/constants";
import { getBarColor } from "@/lib/utils";

interface BreakdownSectionProps {
  breakdown: Breakdown;
}

export function BreakdownSection({ breakdown }: BreakdownSectionProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const entries = Object.entries(breakdown) as [keyof Breakdown, number][];

  return (
    <div className="space-y-1">
      <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-4">Breakdown</h2>
      <div className="space-y-3">
        {entries.map(([key, value]) => {
          const meta = BREAKDOWN_LABELS[key];
          if (!meta) return null;

          const isSubstance = key === "substance";
          const barColor = isSubstance
            ? value >= 60 ? "bg-green-400" : value >= 30 ? "bg-amber-400" : "bg-red-400"
            : getBarColor(value);

          return (
            <div key={key} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-neutral-200">{meta.label}</span>
                  <span className="text-xs text-neutral-600 hidden sm:inline">{meta.description}</span>
                </div>
                <span className="text-sm font-mono text-neutral-400">{value}</span>
              </div>
              <div className="h-2 bg-neutral-800 rounded-sm overflow-hidden">
                <div
                  className={`h-full rounded-sm transition-all duration-1000 ease-out ${barColor}`}
                  style={{ width: animate ? `${value}%` : "0%" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
