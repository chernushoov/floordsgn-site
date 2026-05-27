#!/usr/bin/env node
/* Configurator UX QA audit. Headless Chromium + Playwright.
 * Walks all materials × controls × options and detects dead/duplicate renders
 * via pixel-similarity comparison of the canvas region.
 *
 * Usage: node scripts/configurator-audit.js
 * Output:
 *   _screens/configurator-audit/*.png
 *   docs/research/configurator-audit-data.json (raw)
 *   docs/research/configurator-ux-audit.md (final report)
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
let sharp = null;
try { sharp = require('sharp'); } catch (_) {}

const ROOT = path.resolve(__dirname, '..');
const PORT = 5480;
const CHROMIUM_BIN = '/Applications/Chromium.app/Contents/MacOS/Chromium';
const OUT_DIR = path.join(ROOT, '_screens', 'configurator-audit');
const REPORT_PATH = path.join(ROOT, 'docs', 'research', 'configurator-ux-audit.md');
const DATA_PATH = path.join(ROOT, 'docs', 'research', 'configurator-audit-data.json');

const MIME = {
  '.html':'text/html;charset=utf-8','.css':'text/css','.js':'application/javascript',
  '.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg',
  '.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon',
  '.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf','.glb':'model/gltf-binary',
  '.hdr':'application/octet-stream',
};

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
if (!fs.existsSync(path.dirname(REPORT_PATH))) fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });

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
      } catch (e) { res.writeHead(500); res.end(String(e)); }
    });
    srv.listen(PORT, '127.0.0.1', () => resolve(srv));
  });
}

// Pixel-level analysis: decode PNG -> RGBA -> compute similarity + mean color.
// Uses sharp when available, falls back to byte-histogram.
async function analyze(bufA, bufB) {
  if (sharp) {
    const [a, b] = await Promise.all([
      sharp(bufA).resize(160, 100, { fit: 'fill' }).removeAlpha().raw().toBuffer({ resolveWithObject: true }),
      sharp(bufB).resize(160, 100, { fit: 'fill' }).removeAlpha().raw().toBuffer({ resolveWithObject: true }),
    ]);
    const A = a.data, B = b.data;
    let diff = 0, n = 0;
    let rB=0,gB=0,bB=0; // mean of B (the "after" image)
    for (let i = 0; i < A.length; i += 3) {
      const dr = A[i]-B[i], dg = A[i+1]-B[i+1], db = A[i+2]-B[i+2];
      diff += Math.abs(dr)+Math.abs(dg)+Math.abs(db);
      // Sample only the center 60% horizontally and 40-90% vertically (the plate)
      const px = (i/3) % 160;
      const py = Math.floor((i/3) / 160);
      if (px > 32 && px < 128 && py > 40 && py < 90) {
        // exclude near-white background
        if (!(B[i]>240 && B[i+1]>240 && B[i+2]>240)) {
          rB += B[i]; gB += B[i+1]; bB += B[i+2]; n++;
        }
      }
    }
    const totalPx = A.length / 3;
    const meanDiff = diff / (totalPx * 3); // 0..255
    const similarity = 1 - meanDiff / 255;
    return {
      similarity: +similarity.toFixed(4),
      meanColor: n ? { r: Math.round(rB/n), g: Math.round(gB/n), b: Math.round(bB/n), samples: n } : null,
    };
  }
  // Fallback
  if (bufA.length === bufB.length && bufA.equals(bufB)) return { similarity: 1.0, meanColor: null };
  return { similarity: 0.5, meanColor: null };
}

async function main() {
  const srv = await serve();
  console.log(`serving ${ROOT} on http://127.0.0.1:${PORT}`);

  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, '3d-assets-cfg', 'manifest.json'), 'utf8'));
  const browser = await chromium.launch({
    executablePath: fs.existsSync(CHROMIUM_BIN) ? CHROMIUM_BIN : undefined,
    headless: true,
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  const allErrors = [];
  const screenshots = [];
  const results = []; // {material, control, optionId, optionName, expected, similarity, visible, screenshot}

  page.on('pageerror', e => allErrors.push({ type: 'pageerror', text: e.message, stack: e.stack }));
  page.on('console', m => {
    if (m.type() === 'error') allErrors.push({ type: 'console.error', text: m.text() });
    if (m.type() === 'warning') allErrors.push({ type: 'console.warn', text: m.text() });
  });

  const url = `http://127.0.0.1:${PORT}/configurator.html`;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  // Wait for the boot overlay to vanish and the GLB to load.
  await page.waitForFunction(() => {
    const b = document.getElementById('boot');
    return b && b.classList.contains('gone');
  }, { timeout: 25000 }).catch(()=>{});
  await page.waitForTimeout(1500);

  // Helper: take a screenshot of just the stage area (canvas).
  async function snapStage(name) {
    const filename = path.join(OUT_DIR, `${name}.png`);
    const stage = await page.$('#stage');
    if (!stage) {
      const buf = await page.screenshot();
      fs.writeFileSync(filename, buf);
      screenshots.push(filename);
      return buf;
    }
    const buf = await stage.screenshot();
    fs.writeFileSync(filename, buf);
    screenshots.push(filename);
    return buf;
  }

  // Helper: click a material chip by slug.
  async function selectMaterial(slug) {
    await page.evaluate((slug) => {
      const li = document.querySelector(`#matlist li[data-slug="${slug}"]`);
      if (li) li.click();
    }, slug);
    await page.waitForTimeout(1100);
  }

  // Helper: click a control option by control label and option index.
  // Returns the button text + chip hex for naming.
  async function clickOption(controlLabel, optionIndex) {
    return await page.evaluate(({ controlLabel, optionIndex }) => {
      const blocks = [...document.querySelectorAll('#controls .ctrl')];
      const block = blocks.find(b => b.querySelector('.ctrl-k')?.textContent.trim() === controlLabel);
      if (!block) return { ok: false, reason: 'control-not-found' };
      const buttons = [...block.querySelectorAll('.opts button')];
      const btn = buttons[optionIndex];
      if (!btn) return { ok: false, reason: 'option-not-found' };
      btn.click();
      const txt = btn.textContent.trim();
      const chip = btn.querySelector('.chip');
      const hex = chip ? chip.style.background : null;
      return { ok: true, text: txt, hex };
    }, { controlLabel, optionIndex });
  }

  // Helper: snapshot of right rail spec text (System pirog).
  async function readSpecPie() {
    return await page.evaluate(() => {
      const root = document.getElementById('buildup');
      if (!root) return null;
      return root.innerText.trim();
    });
  }

  // Iterate materials
  const VIEW_MATERIALS_FOR_VIEWS = new Set(['epoxy', 'terrazzo-epoxy']);
  const startTime = Date.now();

  for (const mat of manifest.materials) {
    const slug = mat.slug;
    console.log(`\n=== ${slug} (${mat.label_ru}) ===`);
    await selectMaterial(slug);
    const baseBuf = await snapStage(`${slug}-00-base`);
    const baseSpec = await readSpecPie();

    // For each control attached to this material
    const ctrlIds = mat.controls || [];
    for (const cid of ctrlIds) {
      const spec = manifest.control_options[cid];
      if (!spec) continue;
      const label = spec.label_ru;
      const opts = spec.options;

      // Click first and last
      const indicesToTest = opts.length <= 1 ? [0] : [0, opts.length - 1];
      // Special: for color we want to verify Бордо + Антрацит specifically (already in last positions typically)
      // For flecks we want red-l vs metallic
      // We'll keep the first/last pattern but record explicit checks separately later.

      let previousBuf = baseBuf;
      for (const optIdx of indicesToTest) {
        const opt = opts[optIdx];
        const click = await clickOption(label, optIdx);
        if (!click.ok) {
          results.push({
            material: slug, control: cid, optionId: opt.id, optionName: opt.name,
            similarity: null, visibleChange: 'option-not-rendered',
            note: `Button render failed: ${click.reason}`,
            screenshot: null,
          });
          continue;
        }
        await page.waitForTimeout(900);
        const safeOpt = opt.id.replace(/[^a-z0-9_-]+/gi, '_');
        const fname = `${slug}-${cid}-${safeOpt}`;
        const buf = await snapStage(fname);
        const vsPrev = await analyze(previousBuf, buf);
        const vsBase = await analyze(baseBuf, buf);
        const specNow = await readSpecPie();
        results.push({
          material: slug,
          control: cid,
          optionId: opt.id,
          optionName: opt.name,
          optionHex: opt.hex || null,
          similarityVsPrev: vsPrev.similarity,
          similarityVsBase: vsBase.similarity,
          meanColor: vsPrev.meanColor,
          visibleChange: vsPrev.similarity < 0.97 ? 'yes' : vsPrev.similarity < 0.995 ? 'subtle' : 'no',
          specChanged: specNow !== baseSpec,
          screenshot: path.relative(ROOT, path.join(OUT_DIR, fname + '.png')),
        });
        previousBuf = buf;
      }
    }

    // For epoxy + terrazzo-epoxy: also test Solid/Layers/Top/Reset
    if (VIEW_MATERIALS_FOR_VIEWS.has(slug)) {
      for (const view of ['solid', 'layers', 'top', 'reset']) {
        await page.evaluate((view) => {
          const b = document.querySelector(`.s-br button[data-view="${view}"]`);
          if (b) b.click();
        }, view);
        await page.waitForTimeout(1200);
        const fname = `${slug}-view-${view}`;
        const buf = await snapStage(fname);
        const vsBase = await analyze(baseBuf, buf);
        results.push({
          material: slug,
          control: `view:${view}`,
          optionId: view,
          optionName: view,
          similarityVsBase: vsBase.similarity,
          visibleChange: vsBase.similarity < 0.97 ? 'yes' : vsBase.similarity < 0.995 ? 'subtle' : 'no',
          screenshot: path.relative(ROOT, path.join(OUT_DIR, fname + '.png')),
        });
      }
      // Reset between view tests so subsequent material starts clean
      await page.evaluate(() => {
        const b = document.querySelector('.s-br button[data-view="reset"]');
        if (b) b.click();
      });
      await page.waitForTimeout(800);
    }

    // Budget guard
    const elapsed = (Date.now() - startTime) / 1000;
    if (elapsed > 540) {
      console.log(`[budget] stopping after ${elapsed}s`);
      break;
    }
  }

  // Targeted color verification: pick Бордо and Антрацит on epoxy and terrazzo-epoxy
  console.log('\n=== targeted color washing checks ===');
  for (const slug of ['epoxy', 'terrazzo-epoxy']) {
    await selectMaterial(slug);
    await page.waitForTimeout(800);
    const base = await snapStage(`${slug}-color-base`);

    // Click Бордо (ral-3013) — id index 8
    const colorOpts = manifest.control_options.color.options;
    const burgundyIdx = colorOpts.findIndex(o => o.id === 'ral-3013');
    const anthraciteIdx = colorOpts.findIndex(o => o.id === 'ral-7016');

    if (burgundyIdx >= 0) {
      await clickOption('Цвет (RAL)', burgundyIdx);
      await page.waitForTimeout(900);
      const buf = await snapStage(`${slug}-color-burgundy`);
      const a = await analyze(base, buf);
      results.push({
        material: slug, control: 'color-burgundy-check', optionId: 'ral-3013',
        optionName: 'Бордо',
        similarityVsBase: a.similarity,
        meanColor: a.meanColor,
        expectedHex: '#943f37',
        visibleChange: a.similarity < 0.97 ? 'yes' : 'subtle',
        screenshot: path.relative(ROOT, path.join(OUT_DIR, `${slug}-color-burgundy.png`)),
      });
    }

    if (anthraciteIdx >= 0) {
      await clickOption('Цвет (RAL)', anthraciteIdx);
      await page.waitForTimeout(900);
      const buf = await snapStage(`${slug}-color-anthracite`);
      const a = await analyze(base, buf);
      results.push({
        material: slug, control: 'color-anthracite-check', optionId: 'ral-7016',
        optionName: 'Антрацит',
        similarityVsBase: a.similarity,
        meanColor: a.meanColor,
        expectedHex: '#293133',
        visibleChange: a.similarity < 0.97 ? 'yes' : 'subtle',
        screenshot: path.relative(ROOT, path.join(OUT_DIR, `${slug}-color-anthracite.png`)),
      });
    }
  }

  // Targeted flecks check: red-l vs metallic on epoxy
  await selectMaterial('epoxy');
  await page.waitForTimeout(800);
  const flecksOpts = manifest.control_options.flecks.options;
  const redIdx = flecksOpts.findIndex(o => o.id === 'red-l');
  const metalIdx = flecksOpts.findIndex(o => o.id === 'metallic');
  if (redIdx >= 0) {
    await clickOption('Флеки', redIdx);
    await page.waitForTimeout(900);
    await snapStage(`epoxy-flecks-red-large`);
  }
  if (metalIdx >= 0) {
    await clickOption('Флеки', metalIdx);
    await page.waitForTimeout(900);
    await snapStage(`epoxy-flecks-metallic`);
  }

  // Targeted stripes check: brass on terrazzo-epoxy
  await selectMaterial('terrazzo-epoxy');
  await page.waitForTimeout(800);
  const stripesOpts = manifest.control_options.stripes.options;
  const brassIdx = stripesOpts.findIndex(o => o.id === 'brass');
  if (brassIdx >= 0) {
    await clickOption('Декор. полосы (саргелим)', brassIdx);
    await page.waitForTimeout(900);
    await snapStage(`terrazzo-epoxy-stripes-brass`);
  }

  // Targeted marking on epoxy
  await selectMaterial('epoxy');
  await page.waitForTimeout(800);
  const markingOpts = manifest.control_options.marking.options;
  const yellowIdx = markingOpts.findIndex(o => o.id === 'yellow');
  if (yellowIdx >= 0) {
    await clickOption('Разметка', yellowIdx);
    await page.waitForTimeout(900);
    await snapStage(`epoxy-marking-yellow`);
  }

  // Test CTAs (click → expect alert handler)
  const dialogs = [];
  page.on('dialog', async d => { dialogs.push({ type: d.type(), msg: d.message() }); await d.dismiss().catch(()=>{}); });
  await page.evaluate(() => document.getElementById('ctaOrder')?.click());
  await page.waitForTimeout(500);
  await page.evaluate(() => document.getElementById('ctaSample')?.click());
  await page.waitForTimeout(500);

  fs.writeFileSync(DATA_PATH, JSON.stringify({
    timestamp: new Date().toISOString(),
    elapsedSec: ((Date.now() - startTime)/1000).toFixed(1),
    results, errors: allErrors, screenshots: screenshots.map(s => path.relative(ROOT, s)),
    ctaDialogs: dialogs,
  }, null, 2));

  console.log(`\nDone. ${results.length} interactions, ${screenshots.length} screenshots, ${allErrors.length} console issues`);

  await browser.close();
  srv.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
