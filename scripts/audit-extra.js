#!/usr/bin/env node
// Extra checks: spec pirog updates between materials, finish vs gloss overlap,
// hover preview, keyboard nav.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const PORT = 5482;
const MIME = { '.html':'text/html;charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.glb':'model/gltf-binary','.hdr':'application/octet-stream' };

const srv = http.createServer((req,res)=>{let url=decodeURIComponent(req.url.split('?')[0]);if(url==='/')url='/index.html';const full=path.join(ROOT,url);if(!fs.existsSync(full)||fs.statSync(full).isDirectory()){res.writeHead(404);return res.end();}const ext=path.extname(full).toLowerCase();res.writeHead(200,{'content-type':MIME[ext]||'application/octet-stream'});fs.createReadStream(full).pipe(res);});
srv.listen(PORT,'127.0.0.1', async () => {
  const browser = await chromium.launch({ headless: true, executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`http://127.0.0.1:${PORT}/configurator.html`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.getElementById('boot')?.classList.contains('gone'), { timeout: 20000 }).catch(()=>{});
  await page.waitForTimeout(1500);

  // 1) Spec pirog changes between materials?
  const slugs = ['terrazzo-cement', 'epoxy', 'parquet', 'rubber'];
  const pies = [];
  for (const slug of slugs) {
    await page.evaluate((s) => document.querySelector(`#matlist li[data-slug="${s}"]`)?.click(), slug);
    await page.waitForTimeout(900);
    const text = await page.$eval('#buildup', el => el.innerText.trim());
    pies.push({ slug, snippet: text.slice(0, 80) });
  }
  console.log('PIE CHANGES:');
  pies.forEach(p => console.log(`  ${p.slug}: ${p.snippet}`));
  console.log('uniquePies:', new Set(pies.map(p=>p.snippet)).size, 'of', pies.length);

  // 2) Finish=polished + Gloss=low → which wins? Both write roughness.
  await page.evaluate(() => document.querySelector('#matlist li[data-slug="epoxy"]')?.click());
  await page.waitForTimeout(900);
  // Click finish=polished first
  const finishStatus = await page.evaluate(() => {
    const blocks = [...document.querySelectorAll('#controls .ctrl')];
    const b = blocks.find(x => x.querySelector('.ctrl-k')?.textContent.trim() === 'Финиш');
    if (!b) return null;
    const btns = [...b.querySelectorAll('.opts button')];
    btns[2].click(); // polished
    return btns[2].textContent.trim();
  });
  await page.waitForTimeout(500);
  const glossStatus = await page.evaluate(() => {
    const blocks = [...document.querySelectorAll('#controls .ctrl')];
    const b = blocks.find(x => x.querySelector('.ctrl-k')?.textContent.trim() === 'Глянец');
    if (!b) return null;
    const btns = [...b.querySelectorAll('.opts button')];
    btns[0].click(); // low
    return btns[0].textContent.trim();
  });
  console.log('Finish=polished then Gloss=low — both buttons clicked:', finishStatus, '/', glossStatus);
  const onButtons = await page.evaluate(() => {
    const blocks = [...document.querySelectorAll('#controls .ctrl')];
    const out = {};
    blocks.forEach(b => {
      const k = b.querySelector('.ctrl-k')?.textContent.trim();
      const on = [...b.querySelectorAll('.opts button.on')].map(x => x.textContent.trim());
      if (k) out[k] = on;
    });
    return out;
  });
  console.log('Active buttons after sequential set:', JSON.stringify(onButtons));

  // 3) Reset button — does it reset orderState?
  await page.evaluate(() => document.querySelector('.s-br button[data-view="reset"]')?.click());
  await page.waitForTimeout(800);
  const afterReset = await page.evaluate(() => {
    const blocks = [...document.querySelectorAll('#controls .ctrl')];
    const out = {};
    blocks.forEach(b => {
      const k = b.querySelector('.ctrl-k')?.textContent.trim();
      const on = [...b.querySelectorAll('.opts button.on')].map(x => x.textContent.trim());
      if (k) out[k] = on;
    });
    return out;
  });
  console.log('After Reset view click:', JSON.stringify(afterReset));

  // 4) URL state persistence test
  const beforeUrl = await page.url();
  await page.evaluate(() => document.getElementById('ctaOrder')?.click());
  // Dismiss alert
  page.on('dialog', d => d.dismiss().catch(()=>{}));
  await page.waitForTimeout(800);
  const afterUrl = await page.url();
  console.log('Order CTA URL change:', beforeUrl !== afterUrl, '\n  before:', beforeUrl.slice(0,80), '\n  after:', afterUrl.slice(0,80));

  // 5) Hover preview on left rail
  const previewVisible = await page.evaluate(async () => {
    const li = document.querySelector('#matlist li[data-slug="parquet"]');
    if (!li) return 'no-li';
    li.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await new Promise(r => setTimeout(r, 200));
    const prev = document.querySelector('.matprev');
    if (!prev) return 'no-prev';
    return prev.classList.contains('show') ? 'visible' : 'hidden';
  });
  console.log('Hover preview state:', previewVisible);

  // 6) Default material on load
  const defaultActive = await page.evaluate(() => {
    const on = document.querySelector('#matlist li.on');
    return on ? on.dataset.slug : null;
  });
  console.log('Default active material:', defaultActive);

  // 7) Keyboard nav (ArrowDown)
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(500);
  const afterArrow = await page.evaluate(() => document.querySelector('#matlist li.on')?.dataset.slug);
  console.log('After ArrowDown:', afterArrow);

  await browser.close();
  srv.close();
});
