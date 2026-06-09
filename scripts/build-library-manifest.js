#!/usr/bin/env node
/* LIB-0 — Floor.DSGN Knowledge Library manifest.
 * Scans articles/ (EN/RU; HE excluded — gated), extracts per-article metadata, and
 * assigns pillar (LIBRARY_ARCHITECTURE §6) + persona (§5 reading-paths). First-pass
 * base-62 mapping is operator+MacBook-reviewable. Emits library-manifest.json. */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ART = path.join(ROOT, 'articles');

// ── 8 pillars (§6) ────────────────────────────────────────────────────────────
const PILLARS = {
  1: { key: 'decision',    en: 'Decision & Selection',   ru: 'Выбор системы',        cover: 'images/terrazzo/interrior-222943.jpg' },
  2: { key: 'tender',      en: 'Tender & Documentation', ru: 'Тендер и документация', cover: 'images/rubber/epoxy-resin-floor-preparation-first-layer-inside-building.jpg' },
  3: { key: 'standards',   en: 'Standards & Compliance', ru: 'Стандарты и нормы',     cover: 'images/microtopping/kitchen-with-sink-window-with-view-mountains-outside.jpg' },
  4: { key: 'substrate',   en: 'Substrate & Install',    ru: 'Основание и монтаж',    cover: 'images/rubber/construction-worker-applying-grey-epoxy-resin-industrial-hall.jpg' },
  5: { key: 'usecase',     en: 'Use-Case Specs',         ru: 'По объектам',           cover: 'images/terrazzo/1671671129_kalix-club-p-tekstura-terratstso-krasivo-29.jpg' },
  6: { key: 'comparisons', en: 'Comparisons',            ru: 'Сравнения',             cover: 'images/terrazzo/interrior-222944.jpg' },
  7: { key: 'encyclopedia',en: 'Encyclopedia',           ru: 'Энциклопедия',          cover: 'images/terrazzo/interrior-222945.jpg' },
  8: { key: 'brands',      en: 'Brands & Channel',       ru: 'Бренды и каналы',       cover: 'images/terrazzo/interrior-266999.jpg' },
};

// ── base-62 → pillar first-pass (§6). brands/comparisons/encyclopedia map by folder ─
const BASE_PILLAR = {
  // 1 Decision & Selection
  'role-targeted-floor-faq':1,'floor-frequently-asked-questions':1,'floor-system-selection-by-use-case':1,
  'floor-procurement-timeline':1,'how-to-evaluate-a-floor-installer':1,'floor-decision-guide':1,
  'floor-decision-tree':1,'floor-decision-tree-5q':1,'floor-use-cases':1,'floor-anti-patterns':1,
  'floor-restoration-vs-replace-decision':1,'2026-trends':1,
  // 2 Tender & Documentation
  'floor-tender-boq-template':2,'floor-warranty-types-explained':2,'floor-handover-inspection-checklist':2,
  '10-most-expensive-floor-mistakes-il':2,'architect-pretender-checklist':2,'how-to-read-a-floor-tds':2,
  // 3 Standards & Compliance
  'floor-compliance-verification-checklist':3,'floor-slip-class-DIN-51130-explained':3,
  'israeli-floor-standards-explained':3,'adhesion-pull-off-test-guide':3,
  'floor-accessibility-il-1004-explained':3,'sport-hall-floor-compliance':3,
  // 4 Substrate & Install
  'icri-csp-surface-profile-guide':4,'substrate-icri-csp-guide':4,'substrate-moisture-remediation':4,
  'substrate-moisture-testing':4,'substrate-pull-off-test':4,'substrate-mechanical-prep':4,
  'substrate-defects-handbook':4,'substrate-repair-before-coating':4,'substrate-coastal-chloride-prep':4,
  'expansion-joints-resin-floors':4,'warm-floor-compatibility':4,'floor-finishes-for-underfloor-heating':4,
  'concrete-crack-repair':4,'self-leveling-screeds':4,'when-to-recoat':4,'industrial-cleaning':4,
  'floor-care-by-system-type':4,
  // 5 Use-Case
  'use-case-commercial-kitchen-floor-spec':5,'use-case-brewery-floor-spec':5,'use-case-hospital-floor-spec':5,
  'case-study-tel-aviv-boutique-hotel-renovation':5,'floor-systems-for-cold-stores-freezers':5,
  'floor-systems-coastal-salt-air-environment':5,'floor-systems-dance-fitness-studios':5,
  'floor-systems-high-humidity-environments':5,'floor-systems-outdoor-terrace-pool-deck':5,
  'floor-systems-retail-flagship':5,'antimicrobial-hygiene-floor-systems':5,'esd-static-dissipative-floor-systems':5,
  // 6 Comparisons (base-level comparison articles)
  'microtopping-vs-epoxy':6,'terrazzo-vs-microtopping':6,'epoxy-vs-polyurethane':6,
  // 7 Encyclopedia (base-level primers/glossary)
  'floor-terminology-glossary':7,'sustainable-flooring-cradle-to-cradle':7,'terrazzo-modern-interiors':7,'mma-fast-cure':7,
};
// index pages are not article-cards (floor-knowledge-index becomes /library)
const EXCLUDE = new Set(['index','floor-knowledge-index']);

