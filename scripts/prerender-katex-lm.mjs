// Pre-render KaTeX math in the language-modeling blog embed to static HTML.
//
// Same rationale as prerender-katex-embed.mjs: the embed is a static file in
// public/ with NO runtime KaTeX/CDN dependency. Author math with $inline$ /
// $$display$$ between the <!--KATEX-START--> and <!--KATEX-END--> markers, then run:
//
//   node scripts/prerender-katex-lm.mjs
//
// Idempotent — already-rendered spans contain no `$`, so re-running only renders
// NEW expressions. Only the marked region is scanned, so the trailing <script>
// (which must contain no `$`) is never touched.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import katex from 'katex';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'public/blog-embeds/language-modeling.html');

let html = fs.readFileSync(file, 'utf8');

const START = '<!--KATEX-START-->';
const END = '<!--KATEX-END-->';
const start = html.indexOf(START);
const end = html.indexOf(END);
if (start < 0 || end < 0 || end < start) throw new Error('KATEX markers not found / out of order');

let block = html.slice(start, end);
let count = 0;

const render = (tex, displayMode) => {
  count++;
  return katex.renderToString(tex.trim(), { displayMode, throwOnError: false, strict: false });
};

// Display math first ($$...$$), then inline ($...$). Math never contains a literal `$`.
block = block.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => render(tex, true));
block = block.replace(/\$([^$\n]+?)\$/g, (_, tex) => render(tex, false));

html = html.slice(0, start) + block + html.slice(end);
fs.writeFileSync(file, html);

console.log(`Pre-rendered ${count} math expressions into ${path.relative(root, file)}`);
