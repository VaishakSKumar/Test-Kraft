"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpen, CircleAlert, CircleCheck, CircleX, LoaderCircle, RotateCcw, Sparkles, Trophy, X, Zap } from "lucide-react";
import { PASS_PERCENT, type Topic } from "@/data/syllabus";
import type { LessonSlide, Question, Quiz } from "@/lib/schema";
import { emptyAnswer, grade, isComplete, type Answer } from "@/lib/grade";
import CodeBlock from "./CodeBlock";
import RichText from "./RichText";
import Mcq from "./questions/Mcq";
import Fill from "./questions/Fill";
import Match from "./questions/Match";
import Order from "./questions/Order";

export interface AttemptResponse {
  percent: number;
  passed: boolean;
  newlyCompleted: boolean;
  xpEarned: number;
}

interface Props {
  topic: Topic;
  /** Skip the lesson slides (used for retakes of completed topics). */
  startWithQuiz?: boolean;
  onClose: () => void;
  onAttemptSaved: () => void;
}

type Phase = "lesson" | "quiz" | "result";
type QuizState = { status: "loading" } | { status: "error"; message: string } | ({ status: "ready"; notice?: string } & Quiz);

const TYPE_LABEL: Record<Question["type"], { label: string; tone: string }> = {
  mcq: { label: "Multiple choice", tone: "text-amber-300" },
  fill: { label: "Fill in the blanks", tone: "text-cyan-300" },
  match: { label: "Match the pairs", tone: "text-violet-300" },
  order: { label: "Build the code", tone: "text-pink-300" },
};