// ── §5 reading-paths (ordered) → drive role feeds + in-article "next" ───────────
const READING_PATHS = {
  Owner:      ['role-targeted-floor-faq','floor-system-selection-by-use-case','floor-procurement-timeline','10-most-expensive-floor-mistakes-il'],
  Designer:   ['comparisons/microtopping-vs-polished-concrete','comparisons/epoxy-terrazzo-vs-cement-terrazzo','brands/index','floor-tender-boq-template','architect-pretender-checklist'],
  Contractor: ['floor-procurement-timeline','substrate-icri-csp-guide','substrate-moisture-remediation','substrate-mechanical-prep','floor-handover-inspection-checklist','floor-warranty-types-explained'],
  Builder:    ['floor-compliance-verification-checklist','israeli-floor-standards-explained','use-case-hospital-floor-spec','use-case-commercial-kitchen-floor-spec','use-case-brewery-floor-spec','floor-tender-boq-template'],
};
// pillar → default persona(s) so every card has ≥1 role badge
const PILLAR_PERSONA = {1:['Owner'],2:['Designer','Builder'],3:['Builder'],4:['Contractor'],5:['Builder'],6:['Designer'],7:['Designer'],8:['Designer']};

const stripTags = s => s.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&[a-z]+;/g,' ').replace(/\s+/g,' ').trim();
const attr = (html, re) => { const m = html.match(re); return m ? m[1].trim() : ''; };

