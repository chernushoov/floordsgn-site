#!/usr/bin/env node
/**
 * End-to-end test of the repair-or-replace wizard.
 * Walks each step, asserts state transitions, captures result for 3 different scenarios.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PORT = 5210;
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

const SCENARIOS = [
  {
    name: 'Moisture from below — should force replace+substrate',
    answers: ['epoxy', 'moisture', '7-15', 'widespread', 'week'],
    expectVerdict: /замена.*обработка|substrate/i,
  },
  {
    name: 'Widespread delamination — should force full replace',
    answers: ['epoxy', 'delamination', '7-15', 'widespread', 'week'],
    expectVerdict: /Полная замена/i,
  },
  {
    name: 'Point delamination — should be local repair',
    answers: ['terrazzo', 'delamination', '3-7', 'point', 'weekend'],
    expectVerdict: /Локальный/i,
  },
  {
    name: 'Yellowing — should be recoat with UV finish',
    answers: ['epoxy', 'yellowing', '3-7', 'zonal', 'weekend'],
    expectVerdict: /Recoat.*UV|UV.*финиш/i,
  },
  {
    name: 'Dull / lost gloss — should be re-polish/re-seal',
    answers: ['concrete', 'dull', '7-15', 'widespread', 'weekend'],
    expectVerdict: /Re-polish|re-seal/i,
  },
];

(async () => {
  const srv = await serve();
  const browser = await chromium.launch({ executablePath: fs.existsSync(CHROMIUM_BIN) ? CHROMIUM_BIN : undefined, headless: true });
  let pass = 0, fail = 0;
  const failures = [];

  try {
    for (const scen of SCENARIOS) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      page.on('pageerror', e => failures.push(`[${scen.name}] pageerror: ${e.message}`));
      await page.goto(`http://127.0.0.1:${PORT}/repair-or-replace.html`, { waitUntil: 'load' });
      await page.waitForSelector('.rr-step.active');

      for (let i = 0; i < scen.answers.length; i++) {
        const v = scen.answers[i];
        // Wait for the right step
        await page.waitForSelector(`.rr-step[data-step="${i+1}"].active`, { timeout: 3000 });
        // Click the option
        await page.click(`.rr-step[data-step="${i+1}"].active .rr-opt[data-v="${v}"]`);
        // Wait for selection class
        await page.waitForSelector(`.rr-step[data-step="${i+1}"].active .rr-opt[data-v="${v}"].selected`);
        // Click Next
        await page.click('#rrNext');
        await page.waitForTimeout(150);
      }

      // After last next: result should be active
      await page.waitForSelector('.rr-result.active', { timeout: 3000 });
      const verdict = await page.textContent('#rrVerdictHead');
      const matched = scen.expectVerdict.test(verdict);

      if (matched) {
        console.log(`  ✓ ${scen.name}  →  "${verdict}"`);
        pass += 1;
      } else {
        console.log(`  ✗ ${scen.name}  →  GOT "${verdict}"  EXPECTED ${scen.expectVerdict}`);
        fail += 1;
      }

      await page.close();
    }
  } finally {
    await browser.close();
    await new Promise(r => srv.close(r));
  }

  console.log(`\nWizard test: ${pass}/${pass+fail} passed.`);
  failures.forEach(f => console.log('  !', f));
  process.exit(fail === 0 ? 0 : 1);
})();
