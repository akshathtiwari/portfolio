# Design — Transformer Evolution Map (blog)

## Delivery shape

Reuse the existing interactive-essay pipeline exactly (per project convention):

```
public/blog-embeds/transformer-map.html   <- self-contained interactive map (noindex)
src/content/blog/transformer-evolution-map.mdx  <- immersive:true wrapper + sr-only summary
        └─ <BlogEmbed src="/blog-embeds/transformer-map.html" title="..." />
```

`BlogEmbed.astro` already handles the iframe + auto-resize listener. No component changes.

## Embed document structure

```
<head>
  KaTeX css + fonts (CDN, preconnect), <meta robots noindex>, <style> (self-contained)
<body>
  header  : title, one-line thesis, legend (4 category tags), progress pill "N of M derived"
  phases  : Phase 0..8 — each = .ph { head, sub, .grid of .nd cards, .phase-detail panel }
  timeline: Phase 9 — .tl of .tl-item model teardowns (each a card into the same detail system)
  footer  : source-note + "await K3 report" caveat
  scripts : CARDS data object, accordion controller, copy-prompt, KaTeX auto-render, resize post
```

## Card interaction model (replaces sendPrompt)

- Each `.nd` card is a `<button>` with `data-card="<id>"` and `data-prompt="<original prompt>"`.
- Cards belong to a phase; each phase has exactly one `.phase-detail` region directly
  below its grid. Clicking a card:
  - if a different card is open in that phase → render this card's content, keep open;
  - if the same card is open → collapse.
- Only one detail open per phase (keeps vertical flow readable). `aria-expanded` on the
  card and `hidden` on the panel track state. Selected card gets an `is-active` outline.
- Detail panel content = `CARDS[id].html` (already KaTeX-delimited) + a `.card-prompt`
  block containing the "Ask your own model this" copy button (uses `data-prompt`).
- Pending cards: `CARDS[id]` has `status:'wip'` → panel shows the orientation blurb, a
  "Full derivation in progress" chip, and the copy-prompt. Derived cards: `status:'done'`.
- Progress pill counts `status:'done'`.

## Data model

```js
const CARDS = {
  'lm-next-token': {
    status: 'done',
    title: 'Language modeling as next-token prediction',
    html: `<p>… full derivation with $…$ math …</p>`
  },
  'stable-latentmoe': {
    status: 'wip',
    title: 'Stable LatentMoE',
    html: `<p>orientation … <span class="await">awaiting the July 27 K3 report</span></p>`
  },
  ...
}
```

`data-prompt` on each card is the verbatim source prompt (kept for R5), independent of
`CARDS[id].html`.

## KaTeX

Load `katex.min.css` + `katex.min.js` + `contrib/auto-render.min.js`; call
`renderMathInElement(document.body, {delimiters:[$$ display, $ inline], throwOnError:false})`
once on load. All card HTML (including hidden/pending panels) is in the DOM at load, so
math pre-renders and expansion only reveals — no re-render on toggle, no layout jump.
`.katex{color:var(--ink)}` so math inherits theme ink.

## Auto-resize

Copy the exact resize script from the existing embeds (measures
`max(body.scrollHeight, body.offsetHeight)`; posts on load/resize/click/input + a few
timed fallbacks + ResizeObserver). Accordion toggles fire `click`, which already triggers
a delayed re-post, so height follows expand/collapse.

## Theme / palette

Self-contained dark, tuned to sit beside the other embeds. Category accents from the
source tag palette:

- foundations — warm stone `#D3D1C7` on `#444441`
- architecture — indigo `#CECBF6` on `#3C3489`
- training — teal `#9FE1CB` on `#085041`
- inference — terracotta `#F5C4B3` on `#712B13`

Base: `--bg:#12131a`, `--panel:#1a1b24`, `--ink:#eef0f6`, `--dim:#a6a8b8`, mono for
labels/years. Category accent is used on the card tag and the active-card outline.

## Accessibility (N1)

- Cards: `<button aria-expanded aria-controls>`; panel `role="region"` labelled by card.
- Reduced motion: `@media (prefers-reduced-motion: reduce)` disables the expand transition.
- Focus-visible outline on cards; detail panel receives focus on open for screen readers.

## Content fill plan (the "series")

| Increment | Phase(s) | Cards | State this sitting |
|-----------|----------|-------|--------------------|
| 1 (now)   | 0, 1     | 8     | done               |
| 2         | 2, 3     | 7     | wip → done later   |
| 3         | 4        | 7     | wip → done later   |
| 4         | 5, 6     | 10    | wip → done later   |
| 5         | 7, 8     | 10    | wip → done later   |
| 6         | 9 timeline | 9   | wip → done later   |

Filling a card later = flip `status` to `'done'` and drop in the derivation HTML; no
structural change. Update the sr-only MDX summary if the thesis shifts.
