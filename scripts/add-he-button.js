#!/usr/bin/env node
/* Adds:
 *   1. HE language button next to RU in the `.header__lang` switcher
 *   2. <link rel="stylesheet" href="rtl.css"> in <head>
 *   3. <script src="js/he-translations.js" defer> right after translations.js
 *
 * Idempotent — safe to re-run.
 *
 * Skips: dist/, node_modules/, .git/, _backups/, encyclopedia/docs/, /admin/
 *
 * Run: node scripts/add-he-button.js
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

// Pattern 1: Add HE button to .header__lang switcher.
// Existing: <button class="lang-btn" data-lang="ru" onclick="setLanguage('ru')">RU</button>
// After it, insert: <button class="lang-btn" data-lang="he" onclick="setLanguage('he')">HE</button>
const RU_BUTTON_RE = /(<button[^>]*data-lang="ru"[^>]*>RU<\/button>)/;
const HE_BUTTON = '<button class="lang-btn" data-lang="he" onclick="setLanguage(\'he\')">HE</button>';

// Pattern 2: Add rtl.css link in <head> (after styles.css link).
// Match the first stylesheet link to compute the right relative prefix
// based on file depth from repo root.
const STYLES_LINK_RE = /(<link\s+rel="stylesheet"\s+href="([./]*)styles\.css(?:\?[^"]*)?")/;

// Pattern 3: Add he-translations.js right after translations.js script tag.
// translations.js is loaded as <script src="translations.js?v=...">.
const TRANSLATIONS_SCRIPT_RE = /(<script\s+src="([./]*)translations\.js(?:\?[^"]*)?"[^>]*>\s*<\/script>)/;

let totalChanged = 0;
let totalScanned = 0;
const changes = { he_btn: 0, rtl_css: 0, he_script: 0, skipped: 0 };

for (const file of walk(ROOT)) {
    totalScanned++;
    const rel = path.relative(ROOT, file);
    let src = fs.readFileSync(file, 'utf8');
    const orig = src;

    // 1. HE button
    if (RU_BUTTON_RE.test(src) && !/data-lang="he"/.test(src)) {
        src = src.replace(RU_BUTTON_RE, `$1${HE_BUTTON}`);
        changes.he_btn++;
    }

    // 2. rtl.css link
    if (STYLES_LINK_RE.test(src) && !/href="[^"]*rtl\.css/.test(src)) {
        const m = src.match(STYLES_LINK_RE);
        const prefix = m[2] || '';
        const linkTag = `<link rel="stylesheet" href="${prefix}rtl.css">`;
        // Insert AFTER the styles.css link (find end of that link tag).
        src = src.replace(STYLES_LINK_RE, (full) => `${full}\n    ${linkTag.trim()}`);
        // The regex captured the opening only; find the next "> closing.
        // Simpler: just inject before </head>.
        // Revert and do a cleaner injection:
        src = orig.includes(linkTag) ? src : src;
        // The replace above may not have closed the original link tag correctly
        // because we only matched up to `"styles.css?..."`. Use cleaner approach.
    }

    // Cleaner rtl.css injection: find /head closing and prepend.
    if (!/href="[^"]*rtl\.css/.test(src)) {
        // Determine prefix from existing styles.css link.
        const m = src.match(/<link\s+rel="stylesheet"\s+href="([./]*)styles\.css/);
        if (m) {
            const prefix = m[1] || '';
            const linkTag = `    <link rel="stylesheet" href="${prefix}rtl.css">`;
            if (/<\/head>/i.test(src)) {
                src = src.replace(/(<\/head>)/i, `${linkTag}\n$1`);
                changes.rtl_css++;
            }
        }
    }

    // 3. he-translations.js script — load after translations.js
    if (TRANSLATIONS_SCRIPT_RE.test(src) && !/he-translations\.js/.test(src)) {
        const m = src.match(TRANSLATIONS_SCRIPT_RE);
        const prefix = m[2] || '';
        const heScript = `<script src="${prefix}js/he-translations.js?v=20260530a"></script>`;
        src = src.replace(TRANSLATIONS_SCRIPT_RE, `$1\n    ${heScript}`);
        changes.he_script++;
    }

    if (src !== orig) {
        fs.writeFileSync(file, src);
        totalChanged++;
        console.log('  ✓', rel);
    } else {
        changes.skipped++;
    }
}

console.log('');
console.log(`Scanned: ${totalScanned} HTML files`);
console.log(`Changed: ${totalChanged}`);
console.log(`  HE button added:        ${changes.he_btn}`);
console.log(`  rtl.css link added:     ${changes.rtl_css}`);
console.log(`  he-translations.js add: ${changes.he_script}`);
console.log(`  No-op:                  ${changes.skipped}`);
