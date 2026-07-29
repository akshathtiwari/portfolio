// Composes the walkthrough stages (R10, R12, R13, R14). Each stage, on first
// enter, reports itself to the shared agent store (setStage drives the dock
// narration and the "attending" entity; addTokens fills the context meter).
//
// "Run walkthrough" (guided autopilot, per narrative.md) vs "I'll drive"
// (manual) is realized HERE: in autopilot the agent scroll-drives the stages
// one at a time, dwelling on each so the dock narration can be read; any real
// user scroll/tap hands control back (manual). Narration itself fires on
// viewport-enter in both modes (R10), so it rides along either way.
import { useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import ModelCard from "./ModelCard";
import TrainingRun from "./TrainingRun";
import EvalSuite, { type ProjectLite } from "./EvalSuite";
import Knowledge, { type DocLite } from "./Knowledge";
import Volunteering from "./Volunteering";
import FitScore from "./FitScore";
import { setStage, addTokens, autopilot, stopAutopilot } from "../../agent/store";
import { usePrefersReducedMotion } from "../../agent/useDecoder";
import "./walk.css";

// How long to dwell on each stage before driving to the next (ms). Long enough
// to read that stage's dock narration; the finale gets a little extra.
const STAGE_DWELL_MS = 5200;
const FINALE_DWELL_MS = 6800;
const DRIVE_START_MS = 750; // let the boot overlay finish dismissing first

export default function Walkthrough({
  projects,
  docs,
}: {
  projects: ProjectLite[];
  docs: DocLite[];
}) {
  const walkRef = useRef<HTMLDivElement>(null);
  const driving = useStore(autopilot);
  const reduced = usePrefersReducedMotion();

  // Signal hydration so the inline gate's fail-open timer stands down. If this
  // never runs (hydration failed), the gate drops after its timeout and the
  // stages become visible with no animation.
  useEffect(() => {
    document.documentElement.classList.add("walk-hydrated");
  }, []);

  const enter = (stage: string, tokens: number) => () => {
    setStage(stage);
    addTokens(tokens);
  };

  // Autopilot: scroll-drive the stages in order. Reduced-motion never drives
  // (that path is a static transcript). A genuine user gesture cancels it.
  useEffect(() => {
    if (!driving || reduced) return;
    const container = walkRef.current;
    if (!container) return;
    const stages = Array.from(
      container.querySelectorAll<HTMLElement>(".walk-stage")
    );
    if (stages.length === 0) {
      stopAutopilot();
      return;
    }

    let i = 0;
    let stepTimer = 0;
    let startTimer = 0;
    let cancelled = false;

    const finish = () => {
      if (cancelled) return;
      cancelled = true;
      window.clearTimeout(stepTimer);
      window.clearTimeout(startTimer);
      window.removeEventListener("wheel", onGesture, { capture: true } as never);
      window.removeEventListener("touchstart", onGesture, { capture: true } as never);
      window.removeEventListener("keydown", onKey, { capture: true } as never);
      stopAutopilot();
    };

    // Nav keys mean the visitor wants to steer; other keys (e.g. "/" for the
    // terminal) do not cancel the drive.
    const NAV_KEYS = new Set([
      "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Spacebar",
    ]);
    const onKey = (e: KeyboardEvent) => {
      if (NAV_KEYS.has(e.key)) finish();
    };
    const onGesture = () => finish();

    const step = () => {
      if (cancelled) return;
      if (i >= stages.length) {
        finish();
        return;
      }
      const el = stages[i];
      const isFinale = i === stages.length - 1;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      i += 1;
      stepTimer = window.setTimeout(step, isFinale ? FINALE_DWELL_MS : STAGE_DWELL_MS);
    };

    // Smooth programmatic scrolling emits "scroll" (never listened to) but not
    // "wheel"/"touchstart", so these fire only on real user input.
    window.addEventListener("wheel", onGesture, { passive: true, capture: true });
    window.addEventListener("touchstart", onGesture, { passive: true, capture: true });
    window.addEventListener("keydown", onKey, { capture: true });
    startTimer = window.setTimeout(step, DRIVE_START_MS);

    return finish;
  }, [driving, reduced]);

  return (
    <div className="walk" data-testid="walkthrough" ref={walkRef}>
      {driving && !reduced && (
        <button
          type="button"
          className="walk-autopilot"
          data-testid="autopilot-bar"
          onClick={stopAutopilot}
          aria-label="Autopilot engaged. Take control."
        >
          <span className="walk-autopilot__dot" aria-hidden="true" />
          <span>AXON is driving</span>
          <span className="walk-autopilot__hint">scroll or tap to take control</span>
        </button>
      )}
      <ModelCard onEnter={enter("modelcard", 24000)} />
      <TrainingRun onEnter={enter("experience", 30000)} />
      <EvalSuite projects={projects} onEnter={enter("projects", 36000)} />
      <Knowledge docs={docs} onEnter={enter("knowledge", 12000)} />
      <Volunteering onEnter={enter("volunteer", 8000)} />
      <FitScore onEnter={enter("finale", 10000)} />
    </div>
  );
}
