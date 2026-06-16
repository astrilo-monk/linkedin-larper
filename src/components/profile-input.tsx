"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ScanMode } from "@/lib/types";
import { QUICK_EXAMPLES, DEEP_EXAMPLES, INPUT_LIMITS } from "@/lib/constants";

interface ProfileInputProps {
  mode: ScanMode;
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

export function ProfileInput({ mode, onAnalyze, isLoading }: ProfileInputProps) {
  const [text, setText] = useState("");
  const [exampleIndex, setExampleIndex] = useState(0);

  const limits = INPUT_LIMITS[mode];
  const examples = mode === "quick" ? QUICK_EXAMPLES : DEEP_EXAMPLES;

  const handleExample = () => {
    const example = examples[exampleIndex % examples.length];
    setText(example);
    setExampleIndex((i) => i + 1);
  };

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (trimmed.length >= limits.min && trimmed.length <= limits.max) {
      onAnalyze(trimmed);
    }
  };

  const isValid = text.trim().length >= limits.min && text.trim().length <= limits.max;

  return (
    <div className="space-y-4">
      {mode === "quick" ? (
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Chief Synergy Officer | AI Whisperer | Building the Future™'
          disabled={isLoading}
          maxLength={limits.max}
          className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-4 py-3 font-mono text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-colors"
          onKeyDown={(e) => {
            if (e.key === "Enter" && isValid && !isLoading) handleSubmit();
          }}
        />
      ) : (
        <div className="relative">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your full LinkedIn profile here... About section, experience, the works."
            disabled={isLoading}
            maxLength={limits.max}
            rows={8}
            className="resize-none border-neutral-700 bg-neutral-900 font-mono text-sm placeholder:text-neutral-600 focus:border-amber-500 focus:ring-amber-500/50"
          />
          <span className="absolute bottom-2 right-3 text-xs text-neutral-600">
            {text.length.toLocaleString()} / {limits.max.toLocaleString()}
          </span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className="bg-amber-500 text-neutral-900 font-semibold hover:bg-amber-400 disabled:opacity-40"
        >
          {isLoading ? "Analyzing..." : "Analyze"}
        </Button>
        <button
          onClick={handleExample}
          disabled={isLoading}
          type="button"
          className="text-sm text-neutral-500 underline underline-offset-4 transition-colors hover:text-neutral-300 disabled:opacity-40"
        >
          Try an example
        </button>
      </div>
    </div>
  );
}