export default function LessonRunner({ topic, startWithQuiz = false, onClose, onAttemptSaved }: Props) {
  const [lesson, setLesson] = useState<LessonSlide[] | null>(null);
  const [quiz, setQuiz] = useState<QuizState>({ status: "loading" });
  const [phase, setPhase] = useState<Phase>(startWithQuiz ? "quiz" : "lesson");
  const [slide, setSlide] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [checked, setChecked] = useState<null | boolean>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [result, setResult] = useState<AttemptResponse | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const loadQuiz = useCallback(async () => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setQuiz({ status: "loading" });
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId: topic.id }),
        signal: ctrl.signal,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not load the quiz");
      setQuiz({ status: "ready", ...data });
    } catch (e) {
      if ((e as Error).name !== "AbortError") setQuiz({ status: "error", message: (e as Error).message });
    }
  }, [topic.id]);

  // Lesson loads instantly; the quiz is generated in the background while the learner reads.
  useEffect(() => {
    fetch(`/api/lesson?topicId=${topic.id}`)
      .then((r) => r.json())
      .then((d) => setLesson(d.lesson ?? []))
      .catch(() => setLesson([]));
    loadQuiz();
    return () => abortRef.current?.abort();
  }, [topic.id, loadQuiz]);

  const questions = quiz.status === "ready" ? quiz.questions : [];
  const question = questions[qIndex];

  useEffect(() => {
    if (question) {
      setAnswer(emptyAnswer(question));
      setChecked(null);
    }
  }, [question]);

  const finish = useCallback(
    async (correct: number, total: number) => {
      setPhase("result");
      setSaveError(null);
      try {
        const res = await fetch("/api/attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topicId: topic.id, correct, total, source: quiz.status === "ready" ? quiz.source : "bank" }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Could not save your result");
        setResult(data);
        onAttemptSaved();
      } catch (e) {
        setSaveError((e as Error).message);
        const percent = Math.round((correct / total) * 100);
        setResult({ percent, passed: percent >= PASS_PERCENT, newlyCompleted: false, xpEarned: 0 });
      }
    },
    [topic.id, quiz, onAttemptSaved],
  );

  const retake = () => {
    setPhase("quiz");
    setQIndex(0);
    setCorrectCount(0);
    setResult(null);
    loadQuiz();
  };

  const canCheck = !!question && !!answer && isComplete(question, answer);

  const primaryAction = useCallback(() => {
    if (phase === "lesson") {
      if (lesson && slide < lesson.length - 1) setSlide(slide + 1);
      else setPhase("quiz");
      return;
    }
    if (phase !== "quiz" || !question || !answer) return;
    if (checked === null) {
      if (!canCheck) return;
      const ok = grade(question, answer);
      setChecked(ok);
      if (ok) setCorrectCount((c) => c + 1);
      return;
    }
    if (qIndex < questions.length - 1) setQIndex(qIndex + 1);
    else finish(correctCount, questions.length);
  }, [phase, lesson, slide, question, answer, checked, canCheck, qIndex, questions.length, correctCount, finish]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Enter advances, except while typing into a fill-in blank that isn't complete yet.
      if (e.key === "Enter" && !(e.target instanceof HTMLButtonElement)) primaryAction();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [primaryAction, onClose]);

  // ----- progress bar -----
  const lessonSteps = startWithQuiz ? 0 : (lesson?.length ?? 1);
  const totalSteps = lessonSteps + (questions.length || 5);
  const doneSteps =
    phase === "lesson" ? slide : phase === "quiz" ? lessonSteps + qIndex + (checked !== null ? 1 : 0) : totalSteps;

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-slate-950" role="dialog" aria-modal="true" aria-label={`Lesson: ${topic.title}`}>
      <div className="flex h-dvh w-full max-w-md flex-col">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
          <button onClick={onClose} aria-label="Exit lesson" className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100">
            <X className="h-6 w-6" />
          </button>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
              style={{ width: `${(doneSteps / totalSteps) * 100}%` }}
            />
          </div>
          {phase === "quiz" && quiz.status === "ready" && (
            <span
              title={quiz.source === "ai" ? "Freshly generated by Claude" : "From the built-in question bank"}
              className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                quiz.source === "ai" ? "border-cyan-500/40 text-cyan-300" : "border-slate-700 text-slate-400"
              }`}
            >
              {quiz.source === "ai" ? <Sparkles className="h-3 w-3" /> : <BookOpen className="h-3 w-3" />}
              {quiz.source === "ai" ? "AI" : "Bank"}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          {phase === "lesson" && <LessonView slides={lesson} index={slide} topic={topic} />}

          {phase === "quiz" && quiz.status === "loading" && <Generating />}
          {phase === "quiz" && quiz.status === "error" && (
            <div className="mt-24 flex flex-col items-center text-center">
              <CircleAlert className="mb-3 h-10 w-10 text-rose-400" />
              <p className="mb-4 text-sm text-slate-300">{quiz.message}</p>
              <button onClick={loadQuiz} className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-700">
                Try again
              </button>
            </div>
          )}
          {phase === "quiz" && quiz.status === "ready" && question && answer && (
            <div key={qIndex} className="animate-rise space-y-4 pt-2">
              {qIndex === 0 && quiz.notice && (
                <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-[11px] text-amber-200">
                  Using the built-in question bank: {quiz.notice}
                </p>
              )}
              <p className={`text-[11px] font-bold tracking-[0.12em] uppercase ${TYPE_LABEL[question.type].tone}`}>
                {TYPE_LABEL[question.type].label} · {qIndex + 1}/{questions.length}
              </p>
              <h2 className="text-[17px] leading-snug font-bold text-slate-50">
                <RichText text={question.prompt} />
              </h2>
              <div className={checked === false ? "animate-shake" : ""}>
                <QuestionView question={question} answer={answer} checked={checked !== null} onChange={setAnswer} />
              </div>
            </div>
          )}

          {phase === "result" && <ResultView topic={topic} result={result} correct={correctCount} total={questions.length} saveError={saveError} />}
        </div>

        {/* Feedback + primary action */}
        <div
          className={`border-t px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-colors ${
            phase === "quiz" && checked === true ? "border-emerald-500/30 bg-emerald-950/60" : phase === "quiz" && checked === false ? "border-rose-500/30 bg-rose-950/50" : "border-slate-800/80 bg-slate-950"
          }`}
        >
          {phase === "quiz" && checked !== null && question && (
            <div className="mb-3 flex animate-rise gap-2.5">
              {checked ? <CircleCheck className="h-6 w-6 shrink-0 text-emerald-400" /> : <CircleX className="h-6 w-6 shrink-0 text-rose-400" />}
              <div>
                <p className={`text-sm font-extrabold ${checked ? "text-emerald-300" : "text-rose-300"}`}>{checked ? "Correct!" : "Not quite"}</p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-slate-300">
                  <RichText text={question.explanation} />
                </p>
              </div>
            </div>
          )}

          {phase === "result" ? (
            <div className="flex gap-3">
              <button onClick={retake} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 py-3.5 text-sm font-bold text-slate-100 hover:bg-slate-800">
                <RotateCcw className="h-4 w-4" /> Retake
              </button>
              <button
                onClick={onClose}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-400 py-3.5 text-sm font-extrabold text-slate-950 shadow-[0_4px_0_#047857] active:translate-y-0.5"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={primaryAction}
              disabled={phase === "quiz" && (quiz.status !== "ready" || (checked === null && !canCheck))}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold transition active:translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none ${
                checked === false
                  ? "bg-rose-400 text-slate-950 shadow-[0_4px_0_#9f1239]"
                  : "bg-emerald-400 text-slate-950 shadow-[0_4px_0_#047857]"
              }`}
            >
              {phase === "lesson"
                ? lesson && slide < lesson.length - 1
                  ? "Next"
                  : "Start practice"
                : checked === null
                  ? "Check"
                  : qIndex < questions.length - 1
                    ? "Continue"
                    : "See results"}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function LessonView({ slides, index, topic }: { slides: LessonSlide[] | null; index: number; topic: Topic }) {
  if (!slides) return <Generating label="Loading lesson…" />;
  const s = slides[index];
  if (!s) return null;
  return (
    <div key={index} className="animate-rise space-y-4 pt-2">
      <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.12em] text-emerald-400 uppercase">
        <BookOpen className="h-3.5 w-3.5" /> Learn · Topic {topic.id}
      </p>
      <h2 className="text-xl leading-snug font-extrabold text-slate-50">{s.heading}</h2>
      <ul className="space-y-2.5">
        {s.bullets.map((b, i) => (
          <li key={i} className="flex gap-2.5 text-[14px] leading-relaxed text-slate-300">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            <span>
              <RichText text={b} />
            </span>
          </li>
        ))}
      </ul>
      {s.code && <CodeBlock code={s.code} />}
    </div>
  );
}

