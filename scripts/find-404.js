#!/usr/bin/env node
// Re-run configurator and report every 404 URL.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const PORT = 5481;
const MIME = { '.html':'text/html;charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf','.glb':'model/gltf-binary','.hdr':'application/octet-stream' };

const log404 = [];
const srv = http.createServer((req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/') url = '/index.html';
  const full = path.join(ROOT, url);
  if (!fs.existsSync(full) || fs.statSync(full).isDirectory()) {
    log404.push(url);
    res.writeHead(404); return res.end();
  }
  const ext = path.extname(full).toLowerCase();
  res.writeHead(200, { 'content-type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(full).pipe(res);
});
srv.listen(PORT, '127.0.0.1', async () => {
  const browser = await chromium.launch({ headless: true, executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium' });
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${PORT}/configurator.html`, { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(3000);
  await browser.close();
  console.log('404s:', log404);
  srv.close();
});
