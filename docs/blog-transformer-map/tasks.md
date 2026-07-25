# Tasks — Transformer Evolution Map (blog)

## Increment 1 (this sitting) — infra + foundations live  ✅ SHIPPED (commit ceda861)

- [x] T1  Write SDD: requirements.md, design.md, tasks.md
- [x] T2  Build `public/blog-embeds/transformer-map.html` scaffold
        - [x] head: KaTeX + fonts CDN, noindex, self-contained dark theme
        - [x] all Phase 0–8 grids + cards (data-card, data-prompt, category tag)
        - [x] Phase 9 timeline items wired into the same detail system
        - [x] one `.phase-detail` per phase; accordion controller
        - [x] copy-prompt button; progress pill; legend; footer caveat
        - [x] KaTeX auto-render call; auto-resize post script (exact pattern)
        - [x] a11y: buttons, aria-expanded/controls, reduced-motion, focus
- [x] T3  Fill CARDS content — Phase 0 (4 cards, status done, full derivations)
- [x] T4  Fill CARDS content — Phase 1 (4 cards, status done, full derivations)
- [x] T5  Stub CARDS content — Phases 2–9 + timeline (status wip, orientation + await markers)
- [x] T6  MDX wrapper `src/content/blog/transformer-evolution-map.mdx`
        (immersive:true, tags, sr-only summary, BlogEmbed)
- [x] T7  Build clean (23 pages); preview verified: iframe resizes (3198→4925px tracks
        content), 134 KaTeX rendered, accordion 1-open-per-phase, copy-prompt +
        await-box work, 0 console errors. (Screenshot n/a — headless pane not composited.)
- [x] T8  Commit + push to main → Vercel auto-deploy (commit ceda861)

Verified counts on the live build: 51 cards total, 8 fully derived (Phase 0 + 1).

## Increment 1.1 — math robustness fix (commit 8dcfaf1)

- [x] Root-caused "math not properly formatted": runtime CDN KaTeX fell back to
      Times New Roman wherever cdnjs was slow/blocked or webfonts weren't painted.
- [x] Self-host KaTeX css + 20 woff2 fonts under `public/blog-embeds/katex/`.
- [x] Pre-render all 142 equations to static HTML at build via
      `scripts/prerender-katex-embed.mjs` (idempotent; scans only the #derivations
      region). Removed CDN css/js + runtime auto-render entirely.
- [x] Fixed iframe-resize regression: `postHeight()` was called before its
      non-hoisted `window.postHeight = ...` definition → ReferenceError aborted the
      script. Reordered so it's defined before first use.
- [x] Verified in real Chrome on live prod: math renders correctly, cdn refs = 0,
      no KaTeX JS globals, iframe resizes (3198 ↔ 4486px).

NOTE for future card fills: after adding `$...$` math, run
`node scripts/prerender-katex-embed.mjs` before build+push.

## Later increments — fill the map (one phase per sitting, per source cadence)

MAP COMPLETE — 51/51 cards fully derived and deployed (all phases).

- [x] Phase 2 — transformer block — commit a397b34
- [x] Phase 3 — positional info — commit a397b34
- [x] Phase 4 — attention efficiency (7 cards) — commit 9bbdeed
- [x] Phase 5 — MoE (Stable LatentMoE has inline awaitbox) — commit 5a049e8
- [x] Phase 6 — pretraining — commit ef7a755
- [x] Phase 7 — post-training (full DPO + GRPO derivations) — commit 83a5f51
- [x] Phase 8 — inference/serving — commit 33b864c
- [x] Phase 9 — timeline teardowns (kimi-k3 has inline awaitbox) — commit 36e720c

Only remaining work is deepening the two await cards (stable-latentmoe, kimi-k3)
once the Kimi K3 technical report lands 2026-07-27.

\* deepen once the K3 technical report lands (2026-07-27).

## Fill procedure (each later sitting)
1. Flip the card's `status` from `'wip'` to `'done'` in CARDS.
2. Replace its `html` with the full derivation.
3. `npm run build` → preview KaTeX/resize → push. Progress pill updates automatically.
