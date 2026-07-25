# Tasks — Transformer Evolution Map (blog)

## Increment 1 (this sitting) — infra + foundations live

- [x] T1  Write SDD: requirements.md, design.md, tasks.md
- [ ] T2  Build `public/blog-embeds/transformer-map.html` scaffold
        - [ ] head: KaTeX + fonts CDN, noindex, self-contained dark theme
        - [ ] all Phase 0–8 grids + cards (data-card, data-prompt, category tag)
        - [ ] Phase 9 timeline items wired into the same detail system
        - [ ] one `.phase-detail` per phase; accordion controller
        - [ ] copy-prompt button; progress pill; legend; footer caveat
        - [ ] KaTeX auto-render call; auto-resize post script (exact pattern)
        - [ ] a11y: buttons, aria-expanded/controls, reduced-motion, focus
- [ ] T3  Fill CARDS content — Phase 0 (4 cards, status done, full derivations)
- [ ] T4  Fill CARDS content — Phase 1 (4 cards, status done, full derivations)
- [ ] T5  Stub CARDS content — Phases 2–9 + timeline (status wip, orientation + await markers)
- [ ] T6  MDX wrapper `src/content/blog/transformer-evolution-map.mdx`
        (immersive:true, tags, sr-only summary, BlogEmbed)
- [ ] T7  `npm run build` clean; preview: iframe resizes, KaTeX renders, accordion +
        copy-prompt work, dark/light parent both fine, mobile reflow
- [ ] T8  Commit + push to main → Vercel auto-deploy; verify live URL

## Later increments — fill the map (one phase per sitting, per source cadence)

- [ ] Phase 2 — transformer block (residual stream, normalization, FFN/activations, GPT-2 anatomy)
- [ ] Phase 3 — positional info (abs/rel PE, RoPE, long-context scaling)
- [ ] Phase 4 — attention efficiency (KV cache, MQA/GQA, FlashAttention, sparse, MLA, linear lineage, KDA)
- [ ] Phase 5 — MoE (fundamentals, load balancing, fine-grained/shared, Stable LatentMoE*)
- [ ] Phase 6 — pretraining (scaling laws, data, optimizers, precision, parallelism, stability)
- [ ] Phase 7 — post-training (SFT/LoRA, RLHF/DPO, RLVR/GRPO, agentic)
- [ ] Phase 8 — inference/serving (prefill/decode, serving systems, spec decoding, quant, MTP, giant MoE)
- [ ] Phase 9 — timeline teardowns (GPT-2→GPT-3 … Kimi K3)

\* deepen once the K3 technical report lands (2026-07-27).

## Fill procedure (each later sitting)
1. Flip the card's `status` from `'wip'` to `'done'` in CARDS.
2. Replace its `html` with the full derivation.
3. `npm run build` → preview KaTeX/resize → push. Progress pill updates automatically.
