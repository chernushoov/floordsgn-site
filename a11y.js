#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = __dirname;
const STRICT = process.env.A11Y_STRICT === '1';
const DEFAULT_PAGES = [
  'index.html',
  'blog.html',
  'floors.html',
  'decision-tool.html',
  'articles/epoxy-vs-polyurethane.html',
  'floors/epoxy.html',
  'floors/terrazzo.html',
  'contact.html',
  'tools.html',
  'care-guide.html',
  'warranty.html',
  'repair-or-replace.html',
  'tco.html',
  'boq.html',
  'coastal-chloride-audit.html',
  'about.html',
  'studio.html',
  'designers.html',
  'materials/epoxy.html',
  'materials/terrazzo.html',
];
const PAGES = (process.env.A11Y_PAGES || DEFAULT_PAGES.join(','))
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function resolveRequestPath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  const relative = normalized === '/' ? 'index.html' : normalized.replace(/^[/\\]/, '');
  const candidate = path.join(ROOT, relative.endsWith('/') ? `${relative}index.html` : relative);
  if (!candidate.startsWith(ROOT)) return null;
  return candidate;
}

function createStaticServer() {
  const server = http.createServer((req, res) => {
    const filePath = resolveRequestPath(req.url || '/');
    if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, {
      'content-type': CONTENT_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${address.port}` });
    });
  });
}

function browserOptions() {
  const candidates = [
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ];
  const executablePath = candidates.find((candidate) => fs.existsSync(candidate));
  return executablePath ? { executablePath, headless: true } : { headless: true };
}

function formatViolation(violation) {
  const nodes = violation.nodes
    .slice(0, 3)
    .map((node) => node.target.join(' '))
    .join('; ');
  return `${violation.impact || 'unknown'} ${violation.id}: ${violation.help}${nodes ? ` (${nodes})` : ''}`;
}

async function scanPage(browser, axeSource, baseUrl, pagePath) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  const url = `${baseUrl}/${pagePath}`;
  const response = await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  const status = response ? response.status() : 0;
  if (status < 200 || status >= 300) {
    await page.close();
    return {
      page: pagePath,
      ok: false,
      failures: [`document returned HTTP ${status || 'unknown'}`],
      warnings: [],
    };
  }

  await page.addScriptTag({ content: axeSource });
  const result = await page.evaluate(async () => {
    return window.axe.run(document, {
      resultTypes: ['violations'],
    });
  });
  await page.close();

  const failingImpacts = STRICT ? new Set(['critical', 'serious']) : new Set(['critical']);
  const failures = [];
  const warnings = [];

  for (const violation of result.violations || []) {
    const line = formatViolation(violation);
    if (failingImpacts.has(violation.impact)) failures.push(line);
    else warnings.push(line);
  }
  pageErrors.forEach((message) => warnings.push(`pageerror: ${message}`));

  return {
    page: pagePath,
    ok: failures.length === 0,
    failures,
    warnings,
  };
}

async function main() {
  const axePath = require.resolve('axe-core/axe.min.js');
  const axeSource = fs.readFileSync(axePath, 'utf8');
  const { server, baseUrl } = await createStaticServer();
  let browser;

  try {
    browser = await chromium.launch(browserOptions());
    const results = [];
    for (const pagePath of PAGES) {
      results.push(await scanPage(browser, axeSource, baseUrl, pagePath));
    }

    let failed = false;
    for (const result of results) {
      if (result.ok) {
        console.log(`OK ${result.page}${result.warnings.length ? ` (${result.warnings.length} warnings)` : ''}`);
      } else {
        failed = true;
        console.log(`FAIL ${result.page}`);
        result.failures.forEach((failure) => console.log(`  - ${failure}`));
      }
      if (process.env.A11Y_VERBOSE === '1') {
        result.warnings.forEach((warning) => console.log(`  warn: ${warning}`));
      }
    }

    console.log(`\nA11Y ${failed ? 'FAILED' : 'OK'}: ${results.length} pages scanned${STRICT ? ' (strict)' : ''}`);
    process.exitCode = failed ? 1 : 0;
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error(`a11y check failed: ${error && error.message ? error.message : error}`);
  process.exit(1);
});
