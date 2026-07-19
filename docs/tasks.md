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
- [~] G3 Commit + push to main; Vercel deploy; verify live 200 + expected content. (DoD 5)

## Later phases (queued, not this increment)

- [ ] T2.x Model Card, Training Run (loss curve), Eval Suite. (R10, R12, R13)
- [ ] T3.x Retrieval surface, Volunteering, FitScore finale, Terminal. (R11, R14)
- [ ] T4.x Optional R3F entity, sound (skipped), full a11y/perf audit.
