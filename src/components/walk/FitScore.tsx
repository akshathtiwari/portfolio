// Finale (R14): a playful FitScore for the visitor, computed from how much
// context they let AXON ingest (the meter). Counts up on enter. Clearly framed
// as fun, with a real call to action.
import { useEffect, useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import { useInView } from "./useInView";
import { agent, MAX_TOKENS } from "../../agent/store";
import { usePrefersReducedMotion } from "../../agent/useDecoder";

function fitFrom(tokens: number): number {
  const ratio = Math.min(tokens / MAX_TOKENS, 1);
  return Math.round(58 + ratio * 41); // 58..99
}

function verdict(fit: number): string {
  if (fit >= 92) return "strong signal. if you are hiring or want to build something, act on it.";
  if (fit >= 78) return "good signal. worth a conversation.";
  return "warming up. scroll back through the walkthrough and I will read you again.";
}

export default function FitScore({ onEnter }: { onEnter: () => void }) {
  const reduced = usePrefersReducedMotion();
  const state = useStore(agent);
  const { ref, inView } = useInView<HTMLDivElement>(onEnter);
  const [display, setDisplay] = useState(0);
  const timer = useRef<number | null>(null);
  // The store is hydrated from localStorage, so its token count differs between
  // server (0) and a returning client. Deriving the verdict from it during the
  // first render would cause a hydration mismatch, so hold the SSR value (0)
  // until mounted, then switch to the real score.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const target = mounted ? fitFrom(state.tokens) : 0;

  useEffect(() => {
    if (!inView) return;
    const goal = fitFrom(agent.get().tokens);
    if (reduced) {
      setDisplay(goal);
      return;
    }
    let cur = 0;
    setDisplay(0);
    timer.current = window.setInterval(() => {
      cur += Math.max(1, Math.round(goal / 28));
      if (cur >= goal) {
        cur = goal;
        if (timer.current) window.clearInterval(timer.current);
      }
      setDisplay(cur);
    }, 40);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [inView, reduced]);

  return (
    <section
      ref={ref}
      id="stage-finale"
      data-testid="stage-finale"
      className={`walk-stage walk-fit${inView ? " in-view" : ""}`}
      aria-label="FitScore finale"
    >
      <p className="walk-eyebrow">finale · fitscore(you)</p>
      <h2 className="walk-h2">the eval I was built for</h2>
      <p className="walk-sub">
        This is the one AXON runs on candidates, pointed back at you. It is for fun,
        computed from how much of the walkthrough you let me read. The call to action
        is real.
      </p>

      <div className="walk-fit__score" data-testid="fitscore-value">
        <span className="walk-fit__num">{display}</span>
        <span className="walk-fit__max">/ 100</span>
      </div>
      <p className="walk-fit__verdict">{verdict(target)}</p>

      <div className="walk-fit__cta">
        <a href="/contact" className="walk-btn walk-btn--solid" data-testid="sudo-hire">
          sudo hire
        </a>
        <a href="/contact" className="walk-btn">
          send inference request
        </a>
      </div>
    </section>
  );
}
