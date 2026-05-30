# Hebrew Translation Handoff — iMac → MacBook 2026-05-29

**From:** iMac Claude session (`launch/floordsgn-com-cf` branch, 84 pages reference library)
**To:** MacBook Claude session (`platform-foundation` branch)
**Owner directive:** "пождключайся к макбуку и начинайте вместе работать нам нужен перевод на иврит" — full Hebrew translation + RTL mirroring, technical-grade for designer/architect audience

## What iMac has built (foundation ready to use)

### 1. RTL CSS scaffold
**File:** `he.css` (root)
- Hebrew web fonts loaded: Frank Ruhl Libre (display, analog to Cormorant Garamond) + Heebo (body, analog to Montserrat)
- Triggers ONLY on `<html lang="he" dir="rtl">` — zero impact on EN/RU pages
- Mirrors signal-orange border from `border-left` to `border-right` on all 20+ card class variants from the reference set
- Right-aligns body text, lists, tables, sections
- Numbered step badges flipped from top-left to top-right corner
- Letter-navigation glossary block stays LTR within RTL context
- `<span dir="ltr">...</span>` pattern documented for embedding English standards (EN 13501-1, ASTM F2170, ₪480/m²) within Hebrew paragraphs — bidi handled cleanly via `unicode-bidi: isolate`

### 2. Hebrew technical terminology glossary
**File:** `docs/HEBREW_TERMINOLOGY_GLOSSARY.md`
- ~150 entries organised by topic: system families, substrate + install, standards + test methods, performance properties, compliance + documentation, use cases, brand families, common Hebrew technical phrases
- All audience-targeted at designer/architect/specifier — formal technical register, not consumer marketing
- Brand names + standard codes kept in Latin script (Sikafloor, EN 13501-1) per IL technical convention
- Some entries marked ⚠️ as needing owner review (microtopping rendering, shot-blast preference, borrowed-vs-native term choices)
- "Editing notes for translator" section with bidi handling, brand-capitalisation, currency-position, audience-tone guidance

### 3. Pilot Hebrew page
**File:** `articles/he/floor-knowledge-index.html`
- Full RTL translation of the 8-pillar knowledge index navigation hub
- Demonstrates: bidirectional handling (Hebrew flow + LTR brand spans), card layout RTL-mirrored, role-quick navigation translated, hreflang to EN/RU/x-default
- Snapped + visually verified — `_screens/floor-knowledge-index-desktop-2026-05-30T06-25-36.png` shows clean RTL render

## What needs to happen (translation scope)

**Total scope:** 84 pages on `launch/floordsgn-com-cf` need Hebrew translation. Plus the existing site (encyclopedia + brands + comparisons + tools). MacBook will see a substantial subset is already on `platform-foundation` (data-driven generator approach).

**Estimated effort:** 80+ substantial bilingual reference pages at ~5-7 minutes per Hebrew translation (including RTL verification + glossary check + snap) = ~7-10 hours focused work. Single session cannot do this; needs to be split.

### Recommended split

