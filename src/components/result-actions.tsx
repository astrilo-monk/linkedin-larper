"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/lib/types";
import { generateShareText, copyToClipboard } from "@/lib/utils";
import * as htmlToImage from "html-to-image";

interface ResultActionsProps {
  result: AnalysisResult;
  resultId: string;
}

export function ResultActions({ result, resultId }: ResultActionsProps) {
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopyShare = useCallback(async () => {
    const text = generateShareText(result, resultId);
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  }, [result, resultId]);

  const handleCopyLink = useCallback(async () => {
    const url = `${window.location.origin}/result/${resultId}`;
    const success = await copyToClipboard(url);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  }, [resultId]);

  const handleDownload = useCallback(async () => {
    const node = document.getElementById("score-card");
    if (!node) return;

    setDownloading(true);
    try {
      const dataUrl = await htmlToImage.toPng(node, {
        backgroundColor: "#0a0a0a",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `larpin-score-${resultId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setDownloading(false);
    }
  }, [resultId]);

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyShare}
        className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 font-mono text-xs"
      >
        {copiedShare ? "Copied!" : "Copy Results"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 font-mono text-xs"
      >
        {copiedLink ? "Copied!" : "Copy Link"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        disabled={downloading}
        className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 font-mono text-xs"
      >
        {downloading ? "Saving..." : "Download Image"}
      </Button>
      <a href="/">
        <Button
          variant="outline"
          size="sm"
          className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 font-mono text-xs"
        >
          Analyze Another
        </Button>
      </a>
    </div>
  );
}
