const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = '/Users/agentmachine/Work/02-Projects/floordsgn/floordsgn-site-new';
const PORT = 5340;
const MIME = {'.html':'text/html;charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon'};
function serve() {
  return new Promise(resolve => {
    const srv = http.createServer((req, res) => {
      let url = decodeURIComponent(req.url.split('?')[0]);
      if (url === '/') url = '/index.html';
      const full = path.join(ROOT, url);
      if (!full.startsWith(ROOT) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
        res.writeHead(404); return res.end();
      }
      res.writeHead(200, {'content-type':MIME[path.extname(full).toLowerCase()]||'application/octet-stream'});
      fs.createReadStream(full).pipe(res);
    });
    srv.listen(PORT, '127.0.0.1', () => resolve(srv));
  });
}
const CHROMIUM_BIN = '/Applications/Chromium.app/Contents/MacOS/Chromium';
(async () => {
  const srv = await serve();
  const browser = await chromium.launch({ executablePath: fs.existsSync(CHROMIUM_BIN) ? CHROMIUM_BIN : undefined, headless: true });
  let pass=0, fail=0;
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(`http://127.0.0.1:${PORT}/faq.html`, { waitUntil: 'load' });
    await page.waitForSelector('.faq-item');
    
    // Count items
    const itemCount = await page.$$eval('.faq-item', els => els.length);
    if (itemCount >= 30) { console.log(`  ✓ FAQ has ${itemCount} Q&A items (>= 30)`); pass++; }
    else { console.log(`  ✗ FAQ items=${itemCount} expected >=30`); fail++; }
    
    // First item should be closed initially
    const initiallyOpen = await page.$$eval('.faq-item.open', els => els.length);
    if (initiallyOpen === 0) { console.log(`  ✓ All FAQ items closed by default`); pass++; }
    else { console.log(`  ✗ ${initiallyOpen} items open initially`); fail++; }
    
    // Click first question to open
    await page.click('.faq-item:first-of-type .faq-q');
    await page.waitForTimeout(400);
    const afterOpen = await page.$$eval('.faq-item.open', els => els.length);
    if (afterOpen === 1) { console.log(`  ✓ Click opens FAQ item`); pass++; }
    else { console.log(`  ✗ After click open=${afterOpen}, expected 1`); fail++; }
    
    // FAQPage JSON-LD present
    const ldjson = await page.$$eval('script[type="application/ld+json"]', els => els.map(e => e.textContent).join('|'));
    if (/FAQPage/.test(ldjson)) { console.log(`  ✓ FAQPage JSON-LD present`); pass++; }
    else { console.log(`  ✗ FAQPage JSON-LD missing`); fail++; }
    
    await page.close();
  } finally {
    await browser.close();
    await new Promise(r => srv.close(r));
  }
  console.log(`\nFAQ tests: ${pass}/${pass+fail} passed.`);
  process.exit(fail === 0 ? 0 : 1);
})();
