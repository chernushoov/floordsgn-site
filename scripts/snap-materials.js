#!/usr/bin/env node
/* Per-material screenshot of configurator.html, for visual diff of textures-v2 fix.
 * Clicks each slug in V2_SLUGS, snaps stage canvas at both old and v2 modes.
 * Outputs: _screens/cfg-<slug>-<mode>-<ts>.png
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PORT = parseInt(process.env.PORT || '5183', 10);
const CHROMIUM_BIN = '/Applications/Chromium.app/Contents/MacOS/Chromium';
const V2_SLUGS = ['epoxy', 'microtopping', 'mma', 'pu-cement', 'comfortfloor'];
const MIME = { '.html':'text/html;charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon','.woff':'font/woff','.woff2':'font/woff2','.hdr':'application/octet-stream' };

function serve() {
  return new Promise(r => {
    const s = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split('?')[0]) || '/index.html';
      const full = path.join(ROOT, url === '/' ? '/index.html' : url);
      if (!full.startsWith(ROOT) || !fs.existsSync(full)) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'content-type': MIME[path.extname(full).toLowerCase()] || 'application/octet-stream', 'cache-control':'no-store' });
      fs.createReadStream(full).pipe(res);
    });
    s.listen(PORT, '127.0.0.1', () => r(s));
  });
}

async function snapMaterial(browser, mode, slug) {
  const ctx = await browser.newContext({ viewport: { width: 900, height: 760 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const qs = mode === 'v2' ? '?textures=v2' : '';
  await page.goto(`http://127.0.0.1:${PORT}/configurator.html${qs}`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1200);
  await page.evaluate((s) => {
    const li = document.querySelector(`li[data-slug="${s}"]`);
    if (li) li.click();
  }, slug);
  await page.waitForTimeout(1800);
  const stage = await page.$('#stage');
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const out = path.join(ROOT, '_screens', `cfg-${slug}-${mode}-${ts}.png`);
  if (stage) await stage.screenshot({ path: out });
  else await page.screenshot({ path: out, clip: { x: 250, y: 100, width: 700, height: 560 } });
  await ctx.close();
  return out;
}

(async () => {
  const srv = await serve();
  console.log(`server :${PORT}`);
  const browser = await chromium.launch({ executablePath: CHROMIUM_BIN, headless: true });
  try {
    for (const mode of ['old', 'v2']) {
      for (const slug of V2_SLUGS) {
        const out = await snapMaterial(browser, mode, slug);
        console.log(`✓ ${mode.padEnd(3)} ${slug.padEnd(15)} ${path.relative(ROOT, out)}`);
      }
    }
  } finally {
    await browser.close();
    srv.close();
  }
})();
