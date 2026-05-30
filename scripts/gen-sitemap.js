#!/usr/bin/env node
/* Regenerate sitemap.xml from actual *.html files in the repo.
 *
 * Why: hand-maintained sitemap.xml had 35 entries while the repo ships 92
 * crawlable HTML pages — half the site was invisible to search engines.
 *
 * Output: sitemap.xml at repo root with one <url> per public HTML page.
 *
 * Skips: dist/, node_modules/, .git/, _backups/, admin/, encyclopedia/docs/,
 *        thank-you.html (post-action page), 404.html, language-switcher.html.
 *
 * Priorities (by path/role):
 *   1.0  — index.html
 *   0.9  — top-level tools: configurator, decision-tool, studio, floors
 *   0.8  — material/system pages, designers, industrial, contact, quote
 *   0.7  — sub-system pages (floors/<sys>/<scenario>), articles, verticals
 *   0.6  — encyclopedia, specs
 *   0.5  — everything else
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HOST = 'https://floordsgn.com';

const SKIP_DIRS = new Set([
    'node_modules', '.git', 'dist', 'dist-parcel', 'dist-pwa',
    '_backups', '_screens', '_audit', '_external',
    'research', 'competitor-monitor', 'astro', 'docs',
    '.openclaw', '.parcel-cache', '.netlify',
    'admin', 'api', 'netlify', 'static', 'public'
]);

const SKIP_FILES = new Set([
    '404.html',
    'thank-you.html',
    'language-switcher.html'
]);

function walk(dir, rel = '', out = []) {
    for (const name of fs.readdirSync(dir)) {
        if (SKIP_DIRS.has(name)) continue;
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        const relPath = rel ? path.posix.join(rel, name) : name;
        if (stat.isDirectory()) walk(full, relPath, out);
        else if (name.endsWith('.html') && !SKIP_FILES.has(name)) out.push(relPath);
    }
    return out;
}

function priorityFor(p) {
    if (p === 'index.html') return '1.0';
    const topTools = new Set([
        'configurator.html', 'decision-tool.html', 'studio.html',
        'floors.html', 'compare.html', 'sample-kit.html',
        'visualizer.html', 'room-visualizer.html', 'substrate-check.html'
    ]);
    if (topTools.has(p)) return '0.9';
    const t1 = new Set([
        'designers.html', 'industrial.html', 'contact.html',
        'quote.html', 'projects.html', 'about.html', 'blog.html'
    ]);
    if (t1.has(p)) return '0.8';
    if (p.startsWith('materials/')) return '0.8';
    if (p.startsWith('floors/') && p.split('/').length === 2) return '0.8';   // floors/<sys>.html
    if (p.startsWith('floors/')) return '0.7';                                // floors/<sys>/<scenario>.html
    if (p.startsWith('articles/encyclopedia/')) return '0.6';
    if (p.startsWith('articles/')) return '0.7';
    if (p.startsWith('verticals/')) return '0.7';
    if (p.startsWith('specs/')) return '0.6';
    if (p.startsWith('en/')) return '0.5';
    return '0.5';
}

function urlFor(p) {
    // Root index.html → "/"; otherwise keep relative path with leading "/".
    if (p === 'index.html') return HOST + '/';
    if (p.endsWith('/index.html')) return HOST + '/' + p.replace(/index\.html$/, '');
    return HOST + '/' + p;
}

const files = walk(ROOT).sort();

const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
];

for (const f of files) {
    const url = urlFor(f);
    const prio = priorityFor(f);
    lines.push(`  <url><loc>${url}</loc><priority>${prio}</priority></url>`);
}

lines.push('</urlset>');
lines.push('');

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), lines.join('\n'));
console.log(`Wrote sitemap.xml with ${files.length} entries.`);