**iMac (continuing):** Tier-1 owner-side reference pages — high-value entry points
1. `articles/he/floor-knowledge-index.html` ✅ DONE
2. `articles/he/role-targeted-floor-faq.html`
3. `articles/he/floor-system-selection-by-use-case.html`
4. `articles/he/floor-compliance-verification-checklist.html`
5. `articles/he/floor-warranty-types-explained.html`
6. `articles/he/floor-tender-boq-template.html`
7. `articles/he/floor-procurement-timeline.html`
8. `articles/he/floor-handover-inspection-checklist.html`
9. `articles/he/israeli-floor-standards-explained.html` (IL-specific — high value for owner's market)
10. `articles/he/floor-accessibility-il-1004-explained.html` (ת״י 1004 deep dive — highly relevant for IL public)

**MacBook (proposed):** Tier-2 specialist pages + encyclopedia + comparisons
- Encyclopedia pages (PU-cement, epoxy SL, MMA, microtopping, polished concrete, terrazzo, etc.)
- Comparison pages (resin family / brand-family / microtopping vs polished concrete / terrazzo / resin vs tile / kitchen / etc.)
- Brand profiles (Sika, Mapei, MC-Bauchemie, Ardex, Conica, Polytan, BSW, Tarkett, Forbo, etc.)
- Use-case pages (cold-store, brewery, coastal, dance/fitness, high-humidity, retail flagship, outdoor terrace, etc.)
- Use the same `he.css` + `HEBREW_TERMINOLOGY_GLOSSARY.md` for consistency

### Production rules

1. **HTML structure:** `<html lang="he" dir="rtl">`, drop all `data-lang-block="en"`/`data-lang-block="ru"` blocks (Hebrew is its own file in `articles/he/`).
2. **Brand names + standard codes:** Wrap in `<span dir="ltr">...</span>` when embedded in Hebrew paragraph (EN 13501-1, ASTM F2170, ₪480/m², Sikafloor, etc.).
3. **CSS:** Load all three: `styles.css` + `chrome-fix.css` + `he.css` (in that order).
4. **hreflang:** Include alternate links to EN + RU + x-default versions.
5. **Terminology:** Use canonical entries from `HEBREW_TERMINOLOGY_GLOSSARY.md`. If new term needed, add to glossary "pending owner review" section + flag inline `<!-- TERM: original — proposed Hebrew — needs owner review -->`.
6. **Snap verification:** Snap each translated page via `node scripts/snap.js articles/he/<page>.html --only=desktop --port=N` and visually verify RTL render before commit.
7. **Commit per page:** `feat(he): translate <page> to Hebrew with full RTL`.
8. **Token discipline:** Per `feedback_token_pacing.md` — target ~5-7 minutes per page, not 3-4. Quality over volume; each page is read by IL designers/architects, must be technically correct.

### Anti-collision

- iMac works only in `articles/he/` for its Tier-1 list above
- MacBook works only in `articles/he/encyclopedia/`, `articles/he/brands/`, `articles/he/comparisons/`, and Tier-2 specialist pages
- Both can edit `he.css` if RTL bug discovered (note in commit message + flag in handoff)
- Both can edit `HEBREW_TERMINOLOGY_GLOSSARY.md` to add pending terms (last-write-wins, no merge conflicts expected)

### Blockers to owner (don't get blocked on these — apply best-guess Hebrew + flag inline)

- Several terms flagged ⚠️ in glossary need owner confirmation (microtopping rendering, shot-blast term, borrowed vs native)
- Owner-input on canonical IL distributor names (already in glossary table)
- Hebrew typography preference: do we use diacritics (nikud) on technical terms or rely on context? Currently default is no nikud (matches IL technical writing convention) — confirm with owner

## Status as of handoff (2026-05-29 06:30 IDT)

- iMac branch: `launch/floordsgn-com-cf` at commit (pushed to origin: https://github.com/chernushoov/floordsgn-site/tree/launch/floordsgn-com-cf)
- 84 pages EN+RU bilingual on iMac branch
- 1 Hebrew pilot page complete + snap verified
- Foundation files (he.css + glossary) committed
- BLOCKERS_FOR_OWNER updated with Hebrew translation scope decisions awaiting owner

## What iMac is doing next

Proceeding to translate Tier-1 list above at sustainable pace (~5-7 min per page, not the 3-4 min sprint pace owner flagged in `feedback_token_pacing.md`). Will commit per page + drop interim handoff updates here as terms emerge that need MacBook coordination.

If MacBook prefers different split (e.g., wants the brand catalog first because owner's market presence pivots on IL channel visibility), MacBook can drop a counter-proposal in this same docs/macbook-handoff/ folder and iMac will adjust.

## Visual evidence

Pilot snap: `_screens/floor-knowledge-index-desktop-2026-05-30T06-25-36.png` — confirms RTL works for: hero title, back-link arrow flip, dark navigation block on RIGHT, signal-orange border on RIGHT, 8 pillar cards properly mirrored, brand names LTR-isolated within Hebrew flow, footer center-aligned.

Test URLs (local server still running on port 8797):
- Hebrew pilot: http://127.0.0.1:8797/articles/he/floor-knowledge-index.html
- English source: http://127.0.0.1:8797/articles/floor-knowledge-index.html
- For visual A/B comparison
