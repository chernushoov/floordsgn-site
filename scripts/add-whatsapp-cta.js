#!/usr/bin/env node
/* Adds a sticky WhatsApp CTA to pages that don't have one yet.
 *
 * Why: 5 of 8 material pages (concrete, microtopping, restoration, rubber,
 * terrazzo) plus quote.html have NO WhatsApp button — a primary revenue
 * leak. quote.html has a sticky CTA pointing to /contact.html instead of
 * direct chat, adding friction before owner reach.
 *
 * Strategy: append the same sticky-cta-whatsapp element used on the
 * already-wired pages (epoxy/mma/pu-cement). Each page gets a context-
 * specific pre-filled message so the lead arrives self-classified.
 *
 * Safe to re-run (idempotent — checks for existing wa.me + sticky-cta).
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PHONE = '972559661459';

// Pre-filled message per page. Kept English (matching the existing wired
// pages); Hebrew/Russian variants are deferred to per-language link wiring.
const MESSAGES = {
    'materials/concrete.html':     'Hi FloorDSGN, I want to discuss a polished or decorative concrete floor project.',
    'materials/microtopping.html': 'Hi FloorDSGN, I want to discuss a microtopping project.',
    'materials/restoration.html':  'Hi FloorDSGN, I want to discuss restoring or recoating an existing floor.',
    'materials/rubber.html':       'Hi FloorDSGN, I want to discuss a rubber flooring project.',
    'materials/terrazzo.html':     'Hi FloorDSGN, I want to discuss a terrazzo project.',
    'quote.html':                  'Hi FloorDSGN, I started a quote on the site and want to send photos and details.'
};

function ctaHtml(message) {
    const text = encodeURIComponent(message);
    return `    <a href="https://wa.me/${PHONE}?text=${text}" class="sticky-cta sticky-cta-whatsapp" id="stickyCta" target="_blank" rel="noopener">
        <span data-i18n="sticky_cta">WhatsApp</span>
    </a>`;
}

let added = 0;
let skipped = 0;

for (const [rel, message] of Object.entries(MESSAGES)) {
    const file = path.join(ROOT, rel);
    if (!fs.existsSync(file)) {
        console.log('  ⏭ missing:', rel);
        skipped++;
        continue;
    }
    let src = fs.readFileSync(file, 'utf8');

    // Skip if a WhatsApp sticky CTA is already present.
    if (/class="[^"]*sticky-cta-whatsapp/.test(src)) {
        console.log('  ⏭ already wired:', rel);
        skipped++;
        continue;
    }

    // For quote.html: there's an existing `sticky-cta` (link to contact.html);
    // replace it with the WhatsApp version (direct line to owner = less friction).
    if (rel === 'quote.html') {
        const re = /<a href="contact\.html" class="sticky-cta"[^>]*>[\s\S]*?<\/a>/;
        if (re.test(src)) {
            src = src.replace(re, ctaHtml(message).trim());
            fs.writeFileSync(file, src);
            console.log('  ✓ replaced contact-sticky → WhatsApp:', rel);
            added++;
            continue;
        }
    }

    // For material pages: append just before </body>.
    if (/<\/body>/i.test(src)) {
        src = src.replace(/(<\/body>)/i, `\n${ctaHtml(message)}\n$1`);
        fs.writeFileSync(file, src);
        console.log('  ✓ added WhatsApp sticky:', rel);
        added++;
    } else {
        console.log('  ⚠ no </body> found:', rel);
        skipped++;
    }
}

console.log(`\nAdded: ${added}, Skipped: ${skipped}`);
