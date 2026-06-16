import type { AnalysisResult } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

interface DetailsSectionProps {
  result: AnalysisResult;
}

export function DetailsSection({ result }: DetailsSectionProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <section>
        <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-3">Assessment</h2>
        <p className="text-neutral-300 leading-relaxed">{result.summary}</p>
      </section>

      <Separator className="bg-neutral-800" />

      {/* Biggest Offenders */}
      <section>
        <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-3">Biggest Offenders</h2>
        <ul className="space-y-2">
          {result.biggest_offenders.map((offender, i) => (
            <li key={i} className="flex gap-2 text-neutral-300">
              <span className="text-amber-500 shrink-0">›</span>
              <span className="font-mono text-sm">&ldquo;{offender}&rdquo;</span>
            </li>
          ))}
        </ul>
      </section>

      <Separator className="bg-neutral-800" />

      {/* Roast */}
      <section>
        <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-3">The Roast</h2>
        <p className="text-neutral-200 leading-relaxed italic">{result.roast}</p>
      </section>

      <Separator className="bg-neutral-800" />

      {/* Reality Rewrite */}
      <section>
        <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-3">Reality Rewrite</h2>
        <div className="border-l-2 border-amber-500/50 pl-4">
          <p className="text-neutral-300 font-mono text-sm leading-relaxed whitespace-pre-line">
            {result.reality_rewrite}
          </p>
        </div>
      </section>
    </div>
  );
}
