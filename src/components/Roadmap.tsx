"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Check, Lock, Play, Trophy } from "lucide-react";
import { TOPICS, UNITS, type Topic } from "@/data/syllabus";

export type NodeState = "completed" | "active" | "locked";

interface Props {
  stateOf: (topicId: number) => NodeState;
  bestOf: (topicId: number) => number | undefined;
  highlightId: number | null;
  onSelect: (topic: Topic) => void;
}

export interface RoadmapHandle {
  scrollTo: (topicId: number, behavior?: ScrollBehavior) => void;
}

const NODE_ROW = 144; // px per topic row
const UNIT_ROW = 96; // px per unit banner
const TOP_PAD = 16;
// Horizontal offsets (% of width) for a gentle S-curve, repeating every 8 nodes.
const OFFSETS = [0, 17, 26, 17, 0, -17, -26, -17];

type Row =
  | { kind: "unit"; unitId: number; y: number }
  | { kind: "node"; topic: Topic; x: number; y: number }
  | { kind: "finish"; x: number; y: number };

function layout(): { rows: Row[]; height: number } {
  const rows: Row[] = [];
  let y = TOP_PAD;
  TOPICS.forEach((topic, i) => {
    if (i === 0 || TOPICS[i - 1].unit !== topic.unit) {
      rows.push({ kind: "unit", unitId: topic.unit, y });
      y += UNIT_ROW;
    }
    rows.push({ kind: "node", topic, x: 50 + OFFSETS[i % OFFSETS.length], y: y + NODE_ROW / 2 - 14 });
    y += NODE_ROW;
  });
  rows.push({ kind: "finish", x: 50, y: y + 30 });
  return { rows, height: y + 110 };
}

