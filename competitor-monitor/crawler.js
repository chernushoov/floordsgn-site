// crawler.js
// Simple crawler for competitor websites using axios + cheerio
// This script fetches HTML from a list of competitor URLs and extracts headlines, product mentions, and price info.

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// List of competitor sites – extend as needed
const competitors = [
  { name: 'Flexco', url: 'https://flexco.com/news' },
  { name: 'Ardex', url: 'https://ardex.com/blog' },
  { name: 'Sika', url: 'https://sika.com/en-us/news' },
  { name: 'BASF', url: 'https://basf.com/en/company/news' },
  { name: 'Mapei', url: 'https://mapei.com/en/press' },
  { name: 'Sherwin-Williams', url: 'https://www.sherwin-williams.com/press-centre' }
];

/**
 * Fetch page HTML and return cheerio instance.
 */
async function fetchPage(url) {
  try {
    const response = await axios.get(url, { timeout: 15000 });
    return cheerio.load(response.data);
  } catch (e) {
    console.error(`Failed to fetch ${url}:`, e.message);
    return null;
  }
}

/**
 * Extract simple items (titles + links) from a page.
 */
function extractItems($, selectors) {
  const items = [];
  selectors.forEach(sel => {
    $(sel).each((_, el) => {
      const title = $(el).text().trim();
      const link = $(el).attr('href') || '';
      if (title) items.push({ title, link });
    });
  });
  return items;
}

/**
 * Main routine – iterate competitors, collect data, write markdown files.
 */
(async () => {
  const now = new Date().toISOString().slice(0, 10);
  const outDir = path.join(__dirname, '..', 'content', 'knowledge');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const comp of competitors) {
    const $ = await fetchPage(comp.url);
    if (!$) continue;
    // Very generic selectors – many sites use <article> or <h2> for headlines.
    const items = extractItems($, ['article h2 a', 'h2 a', '.post-title a']);
    if (items.length === 0) continue;

    const mdLines = items.map(it => `- [${it.title}](${it.link})`).join('\n');
    const mdContent = `# ${comp.name} – updates ${now}\n\n${mdLines}\n`;
    const filePath = path.join(outDir, `${comp.name.toLowerCase().replace(/\s+/g, '-')}-${now}.md`);
    fs.writeFileSync(filePath, mdContent);
    console.log(`Wrote ${filePath}`);
  }
})();
