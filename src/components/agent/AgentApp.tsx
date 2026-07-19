// AXON orchestrator (R1-R9). Owns the boot -> greeting -> dock flow, drives the
// XState machine, reveals the static portfolio, and honors reduced-motion and
// returning visitors. Mounted client:only, so no-JS visitors get the plain site.
//
// Dismissal uses a CSS fade + setTimeout unmount (deterministic, not rAF-bound),
// and a boot watchdog guarantees progression even if GSAP stalls. While the
// modal overlay is up, the rest of the page is inert (focus-trapped) for a11y.
import { useEffect, useState, useCallback, useRef, lazy, Suspense } from "react";
import { useMachine } from "@xstate/react";
import { agentMachine, type AgentVisualState } from "../../agent/machine";
import { agent, chooseMode, addTokens, type Mode } from "../../agent/store";
import { usePrefersReducedMotion } from "../../agent/useDecoder";
import AgentEntity from "./AgentEntity";
import Greeting from "./Greeting";
import Transcript from "./Transcript";
import AgentDock from "./AgentDock";
import "./agent.css";

// Lazy so GSAP only downloads when a boot actually runs (returning visitors and
// reduced-motion visitors never mount this).
const BootSequence = lazy(() => import("./BootSequence"));

type Phase = "boot" | "greeting" | "docked";

const GATE = "data-agent-boot";
const BOOT_WATCHDOG_MS = 4500;
const DISMISS_MS = 460;
const BG_SELECTORS = ["#main-content", "header", "footer"];

function revealContent() {
  document.documentElement.removeAttribute(GATE);
}

function setBackgroundInert(on: boolean) {
  for (const sel of BG_SELECTORS) {
    document.querySelectorAll(sel).forEach((el) => {
      if (on) {
        el.setAttribute("inert", "");
        el.setAttribute("aria-hidden", "true");
      } else {
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      }
    });
  }
}

export default function AgentApp() {
  const reduced = usePrefersReducedMotion();
  const [snapshot, send] = useMachine(agentMachine);
  const visual = snapshot.value as AgentVisualState;

  const [phase, setPhase] = useState<Phase | null>(null);
  const [mode, setModeLocal] = useState<Mode>("unset");
  const [dismissing, setDismissing] = useState(false);
  const bootHandled = useRef(false);
  const cameFromOverlay = useRef(false);
  const skipRef = useRef<HTMLButtonElement>(null);
  const dismissTimer = useRef<number | null>(null);
  const scrollRaf = useRef<number | null>(null);

  const modalUp =
    !reduced && (phase === "boot" || phase === "greeting" || dismissing);

  // Initial phase, decided once from persisted state + reduced motion.
  useEffect(() => {
    const st = agent.get();
    if (st.mode !== "unset") {
      revealContent();
      send({ type: "BOOT_DONE" });
      setModeLocal(st.mode);
      setPhase("docked");
    } else if (reduced) {
      revealContent();
      send({ type: "BOOT_DONE" });
      setPhase("greeting");
    } else {
      setPhase("boot");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fail-open safety: never trap content behind the gate.
  useEffect(() => {
    const id = window.setTimeout(revealContent, 6000);
    return () => window.clearTimeout(id);
  }, []);

  // Focus trap: while the modal overlay is up, make the rest of the page inert
  // and move focus to the skip control. Restore on teardown.
  useEffect(() => {
    if (!modalUp) return;
    setBackgroundInert(true);
    skipRef.current?.focus();
    return () => {
      setBackgroundInert(false);
    };
  }, [modalUp]);

  // After a choice, move focus into the content (WCAG 2.4.3). Only when the
  // visitor just came from the overlay, not on a returning-visitor first paint.
  useEffect(() => {
    if (phase === "docked" && cameFromOverlay.current) {
      cameFromOverlay.current = false;
      const el = document.getElementById("main-content");
      if (el) {
        el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
      }
    }
  }, [phase]);

  // Clear any pending timers on unmount.
  useEffect(() => {
    return () => {
      if (dismissTimer.current) window.clearTimeout(dismissTimer.current);
      if (scrollRaf.current) window.cancelAnimationFrame(scrollRaf.current);
    };
  }, []);

  const handleBootDone = useCallback(() => {
    if (bootHandled.current) return;
    bootHandled.current = true;
    send({ type: "BOOT_DONE" });
    send({ type: "SPEAK" });
    setPhase("greeting");
  }, [send]);

  // Boot watchdog: advance even if the GSAP ticker is throttled or fails.
  useEffect(() => {
    if (phase !== "boot") return;
    const id = window.setTimeout(handleBootDone, BOOT_WATCHDOG_MS);
    return () => window.clearTimeout(id);
  }, [phase, handleBootDone]);

  const handleChoose = useCallback(
    (m: Mode) => {
      chooseMode(m);
      addTokens(8000); // greeting ingested; meter starts moving
      revealContent();
      send({ type: "DECODE_DONE" });
      setModeLocal(m);
      cameFromOverlay.current = true;
      setDismissing(true);
      dismissTimer.current = window.setTimeout(() => {
        setPhase("docked");
        setDismissing(false);
      }, DISMISS_MS);
      if (m === "skip") {
        scrollRaf.current = window.requestAnimationFrame(() =>
          document
            .getElementById("main-content")
            ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" })
        );
      }
    },
    [send, reduced]
  );

  const handleReplay = useCallback(() => {
    bootHandled.current = false;
    agent.setKey("mode", "unset");
    setModeLocal("unset");
    document.documentElement.setAttribute(GATE, "");
    setPhase(reduced ? "greeting" : "boot");
    if (reduced) send({ type: "SPEAK" });
  }, [reduced, send]);

  if (phase === null) return null;

  // Reduced-motion path: a non-covering transcript banner (not modal).
  if (reduced && phase !== "docked") {
    return (
      <div className="axon-root axon-root--inline" data-testid="axon-root">
        <button
          type="button"
          className="axon-skip axon-skip--inline"
          data-testid="skip"
          onClick={() => handleChoose("skip")}
        >
          Skip to content
        </button>
        <Transcript onChoose={handleChoose} />
      </div>
    );
  }

  const overlayUp = phase === "boot" || phase === "greeting" || dismissing;

  return (
    <div className="axon-root" data-testid="axon-root">
      {overlayUp && (
        <div
          className={`axon-overlay${dismissing ? " axon-overlay--out" : ""}`}
          data-testid="overlay"
          role="dialog"
          aria-modal="true"
          aria-label="AXON is starting up"
        >
          <button
            type="button"
            className="axon-skip"
            data-testid="skip"
            ref={skipRef}
            onClick={() => handleChoose("skip")}
          >
            Skip to content
          </button>

          <div className="axon-stage">
            <div className="axon-stage__entity">
              <AgentEntity state={visual} size={140} reduced={reduced} />
            </div>

            {phase === "boot" && (
              <Suspense fallback={null}>
                <BootSequence onDone={handleBootDone} reduced={reduced} />
              </Suspense>
            )}
            {phase === "greeting" && <Greeting onChoose={handleChoose} reduced={reduced} />}
          </div>
        </div>
      )}

      {phase === "docked" && (
        <AgentDock mode={mode} visual={visual} reduced={reduced} onReplay={handleReplay} />
      )}
    </div>
  );
}
