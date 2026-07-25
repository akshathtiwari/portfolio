// Pre-render KaTeX math in the transformer-map blog embed to static HTML.
//
// Why: the embed is a static file in public/ (not processed by Astro), and we do
// NOT want a runtime CDN/JS dependency for math — that is exactly what makes the
// equations render as broken Times-New-Roman fallback on flaky networks, corporate
// proxies, or non-compositing preview panes. Instead we bake KaTeX HTML into the
// hidden #derivations blocks at build time and self-host the CSS + fonts.
//
// Authoring workflow: write math in the #derivations blocks with $inline$ / $$display$$
// delimiters, then run this script (idempotent — already-rendered spans contain no `$`,
// so re-running only renders NEW expressions):
//
//   node scripts/prerender-katex-embed.mjs
//
// It only touches the region between `<div id="derivations"` and the first following
// `<script>`, so prose, data-prompt attributes, and the WIP{} JS map are never scanned.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import katex from 'katex';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'public/blog-embeds/transformer-map.html');

let html = fs.readFileSync(file, 'utf8');

const start = html.indexOf('<div id="derivations"');
if (start < 0) throw new Error('#derivations block not found');
const end = html.indexOf('<script', start);
if (end < 0) throw new Error('script boundary after #derivations not found');

let block = html.slice(start, end);
let count = 0;

const render = (tex, displayMode) => {
  count++;
  return katex.renderToString(tex.trim(), {
    displayMode,
    throwOnError: false, // renders the offending source in red rather than crashing the build
    strict: false,
  });
};

// Display math first ($$...$$), then inline ($...$). Math never contains a literal `$`.
block = block.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => render(tex, true));
block = block.replace(/\$([^$\n]+?)\$/g, (_, tex) => render(tex, false));

html = html.slice(0, start) + block + html.slice(end);
fs.writeFileSync(file, html);

console.log(`Pre-rendered ${count} math expressions into ${path.relative(root, file)}`);
