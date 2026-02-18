// parser.js
// Parses raw HTML data collected by crawler.js and extracts structured insights.
// Outputs markdown files with tags for later consumption.

const fs = require('fs');
const path = require('path');

/**
 * Simple helper to create a markdown file for a competitor entry.
 * @param {string} competitorName
 * @param {Array<{title:string, link:string}>} items
 * @param {string} date ISO date string (YYYY-MM-DD)
 */
function writeMarkdown(competitorName, items, date) {
  const outDir = path.join(__dirname, '..', 'content', 'knowledge');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const fileName = `${competitorName.toLowerCase().replace(/\s+/g, '-')}-${date}.md`;
  const filePath = path.join(outDir, fileName);
  const header = `# ${competitorName} – ${date}\n\n#competitor #technology #trend #date\n\n`;
  const body = items.map(i => `- [${i.title}](${i.link})`).join('\n');
  fs.writeFileSync(filePath, header + body + '\n');
  console.log(`✅ Parsed and saved ${filePath}`);
}

// Export for external use (e.g., scheduler)
module.exports = { writeMarkdown };
