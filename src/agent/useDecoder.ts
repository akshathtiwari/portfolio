// Token-by-token reveal for the agent's speech (R2). Reduced-motion aware (R7):
// when the user prefers reduced motion, the full text is shown immediately.
import { useEffect, useRef, useState } from "react";

export function usePrefersReducedMotion(): boolean {
  // Lazy initial value so the very first render is already correct (avoids a
  // stale-closure branch in consumers that read `reduced` in a mount effect).
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

interface DecoderOptions {
  tokensPerSecond?: number;
  start?: boolean;
  onDone?: () => void;
}

// Splits text into word-ish "tokens" and reveals them over time.
// Returns the number of visible tokens and the full token list, so the caller
// can render every token in the DOM (opacity-gated) for accessibility.
export function useDecoder(text: string, opts: DecoderOptions = {}) {
  const { tokensPerSecond = 26, start = true, onDone } = opts;
  const reduced = usePrefersReducedMotion();
  const tokens = text.match(/\S+\s*/g) ?? [text];
  const [visible, setVisible] = useState(0);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    doneRef.current = false;
    if (!start) {
      setVisible(0);
      return;
    }
    if (reduced) {
      setVisible(tokens.length);
      if (!doneRef.current) {
        doneRef.current = true;
        onDoneRef.current?.();
      }
      return;
    }
    setVisible(0);
    let i = 0;
    const step = Math.max(1000 / tokensPerSecond, 16);
    const id = window.setInterval(() => {
      i += 1;
      setVisible(i);
      if (i >= tokens.length) {
        window.clearInterval(id);
        if (!doneRef.current) {
          doneRef.current = true;
          onDoneRef.current?.();
        }
      }
    }, step);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, start, reduced, tokensPerSecond]);

  return { tokens, visible, done: visible >= tokens.length, reduced };
}
