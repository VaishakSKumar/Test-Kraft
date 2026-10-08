"use client";

import { useEffect } from "react";
import { Lock, Play, RotateCcw, X, Zap } from "lucide-react";
import { PASS_PERCENT, UNITS, type Topic } from "@/data/syllabus";
import type { NodeState } from "./Roadmap";

interface Props {
  topic: Topic;
  state: NodeState;
  best?: number;
  attempts?: number;
  aiEnabled: boolean;
  onClose: () => void;
  onStart: () => void;
}

export default function TopicSheet({ topic, state, best, attempts, aiEnabled, onClose, onStart }: Props) {
  const unit = UNITS.find((u) => u.id === topic.unit);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="topic-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md animate-rise rounded-t-3xl border border-slate-800 bg-slate-900 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-700 sm:hidden" />
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200">
          <X className="h-5 w-5" />
        </button>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-bold text-cyan-300">
            Unit {unit?.id} · {unit?.title}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-300">
            <Zap className="h-3.5 w-3.5 fill-amber-300" />+{topic.xp} XP
          </span>
        </div>

        <h2 id="topic-title" className="mb-2 text-lg leading-snug font-bold text-slate-50">
          <span className="text-slate-500">#{topic.id}</span> {topic.title}
        </h2>
        <p className="mb-5 text-[13px] leading-relaxed text-slate-400">{topic.focus}.</p>

        <div className="mb-5 grid grid-cols-3 gap-2 text-center">
          <Stat label="Best" value={best !== undefined ? `${best}%` : "–"} tone={best !== undefined && best >= PASS_PERCENT ? "text-emerald-300" : "text-slate-200"} />
          <Stat label="Attempts" value={String(attempts ?? 0)} />
          <Stat label="To pass" value={`${PASS_PERCENT}%`} />
        </div>

        {state === "locked" ? (
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-[13px] text-slate-400">
            <Lock className="h-4 w-4 shrink-0" />
            Score {PASS_PERCENT}% or more on topic #{topic.id - 1} to unlock this one.
          </div>
        ) : (
          <button
            onClick={onStart}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold text-slate-950 transition active:translate-y-0.5 ${
              state === "active"
                ? "bg-amber-400 shadow-[0_4px_0_#b45309] hover:bg-amber-300"
                : "bg-emerald-400 shadow-[0_4px_0_#047857] hover:bg-emerald-300"
            }`}
          >
            {state === "active" ? <Play className="h-4 w-4 fill-slate-950" strokeWidth={0} /> : <RotateCcw className="h-4 w-4" />}
            {state === "active" ? "Start lesson" : "Review & retake"}
          </button>
        )}
        {state !== "locked" && (
          <p className="mt-3 text-center text-[11px] text-slate-500">
            {aiEnabled ? "Each attempt gets freshly generated questions." : "Questions are drawn from the built-in bank."}
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, tone = "text-slate-200" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 py-2.5">
      <p className={`text-base font-bold ${tone}`}>{value}</p>
      <p className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase">{label}</p>
    </div>
  );
}