// id used in paths/maps: e.g. "brands/sika-flooring", "comparisons/x", or base slug
function idOf(rel){ const p = rel.replace(/^articles\//,'').replace(/\.html$/,''); return p; }
function slugOf(rel){ return path.basename(rel).replace(/\.html$/,''); }

function pillarOf(rel){
  if (/^articles\/brands\//.test(rel)) return 8;
  if (/^articles\/comparisons\//.test(rel)) return 6;
  if (/^articles\/encyclopedia\//.test(rel)) return 7;
  if (/^articles\/resources\//.test(rel)) return 7; // glossary/resources → encyclopedia
  return BASE_PILLAR[slugOf(rel)] || 0; // 0 = unmapped (review)
}
function personasOf(id, slug, pillar){
  const set = new Set(PILLAR_PERSONA[pillar] || []);
  for (const [role, pathArr] of Object.entries(READING_PATHS))
    if (pathArr.includes(id) || pathArr.includes(slug)) set.add(role);
  return [...set];
}

// blog-dup set
let blogDup = new Set();
try {
  const blog = fs.readFileSync(path.join(ROOT,'blog.html'),'utf8');
  (blog.match(/href="[^"]*?articles\/[^"]*?\.html"/g)||[]).forEach(h=>{
    const m = h.match(/articles\/([^"]*?)\.html/); if (m) blogDup.add(m[1]);
  });
} catch(e){}

const files = [];
(function walk(d){ for (const e of fs.readdirSync(d,{withFileTypes:true})){ const p=path.join(d,e.name); if(e.isDirectory()) walk(p); else if(e.name.endsWith('.html')) files.push(p); } })(ART);

const manifest = [], flags = [];
for (const abs of files.sort()){
  const rel = path.relative(ROOT, abs);
  const slug = slugOf(rel), id = idOf(rel);
  if (EXCLUDE.has(slug) && !/\//.test(id.replace('articles/',''))) { continue; } // skip top-level index pages
  if (slug === 'index') continue; // skip pillar sub-index pages from cards
  const html = fs.readFileSync(abs,'utf8');
  const lang = (attr(html, /<html[^>]*\blang="([a-z-]+)"/i) || 'en').toLowerCase();
  let title = attr(html, /<title>([^<]*)<\/title>/i).replace(/\s*[|·—-]\s*Floor\.?DSGN.*$/i,'').trim()
           || attr(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g,'').trim();
  let gist = attr(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  if (!gist){ const firstP = html.match(/<main\b[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i) || html.match(/<p[^>]*>([\s\S]*?)<\/p>/i); gist = firstP ? stripTags(firstP[1]) : ''; }
  gist = gist.replace(/\s+/g,' ').trim(); if (gist.length>160) gist = gist.slice(0,157).replace(/\s\S*$/,'')+'…';
  const words = stripTags(html.replace(/<head[\s\S]*?<\/head>/i,'')).split(/\s+/).length;
  const readMin = Math.max(1, Math.round(words/200));
  let photo = attr(html, /<meta\s+property="og:image"\s+content="([^"]*)"/i)
           || attr(html, /<main\b[\s\S]*?<img[^>]+src="([^"]+)"/i)
           || attr(html, /<img[^>]+src="([^"]+\.(?:jpg|jpeg|webp|png))"/i);
  photo = (photo||'').replace(/^https?:\/\/[^/]+\//,'').replace(/^\.?\//,'').replace(/^\.\.\//,'');
  const pillar = pillarOf(rel);
  const personas = personasOf(id, slug, pillar);
  if (!photo) photo = PILLARS[pillar] ? PILLARS[pillar].cover : 'images/terrazzo/interrior-222943.jpg';
  if (!pillar) flags.push(`UNMAPPED-PILLAR  ${rel}`);
  if (!personas.length) flags.push(`NO-PERSONA  ${rel}`);
  if (!title) flags.push(`NO-TITLE  ${rel}`);
  manifest.push({ id, slug, url: '/'+rel, lang, title, gist, readMin, photo, pillar, personas, blogDup: blogDup.has(id)||blogDup.has(slug) });
}

// recency: blog-dup'd articles surface in "Свежее"; mark order by file mtime
manifest.sort((a,b)=> a.pillar - b.pillar || a.title.localeCompare(b.title));

const out = { generated: 'build-library-manifest', count: manifest.length, pillars: PILLARS, readingPaths: READING_PATHS, articles: manifest };
fs.writeFileSync(path.join(ROOT,'library-manifest.json'), JSON.stringify(out,null,1));

// ── coverage report ─────────────────────────────────────────────────────────
const byPillar = {}; manifest.forEach(a=>{byPillar[a.pillar]=(byPillar[a.pillar]||0)+1;});
console.log(`[lib-manifest] ${manifest.length} articles → library-manifest.json`);
console.log('per pillar:', Object.entries(byPillar).map(([p,n])=>`${p}:${n}`).join('  '));
const byPersona={}; manifest.forEach(a=>a.personas.forEach(p=>byPersona[p]=(byPersona[p]||0)+1));
console.log('per persona:', Object.entries(byPersona).map(([p,n])=>`${p}:${n}`).join('  '));
console.log('blog-dups:', manifest.filter(a=>a.blogDup).length, '| no-photo fallbacks:', manifest.filter(a=>!a.photo).length);
if (flags.length){ console.log(`\nFLAGS (${flags.length}) — review:`); console.log(flags.join('\n')); }
else console.log('no flags — all mapped.');
