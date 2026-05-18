#!/usr/bin/env node
/* Comprehensive audit of configurator controls.
 * For each material × each control × each option:
 *   - click the option
 *   - capture a pixel-hash of the stage canvas
 *   - flag dead clicks (no pixel change vs previous option)
 *
 * Output:
 *   _screens/audit-<slug>-<cid>-<oid>.png  (per option, when changed)
 *   _audit/controls-report.md              (markdown summary)
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PORT = parseInt(process.env.PORT || '5184', 10);
const CHROMIUM_BIN = '/Applications/Chromium.app/Contents/MacOS/Chromium';
const MIME = { '.html':'text/html;charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.hdr':'application/octet-stream','.glb':'model/gltf-binary','.gltf':'model/gltf+json' };

function serve() {
  return new Promise(r => {
    const s = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split('?')[0]) || '/index.html';
      const full = path.join(ROOT, url === '/' ? '/index.html' : url);
      if (!full.startsWith(ROOT) || !fs.existsSync(full)) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'content-type': MIME[path.extname(full).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
      fs.createReadStream(full).pipe(res);
    });
    s.listen(PORT, '127.0.0.1', () => r(s));
  });
}

function hash(buf) { return crypto.createHash('md5').update(buf).digest('hex').slice(0, 12); }

(async () => {
  const srv = await serve();
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, '3d-assets/manifest.json'), 'utf8'));
  const co = manifest.control_options;

  const outDir = path.join(ROOT, '_audit');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const findings = [];
  const browser = await chromium.launch({ executablePath: CHROMIUM_BIN, headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1024, height: 700 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', e => findings.push({ kind: 'pageerror', msg: e.message }));
  await page.goto(`http://127.0.0.1:${PORT}/configurator.html?textures=v2`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  for (const mat of manifest.materials) {
    const slug = mat.slug;
    // select material
    const sel = await page.evaluate((s) => {
      const li = document.querySelector(`li[data-slug="${s}"]`);
      if (!li) return false;
      li.click();
      return true;
    }, slug);
    if (!sel) { findings.push({ kind: 'no-li', slug }); continue; }
    await page.waitForTimeout(1500);

    const controls = mat.controls || [];
    for (const cid of controls) {
      const spec = co[cid];
      if (!spec) { findings.push({ kind: 'unknown-control', slug, cid }); continue; }
      const hashes = [];
      for (const opt of spec.options) {
        const oid = opt.id;
        // click the option button for THIS control
        const ok = await page.evaluate(({ cid, oid }) => {
          const ctrls = Array.from(document.querySelectorAll('#controls .ctrl'));
          for (const w of ctrls) {
            const head = w.querySelector('.ctrl-k')?.textContent || '';
            // match by exact label is fragile, so just iterate all buttons looking for the option name
            const btns = Array.from(w.querySelectorAll('button'));
            for (const b of btns) {
              const span = b.querySelector('span:last-child');
              if (!span) continue;
              if (span.textContent.trim() === window.__CFG_OPT_NAME) { b.click(); return true; }
            }
          }
          return false;
        }, { cid, oid });
        // Workaround: set the option name via window var first
        await page.evaluate((name) => { window.__CFG_OPT_NAME = name; }, opt.name);
        await page.evaluate(({ cid, oid }) => {
          const ctrls = Array.from(document.querySelectorAll('#controls .ctrl'));
          for (const w of ctrls) {
            const btns = Array.from(w.querySelectorAll('button'));
            for (const b of btns) {
              const span = b.querySelector('span:last-child');
              if (span && span.textContent.trim() === window.__CFG_OPT_NAME) { b.click(); return; }
            }
          }
        }, { cid, oid });
        await page.waitForTimeout(900);
        const stage = await page.$('#stage');
        const buf = stage ? await stage.screenshot() : await page.screenshot();
        hashes.push({ oid, name: opt.name, hash: hash(buf), size: buf.length });
      }
      // Dead-click detection: all hashes identical → control has no visible effect
      const distinct = new Set(hashes.map(h => h.hash));
      if (distinct.size === 1) {
        findings.push({ kind: 'dead-control', slug, cid, options: hashes.map(h => h.oid).join(',') });
      } else if (distinct.size < hashes.length) {
        // Some options identical to others — partial dead
        const grouped = {};
        for (const h of hashes) (grouped[h.hash] ||= []).push(h.oid);
        const dupes = Object.values(grouped).filter(g => g.length > 1);
        findings.push({ kind: 'dupe-options', slug, cid, dupes: dupes.map(g => g.join('=')).join(' / ') });
      }
    }
  }
  await browser.close();
  srv.close();

  // Write report
  const md = ['# Configurator control audit', '', `Run: ${new Date().toISOString()}`, '', '## Findings', ''];
  if (!findings.length) md.push('No issues found.');
  else for (const f of findings) md.push(`- **${f.kind}** ${JSON.stringify(f)}`);
  fs.writeFileSync(path.join(outDir, 'controls-report.md'), md.join('\n'));
  console.log(`✓ ${findings.length} findings → _audit/controls-report.md`);
  for (const f of findings) console.log(`  ${f.kind}: ${f.slug || ''} ${f.cid || ''} ${f.options || f.dupes || f.msg || ''}`.trim());
})();
