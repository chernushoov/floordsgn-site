#!/usr/bin/env node
// v18 — one-shot: replace old "Floor Systems / Company / Contact + badges"
// footer with the new "Системы / Инструменты / Связь" footer used by
// decision-tool.html. For files under materials/, paths are rewritten with
// a "../" prefix.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function footer(prefix) {
  return `<footer class="footer"><div class="container"><div class="footer-grid"><div class="footer-brand"><img src="${prefix}images/logo/White1_tr.png" alt="Floor.DSGN" class="footer-logo"><p>Engineering-grade напольные системы по Израилю. Сертифицированный installer Sika.</p></div><div class="footer-column"><h4>Системы</h4><ul><li><a href="${prefix}floors/epoxy.html">Эпокси</a></li><li><a href="${prefix}floors/terrazzo.html">Терраццо</a></li><li><a href="${prefix}floors/microtopping.html">Микротопинг</a></li><li><a href="${prefix}floors/concrete.html">Бетон</a></li></ul></div><div class="footer-column"><h4>Инструменты</h4><ul><li><a href="${prefix}quote.html">Калькулятор</a></li><li><a href="${prefix}decision-tool.html">Подбор системы</a></li></ul></div><div class="footer-column"><h4>Связь</h4><ul><li>floors.dsgn@gmail.com</li><li>+972 55 966 1459</li><li>Tel Aviv</li></ul></div></div><div class="footer-bottom"><p>&copy; 2026 Floor.DSGN</p></div></div></footer>`;
}

const TARGETS = [
  // root pages
  'index.html', 'floors.html', 'quote.html', 'about.html', 'contact.html',
  'designers.html', 'industrial.html', 'projects.html',
  // material pages (prefix = ../)
  'materials/concrete.html', 'materials/epoxy.html', 'materials/microtopping.html',
  'materials/mma.html', 'materials/pu-cement.html', 'materials/restoration.html',
  'materials/rubber.html', 'materials/terrazzo.html'
];

const RE = /<footer class="footer">[\s\S]*?<\/footer>/;
let changed = 0;
for (const rel of TARGETS) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) { console.log('skip (missing):', rel); continue; }
  const src = fs.readFileSync(abs, 'utf8');
  if (!RE.test(src)) { console.log('skip (no footer):', rel); continue; }
  const prefix = rel.startsWith('materials/') ? '../' : '';
  const out = src.replace(RE, footer(prefix));
  if (out === src) { console.log('skip (already new):', rel); continue; }
  fs.writeFileSync(abs, out);
  changed++;
  console.log('rewrote:', rel);
}
console.log(`\nDone. ${changed} file(s) updated.`);