const Roadmap = forwardRef<RoadmapHandle, Props>(function Roadmap({ stateOf, bestOf, highlightId, onSelect }, ref) {
  const { rows, height } = useMemo(layout, []);
  const nodeRefs = useRef(new Map<number, HTMLDivElement>());

  useImperativeHandle(ref, () => ({
    scrollTo(topicId, behavior = "smooth") {
      nodeRefs.current.get(topicId)?.scrollIntoView({ block: "center", behavior });
    },
  }));

  const points = rows.filter((r) => r.kind !== "unit") as Extract<Row, { x: number }>[];

  // One S-curve per pair of consecutive nodes.
  const segments = points.slice(1).map((to, i) => {
    const from = points[i];
    const midY = (from.y + to.y) / 2;
    const d = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
    const fromState = from.kind === "node" ? stateOf(from.topic.id) : "locked";
    const toState = to.kind === "node" ? stateOf(to.topic.id) : fromState === "completed" ? "completed" : "locked";
    const tone = fromState === "completed" ? (toState === "active" ? "url(#seg-active)" : "#10B981") : null;
    return { d, tone, key: i };
  });

  const unitProgress = (unitId: number) => {
    const topics = TOPICS.filter((t) => t.unit === unitId);
    return { done: topics.filter((t) => stateOf(t.id) === "completed").length, total: topics.length };
  };

  return (
    <div className="relative" style={{ height }}>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="seg-active" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#10B981" />
            <stop offset="1" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        {segments.map((s) => (
          <path
            key={`base-${s.key}`}
            d={s.d}
            fill="none"
            stroke="#1E293B"
            strokeWidth={10}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {segments.map((s) =>
          s.tone ? (
            <path
              key={`tone-${s.key}`}
              d={s.d}
              fill="none"
              stroke={s.tone}
              strokeWidth={6}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity={0.9}
            />
          ) : (
            <path
              key={`dash-${s.key}`}
              d={s.d}
              fill="none"
              stroke="#334155"
              strokeWidth={2}
              strokeDasharray="2 10"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ),
        )}
      </svg>

      {rows.map((row) => {
        if (row.kind === "unit") {
          const unit = UNITS.find((u) => u.id === row.unitId)!;
          const { done, total } = unitProgress(row.unitId);
          const complete = done === total;
          return (
            <div key={`unit-${row.unitId}`} className="absolute inset-x-0 z-10 px-1" style={{ top: row.y + 12 }}>
              <div
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 backdrop-blur ${
                  complete ? "border-emerald-500/30 bg-emerald-950/70" : "border-slate-800 bg-slate-900/90"
                }`}
              >
                <div>
                  <p className={`text-[10px] font-bold tracking-[0.14em] uppercase ${complete ? "text-emerald-400" : "text-cyan-400"}`}>
                    Unit {unit.id}
                  </p>
                  <p className="text-sm font-bold text-slate-100">{unit.title}</p>
                </div>
                <span className={`text-xs font-semibold ${complete ? "text-emerald-300" : "text-slate-400"}`}>
                  {done}/{total}
                </span>
              </div>
            </div>
          );
        }

        if (row.kind === "finish") {
          const allDone = stateOf(TOPICS[TOPICS.length - 1].id) === "completed";
          return (
            <div
              key="finish"
              className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: `${row.x}%`, top: row.y }}
            >
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full ${
                  allDone ? "bg-gradient-to-br from-amber-300 to-amber-500 text-slate-950 shadow-[0_6px_0_#b45309]" : "bg-slate-800 text-slate-600 shadow-[0_6px_0_#0f172a]"
                }`}
              >
                <Trophy className="h-7 w-7" />
              </div>
              <span className={`mt-3 text-[11px] font-semibold ${allDone ? "text-amber-300" : "text-slate-500"}`}>Course complete</span>
            </div>
          );
        }

        const { topic } = row;
        const state = stateOf(topic.id);
        const best = bestOf(topic.id);
        return (
          <div
            key={topic.id}
            ref={(el) => {
              if (el) nodeRefs.current.set(topic.id, el);
            }}
            className="absolute z-10 flex w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${row.x}%`, top: row.y }}
          >
            <RoadNode topic={topic} state={state} highlighted={highlightId === topic.id} onClick={() => onSelect(topic)} />
            <p
              className={`mt-3 line-clamp-2 rounded-md bg-slate-950/85 px-1.5 py-0.5 text-center text-[11px] leading-tight font-semibold ${
                state === "completed" ? "text-slate-300" : state === "active" ? "text-amber-300" : "text-slate-500"
              }`}
            >
              {topic.title}
            </p>
            {state === "completed" && best !== undefined && <p className="mt-0.5 rounded bg-slate-950/85 px-1 text-[10px] font-bold text-emerald-400">{best}%</p>}
          </div>
        );
      })}
    </div>
  );
});

export default Roadmap;

const NODE_STYLES: Record<NodeState, string> = {
  completed:
    "bg-gradient-to-b from-emerald-400 to-emerald-500 text-slate-950 shadow-[0_6px_0_#047857] hover:brightness-110 active:translate-y-1 active:shadow-[0_2px_0_#047857]",
  active:
    "bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 shadow-[0_6px_0_#b45309] hover:brightness-110 active:translate-y-1 active:shadow-[0_2px_0_#b45309]",
  locked: "bg-slate-800 text-slate-500 shadow-[0_6px_0_#0b1220]",
};

function RoadNode({
  topic,
  state,
  highlighted,
  onClick,
}: {
  topic: Topic;
  state: NodeState;
  highlighted: boolean;
  onClick: () => void;
}) {
  return (
    <div className="relative">
      {state === "active" && (
        <>
          <span className="absolute inset-0 animate-ring rounded-full bg-amber-400/40" aria-hidden />
          <span className="absolute -top-9 left-1/2 -translate-x-1/2 animate-float rounded-lg border border-amber-400/40 bg-slate-900 px-2.5 py-1 text-[10px] font-extrabold tracking-wider whitespace-nowrap text-amber-300 uppercase shadow-lg">
            Start
            <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-r border-b border-amber-400/40 bg-slate-900" />
          </span>
        </>
      )}
      {highlighted && <span className="absolute -inset-2 rounded-full ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950" aria-hidden />}
      <button
        onClick={onClick}
        aria-label={`Topic ${topic.id}: ${topic.title} (${state})`}
        className={`relative flex h-[68px] w-[68px] items-center justify-center rounded-full transition-all duration-150 ${NODE_STYLES[state]}`}
      >
        {state === "completed" && <Check className="h-8 w-8" strokeWidth={3.2} />}
        {state === "active" && <Play className="h-7 w-7 translate-x-0.5 fill-slate-950" strokeWidth={0} />}
        {state === "locked" && <Lock className="h-6 w-6" />}
        <span
          className={`absolute -right-1.5 -bottom-1 rounded-md border px-1.5 py-px text-[10px] font-extrabold ${
            state === "completed"
              ? "border-emerald-500/50 bg-slate-950 text-emerald-300"
              : state === "active"
                ? "border-amber-500/50 bg-slate-950 text-amber-300"
                : "border-slate-700 bg-slate-900 text-slate-500"
          }`}
        >
          {topic.id}
        </span>
      </button>
    </div>
  );
}
