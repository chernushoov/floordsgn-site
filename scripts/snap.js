#!/usr/bin/env node
/* Snap a page from the repo and save screenshots to _screens/.
 * Usage:  node scripts/snap.js configurator.html
 *         node scripts/snap.js configurator.html --only=desktop
 *         node scripts/snap.js index.html --port=5180
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const CHROMIUM_BIN = '/Applications/Chromium.app/Contents/MacOS/Chromium';

const args = process.argv.slice(2);
if (!args.length) {
  console.error('usage: node scripts/snap.js <path-relative-to-repo> [--only=desktop|mobile] [--port=N]');
  process.exit(2);
}
const target = args[0].replace(/^\/+/, '');
const only = (args.find(a => a.startsWith('--only=')) || '').split('=')[1] || 'all';
const port = parseInt((args.find(a => a.startsWith('--port=')) || '').split('=')[1] || '5179', 10);

const MIME = {
  '.html':'text/html;charset=utf-8', '.css':'text/css', '.js':'application/javascript',
  '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
  '.webp':'image/webp', '.svg':'image/svg+xml', '.ico':'image/x-icon',
  '.woff':'font/woff', '.woff2':'font/woff2', '.ttf':'font/ttf',
  '.mp4':'video/mp4', '.webm':'video/webm', '.mov':'video/quicktime',
};

function serve() {
  return new Promise(resolve => {
    const srv = http.createServer((req, res) => {
      try {
        let url = decodeURIComponent(req.url.split('?')[0]);
        if (url === '/') url = '/index.html';
        const full = path.join(ROOT, url);
        if (!full.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
        if (!fs.existsSync(full) || fs.statSync(full).isDirectory()) { res.writeHead(404); return res.end('not found: ' + url); }
        const ext = path.extname(full).toLowerCase();
        res.writeHead(200, { 'content-type': MIME[ext] || 'application/octet-stream', 'cache-control': 'no-store' });
        fs.createReadStream(full).pipe(res);
      } catch (e) {
        res.writeHead(500); res.end(String(e));
      }
    });
    srv.listen(port, '127.0.0.1', () => resolve(srv));
  });
}

async function snap(viewport, label) {
  const browser = await chromium.launch({ executablePath: CHROMIUM_BIN, headless: true });
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const url = `http://127.0.0.1:${port}/${target}`;
  const errs = [];
  page.on('pageerror', e => errs.push(`pageerror: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errs.push(`console.error: ${m.text()}`); });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(800);
  const base = path.basename(target).replace(/\.[^.]+$/, '');
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const out = path.join(ROOT, '_screens', `${base}-${label}-${ts}.png`);
  await page.screenshot({ path: out, fullPage: true });
  await browser.close();
  return { out, errs };
}

(async () => {
  const srv = await serve();
  console.log(`serving ${ROOT} on http://127.0.0.1:${port}`);
  try {
    const jobs = [];
    if (only === 'all' || only === 'desktop') jobs.push(snap({ width: 1440, height: 900 }, 'desktop'));
    if (only === 'all' || only === 'mobile')  jobs.push(snap({ width: 390,  height: 844 }, 'mobile'));
    const results = await Promise.all(jobs);
    for (const r of results) {
      console.log('✓', path.relative(ROOT, r.out));
      r.errs.forEach(e => console.log('  !', e));
    }
  } catch (e) {
    console.error('snap failed:', e.message);
    process.exitCode = 1;
  } finally {
    srv.close();
  }
})();
