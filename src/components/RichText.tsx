/** Renders `backtick` spans as inline code. Used for lesson bullets, prompts and explanations. */
export default function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((part, i) =>
        part.length > 2 && part.startsWith("`") && part.endsWith("`") ? (
          <code key={i} className="rounded bg-slate-800 px-1 py-0.5 font-mono text-[0.9em] text-cyan-200">
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** True when an answer option reads like code rather than prose. */
export function looksLikeCode(text: string): boolean {
  return (
    /[(){}[\]=;<>`'"]|^\s*[\w.$]+\.\w+|^--?\w|^\w+\(|^(npx|npm|git|docker|node) |^@[\w-]+\//.test(text) ||
    (/^[\w.-]+$/.test(text.trim()) && /[.\-_]|[a-z][A-Z]/.test(text))
  );
}
