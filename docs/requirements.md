# Requirements — The Agent Portfolio

Spec-driven. This is the source of truth for *what* must be true. Design (`design.md`)
covers *how*; tasks (`tasks.md`) track execution. Derived from `narrative.md` with all
default decisions (D1 to D8) accepted.

## Accepted decisions (from narrative.md §15)

- D1 Stack: Astro + React islands (keep content collections, SEO, blog, Vercel deploy).
- D2 Agent: name `AXON`, light meta.
- D3 Tone: ~70% restrained, competent-with-a-smile.
- D4 Gamification: full, but everything skippable.
- D5 FitScore finale: in, clearly labeled playful.
- D6 3D: 2D first, react-three-fiber optional in a later phase.
- D7 Re-skin scope: landing is the full experience; inner pages get lighter agent presence.
- D8 Sound: skipped for now.

## Functional requirements

Each requirement uses EARS-style phrasing and has an id. Phase 1 requirements are marked **[P1]**.

- **R1 [P1]** On first paint of the landing page, the system SHALL play a cold-start boot sequence (weights loading, KV cache, warmup) that completes in about 3 seconds.
- **R2 [P1]** After boot, the agent AXON SHALL greet the visitor with text decoded token-by-token.
- **R3 [P1]** The greeting SHALL present a three-way fork: `Run walkthrough`, `I'll drive`, `Skip to content`.
- **R4 [P1]** A `Skip to content` affordance SHALL be reachable within one action from the first frame, at any time during boot or greeting.
- **R5 [P1]** WHEN the visitor chooses `Skip to content`, the system SHALL immediately reveal the static portfolio and minimize the agent.
- **R6 [P1]** The visitor's choice at the fork SHALL persist across reloads (localStorage), and returning visitors SHALL NOT be forced through the boot again.
- **R7 [P1]** WHEN `prefers-reduced-motion: reduce` is set, the system SHALL skip animated boot/decoding and render a static transcript of the agent's narration inline, with the full portfolio immediately visible.
- **R8 [P1]** The agent SHALL be a persistent island driven by a finite state machine with states `cold_start, idle, forward_pass, decoding, attending`.
- **R9 [P1]** A context-window progress meter SHALL exist and update as the visitor advances (0 to 128k tokens), persisted to localStorage.
- **R10** The agent SHALL narrate each stage as it enters the viewport (attending state), in walkthrough and manual modes.
- **R11** A terminal surface SHALL accept commands (`help, whoami, ls projects, run eval fitscore, sudo hire, clear`, hidden `jailbreak`).
- **R12** Experience SHALL render as a scroll-scrubbed loss curve with checkpoints and capability unlocks.
- **R13** Projects SHALL render as an eval suite where each project is a callable tool with an animated result.
- **R14** The finale SHALL compute a playful, clearly-labeled FitScore for the visitor from their path.

## Non-functional requirements

- **N1 [P1] Accessibility:** all controls keyboard-focusable; agent narration in an `aria-live="polite"` region; decorative canvas/graph `aria-hidden`. Meets WCAG AA contrast.
- **N2 [P1] SEO preserved:** all real content stays server-rendered static HTML; existing meta, OG, sitemap, JSON-LD intact. The agent layer never hides content from crawlers.
- **N3 [P1] Performance:** no regression of current fast static loads; animation libs code-split; nothing blocks first content. Boot must not trap the visitor (R4/R5).
- **N4 [P1] Graceful degradation:** with JS disabled, the site renders as a complete static portfolio.
- **N5 Progressive enhancement:** the agent is strictly additive; content is authoritative.
- **N6 No em-dashes in copy** (author style). Mechanism-first, correct ML terminology per narrative §7.

## Acceptance for Phase 1 (definition of done)

1. R1 to R9, N1 to N4, N6 all satisfied on the landing page.
2. Production build passes; no console errors on load or on each fork choice.
3. Senior-frontend-dev review passes.
4. UI-testing agent passes.
5. Committed and deployed live; live URL verified 200 with expected content.
