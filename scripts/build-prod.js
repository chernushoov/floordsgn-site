#!/usr/bin/env node
/* Production build for floordsgn-site-new.
 * Reads HTML/CSS/JS/assets from repo root, emits minified copies to ./dist.
 * Leaves source files untouched (Netlify build-time transformation only). */
'use strict';

const fs = require('fs');
const path = require('path');
const { minify: minifyHtml } = require('html-minifier-terser');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const ASSET_DIRS = [
  'images', 'fonts', 'css', 'js', '3d-assets', 'articles',
  'encyclopedia', 'en', 'floors', 'verticals', 'content',
  'materials', 'public', 'assets'
];

const ASSET_EXT_PASSTHROUGH = new Set([
  '.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg', '.ico',
  '.woff', '.woff2', '.ttf', '.otf', '.eot',
  '.mp4', '.webm', '.glb', '.gltf', '.bin', '.hdr',
  '.json', '.xml', '.txt', '.pdf', '.csv'
]);

// Files at root that we always SKIP from copying to dist (build outputs,
// internal docs, configs that are not part of the served site).
const SKIP_ROOT = new Set([
  'node_modules', '.git', '.parcel-cache', 'dist', 'dist-parcel',
  '_backups', '_screens', 'research', 'competitor-monitor', 'astro',
  'docs', 'SYSTEM', 'portfolio-research', 'specs', 'plate3d',
  '.openclaw', 'admin', 'scripts', 'api',
  'AGENTS.md', 'BOOTSTRAP.md', 'HEARTBEAT.md', 'IDENTITY.md',
  'SOUL.md', 'TOOLS.md', 'USER.md',
  'PROJECT_PLAN.md', 'SITE_BLUEPRINT.md', 'SITE_TREE.md',
  'RESEARCH.md', 'SIKA_CATALOG.md', 'README.md',
  'I18N_IMPLEMENTATION.md', 'I18N_SETUP.md', 'CLEANUP_PLAN.md',
  'vercel.json', '.env', '.env.local', 'package.json', 'package-lock.json',
  '.gitignore', '.gitattributes', '.netlifyignore', 'netlify.toml',
  '_headers', '_redirects',
]);

