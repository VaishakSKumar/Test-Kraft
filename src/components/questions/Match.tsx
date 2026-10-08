"use client";

import { useMemo, useState } from "react";
import type { MatchQuestion } from "@/lib/schema";
import { shuffle } from "@/lib/shuffle";

interface Props {
  q: MatchQuestion;
  /** left index -> right index (both index into q.pairs; correct when equal) */
  pairs: Record<number, number>;
  checked: boolean;
  onChange: (pairs: Record<number, number>) => void;
}

const PAIR_COLORS = [
  "border-cyan-400 bg-cyan-500/15 text-cyan-50",
  "border-violet-400 bg-violet-500/15 text-violet-50",
  "border-amber-400 bg-amber-500/15 text-amber-50",
  "border-pink-400 bg-pink-500/15 text-pink-50",
  "border-sky-400 bg-sky-500/15 text-sky-50",
];

/** Tap a left item, then a right item, to pair them. Tap a paired item to unpair it. */
export default function Match({ q, pairs, checked, onChange }: Props) {
  const rightOrder = useMemo(() => shuffle(q.pairs.map((_, i) => i)), [q]);
  const [activeLeft, setActiveLeft] = useState<number | null>(0);

  const ownerOf = (right: number) => {
    const key = Object.keys(pairs).find((l) => pairs[Number(l)] === right);
    return key === undefined ? -1 : Number(key);
  };
  const colorOf = (left: number) => PAIR_COLORS[left % PAIR_COLORS.length];

  const unpair = (left: number) => {
    const next = { ...pairs };
    delete next[left];
    return next;
  };

  const tapLeft = (left: number) => {
    if (pairs[left] !== undefined) onChange(unpair(left));
    setActiveLeft(left);
  };

  const tapRight = (right: number) => {
    const owner = ownerOf(right);
    if (activeLeft === null) {
      if (owner !== -1) onChange(unpair(owner));
      return;
    }
    const next = owner !== -1 ? unpair(owner) : { ...pairs };
    next[activeLeft] = right;
    onChange(next);
    const nextFree = q.pairs.findIndex((_, i) => next[i] === undefined);
    setActiveLeft(nextFree === -1 ? null : nextFree);
  };

  const resultClass = (left: number) =>
    pairs[left] === left
      ? "border-emerald-400 bg-emerald-500/15 text-emerald-50"
      : "border-rose-400 bg-rose-500/10 text-rose-100";

  return (
    <div className="space-y-3">
      {!checked && <p className="text-[11px] font-medium text-slate-400">Tap an item on the left, then its match on the right.</p>}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="space-y-2.5">
          {q.pairs.map((p, left) => {
            const cls = checked
              ? resultClass(left)
              : activeLeft === left
                ? "border-white/70 bg-slate-800 text-white ring-2 ring-cyan-400/40"
                : pairs[left] !== undefined
                  ? colorOf(left)
                  : "border-slate-800 bg-slate-900/70 text-slate-200";
            return (
              <button
                key={left}
                onClick={() => tapLeft(left)}
                disabled={checked}
                className={`min-h-14 w-full rounded-2xl border p-2.5 text-left font-mono text-[12px] leading-snug break-words transition active:scale-[0.98] ${cls}`}
              >
                {p.left}
              </button>
            );
          })}
        </div>
        <div className="space-y-2.5">
          {rightOrder.map((right) => {
            const owner = ownerOf(right);
            const cls = checked
              ? owner !== -1
                ? resultClass(owner)
                : "border-slate-800 text-slate-500"
              : owner !== -1
                ? colorOf(owner)
                : activeLeft !== null
                  ? "border-slate-600 bg-slate-900 text-slate-100"
                  : "border-slate-800 bg-slate-900/70 text-slate-300";
            return (
              <button
                key={right}
                onClick={() => tapRight(right)}
                disabled={checked}
                className={`min-h-14 w-full rounded-2xl border p-2.5 text-left text-[12px] leading-snug break-words transition active:scale-[0.98] ${cls}`}
              >
                {q.pairs[right].right}
              </button>
            );
          })}
        </div>
      </div>
      {checked && q.pairs.some((_, left) => pairs[left] !== left) && (
        <ul className="space-y-1 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-[12px] text-slate-300">
          {q.pairs.map((p, i) => (
            <li key={i}>
              <span className="font-mono text-emerald-300">{p.left}</span> → {p.right}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
