"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Flame, Search, Sparkles, X, Zap } from "lucide-react";
import { COURSE_TITLE, TOPICS, type Topic } from "@/data/syllabus";
import { APP_NAME, APP_TAGLINE } from "@/lib/brand";
import Roadmap, { type NodeState, type RoadmapHandle } from "./Roadmap";
import TopicSheet from "./TopicSheet";
import LessonRunner from "./LessonRunner";

interface Progress {
  topics: { topicId: number; bestPercent: number; attempts: number; completed: boolean }[];
  activeId: number | null;
  xp: number;
  streak: number;
  aiEnabled: boolean;
}

export default function AppShell() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Topic | null>(null);
  const [running, setRunning] = useState<Topic | null>(null);
  const [query, setQuery] = useState("");
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const roadmap = useRef<RoadmapHandle>(null);
  const didScroll = useRef(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/progress", { cache: "no-store" });
      if (!res.ok) throw new Error(`Progress request failed (${res.status})`);
      setProgress(await res.json());
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Jump to the current topic on first load.
  useEffect(() => {
    if (progress && !didScroll.current) {
      didScroll.current = true;
      const target = progress.activeId ?? TOPICS[TOPICS.length - 1].id;
      requestAnimationFrame(() => roadmap.current?.scrollTo(target, "auto"));
    }
  }, [progress]);

  const byId = useMemo(() => new Map(progress?.topics.map((t) => [t.topicId, t]) ?? []), [progress]);

  const stateOf = useCallback(
    (id: number): NodeState => {
      if (byId.get(id)?.completed) return "completed";
      return progress?.activeId === id ? "active" : "locked";
    },
    [byId, progress?.activeId],
  );
  const bestOf = useCallback((id: number) => byId.get(id)?.bestPercent, [byId]);

  const completedCount = progress?.topics.filter((t) => t.completed).length ?? 0;
  const percent = Math.round((completedCount / TOPICS.length) * 100);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return TOPICS.filter((t) => t.title.toLowerCase().includes(q) || t.focus.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  const jumpTo = (topic: Topic) => {
    setQuery("");
    setHighlightId(topic.id);
    roadmap.current?.scrollTo(topic.id);
    setTimeout(() => setHighlightId(null), 2500);
  };

  const overlayOpen = !!selected || !!running;
  const active = progress?.activeId ? TOPICS.find((t) => t.id === progress.activeId) : null;

  return (
    <div className="min-h-dvh pb-24">
      {/* Header */}
      <header inert={overlayOpen} className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-md items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo.svg" alt="" className="h-10 w-10 drop-shadow-[0_4px_12px_rgba(16,185,129,0.25)]" />
            <div>
              <h1 className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-lg leading-tight font-extrabold tracking-tight text-transparent">
                {APP_NAME}
              </h1>
              <p className="text-[10px] font-semibold tracking-[0.14em] text-slate-500 uppercase">{APP_TAGLINE}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Pill title="Day streak" className="border-amber-500/25 bg-amber-500/10 text-amber-300">
              <Flame className={`h-4 w-4 ${progress?.streak ? "fill-amber-400" : ""}`} />
              {progress?.streak ?? 0}
            </Pill>
            <Pill title="Total XP" className="border-cyan-500/25 bg-cyan-500/10 text-cyan-300">
              <Zap className="h-4 w-4 fill-cyan-400" />
              {progress?.xp ?? 0}
            </Pill>
          </div>
        </div>
      </header>

      <main inert={overlayOpen} className="mx-auto max-w-md px-4 pt-5">
        {/* Course card */}
        <section className="relative mb-5 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-300 uppercase">
              Active course
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {completedCount}/{TOPICS.length} topics
            </span>
          </div>
          <h2 className="mb-4 flex items-start gap-2 text-[15px] leading-snug font-bold text-slate-100">
            <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
            {COURSE_TITLE}
          </h2>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-700" style={{ width: `${percent}%` }} />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-[11px] font-medium text-slate-400">{percent}% complete</p>
            {active && (
              <button
                onClick={() => setSelected(active)}
                className="rounded-xl bg-amber-400 px-3 py-1.5 text-[12px] font-extrabold text-slate-950 shadow-[0_3px_0_#b45309] active:translate-y-0.5"
              >
                Continue #{active.id}
              </button>
            )}
          </div>
          {progress && !progress.aiEnabled && (
            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
              <Sparkles className="h-3.5 w-3.5" /> AI questions are off. Using the built-in question bank.
            </p>
          )}
        </section>

        {/* Search */}
        <div className="relative z-30 mb-4">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a topic: locators, fixtures, Docker…"
            aria-label="Search topics"
            className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 py-3 pr-10 pl-10 text-[13px] text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search" className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-500 hover:text-slate-200">
              <X className="h-4 w-4" />
            </button>
          )}
          {query && (
            <ul className="absolute inset-x-0 top-full mt-2 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
              {matches.length === 0 && <li className="px-4 py-3 text-[13px] text-slate-500">No topics match “{query}”.</li>}
              {matches.map((t) => {
                const s = stateOf(t.id);
                return (
                  <li key={t.id}>
                    <button onClick={() => jumpTo(t)} className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-800">
                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${s === "completed" ? "bg-emerald-400" : s === "active" ? "bg-amber-400" : "bg-slate-600"}`}
                      />
                      <span className="text-[13px] text-slate-200">
                        <span className="text-slate-500">#{t.id}</span> {t.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-[13px] text-rose-200">
            {error}{" "}
            <button onClick={refresh} className="font-semibold underline">
              Retry
            </button>
          </div>
        )}

        {/* Learning path */}
        {progress ? (
          <Roadmap ref={roadmap} stateOf={stateOf} bestOf={bestOf} highlightId={highlightId} onSelect={setSelected} />
        ) : (
          !error && <div className="mt-10 text-center text-sm text-slate-500">Loading your path…</div>
        )}
      </main>

      {selected && (
        <TopicSheet
          topic={selected}
          state={stateOf(selected.id)}
          best={bestOf(selected.id)}
          attempts={byId.get(selected.id)?.attempts}
          aiEnabled={progress?.aiEnabled ?? false}
          onClose={() => setSelected(null)}
          onStart={() => {
            setRunning(selected);
            setSelected(null);
          }}
        />
      )}

      {running && (
        <LessonRunner
          key={running.id}
          topic={running}
          onAttemptSaved={refresh}
          onClose={() => {
            setRunning(null);
            requestAnimationFrame(() => progress?.activeId && roadmap.current?.scrollTo(progress.activeId));
          }}
        />
      )}
    </div>
  );
}

function Pill({ children, className, title }: { children: React.ReactNode; className: string; title: string }) {
  return (
    <div title={title} className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${className}`}>
      {children}
    </div>
  );
}
