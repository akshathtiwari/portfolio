// AXON shell (R11). A small command surface. Real commands, one hidden.
// Mounted by AgentApp; opened from the dock or the "/" key.
import { useEffect, useRef, useState } from "react";
import { JOURNEY } from "../../data/journey";
import { TERMINAL_HELP, TERMINAL_BANNER } from "../../agent/script";
import type { ProjectLite } from "../walk/EvalSuite";

interface Line {
  kind: "in" | "out" | "sys";
  text: string;
}

export default function Terminal({
  projects,
  onClose,
}: {
  projects: ProjectLite[];
  onClose: () => void;
}) {
  const [lines, setLines] = useState<Line[]>([{ kind: "sys", text: TERMINAL_BANNER }]);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Remember who opened us so focus can return there on close (WCAG 2.4.3).
    opener.current = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    return () => opener.current?.focus?.();
  }, []);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const print = (out: Line[]) => setLines((l) => [...l, ...out]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    const echo: Line = { kind: "in", text: cmd };
    const lc = cmd.toLowerCase();

    if (lc === "clear") {
      setLines([{ kind: "sys", text: TERMINAL_BANNER }]);
      return;
    }
    if (lc === "help") {
      print([echo, ...TERMINAL_HELP.map((h) => ({ kind: "out" as const, text: `${h[0].padEnd(20)}${h[1]}` }))]);
      return;
    }
    if (lc === "whoami") {
      print([echo, { kind: "out", text: "Akshath Tiwari, ML Engineer at Phenom. Fine-tunes LLMs, builds agents, ships them." }]);
      return;
    }
    if (lc === "ls projects") {
      print([echo, ...projects.map((p) => ({ kind: "out" as const, text: p.title }))]);
      return;
    }
    if (lc === "cat experience") {
      print([echo, ...JOURNEY.map((c) => ({ kind: "out" as const, text: `${c.period.padEnd(16)}${c.role} @ ${c.org}` }))]);
      return;
    }
    if (lc === "run eval fitscore") {
      print([echo, { kind: "out", text: "jumping to FitScore..." }]);
      const el = document.getElementById("stage-finale");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.setTimeout(onClose, 300);
      }
      return;
    }
    if (lc === "open blog") {
      print([echo, { kind: "out", text: "opening /blog" }]);
      window.location.href = "/blog";
      return;
    }
    if (lc === "sudo hire") {
      print([echo, { kind: "out", text: "escalating privileges... routing to contact." }]);
      window.location.href = "/contact";
      return;
    }
    if (lc === "jailbreak") {
      print([echo, { kind: "sys", text: "temperature -> 2.0. everything is vibes now. (kidding. staying aligned.)" }]);
      return;
    }
    print([echo, { kind: "out", text: `command not found: ${cmd}. try 'help'.` }]);
  };

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      run(value);
      setValue("");
    }
  };

  return (
    <div
      className="axon-term"
      role="dialog"
      aria-modal="false"
      aria-label="AXON shell"
      data-testid="terminal"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="axon-term__bar">
        <span className="axon-term__dot" aria-hidden="true" />
        <span className="axon-term__name">axon@portfolio</span>
        <button type="button" className="axon-term__close" onClick={onClose} aria-label="Close terminal" data-testid="terminal-close">
          esc
        </button>
      </div>
      <div className="axon-term__body" ref={bodyRef}>
        {lines.map((l, i) => (
          <div key={i} className={`axon-term__line axon-term__line--${l.kind}`}>
            {l.kind === "in" ? <span className="axon-term__prompt">&gt;</span> : null}
            {l.text}
          </div>
        ))}
        <div className="axon-term__inputrow">
          <span className="axon-term__prompt">&gt;</span>
          <input
            ref={inputRef}
            className="axon-term__input"
            data-testid="terminal-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onInputKeyDown}
            spellCheck={false}
            autoComplete="off"
            aria-label="terminal input"
          />
        </div>
      </div>
    </div>
  );
}
