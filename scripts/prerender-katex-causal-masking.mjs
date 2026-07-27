// Pre-render KaTeX math in the causal-masking blog embed to static HTML.
// Same contract as the other prerender-katex-*.mjs scripts: no runtime KaTeX/CDN.
// Author math with $inline$ / $$display$$ between <!--KATEX-START--> and
// <!--KATEX-END-->, then run:  node scripts/prerender-katex-causal-masking.mjs
// Idempotent; only the marked region is scanned.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import katex from 'katex';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'public/blog-embeds/causal-masking.html');

let html = fs.readFileSync(file, 'utf8');
const START = '<!--KATEX-START-->', END = '<!--KATEX-END-->';
const start = html.indexOf(START), end = html.indexOf(END);
if (start < 0 || end < 0 || end < start) throw new Error('KATEX markers not found / out of order');

let block = html.slice(start, end);
let count = 0;
const render = (tex, displayMode) => {
  count++;
  return katex.renderToString(tex.trim(), { displayMode, throwOnError: false, strict: false });
};
block = block.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => render(tex, true));
block = block.replace(/\$([^$\n]+?)\$/g, (_, tex) => render(tex, false));

html = html.slice(0, start) + block + html.slice(end);
fs.writeFileSync(file, html);
console.log(`Pre-rendered ${count} math expressions into ${path.relative(root, file)}`);
