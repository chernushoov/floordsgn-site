#!/usr/bin/env node
/**
 * gen-sitemap.js — regenerate sitemap.xml from the actual page tree.
 *
 * The old sitemap was hand-maintained and stale: 35 URLs, missing the entire
 * /floors/* catalog (40 spec/price pages), most /articles/* and /materials/*.
 * This scans every *.html, drops non-indexable pages, emits pretty URLs
 * (extensionless; index.html -> directory root) on the production host.
 *
 * Run: node scripts/gen-sitemap.js   (writes sitemap.xml in repo root)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HOST = 'https://floordsgn.com';

// dirs never scanned
const SKIP_DIRS = new Set(['node_modules', 'dist', '_backups', 'astro', '.git', '.netlify', 'admin']);
// exact files to exclude (noindex, redirect stubs, fragments, error pages, EN clone)
const EXCLUDE = new Set([
  '404.html', 'thank-you.html', 'room-visualizer.html', 'language-switcher.html',
  'contact_form.html', 'articles/index.html', 'en/index.html',
]);

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else if (name.endsWith('.html') && !name.startsWith('_')) acc.push(full);
  }
  return acc;
}

function relUrl(file) {
  let rel = path.relative(ROOT, file).split(path.sep).join('/');
  if (EXCLUDE.has(rel)) return null;
  // skip any page that declares noindex (defensive — covers future additions)
  const html = fs.readFileSync(file, 'utf8');
  if (/<meta[^>]+name=["']robots["'][^>]*noindex/i.test(html)) return null;
  if (/http-equiv=["']refresh["']/i.test(html)) return null;
  // pretty URL: index.html -> dir/, foo.html -> foo
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel.replace(/\.html$/, '');
}

function priority(url) {
  if (url === '/') return '1.0';
  const depth = (url.match(/\//g) || []).length; // trailing-slash dirs count higher
  if (['/floors', '/configurator', '/studio', '/sample-kit', '/visualizer', '/room-visualizer'].includes(url)) return '0.9';
  if (url.startsWith('/floors/') || url.startsWith('/materials/')) return '0.8';
  if (url.startsWith('/articles/')) return '0.6';
  if (url.startsWith('/verticals/') || url.startsWith('/specs/')) return '0.7';
  return depth <= 1 ? '0.7' : '0.6';
}

const urls = walk(ROOT)
  .map(relUrl)
  .filter(Boolean)
  .sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));

const today = new Date().toISOString().slice(0, 10);
const body = urls.map(u =>
  `  <url><loc>${HOST}${u}</loc><lastmod>${today}</lastmod><priority>${priority(u)}</priority></url>`
).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
console.log(`sitemap.xml written: ${urls.length} URLs (host ${HOST})`);