const HTML_MIN_OPTS = {
  collapseWhitespace: true,
  conservativeCollapse: false,
  removeComments: true,
  ignoreCustomComments: [/^!/, /^\s*\[if\s/, /\[endif\]/],
  removeRedundantAttributes: false,
  collapseBooleanAttributes: true,
  minifyCSS: true,
  // CRITICAL: do NOT minify inline JS. terser can mangle `<script type="module">`
  // and importmap usage in configurator.html. Inline JS stays as-is; we strip
  // comments via a regex pass before passing HTML to minifyHtml.
  minifyJS: false,
  processScripts: [],
  caseSensitive: true,
  keepClosingSlash: true,
  removeEmptyAttributes: false
};

function rimraf(p) {
  if (!fs.existsSync(p)) return;
  for (const entry of fs.readdirSync(p)) {
    const full = path.join(p, entry);
    if (fs.lstatSync(full).isDirectory()) rimraf(full);
    else fs.unlinkSync(full);
  }
  fs.rmdirSync(p);
}
function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

function stripJsComments(src) {
  let s = src;
  // Conservative line-comment strip: only when preceded by start-of-line, whitespace,
  // semicolon, or closing brace — prevents eating URLs like "https://" or "data://".
  s = s.replace(/(^|[\s;{}\(\),])\/\/[^\n\r]*/g, (m, pre) => pre);
  // Block comments, preserve /*! license */ and /*@ ... @*/ JSDoc-style preservers.
  s = s.replace(/\/\*(?![!@])[\s\S]*?\*\//g, '');
  // Collapse runs of blank lines but keep newlines (avoid breaking ASI).
  s = s.replace(/\n{2,}/g, '\n');
  s = s.replace(/[ \t]+\n/g, '\n');
  return s;
}

function stripCssComments(src) {
  return src
    .replace(/\/\*(?![!@])[\s\S]*?\*\//g, '')
    .replace(/\n{2,}/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/ ?([{}:;,>+~]) ?/g, '$1');
}

// Strip our internal HTML comments (Russian intent notes, version markers)
// BEFORE minifyHtml — minifyHtml drops all comments anyway, but doing this here
// also strips any developer breadcrumbs from inline scripts/styles that
// minifyHtml leaves alone (because we set minifyJS:false).
function preStripHtml(src) {
  return src
    // Strip /* ... */ inside inline <script> blocks (where minifyJS:false leaves them)
    .replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (m, attrs, body) => {
      // Don't touch json-ld or importmap
      if (/type=["'](application\/ld\+json|importmap)["']/.test(attrs)) return m;
      const cleaned = stripJsComments(body);
      return `<script${attrs}>${cleaned}</script>`;
    })
    // Strip /* ... */ inside inline <style> blocks
    .replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi, (m, attrs, body) => {
      const cleaned = stripCssComments(body);
      return `<style${attrs}>${cleaned}</style>`;
    });
}

function fallbackHtmlMinify(html) {
  // Regex-only path: strip HTML comments (preserving conditional/IE),
  // collapse whitespace between tags, leave inline JS/CSS bodies intact.
  return html
    .replace(/<!--(?!\[if|!)[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

async function buildHtml(absSrc, absDst) {
  const raw = fs.readFileSync(absSrc, 'utf8');
  const stripped = preStripHtml(raw);
  let out;
  try {
    out = await minifyHtml(stripped, HTML_MIN_OPTS);
  } catch (err) {
    console.warn(`[html] ${path.relative(ROOT, absSrc)} — minifyHtml failed (${err.message.split('\n')[0]}), using regex fallback`);
    out = fallbackHtmlMinify(stripped);
  }
  ensureDir(path.dirname(absDst));
  fs.writeFileSync(absDst, out);
  return { before: raw.length, after: out.length };
}

function processNonHtmlFile(src, dst) {
  const ext = path.extname(src).toLowerCase();
  ensureDir(path.dirname(dst));
  if (ext === '.css') {
    fs.writeFileSync(dst, stripCssComments(fs.readFileSync(src, 'utf8')));
  } else if (ext === '.js' || ext === '.mjs') {
    fs.writeFileSync(dst, stripJsComments(fs.readFileSync(src, 'utf8')));
  } else if (ASSET_EXT_PASSTHROUGH.has(ext)) {
    fs.copyFileSync(src, dst);
  } else {
    // Unknown extension — pass through verbatim
    fs.copyFileSync(src, dst);
  }
}

async function walkDir(srcDir, dstDir) {
  if (!fs.existsSync(srcDir)) return;
  ensureDir(dstDir);
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (entry.name === '.DS_Store') continue;
    const s = path.join(srcDir, entry.name);
    const d = path.join(dstDir, entry.name);
    if (entry.isDirectory()) {
      await walkDir(s, d);
      continue;
    }
    if (entry.name.endsWith('.html')) {
      await buildHtml(s, d);
    } else {
      processNonHtmlFile(s, d);
    }
  }
}

(async () => {
  console.log('[build-prod] cleaning dist/');
  rimraf(DIST);
  ensureDir(DIST);

  // 1. Root-level files (HTML, CSS, JS, root assets) — skip internal/build dirs
  const rootEntries = fs.readdirSync(ROOT, { withFileTypes: true });
  let htmlCount = 0, assetCount = 0;
  for (const e of rootEntries) {
    if (SKIP_ROOT.has(e.name)) continue;
    if (e.name.startsWith('.')) continue;
    const src = path.join(ROOT, e.name);
    const dst = path.join(DIST, e.name);
    if (e.isFile() && e.name.endsWith('.html')) {
      const r = await buildHtml(src, dst);
      console.log(`[html] ${e.name}  ${r.before} -> ${r.after}`);
      htmlCount++;
    } else if (e.isFile()) {
      processNonHtmlFile(src, dst);
      assetCount++;
    }
  }

  // 2. Recurse into asset dirs we explicitly want shipped
  for (const d of ASSET_DIRS) {
    const src = path.join(ROOT, d);
    const dst = path.join(DIST, d);
    if (!fs.existsSync(src)) continue;
    await walkDir(src, dst);
    console.log(`[dir]  ${d}/`);
  }

  // 3. Copy a few specific top-level files that should NOT be minified
  for (const f of ['robots.txt', 'sitemap.xml', '_headers', '_redirects', 'favicon.ico']) {
    const src = path.join(ROOT, f);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(DIST, f));
    }
  }

  console.log(`[build-prod] done — ${htmlCount} html, ${assetCount} root assets → dist/`);
})().catch(err => { console.error(err); process.exit(1); });
