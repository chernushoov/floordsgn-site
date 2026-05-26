#!/usr/bin/env node
/**
 * E2E test of the TCO + BoQ calculators.
 * Smoke-test compute() logic via DOM: change params, read summaries, assert sane numbers.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PORT = 5310;
const CHROMIUM_BIN = '/Applications/Chromium.app/Contents/MacOS/Chromium';

const MIME = {
  '.html':'text/html;charset=utf-8', '.css':'text/css', '.js':'application/javascript',
  '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
  '.webp':'image/webp', '.svg':'image/svg+xml', '.ico':'image/x-icon',
};

function serve() {
  return new Promise(resolve => {
    const srv = http.createServer((req, res) => {
      try {
        let url = decodeURIComponent(req.url.split('?')[0]);
        if (url === '/') url = '/index.html';
        const full = path.join(ROOT, url);
        if (!full.startsWith(ROOT) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
          res.writeHead(404); return res.end();
        }
        res.writeHead(200, { 'content-type': MIME[path.extname(full).toLowerCase()] || 'application/octet-stream' });
        fs.createReadStream(full).pipe(res);
      } catch (e) {
        res.writeHead(500); res.end(String(e));
      }
    });
    srv.listen(PORT, '127.0.0.1', () => resolve(srv));
  });
}

function parseILS(s) {
  // "₪64,000" or similar → 64000
  if (!s) return NaN;
  const digits = s.replace(/[^0-9]/g, '');
  return digits ? parseInt(digits, 10) : NaN;
}

(async () => {
  const srv = await serve();
  const browser = await chromium.launch({ executablePath: fs.existsSync(CHROMIUM_BIN) ? CHROMIUM_BIN : undefined, headless: true });
  let pass = 0, fail = 0;
  const failures = [];

  function expect(name, cond, detail) {
    if (cond) { console.log(`  ✓ ${name}`); pass++; }
    else { console.log(`  ✗ ${name} — ${detail || ''}`); fail++; failures.push(name); }
  }

  try {
    // ============ TCO calculator ============
    console.log('\nTCO calculator:');
    let page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('pageerror', e => failures.push(`tco pageerror: ${e.message}`));
    await page.goto(`http://127.0.0.1:${PORT}/tco.html`, { waitUntil: 'load' });
    await page.waitForSelector('#tcoTotal');
    await page.waitForFunction(() => document.getElementById('tcoTotal').textContent !== '—');

    // Default: epoxy-sl, 200 m², retail, 10 years
    const install1 = parseILS(await page.textContent('#tcoInstall'));
    const total1 = parseILS(await page.textContent('#tcoTotal'));
    expect('TCO install > 0', install1 > 0, `install=${install1}`);
    expect('TCO total > install (care + recoat add to cost)', total1 > install1, `total=${total1} install=${install1}`);
    expect('TCO total sanity (200 m² × 10 yrs epoxy ≈ 100k-200k ILS)', total1 > 50000 && total1 < 500000, `total=${total1}`);

    // Change area to 1000 → total should ~5x
    await page.fill('#tco-area', '1000');
    await page.dispatchEvent('#tco-area', 'input');
    await page.waitForTimeout(200);
    const total2 = parseILS(await page.textContent('#tcoTotal'));
    expect('TCO scales with area (1000 m² ≈ 5x of 200 m²)', total2 > total1 * 4 && total2 < total1 * 6, `200m2=${total1} 1000m2=${total2}`);

    // Change system to PU-cement → should be more expensive per m²
    await page.fill('#tco-area', '200');
    await page.selectOption('#tco-system', 'pu-cement');
    await page.waitForTimeout(200);
    const totalPU = parseILS(await page.textContent('#tcoTotal'));
    expect('PU-cement TCO > Epoxy-SL TCO', totalPU > total1, `pu=${totalPU} epoxy=${total1}`);

    // Compare bars exist
    const compareCount = await page.$$eval('#tcoCompare .tco-compare__row', els => els.length);
    expect('TCO comparison has >= 5 rows', compareCount >= 5, `count=${compareCount}`);

    await page.close();

    // ============ BoQ calculator ============
    console.log('\nBoQ calculator:');
    page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('pageerror', e => failures.push(`boq pageerror: ${e.message}`));
    await page.goto(`http://127.0.0.1:${PORT}/boq.html`, { waitUntil: 'load' });
    await page.waitForSelector('#boqBody tr');

    const matTotalText = await page.textContent('#boqMatTotal');
    const costMat = parseILS(await page.textContent('#boqCostMat'));
    const costFull = parseILS(await page.textContent('#boqCostFull'));
    expect('BoQ material total has weight', /kg/.test(matTotalText), `matTotal="${matTotalText}"`);
    expect('BoQ material cost > 0', costMat > 0, `cost=${costMat}`);
    expect('BoQ full cost > material cost (labour added)', costFull > costMat, `mat=${costMat} full=${costFull}`);

    // Substrate change to "moisture" should add EpoCem line + bump labour
    await page.selectOption('#boq-substrate', 'moisture');
    await page.waitForTimeout(200);
    const costFullMoist = parseILS(await page.textContent('#boqCostFull'));
    expect('BoQ moisture substrate adds cost (EpoCem)', costFullMoist > costFull, `before=${costFull} moisture=${costFullMoist}`);

    // Has SKU rows with Sika SKUs
    const skuCount = await page.$$eval('#boqBody tr td:first-child', els => els.filter(el => /Sika/.test(el.textContent)).length);
    expect('BoQ has at least 2 Sika SKU rows', skuCount >= 2, `count=${skuCount}`);

    await page.close();

  } finally {
    await browser.close();
    await new Promise(r => srv.close(r));
  }

  console.log(`\nCalculator tests: ${pass}/${pass+fail} passed.`);
  failures.forEach(f => console.log('  !', f));
  process.exit(fail === 0 ? 0 : 1);
})();
