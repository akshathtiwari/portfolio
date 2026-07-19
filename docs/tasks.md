# Tasks — The Agent Portfolio

Execution checklist. `[ ]` todo, `[~]` in progress, `[x]` done. Each task cites the
requirement(s) it satisfies. Phase 1 is the current live target.

## Phase 0 — Foundations

- [x] T0.1 Add `@astrojs/react` via `astro add react`; verify config. (D1)
- [x] T0.2 Install `framer-motion gsap lenis xstate @xstate/react nanostores @nanostores/react`. (Design)
- [x] T0.3 Enable Astro View Transitions (`<ClientRouter />`) in Layout for persistent agent. (R8)
- [x] T0.4 Create `src/agent/store.ts` with nanostores + localStorage persistence. (R6, R9)
- [x] T0.5 Create `src/agent/machine.ts` XState FSM. (R8)
- [x] T0.6 Build passes with plumbing in place, no visible change / no console errors. (N3)

## Phase 1 — Boot + Greeting + Fork (live target)

- [x] T1.1 `src/agent/script.ts` narration copy (boot log + greeting), no em-dashes. (R1, R2, N6)
- [x] T1.2 `AgentEntity.tsx` 2D attention-graph, state-reactive, `aria-hidden`. (R8, N1)
- [x] T1.3 `BootSequence.tsx` GSAP cold-start; reduced-motion aware; killable + watchdog. (R1, R7)
- [x] T1.4 `useDecoder.ts` + `Greeting.tsx` decoded greeting, aria-live full text. (R2, N1, N2)
- [x] T1.5 Three-way fork buttons wired to store, persisted. (R3, R6)
- [x] T1.6 Persistent `Skip to content` from first frame. (R4, R5)
- [x] T1.7 `Transcript.tsx` reduced-motion static narration. (R7)
- [x] T1.8 `ContextMeter.tsx` + `AgentDock.tsx` persistent presence. (R9)
- [x] T1.9 `AgentLanding.astro` island host; layer over static `index.astro`; no-JS gate. (N4)
- [x] T1.10 Self-review pass + fix; production build clean; no console errors on each fork. (DoD 1,2)
      Verified in-browser: boot->greeting->fork (all 3), persistence, returning visitor,
      replay, deterministic dismiss, SSR has no overlay (no-JS safe), console clean.

## Gates (Phase 1 definition of done)

- [x] G1 Senior-frontend-dev review agent passes (address all findings). (DoD 3)
      PASS after addressing 2 Majors (focus trap, contrast) + 6 minors; verified live.
- [x] G2 UI-testing agent passes (address all findings). (DoD 4)
      GO: 10/11 checks PASS; reduced-motion not live-emulatable in headless pane
      (verified in source). No blocking defects.
- [x] G3 Commit + push to main; Vercel deploy; verify live 200 + expected content. (DoD 5)
      Live: boot->greeting->fork verified on production, focus trap + dock + meter
      working, console clean, SSR has no overlay (SEO/no-JS intact), blog post 200.
      Commit 155760d.

## Phase 2 — Walkthrough stages (current live target)

Stage reveals use IntersectionObserver + CSS transitions (robust, reduced-motion
friendly, verifiable). Cross-island state via the shared nanostore drives dock
narration (R10) and the "attending" entity state.

- [x] T2.1 `src/data/journey.ts` training-run checkpoints (roles, periods, loss, caps).
- [x] T2.2 `src/data/evals.ts` per-project eval metadata (metric label + qualitative value).
- [x] T2.3 `useInView.ts` IntersectionObserver hook (threshold 0.12 for tall stages).
- [x] T2.4 `ModelCard.tsx` About-as-model-card stage. (R10)
- [x] T2.5 `TrainingRun.tsx` Experience as a drawn loss curve + checkpoints + capability chips. (R12)
- [x] T2.6 `EvalSuite.tsx` Projects as an eval board with animated bars + run-all. (R13)
- [x] T2.7 `Walkthrough.tsx` island composes stages; on stage enter -> setStage + addTokens.
- [x] T2.8 Dock narrates active stage (decoded) + entity shows 'attending'. (R10, R8)
- [x] T2.9 `Walkthrough.astro` host passes projects; wire into index.astro (replaced Featured teaser).
- [x] T2.10 Self-review + build clean. Verified: store singleton shared cross-island, dock
      narration + meter on stage change, reveal end-states correct (opacity/loss-draw/bars).
      NOTE: live scroll/IO/transitions NOT observable in the headless pane (frozen anim clock,
      IO does not fire) - same limitation as screenshots. Real-browser visual check pending.

## Phase 2 gates

- [x] G4 Senior-frontend-dev review passes.
      PASS after fixing 1 Major (walk-js fail-open) + 2 Minors + 2 nits.
- [x] G5 UI-testing agent passes.
      GO: checks 1-4, 6, 7, 8 PASS; 5 (fail-open) NOT-TESTABLE in pane (verified in source).
- [~] G6 Commit + deploy; verify live.

## Later phases (queued)

- [ ] T3.x Retrieval surface, Volunteering, FitScore finale, Terminal. (R11, R14)
- [ ] T4.x Optional R3F entity, sound (skipped), full a11y/perf audit.
