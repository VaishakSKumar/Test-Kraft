"use client";

import { useRef, useState } from "react";
import type { FillQuestion } from "@/lib/schema";
import { normalize } from "@/lib/grade";

interface Props {
  q: FillQuestion;
  values: string[];
  checked: boolean;
  onChange: (values: string[]) => void;
}

export default function Fill({ q, values, checked, onChange }: Props) {
  const [focused, setFocused] = useState(0);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const segments = q.code.split("___");
  const isRight = (i: number) => q.blanks[i].some((ok) => normalize(ok) === normalize(values[i] ?? ""));

  const setValue = (i: number, v: string) => {
    const next = [...values];
    next[i] = v;
    onChange(next);
  };

  // A chip fills the focused blank if it is empty, otherwise the first empty blank.
  const applyChip = (chip: string) => {
    const firstEmpty = values.findIndex((v) => v === "");
    const i = values[focused] === "" || firstEmpty === -1 ? focused : firstEmpty;
    setValue(i, chip);
    const nextEmpty = values.findIndex((v, j) => j !== i && v === "");
    if (nextEmpty !== -1) {
      setFocused(nextEmpty);
      inputs.current[nextEmpty]?.focus();
    }
  };

  return (
    <div className="space-y-4">
      <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 font-mono text-[12.5px] leading-[2.2] whitespace-pre-wrap text-slate-200">
        {segments.map((seg, i) => (
          <span key={i}>
            {seg}
            {i < segments.length - 1 && (
              <span className="inline-flex flex-col align-middle">
                <input
                  ref={(el) => {
                    inputs.current[i] = el;
                  }}
                  value={values[i] ?? ""}
                  disabled={checked}
                  onFocus={() => setFocused(i)}
                  onChange={(e) => setValue(i, e.target.value)}
                  aria-label={`Blank ${i + 1}`}
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoComplete="off"
                  spellCheck={false}
                  size={Math.max(4, (values[i] ?? "").length + 1, q.blanks[i][0].length)}
                  className={`mx-0.5 rounded-md border-b-2 bg-slate-900 px-1.5 py-0.5 text-center font-mono font-semibold outline-none ${
                    checked
                      ? isRight(i)
                        ? "border-emerald-400 text-emerald-300"
                        : "border-rose-400 text-rose-300 line-through"
                      : focused === i
                        ? "border-cyan-400 text-cyan-200"
                        : "border-slate-600 text-cyan-200"
                  }`}
                />
                {checked && !isRight(i) && (
                  <span className="text-center text-[11px] leading-tight text-emerald-300">{q.blanks[i][0]}</span>
                )}
              </span>
            )}
          </span>
        ))}
      </pre>

      {q.choices && !checked && (
        <div className="flex flex-wrap gap-2">
          {q.choices.map((chip) => (
            <button
              key={chip}
              onClick={() => applyChip(chip)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-[12.5px] text-slate-100 shadow-sm transition hover:border-cyan-500/60 active:scale-95"
            >
              {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
