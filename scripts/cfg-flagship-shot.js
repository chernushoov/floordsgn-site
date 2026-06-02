#!/usr/bin/env node
/* Flagship-material QA shooter for configurator-v3.
 * Captures the required overnight views for one material across desktop + mobile:
 *   closeup · normal · edge · surface · system · sample  (+ mobile-surface, mobile-sample)
 * Usage: node scripts/cfg-flagship-shot.js [slug=terrazzo-epoxy] [outdir=baseline-no-seam]
 * Writes PNGs to _screens/cfgqa/<outdir>/ and prints any page/console errors as JSON.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { chromiumLaunchOptions } = require('./browser-launch-options');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const slug = args[0] || 'terrazzo-epoxy';
const outdir = args[1] || 'baseline-no-seam';
const page_ = (process.argv.slice(2).find(a => a.startsWith('--page=')) || '').split('=')[1] || 'configurator-v3.html';
const port = 5191;
const OUT = path.join(ROOT, '_screens', 'cfgqa', outdir);
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

// Re-zero plate spin + reset idle so framing is deterministic between runs.
async function steady(pg, ms = 850) {
  await pg.evaluate(() => {
    if (window.__cfg && window.__cfg.scene) window.__cfg.scene.traverse(o => { if (o.name === 'plateRoot') o.rotation.y = 0; });
    window.dispatchEvent(new Event('pointerdown'));
  });
  await pg.waitForTimeout(ms);
}

(async () => {
  const srv = await serve();
  const browser = await chromium.launch(chromiumLaunchOptions(chromium, { headless: true }));
  const errs = [];

  // ---------- desktop ----------
  // Tall viewport so the whole 720px stage fits above the fold (plate was clipping off-frame).
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1040 }, deviceScaleFactor: 2 });
  const pg = await ctx.newPage();
  pg.on('pageerror', e => errs.push('pageerror: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') errs.push('console.error: ' + m.text()); });
  await pg.goto(`http://127.0.0.1:${port}/${page_}`, { waitUntil: 'networkidle', timeout: 30000 });
  await pg.waitForFunction(() => window.__cfg && window.__cfg.manifest && window.__cfg.bodyMesh, { timeout: 20000 });
  await pg.evaluate((s) => window.__cfg.selectMaterial(s), slug);
  await pg.waitForTimeout(1100); // composite map build

  // Optional control overrides: --apply=color:ral7035,aggregates:marble-white,gloss:mid
  const applyArg = (process.argv.slice(2).find(a => a.startsWith('--apply=')) || '').split('=')[1];
  if (applyArg) {
    const pairs = applyArg.split(',').map(p => p.split(':'));
    await pg.evaluate(({ s, pairs }) => { pairs.forEach(([cid, optId]) => window.__cfg.applyControl(s, cid, optId)); }, { s: slug, pairs });
    await pg.waitForTimeout(1300); // recolor + Voronoi composite rebuild
  }

  const shotCanvas = async (name) => {
    const box = await pg.evaluate(() => {
      const c = document.querySelector('canvas');
      c.scrollIntoView({ block: 'center' });
      const r = c.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    });
    await pg.waitForTimeout(120);
    await pg.screenshot({ path: path.join(OUT, name), clip: { x: box.x, y: box.y, width: box.w, height: box.h } });
  };

  // normal (default 3/4 view) — target slab mid-height so the whole plate centers
  await pg.evaluate(() => { window.__cfg.setView('reset'); window.__cfg.setCam(0.50, 0.40, 0.50, 0, -0.013, 0); });
  await steady(pg);
  await shotCanvas(`${slug}-normal.png`);

  // close-up / macro (camera pulled in tight on the surface)
  await pg.evaluate(() => window.__cfg.setCam(0.27, 0.205, 0.27, 0, -0.006, 0));
  await steady(pg);
  await shotCanvas(`${slug}-closeup.png`);

  // edge / fascia (low grazing angle to read the cut edge + bevel)
  await pg.evaluate(() => window.__cfg.setCam(0.40, 0.072, 0.345, 0, -0.014, 0));
  await steady(pg);
  await shotCanvas(`${slug}-edge.png`);

  // surface view (full HUD, default framing)
  await pg.evaluate(() => { window.__cfg.setView('reset'); });
  await steady(pg);
  await pg.evaluate(() => document.querySelector('canvas').scrollIntoView({ block: 'center' }));
  await pg.waitForTimeout(150);
  await pg.screenshot({ path: path.join(OUT, `${slug}-surface-full.png`) });

  // system / explode view
  await pg.evaluate(() => window.__cfg.setView('layers'));
  await steady(pg, 1200);
  await pg.evaluate(() => document.querySelector('canvas').scrollIntoView({ block: 'center' }));
  await pg.waitForTimeout(150);
  await shotCanvas(`${slug}-system.png`);
  await pg.screenshot({ path: path.join(OUT, `${slug}-system-full.png`) });

  // sample / top view
  await pg.evaluate(() => window.__cfg.setView('top'));
  await steady(pg, 1100);
  await pg.evaluate(() => document.querySelector('canvas').scrollIntoView({ block: 'center' }));
  await pg.waitForTimeout(150);
  await shotCanvas(`${slug}-sample.png`);
  await pg.screenshot({ path: path.join(OUT, `${slug}-sample-full.png`) });

  // material/topcoat state dump
  const state = await pg.evaluate(() => {
    const d = (m) => m && m.material ? { type: m.material.type, hasMap: !!m.material.map, hasNormal: !!m.material.normalMap, hasRough: !!m.material.roughnessMap, hasAO: !!m.material.aoMap, roughness: m.material.roughness, metalness: m.material.metalness, transparent: !!m.material.transparent, opacity: m.material.opacity, clearcoat: m.material.clearcoat, clearcoatRoughness: m.material.clearcoatRoughness } : null;
    return { slug: window.__cfg.activeSlug, body: d(window.__cfg.bodyMesh), topcoat: d(window.__cfg.topcoatMesh),
             renderer: { toneMapping: window.__cfg.renderer.toneMapping, exposure: window.__cfg.renderer.toneMappingExposure, pixelRatio: window.__cfg.renderer.getPixelRatio() } };
  });
  await ctx.close();

  // ---------- mobile (iPhone 14 Pro logical) ----------
  const mctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const mpg = await mctx.newPage();
  mpg.on('pageerror', e => errs.push('mobile pageerror: ' + e.message));
  mpg.on('console', m => { if (m.type() === 'error') errs.push('mobile console.error: ' + m.text()); });
  await mpg.goto(`http://127.0.0.1:${port}/${page_}`, { waitUntil: 'networkidle', timeout: 30000 });
  await mpg.waitForFunction(() => window.__cfg && window.__cfg.manifest && window.__cfg.bodyMesh, { timeout: 20000 });
  await mpg.evaluate((s) => window.__cfg.selectMaterial(s), slug);
  await mpg.waitForTimeout(1100);
  await mpg.evaluate(() => { const c = document.querySelector('canvas'); if (c) c.scrollIntoView({ block: 'center' }); window.dispatchEvent(new Event('pointerdown')); });
  await mpg.waitForTimeout(700);
  await mpg.screenshot({ path: path.join(OUT, `${slug}-mobile.png`) });          // viewport
  await mpg.screenshot({ path: path.join(OUT, `${slug}-mobile-full.png`), fullPage: true });
  await mctx.close();

  await browser.close();
  srv.close();
  console.log(JSON.stringify({ slug, outdir: OUT, state, errors: errs }, null, 2));
})().catch(e => { console.error('SHOOTER FAILED:', e); process.exit(1); });
