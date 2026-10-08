"use client";

import { useMemo } from "react";
import type { OrderQuestion } from "@/lib/schema";
import { shuffle } from "@/lib/shuffle";

interface Props {
  q: OrderQuestion;
  lines: string[];
  checked: boolean;
  onChange: (lines: string[]) => void;
}

/** Code builder: tap lines from the pool to append them; tap a placed line to send it back. */
export default function Order({ q, lines, checked, onChange }: Props) {
  const pool = useMemo(() => shuffle([...q.lines, ...(q.distractors ?? [])]), [q]);
  const remaining = pool.filter((l) => !lines.includes(l));

  return (
    <div className="space-y-4">
      <div className="min-h-36 space-y-1.5 rounded-2xl border-2 border-dashed border-slate-700/80 bg-slate-950/50 p-2.5">
        {lines.length === 0 && <p className="p-3 text-center text-[12px] text-slate-500">Tap the lines below in the correct order</p>}
        {lines.map((line, i) => {
          const ok = q.lines[i] === line;
          return (
            <button
              key={line}
              disabled={checked}
              onClick={() => onChange(lines.filter((l) => l !== line))}
              className={`flex w-full animate-pop items-start gap-2 rounded-lg border px-2.5 py-2 text-left font-mono text-[12px] whitespace-pre-wrap transition ${
                checked
                  ? ok
                    ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-100"
                    : "border-rose-500/60 bg-rose-500/10 text-rose-100"
                  : "border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-500"
              }`}
            >
              <span className="w-4 shrink-0 pt-px text-right text-[10px] text-slate-500">{i + 1}</span>
              <span>{line}</span>
            </button>
          );
        })}
      </div>

      {!checked && (
        <div className="space-y-1.5">
          {remaining.map((line) => (
            <button
              key={line}
              disabled={lines.length >= q.lines.length}
              onClick={() => onChange([...lines, line])}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/70 px-2.5 py-2 text-left font-mono text-[12px] whitespace-pre-wrap text-slate-100 shadow-sm transition hover:border-cyan-500/60 active:scale-[0.99] disabled:opacity-40"
            >
              {line}
            </button>
          ))}
          {q.distractors?.length ? (
            <p className="pt-1 text-[11px] text-slate-500">Careful: {q.distractors.length === 1 ? "one line doesn't" : "some lines don't"} belong.</p>
          ) : null}
        </div>
      )}

      {checked && lines.some((l, i) => q.lines[i] !== l) && (
        <div>
          <p className="mb-1.5 text-[11px] font-semibold tracking-wide text-emerald-300 uppercase">Correct order</p>
          <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70 p-3 font-mono text-[12px] leading-relaxed text-slate-200">
            {q.lines.join("\n")}
          </pre>
        </div>
      )}
    </div>
  );
}
