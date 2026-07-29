// Make the self-contained blog-embed essays theme-aware so they follow the
// site's light/dark toggle instead of being stuck in dark.
//
// The essays are generated dark, but they share a consistent neutral-token
// vocabulary in :root (--bg/--panel/--ink/--dim/--faint/--line ...). This
// injects, idempotently, into every public/blog-embeds/*.html:
//   1. a tiny <head> listener that reads ?theme= (set by BlogEmbed at load) and
//      live postMessage {__blogTheme} (sent on toggle), flipping a data-theme
//      attribute on <html>; and
//   2. a :root[data-theme="light"] block that remaps the shared neutral tokens
//      to light values (accent hues are left as designed).
//
// Run after the content pipeline adds new embeds:  node scripts/inject-embed-theme.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../public/blog-embeds"
);

const MARKER = "tdb-theme-light";

// Setting an explicit color-scheme on <html> tells the browser this page
// manages its own theming, which opts it OUT of forced/auto dark-mode — so
// the site's real toggle wins instead of the browser force-darkening a light
// essay. The <meta> below declares support for both up front.
const HEAD_META = `<meta name="color-scheme" content="light dark">`;

const HEAD_SCRIPT = `<script data-theme-bridge>
/* theme-bridge: follow the host site's light/dark choice, and opt out of
   the browser's forced dark-mode by owning color-scheme. */
(function(){
  function apply(t){
    var el=document.documentElement;
    if(t==='light'){el.setAttribute('data-theme','light');el.style.colorScheme='light';}
    else{el.removeAttribute('data-theme');el.style.colorScheme='dark';}
  }
  apply('dark'); // sensible default until a theme signal arrives
  try{var p=new URLSearchParams(location.search).get('theme');if(p){apply(p);}}catch(e){}
  window.addEventListener('message',function(e){
    var d=e.data;
    if(d&&(d.__blogTheme==='light'||d.__blogTheme==='dark')){apply(d.__blogTheme);}
  });
})();
</script>`;

// Light theme. The neutral tokens flip cleanly, but the essays are generated
// dark and some hardcode white/near-white or accent colors on headings and
// prose text (not via --ink), which would vanish on white. So we also force
// headings and block text to ink. Inline accent spans keep their own color
// (they set it on the span, which still wins), so highlighted words stay
// colored while the base text becomes readable.
const LIGHT_STYLE = `<style id="${MARKER}">
:root[data-theme="light"]{
  color-scheme: light;
  --bg:#f7f8fa; --bg-2:#eef1f5;
  --panel:#ffffff; --panel-2:#f2f4f7;
  --ink:#16181d; --dim:#41495a; --faint:#69728a;
  --line:#e2e6ec; --line-2:#d6dbe3; --line-soft:#eceff3;
}
:root[data-theme="light"] body{ background:var(--bg); color:var(--ink); }
:root[data-theme="light"] h1,:root[data-theme="light"] h2,
:root[data-theme="light"] h3,:root[data-theme="light"] h4,
:root[data-theme="light"] h5,:root[data-theme="light"] h6{
  color:var(--ink)!important;-webkit-text-fill-color:var(--ink)!important;
}
:root[data-theme="light"] p,:root[data-theme="light"] li,
:root[data-theme="light"] dd,:root[data-theme="light"] dt,
:root[data-theme="light"] td,:root[data-theme="light"] th,
:root[data-theme="light"] blockquote,:root[data-theme="light"] figcaption,
:root[data-theme="light"] label,:root[data-theme="light"] summary{
  color:var(--ink)!important;
}
</style>`;

const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".html"))
  .map((f) => path.join(dir, f));

let changed = 0;

for (const file of files) {
  let html = fs.readFileSync(file, "utf8");
  if (!/<head[^>]*>/i.test(html) || !/<\/head>/i.test(html)) {
    console.warn(`! ${path.basename(file)}: no <head> found, skipping`);
    continue;
  }
  // Remove any previously injected blocks so re-running updates them in place.
  html = html
    .replace(/\n?<meta name="color-scheme"[^>]*>/i, "")
    .replace(/\n?<script data-theme-bridge>[\s\S]*?<\/script>/i, "")
    .replace(new RegExp(`\\n?<style id="${MARKER}">[\\s\\S]*?<\\/style>`, "i"), "");

  // Meta + listener early in <head> (before paint → no flash), style before </head>.
  html = html.replace(/<head[^>]*>/i, (m) => `${m}\n${HEAD_META}\n${HEAD_SCRIPT}`);
  html = html.replace(/<\/head>/i, `${LIGHT_STYLE}\n</head>`);
  fs.writeFileSync(file, html);
  changed++;
}

console.log(`theme-bridge injected/updated in ${changed} embeds`);
