import type { McqQuestion } from "@/lib/schema";
import CodeBlock from "../CodeBlock";
import { looksLikeCode } from "../RichText";

interface Props {
  q: McqQuestion;
  choice: number | null;
  checked: boolean;
  onChange: (choice: number) => void;
}

export default function Mcq({ q, choice, checked, onChange }: Props) {
  return (
    <div className="space-y-3">
      {q.code && <CodeBlock code={q.code} />}
      <div className="space-y-2.5" role="radiogroup">
        {q.options.map((option, i) => {
          const selected = choice === i;
          const state = !checked
            ? selected
              ? "border-cyan-400 bg-cyan-500/10 text-cyan-50 ring-1 ring-cyan-400/50"
              : "border-slate-800 bg-slate-900/60 text-slate-200 hover:border-slate-600"
            : i === q.answer
              ? "border-emerald-400 bg-emerald-500/15 text-emerald-50"
              : selected
                ? "border-rose-400 bg-rose-500/10 text-rose-100"
                : "border-slate-800 bg-slate-900/40 text-slate-500";
          return (
            <button
              key={i}
              role="radio"
              aria-checked={selected}
              disabled={checked}
              onClick={() => onChange(i)}
              className={`flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left text-[13px] leading-snug transition-all active:scale-[0.99] ${state}`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[11px] font-bold ${
                  selected && !checked ? "border-cyan-300 bg-cyan-400 text-slate-950" : "border-slate-700 text-slate-400"
                }`}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className={`pt-0.5 ${looksLikeCode(option) ? "font-mono text-[12.5px]" : "text-[13.5px]"}`}>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
