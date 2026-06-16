"use client";

import { useState, useEffect } from "react";
import { LOADING_MESSAGES } from "@/lib/constants";

export function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
        setIsVisible(true);
      }, 300);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-8 flex gap-1">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-500" style={{ animationDelay: "0ms" }} />
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-500" style={{ animationDelay: "150ms" }} />
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-500" style={{ animationDelay: "300ms" }} />
      </div>
      <p
        className="font-mono text-sm text-neutral-400 transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        {LOADING_MESSAGES[messageIndex]}
      </p>
    </div>
  );
}
