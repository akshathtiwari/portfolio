# Requirements — Transformer Evolution Map (blog)

## Context

Source artifact: `~/Documents/GRE/transformer_to_kimi_k3_master_roadmap.html` — an
interactive study roadmap (Phase 0→9, ~40 concept cards + a 9-model timeline) that
was generated as a Claude-chat widget. Every card fires `sendPrompt(...)`, a function
that only exists inside the chat widget, so outside chat the cards do nothing. The
teaching content behind each card does not exist yet; the file holds *prompts*, not
*explanations*.

Goal: turn this into a single, canonical, deployed blog post on the portfolio —
"Transformer Evolution: GPT-2 → Kimi K3" — a derivation-first learning map where each
card expands **in place** to its full worked derivation. The map is filled in over
sittings ("one card per sitting"), so it ships live now with the foundational phases
fully derived and every remaining card structured and ready to fill.

## Functional requirements

- **R1 — Single immersive post.** One blog entry (`immersive: true`) rendered via the
  established `BlogEmbed` iframe pipeline (`public/blog-embeds/*.html`), not 10 separate
  posts. The "series" is the progressive deepening of one map.
- **R2 — Faithful structure.** Preserve the source's Phase 0→9 spine, all ~40 cards,
  the 4-category tag system (foundations / architecture / training / inference), and the
  9-model evolution timeline. Card order and phase framing match the source.
- **R3 — Expand-in-place derivations.** Clicking a card reveals a full-width detail
  panel within its phase (accordion, one open per phase). No dependency on `sendPrompt`.
- **R4 — Full math.** Derivations render real math via KaTeX (CDN, `$…$`/`$$…$$`,
  matching existing embeds). Rigor targeted at an ML-engineer reader; no hand-waving.
- **R5 — Honor original intent.** Each card keeps its original teaching prompt behind a
  "Ask your own model this" copy-to-clipboard button, so the reader can still get the
  interactive deep-dive the source was designed for.
- **R6 — Honest K3 markers.** K3-specific cards (Stable LatentMoE internals especially)
  are visibly marked "awaiting the July 27, 2026 technical report" and are built on
  what is publicly known now, per the source's own caveat.
- **R7 — Progress signal.** The map shows how many cards are fully derived vs pending,
  so the reader (and author) can see the fill state.
- **R8 — Crawlable + SEO-safe.** Embed is `noindex`; the MDX carries an sr-only prose
  summary so `/blog/*` stays the canonical, indexable surface. Matches existing embeds.
- **R9 — Auto-resize.** Embed reports content height via `postMessage` (measuring
  `document.body`, not `documentElement.scrollHeight`) and re-posts on expand/collapse,
  so the parent iframe grows/shrinks correctly.

## Non-functional requirements

- **N1 — Accessibility.** Cards are real buttons, keyboard-operable, `aria-expanded`
  reflects state; detail panels are focusable/announced. Respects `prefers-reduced-motion`.
- **N2 — Theme.** Self-contained dark theme consistent with the other embeds; the four
  category accents derive from the source tag palette.
- **N3 — Self-contained.** No build step for the embed; KaTeX + fonts via CDN (same
  tradeoff as the dflash/dspark/speculative embeds). No external calls beyond CDN assets.
- **N4 — Responsive.** Card grid reflows on mobile; no horizontal page scroll; math
  blocks scroll inside their own container if they overflow.

## Scope for the FIRST shipped increment (this sitting)

Fully derived and live:
- **Phase 0 — Bedrock** (4 cards): LM as next-token prediction, Tokenization,
  Embeddings, Pre-transformer era.
- **Phase 1 — Attention** (4 cards): Scaled dot-product attention (incl. the √d_k
  variance derivation and a worked 3-token example), Causal masking, Multi-head
  attention, Quadratic complexity.

All other cards (Phases 2–9 + timeline) ship with a crisp orientation + "full derivation
in progress" marker + the copy-prompt, so the map is complete and usable on day one.

## Out of scope

- Rewriting the source's pedagogical ordering.
- Fabricating K3 internals not yet public (report lands 2026-07-27).
- Any change to the AXON agent landing or other posts.