function QuestionView({
  question,
  answer,
  checked,
  onChange,
}: {
  question: Question;
  answer: Answer;
  checked: boolean;
  onChange: (a: Answer) => void;
}) {
  switch (question.type) {
    case "mcq":
      return answer.type === "mcq" ? <Mcq q={question} choice={answer.choice} checked={checked} onChange={(choice) => onChange({ type: "mcq", choice })} /> : null;
    case "fill":
      return answer.type === "fill" ? <Fill q={question} values={answer.values} checked={checked} onChange={(values) => onChange({ type: "fill", values })} /> : null;
    case "match":
      return answer.type === "match" ? <Match q={question} pairs={answer.pairs} checked={checked} onChange={(pairs) => onChange({ type: "match", pairs })} /> : null;
    case "order":
      return answer.type === "order" ? <Order q={question} lines={answer.lines} checked={checked} onChange={(lines) => onChange({ type: "order", lines })} /> : null;
  }
}

function Generating({ label = "Generating fresh questions…" }: { label?: string }) {
  return (
    <div className="mt-28 flex flex-col items-center text-center">
      <LoaderCircle className="mb-3 h-9 w-9 animate-spin text-cyan-400" />
      <p className="text-sm font-semibold text-slate-200">{label}</p>
      <p className="mt-1 text-[12px] text-slate-500">This can take a few seconds.</p>
    </div>
  );
}

function ResultView({
  topic,
  result,
  correct,
  total,
  saveError,
}: {
  topic: Topic;
  result: AttemptResponse | null;
  correct: number;
  total: number;
  saveError: string | null;
}) {
  if (!result) return <Generating label="Saving your result…" />;
  const { percent, passed, newlyCompleted, xpEarned } = result;
  return (
    <div className="mt-10 flex animate-pop flex-col items-center text-center">
      <div
        className={`mb-5 flex h-24 w-24 items-center justify-center rounded-full ${
          passed ? "bg-gradient-to-b from-emerald-300 to-emerald-500 shadow-[0_8px_0_#047857]" : "bg-gradient-to-b from-amber-300 to-amber-500 shadow-[0_8px_0_#b45309]"
        }`}
      >
        {passed ? <Trophy className="h-11 w-11 text-slate-950" /> : <RotateCcw className="h-10 w-10 text-slate-950" />}
      </div>
      <h2 className="text-2xl font-extrabold text-slate-50">{passed ? (newlyCompleted ? "Topic complete!" : "Nice work!") : "Almost there"}</h2>
      <p className="mt-1 text-sm text-slate-400">
        {passed
          ? newlyCompleted
            ? topic.id < 61
              ? `Topic #${topic.id + 1} is now unlocked.`
              : "You finished the whole course!"
            : "Your best score is saved."
          : `You need ${PASS_PERCENT}% to pass. Retake for a new set of questions.`}
      </p>

      <div className="mt-7 grid w-full grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className={`text-3xl font-extrabold ${passed ? "text-emerald-300" : "text-amber-300"}`}>{percent}%</p>
          <p className="mt-1 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
            {correct}/{total} correct
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="flex items-center justify-center gap-1 text-3xl font-extrabold text-cyan-300">
            <Zap className="h-6 w-6 fill-cyan-300" />+{xpEarned}
          </p>
          <p className="mt-1 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">XP earned</p>
        </div>
      </div>
      {saveError && <p className="mt-4 text-[12px] text-rose-300">Couldn&apos;t save: {saveError}</p>}
    </div>
  );
}
