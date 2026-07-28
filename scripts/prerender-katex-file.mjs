// Generic KaTeX pre-renderer for a blog embed. Usage:
//   node scripts/prerender-katex-file.mjs public/blog-embeds/<file>.html
// Renders $inline$ / $$display$$ math between <!--KATEX-START--> and <!--KATEX-END-->
// to static KaTeX HTML (no runtime CDN/JS). Idempotent; only the marked region is scanned.
import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';

const rel = process.argv[2];
if (!rel) throw new Error('usage: node scripts/prerender-katex-file.mjs <path-to-embed.html>');
const file = path.resolve(rel);
let html = fs.readFileSync(file, 'utf8');
const START = '<!--KATEX-START-->', END = '<!--KATEX-END-->';
const start = html.indexOf(START), end = html.indexOf(END);
if (start < 0 || end < 0 || end < start) throw new Error('KATEX markers not found / out of order');
let block = html.slice(start, end);
let count = 0;
const render = (tex, displayMode) => { count++; return katex.renderToString(tex.trim(), { displayMode, throwOnError: false, strict: false }); };
block = block.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => render(tex, true));
block = block.replace(/\$([^$\n]+?)\$/g, (_, tex) => render(tex, false));
html = html.slice(0, start) + block + html.slice(end);
fs.writeFileSync(file, html);
console.log(`Pre-rendered ${count} math expressions into ${rel}`);
