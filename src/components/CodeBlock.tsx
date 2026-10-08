import { Fragment } from "react";

// Tiny TypeScript-ish highlighter: enough for short lesson snippets, no dependency.
const TOKEN =
  /(\/\/.*$|#.*$)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|\b(\d[\d_]*(?:\.\d+)?)\b|\b(import|from|export|default|const|let|var|function|return|async|await|if|else|for|while|of|in|new|class|extends|implements|interface|type|enum|readonly|private|protected|public|true|false|null|undefined|this|super|switch|case|break|continue|try|catch|throw|void|override|abstract|static)\b|\b(string|number|boolean|any|unknown|never|Promise|Page|Locator|Array)\b|([A-Za-z_$][\w$]*)(?=\s*\()/gm;

function highlight(line: string, isShell: boolean) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    const [text, com, str, num, kw, type, fn] = m;
    // '#' starts a comment only in shell/YAML-like snippets
    if (com?.startsWith("#") && !isShell) continue;
    if (m.index > last) parts.push(line.slice(last, m.index));
    const cls = com ? "tok-com" : str ? "tok-str" : num ? "tok-num" : kw ? "tok-kw" : type ? "tok-type" : fn ? "tok-fn" : "";
    parts.push(
      <span key={m.index} className={cls}>
        {text}
      </span>,
    );
    last = m.index + text.length;
  }
  if (last < line.length) parts.push(line.slice(last));
  return parts;
}

export default function CodeBlock({ code, className = "" }: { code: string; className?: string }) {
  const isShell = /^\s*(#|npx |npm |docker |git |name:|FROM )/m.test(code) && !/^\s*(import|const|await) /m.test(code);
  return (
    <pre
      className={`overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 font-mono text-[12px] leading-relaxed text-slate-200 ${className}`}
    >
      <code>
        {code.split("\n").map((line, i) => (
          <Fragment key={i}>
            {highlight(line, isShell)}
            {"\n"}
          </Fragment>
        ))}
      </code>
    </pre>
  );
}
