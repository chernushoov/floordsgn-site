#!/usr/bin/env node
/* QA driver for configurator-v3: drives the __cfg debug hook to capture key states.
 * Usage: node scripts/cfg-qa-shot.js [slug=microtopping] [--page=configurator-v3.html]
 * Writes PNGs to _screens/cfgqa/ and prints any page/console errors.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { chromiumLaunchOptions } = require('./browser-launch-options');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const slug = (args.find(a => !a.startsWith('--')) || 'microtopping');
const page_ = (args.find(a => a.startsWith('--page=')) || '').split('=')[1] || 'configurator-v3.html';
const port = 5188;
const OUT = path.join(ROOT, '_screens', 'cfgqa');
fs.mkdirSync(OUT, { recursive: true });

const MIME = { '.html':'text/html;charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon','.hdr':'application/octet-stream','.glb':'model/gltf-binary','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf' };

function serve() {
  return new Promise(resolve => {
    const srv = http.createServer((req, res) => {
      try {
        let url = decodeURIComponent(req.url.split('?')[0]);
        if (url === '/') url = '/index.html';
        const full = path.join(ROOT, url);
        if (!full.startsWith(ROOT) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) { res.writeHead(404); return res.end('404 ' + url); }
        const ext = path.extname(full).toLowerCase();
        res.writeHead(200, { 'content-type': MIME[ext] || 'application/octet-stream', 'cache-control':'no-store' });
        fs.createReadStream(full).pipe(res);
      } catch (e) { res.writeHead(500); res.end(String(e)); }
    });
    srv.listen(port, '127.0.0.1', () => resolve(srv));
  });
}

(async () => {
  const srv = await serve();
  const browser = await chromium.launch(chromiumLaunchOptions(chromium, { headless: true }));
  const ctx = await browser.newContext({ viewport: { width: 1500, height: 845 }, deviceScaleFactor: 2 });
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push('pageerror: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') errs.push('console.error: ' + m.text()); });

  const url = `http://127.0.0.1:${port}/${page_}`;
  await pg.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await pg.waitForFunction(() => window.__cfg && window.__cfg.manifest, { timeout: 20000 });

  const shot = async (name) => {
    await pg.evaluate(() => {
      const c = document.querySelector('canvas');
      if (c) c.scrollIntoView({ block: 'center' });
    });
    await pg.waitForTimeout(900);
    await pg.screenshot({ path: path.join(OUT, name) });
  };

  // Select material, system (exploded) view
  await pg.evaluate((s) => { window.__cfg.selectMaterial(s); }, slug);
  await pg.waitForTimeout(700);
  await pg.evaluate(() => window.__cfg.setView('layers'));
  await shot(`${slug}-1-system.png`);

  // Click first design swatch (if any) — should retexture the BODY, leave topcoat clear
  const hasDesign = await pg.evaluate(() => {
    const b = document.querySelector('#designs .ds'); if (!b) return false; b.click(); return true;
  });
  await shot(`${slug}-2-system-design.png`);

  // Surface (solid) view
  await pg.evaluate(() => window.__cfg.setView('solid'));
  await shot(`${slug}-3-surface.png`);

  // Report material state
  const state = await pg.evaluate(() => {
    const tc = window.__cfg.topcoatMesh, bd = window.__cfg.bodyMesh;
    const desc = (m) => m && m.material ? ({ type: m.material.type, hasMap: !!m.material.map, transparent: !!m.material.transparent, opacity: m.material.opacity, clearcoat: m.material.clearcoat, clearcoatRoughness: m.material.clearcoatRoughness, roughness: m.material.roughness }) : null;
    return { active: window.__cfg.activeSlug, topcoat: desc(tc), body: desc(bd) };
  });

  console.log('hasDesign:', hasDesign);
  console.log('STATE:', JSON.stringify(state, null, 1));
  console.log('ERRORS:', errs.length ? errs.join('\n') : '(none)');
  console.log('OUT:', OUT);

  await browser.close();
  srv.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
