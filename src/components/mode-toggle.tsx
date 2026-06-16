"use client";

import { cn } from "@/lib/utils";
import type { ScanMode } from "@/lib/types";

interface ModeToggleProps {
  mode: ScanMode;
  onChange: (mode: ScanMode) => void;
  disabled?: boolean;
}

export function ModeToggle({ mode, onChange, disabled }: ModeToggleProps) {
  return (
    <div className="inline-flex rounded-md border border-neutral-700 p-0.5">
      <button
        onClick={() => onChange("quick")}
        disabled={disabled}
        className={cn(
          "rounded-sm px-4 py-1.5 text-sm font-medium transition-colors",
          mode === "quick"
            ? "bg-neutral-100 text-neutral-900"
            : "text-neutral-400 hover:text-neutral-200"
        )}
      >
        Post Scan
      </button>
      <button
        onClick={() => onChange("deep")}
        disabled={disabled}
        className={cn(
          "rounded-sm px-4 py-1.5 text-sm font-medium transition-colors",
          mode === "deep"
            ? "bg-neutral-100 text-neutral-900"
            : "text-neutral-400 hover:text-neutral-200"
        )}
      >
        Profile Scan
      </button>
    </div>
  );
}
