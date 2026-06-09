#!/usr/bin/env node
/* LIB-7 + LIB-8 — inject in-article navigation from the library manifest:
 *  • breadcrumb  Library → Pillar → article   (after header)
 *  • "next in your role path" + 3–6 related cards + soft lead CTA  (before footer)
 * Idempotent (marker-wrapped). EN/RU only; HE is gated. Per-article language. */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'library-manifest.json'), 'utf8'));
const byId = {}; M.articles.forEach(a => { byId[a.id] = a; });

const L = {
  ru: { lib: 'Библиотека', related: 'Связанные статьи', next: 'Дальше по маршруту', min: 'мин',
        cta_h: 'Соберём маршрут под ваш проект за 48 часов', cta_b: 'Получить подборку', back: 'В библиотеку' },
  en: { lib: 'Library', related: 'Related articles', next: 'Next in your path', min: 'min',
        cta_h: 'A curated reading path for your project in 48h', cta_b: 'Get the set', back: 'Back to Library' }
};
const esc = s => (s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pillarName = (p, lang) => { const P = M.pillars[p]; return P ? (P[lang] || P.en) : ''; };

const CSS = `<style id="lib-art-css">
.lan{font-family:'Montserrat',sans-serif}
.lan-crumb{max-width:1100px;margin:0 auto;padding:16px 24px 0;display:flex;gap:8px;align-items:center;flex-wrap:wrap;font:500 12.5px/1.4 'Montserrat',sans-serif;color:var(--steel)}
.lan-crumb a{color:var(--steel);text-decoration:none}.lan-crumb a:hover{color:var(--carbon)}
.lan-crumb b{color:var(--carbon);font-weight:600}.lan-crumb span{color:#c9c5bc}
.lan-foot{max-width:1100px;margin:48px auto 0;padding:0 24px}
.lan-next{display:flex;align-items:center;gap:12px;padding:16px 18px;border:1px solid var(--signal);border-radius:14px;text-decoration:none;color:var(--carbon);margin:0 0 30px;background:#fff}
.lan-next:hover{box-shadow:0 10px 26px rgba(200,107,60,.16)}
.lan-next__k{font:600 11px/1 'Montserrat';letter-spacing:.08em;text-transform:uppercase;color:var(--signal);white-space:nowrap}
.lan-next__t{font:600 15px/1.3 'Montserrat';color:var(--carbon)}.lan-next__a{margin-left:auto;color:var(--signal);font-size:20px}
.lan-h{font-family:'Cormorant Garamond',serif;font-weight:500;font-size:28px;line-height:1.05;margin:0 0 18px;color:var(--carbon)}
.lan-rel{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:0 0 44px}
.lan-card{display:flex;flex-direction:column;background:#fff;border:1px solid #e4e1d9;border-radius:14px;overflow:hidden;text-decoration:none;color:inherit;transition:.18s}
.lan-card:hover{transform:translateY(-3px);box-shadow:0 12px 28px rgba(21,21,21,.09)}
.lan-card img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block;background:var(--concrete)}
.lan-card__b{padding:13px 14px 15px;display:flex;flex-direction:column;gap:7px;flex:1}
.lan-card__t{font:600 14px/1.3 'Montserrat';color:var(--carbon)}
.lan-card__m{font:500 11.5px/1 'Montserrat';color:var(--steel);margin-top:auto}
.lan-cta{background:var(--concrete);border:1px solid #e4e1d9;border-radius:18px;padding:34px;text-align:center;margin:0 0 50px}
.lan-cta__h{font-family:'Cormorant Garamond',serif;font-weight:500;font-size:clamp(24px,3vw,32px);line-height:1.08;margin:0 0 16px;color:var(--carbon)}
.lan-cta__btn{display:inline-flex;align-items:center;gap:9px;background:var(--carbon);color:#fff;text-decoration:none;padding:14px 28px;border-radius:980px;font:600 14px/1 'Montserrat'}
.lan-cta__btn:hover{background:var(--signal)}
@media(max-width:860px){.lan-rel{grid-template-columns:1fr 1fr}}
@media(max-width:560px){.lan-rel{grid-template-columns:1fr}}
</style>`;

function nextInPath(a) {
  for (const role of Object.keys(M.readingPaths)) {
    const arr = M.readingPaths[role];
    const i = arr.findIndex(s => s === a.id || s === a.slug);
    if (i >= 0 && i < arr.length - 1) {
      const nx = byId[arr[i + 1]] || M.articles.find(x => x.slug === arr[i + 1] || x.id === arr[i + 1]);
      if (nx) return { role, nx };
    }
  }
  return null;
}
function related(a) {
  return M.articles.filter(x => x.pillar === a.pillar && x.id !== a.id)
    .sort((x, y) => (y.personas.some(p => a.personas.includes(p)) ? 1 : 0) - (x.personas.some(p => a.personas.includes(p)) ? 1 : 0))
    .slice(0, 6);
}
function relCard(x) {
  return `<a class="lan-card" href="${esc(x.url)}"><img src="${esc(x.photo)}" alt="" loading="lazy"><div class="lan-card__b"><div class="lan-card__t">${esc(x.title)}</div><div class="lan-card__m">${x.readMin} ${L[x.lang] ? L[x.lang].min : 'min'}</div></div></a>`;
}

function build(a) {
  const lang = L[a.lang] ? a.lang : 'en', t = L[lang];
  const crumb = `<!--lib:crumb:start-->\n<nav class="lan lan-crumb" aria-label="breadcrumb"><a href="/library.html">${t.lib}</a><span>/</span><a href="/library.html">${esc(pillarName(a.pillar, lang))}</a><span>/</span><b>${esc(a.title)}</b></nav>\n<!--lib:crumb:end-->`;
  const nx = nextInPath(a);
  const nextHtml = nx ? `<a class="lan-next" href="${esc(nx.nx.url)}"><span class="lan-next__k">${t.next} · ${esc(nx.role)}</span><span class="lan-next__t">${esc(nx.nx.title)}</span><span class="lan-next__a">→</span></a>` : '';
  const rel = related(a);
  const relHtml = rel.length ? `<h2 class="lan-h">${t.related}</h2><div class="lan-rel">${rel.map(relCard).join('')}</div>` : '';
  const persona = a.personas[0] || '';
  const cta = `<div class="lan-cta"><h2 class="lan-cta__h">${t.cta_h}</h2><a class="lan-cta__btn" href="/contact.html#intent=reading-path&source=library&persona=${encodeURIComponent(persona)}">${t.cta_b}<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div>`;
  const foot = `<!--lib:foot:start-->\n${CSS}\n<section class="lan lan-foot">${nextHtml}${relHtml}${cta}</section>\n<!--lib:foot:end-->`;
  return { crumb, foot };
}

function injectOnce(html, startMark, block) {
  const re = new RegExp(startMark.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + startMark.replace('start', 'end').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return re.test(html) ? html.replace(re, block) : null; // null = not present yet
}

let done = 0, skip = 0;
for (const a of M.articles) {
  const abs = path.join(ROOT, a.url.replace(/^\//, ''));
  if (!fs.existsSync(abs)) { skip++; continue; }
  let html = fs.readFileSync(abs, 'utf8');
  const { crumb, foot } = build(a);

  // breadcrumb: replace existing block, else insert after header:end
  let r = injectOnce(html, '<!--lib:crumb:start-->', crumb);
  if (r) html = r; else if (/<!-- partials:header:end -->/.test(html)) html = html.replace(/<!-- partials:header:end -->/, '<!-- partials:header:end -->\n' + crumb);

  // foot: replace existing block, else insert before footer marker / <footer / </body>
  r = injectOnce(html, '<!--lib:foot:start-->', foot);
  if (r) html = r;
  else if (/<!-- partials:footer:start/.test(html)) html = html.replace(/(<!-- partials:footer:start)/, foot + '\n$1');
  else if (/<footer\b/.test(html)) html = html.replace(/(<footer\b)/, foot + '\n$1');
  else if (/<\/body>/i.test(html)) html = html.replace(/<\/body>/i, foot + '\n</body>');

  // normalize legacy back-link → Library (matches any attribute order; breadcrumb is now the primary nav)
  html = html.replace(/<a\b[^>]*\bclass="back-link"[^>]*>[\s\S]*?<\/a>/gi,
    '<a class="back-link" href="/library.html">' + (a.lang === 'ru' ? 'В библиотеку' : 'Back to Library') + '</a>');

  fs.writeFileSync(abs, html);
  done++;
}
console.log(`[article-nav] injected breadcrumb + related + CTA into ${done} articles (skipped ${skip})`);
