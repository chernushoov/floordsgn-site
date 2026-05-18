#!/usr/bin/env node
/* Audit: every material × every control × every option.
 * For each option click, captures the Three.js material STATE (color hex,
 * roughness, opacity, map?, normalMap?, mapHash, textures.bodyMatColor) and
 * compares across options. Misses no real changes (unlike pixel-hash).
 *
 * Flags:
 *   dead-control    — all options yield identical material state for the control type
 *   dupe-options    — two+ options yield identical state
 *   error           — option threw on click or material wasn't ready
 *
 * Output: _audit/controls-report.md
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
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
  await page.goto(`http://127.0.0.1:${PORT}/configurator.html?textures=v2&debug=1`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  await page.evaluate(() => {
    window.__cfgState = () => {
      const c = window.__cfg;
      if (!c) return null;
      const dump = (m) => m && m.material ? ({
        color: m.material.color ? '#' + m.material.color.getHexString() : null,
        roughness: m.material.roughness != null ? +m.material.roughness.toFixed(3) : null,
        opacity: m.material.opacity != null ? +m.material.opacity.toFixed(3) : null,
        mapUUID: (m.material.map && m.material.map.uuid) || null,
        normalUUID: (m.material.normalMap && m.material.normalMap.uuid) || null,
        roughMapUUID: (m.material.roughnessMap && m.material.roughnessMap.uuid) || null,
      }) : null;
      return { slug: c.activeSlug, topcoat: dump(c.topcoatMesh), body: dump(c.bodyMesh), state: c.orderState[c.activeSlug] || {} };
    };
    window.__clickOpt = (name) => {
      const ctrls = Array.from(document.querySelectorAll('#controls .ctrl'));
      for (const w of ctrls) {
        const btns = Array.from(w.querySelectorAll('button'));
        for (const b of btns) {
          const sp = b.querySelector('span:last-child');
          if (sp && sp.textContent.trim() === name) { b.click(); return true; }
        }
      }
      return false;
    };
  });

  for (const mat of manifest.materials) {
    const slug = mat.slug;
    const sel = await page.evaluate((s) => {
      const li = document.querySelector(`li[data-slug="${s}"]`);
      if (!li) return false;
      li.click();
      return true;
    }, slug);
    if (!sel) { findings.push({ kind: 'no-li', slug }); continue; }
    await page.waitForTimeout(1800);

    const controls = mat.controls || [];
    for (const cid of controls) {
      const spec = co[cid];
      if (!spec) { findings.push({ kind: 'unknown-control', slug, cid }); continue; }
      const samples = [];
      for (const opt of spec.options) {
        const ok = await page.evaluate((name) => window.__clickOpt(name), opt.name);
        await page.waitForTimeout(700);
        const state = await page.evaluate(() => window.__cfgState && window.__cfgState());
        samples.push({ oid: opt.id, ok, state: JSON.stringify(state) });
      }
      const failed = samples.filter(s => !s.ok).map(s => s.oid);
      if (failed.length) findings.push({ kind: 'click-failed', slug, cid, opts: failed.join(',') });
      // For color-control: extract topcoat.color and compute pairwise RGB distance.
      // Visually-indistinct (< 8 euclidean) = effectively duplicate.
      const colors = samples.map(s => { try { return JSON.parse(s.state).topcoat?.color; } catch { return null; } });
      const hexToRgb = (h) => h ? [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)] : null;
      const rgbs = colors.map(hexToRgb);
      const visualGroups = [];
      for (let i = 0; i < rgbs.length; i++) {
        if (!rgbs[i]) continue;
        let placed = false;
        for (const g of visualGroups) {
          const a = rgbs[g[0]], b = rgbs[i];
          const d = Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2);
          if (d < 8) { g.push(i); placed = true; break; }
        }
        if (!placed) visualGroups.push([i]);
      }
      if (cid === 'color' && colors.every(c => !!c)) {
        if (visualGroups.length === 1) findings.push({ kind: 'visually-dead-color', slug, cid, n_opts: samples.length, colors: colors.join(',') });
        else if (visualGroups.length < samples.length) {
          const dupes = visualGroups.filter(g => g.length > 1).map(g => g.map(i => samples[i].oid).join('='));
          findings.push({ kind: 'visually-dupe-colors', slug, cid, dupes: dupes.join(' / '), colors: colors.join(',') });
        }
      }
      // Generic state-distinct check for non-color controls
      const distinct = new Set(samples.map(s => s.state));
      if (distinct.size === 1) {
        findings.push({ kind: 'dead-control', slug, cid, n_opts: samples.length });
      } else if (distinct.size < samples.length && cid !== 'color') {
        const grouped = {};
        for (const s of samples) (grouped[s.state] ||= []).push(s.oid);
        const dupes = Object.values(grouped).filter(g => g.length > 1).map(g => g.join('='));
        if (dupes.length) findings.push({ kind: 'dupe-options', slug, cid, dupes: dupes.join(' / ') });
      }
    }
  }
  await browser.close();
  srv.close();

  const md = [`# Configurator control audit\n\nRun: ${new Date().toISOString()}\n`];
  md.push('## Findings\n');
  if (!findings.length) md.push('No issues found.');
  else {
    for (const f of findings) md.push(`- **${f.kind}** \`${f.slug || ''}\` ${f.cid ? `→ ${f.cid}` : ''} ${f.opts || f.dupes || f.msg || ''} ${f.n_opts ? `(${f.n_opts} opts)` : ''}`.trim());
  }
  fs.writeFileSync(path.join(outDir, 'controls-report.md'), md.join('\n'));
  console.log(`✓ ${findings.length} findings → _audit/controls-report.md`);
  for (const f of findings) console.log(`  ${f.kind}: ${f.slug || ''} ${f.cid || ''} ${f.opts || f.dupes || f.msg || ''} ${f.n_opts ? `(n=${f.n_opts})` : ''}`.trim());
})();
