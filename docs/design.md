# Design — The Agent Portfolio

How the requirements in `requirements.md` are realized. Focus is Phase 0 (foundations)
and Phase 1 (boot + greeting + fork), with hooks for later phases.

## Stack additions

- `@astrojs/react` + `react` + `react-dom` — React islands.
- `framer-motion` (motion) — declarative UI + decode animation.
- `gsap` — boot timeline (frame-accurate sequencing).
- `lenis` — smooth scroll (later phases; installed in P0).
- `xstate` + `@xstate/react` — agent finite state machine.
- `nanostores` + `@nanostores/react` — cross-island global state, persisted.
- Astro View Transitions (`<ClientRouter />`) so the agent island persists across routes.

## Module layout

```
src/
  agent/
    machine.ts            # XState agent FSM (cold_start→idle→forward_pass→decoding→attending)
    store.ts             # nanostores: progress (tokens), mode, unlocks, booted flag; localStorage-persisted
    script.ts            # narration copy per stage (real text, no em-dashes)
    useDecoder.ts        # hook: token-by-token reveal, reduced-motion aware
  components/agent/
    AgentProvider.tsx    # mounts machine, subscribes store, exposes context
    BootSequence.tsx     # R1 cold-start log + weights bar + graph ignite (GSAP)
    AgentEntity.tsx      # 2D attention-graph canvas/SVG, state-reactive (aria-hidden)
    Greeting.tsx         # R2 decoded greeting + R3 three-way fork
    AgentDock.tsx        # persistent minimized presence after boot
    ContextMeter.tsx     # R9 context-window progress
    Terminal.tsx         # R11 (later phase; stub in P1)
    Transcript.tsx       # R7 reduced-motion static narration
  components/AgentLanding.astro   # island host for the landing experience
```

## State model (nanostores)

```
agentStore = {
  booted: boolean          // has the boot played this session/visitor
  mode: 'unset'|'walkthrough'|'manual'|'skip'   // R3/R6, persisted
  tokens: number           // R9 context meter, 0..128000, persisted
  unlocks: string[]        // capability chips
  stage: string            // active section for 'attending'
}
```
Persistence: a tiny localStorage sync (key `axon.v1`). Reduced-motion and returning-visitor
logic reads `mode`/`booted` to satisfy R6/R7.

## Agent FSM (xstate)

States and transitions:
- `cold_start` --(BOOT_DONE)--> `idle`
- `idle` --(SPEAK)--> `decoding` --(DECODE_DONE)--> `idle`
- `idle` --(FOCUS stage)--> `attending` --(BLUR)--> `idle`
- `idle` --(THINK)--> `forward_pass` --(READY)--> `idle`
Guards: if reduced-motion or returning visitor with `mode!=unset`, machine starts in `idle`
and boot is skipped (BootSequence renders nothing / transcript instead).

## Boot sequence (R1) — GSAP timeline

1. Print log lines with a stagger (weights bar tween 0→100%).
2. Ignite the attention graph (opacity/scale, edges draw).
3. Emit `BOOT_DONE`; hand off to Greeting.
Total ~3s. A persistent `Skip` button (R4) calls `chooseMode('skip')` at any time.
Timeline is killed on unmount and on skip. Respects reduced-motion (no timeline; jump to end).

## Greeting + fork (R2, R3)

- Greeting text via `useDecoder` (Framer Motion / rAF token reveal). Real text lives in DOM
  immediately in an `aria-live` region; the animation only controls opacity per token so
  screen readers and crawlers see full text (N1, N2).
- Three buttons; each writes `mode` to the store (persisted, R6) and transitions:
  - `walkthrough`: reveal content, agent autopilots later phases (P1: reveal + dock).
  - `manual`: reveal content, agent docks quietly.
  - `skip`: reveal content immediately, agent minimized (R5).

## Landing composition

The existing `src/pages/index.astro` content becomes the "static portfolio underneath"
(authoritative for SEO, N2/N4). The agent experience is an island layered above it via
`AgentLanding.astro` with `client:load`. Skip/again toggles a class that reveals the static
sections. The static content is always in the DOM (not conditionally rendered) so crawlers
and no-JS visitors get everything (N4).

## Accessibility & degradation (N1, N4, R7)

- Narration: `aria-live="polite"`, full text present, animation is opacity-only.
- Graph/canvas: `aria-hidden="true"`, `pointer-events` off.
- Reduced-motion: `Transcript.tsx` renders the same script as static text; boot/decoder skipped.
- No-JS: island does not hydrate; static portfolio shows; a `.no-js`/`.js` gate ensures the
  agent overlay is only shown when JS runs (overlay hidden by default, shown by script).

## Performance (N3)

- Only the landing island hydrates eagerly (`client:load`); it is small.
- GSAP/Framer imported inside the island, code-split from the rest of the site.
- Lenis and heavier stage animations load in later phases behind their routes/sections.

## Testing hooks

- Stable `data-testid` on: boot root, skip button, each fork button, greeting region,
  context meter, dock. Used by the UI-testing agent.
