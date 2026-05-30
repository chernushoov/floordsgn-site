#!/usr/bin/env node
/* Fix the bad rtl.css injection from add-he-button.js v1.
 *
 * Broken pattern:
 *   <link rel="stylesheet" href="styles.css?v=...."   ← missing closing >
 *       <link rel="stylesheet" href="rtl.css">>      ← double >
 *
 * Fix: ensure styles.css link closes properly, single rtl.css link follows.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SKIP = new Set([
    'node_modules', '.git', 'dist', 'dist-parcel', 'dist-pwa',
    '_backups', '_screens', 'research', 'competitor-monitor',
    'astro', 'docs', '.openclaw', '.parcel-cache', '.netlify',
    'admin', 'plate3d'
]);

function walk(dir, out = []) {
    for (const name of fs.readdirSync(dir)) {
        if (SKIP.has(name)) continue;
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) walk(full, out);
        else if (name.endsWith('.html')) out.push(full);
    }
    return out;
}

// Match the broken sequence:
//   "(?:\?[^"]*)?"
//   \n    <link rel="stylesheet" href="([./]*)rtl\.css">>
// We need to close the styles.css link before the rtl.css link.
const BROKEN_RE = /(<link\s+rel="stylesheet"\s+href="[./]*styles\.css(?:\?[^"]*)?")(\s*\n\s*)(<link\s+rel="stylesheet"\s+href="([./]*)rtl\.css">)>/g;

let fixed = 0;
let scanned = 0;
for (const file of walk(ROOT)) {
    scanned++;
    let src = fs.readFileSync(file, 'utf8');
    const orig = src;

    src = src.replace(BROKEN_RE, (_m, stylesLink, gap, rtlLink) => {
        return `${stylesLink}>${gap}${rtlLink}`;
    });

    if (src !== orig) {
        fs.writeFileSync(file, src);
        fixed++;
        console.log('  ✓', path.relative(ROOT, file));
    }
}

console.log(`\nScanned: ${scanned}, Fixed: ${fixed}`);
