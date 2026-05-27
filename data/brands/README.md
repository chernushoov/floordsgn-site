# Brand Research Database

**Purpose.** Structured technical-data knowledge base for floor system brands FloorDSGN compares, recommends, or competes with. Built 2026-05-27 from publicly available manufacturer product pages and TDS PDFs using `scripts/brand-research.py` + `scripts/brand-extract-fields.py`. Synthesised per-brand into structured `products.json` files and human-written `notes.md` summaries.

## Legal positioning

This is **research material, not a republished mirror**. We extract categorical technical facts (product names, thicknesses, consumption rates, certifications, application areas) — these are not copyrightable. We do **not** copy manufacturer prose, design, or table layout into our own pages. All facts we surface on floordsgn.com carry source attribution back to the original manufacturer URL. Raw HTML caches and downloaded TDS PDFs stay local (gitignored) for our reference; only our derived analysis is committed.

## Pipeline

```
scripts/brand-research.py    →    data/brands/<slug>/_raw_*.html  (gitignored)
                              →    data/brands/<slug>/tds/*.pdf   (gitignored)
                              →    data/brands/<slug>/pages.json  (committed)
                              →    data/brands/<slug>/pdfs.json   (committed)
                              →    data/brands/<slug>/sources.md  (committed)
                              →    data/brands/<slug>/meta.json   (committed)

scripts/brand-extract-fields.py  →  data/brands/<slug>/products.json  (committed)
                                     [regex-extracted thickness, consumption,
                                      certs, components from PDF text]

(manual synthesis)               →  data/brands/<slug>/notes.md       (committed)
                                     [brand identity, product hierarchy,
                                      positioning, IL distribution]

(final aggregation)              →  config/brand-catalog.json         (committed)
                                     [tier schema for configurator + segment index]
```

## Brands processed (2026-05-27 session)

| Slug | Brand | Tier | TDS PDFs | IL distribution | Notes status |
|------|-------|------|----------|-----------------|--------------|
| sika-flooring | Sika Flooring | **solo** (default) | 4 | **confirmed** (Gilar) | full |
| topciment | Topciment | featured | **19** | TBD | full + 20 products extracted |
| mapei-mapefloor | Mapei Mapefloor | featured | 0 (WAF blocked) | TBD active IL | synthesised |
| ideal-work | Ideal Work | featured | 0 (gated) | TBD (Italprotec?) | full + 7 products |
| flowcrete | Flowcrete | featured | 0 | TBD | synthesised |
| master-builders | MasterTop / Ucrete | reference | 0 (post-Sika) | likely Gilar | synthesised |
| stonhard | Stonhard | alternative | 3 | TBD direct intl | full + 7 products |
| altro | Altro | featured | 0 (JS nav) | TBD | synthesised + 11 products |
| polyflor | Polyflor | alternative | 0 | TBD | partial scrape + 14 products |
| smartcret | Smartcret | diy-alternative | 0 (Shopify) | direct ship only | full + pricing reference |
| keim | KEIM | reference | 0 (bot check) | owner partner | synthesised |
| beal-mortex | Mortex (BEAL) | **blocked** | — | unknown | retry — port 443 refused |
| pavistamp | Pavistamp | **blocked** | — | unknown | retry — site unresponsive |

**Total:** 11 brands fully profiled, 2 retry-pending, 23 TDS PDFs downloaded for research.

## Brand catalog summary

See [config/brand-catalog.json](../../config/brand-catalog.json) for the aggregated tier schema used by:
- the configurator brand-selector UI (`tier: solo | featured | alternative | reference | diy-alternative | blocked`),
- the brand comparison articles,
- the segment-index for "best brand for X" routing.

## What is in each brand folder

- **`meta.json`** — brand HQ, founded, parent corp, official URL, fetch status.
- **`pages.json`** — list of pages we fetched (URL + title + h1 + h2s + meta description).
- **`pdfs.json`** — list of PDFs downloaded with URL + label + saved-to + extract excerpt.
- **`products.json`** — structured per-product/per-SKU data (thickness, consumption, certs, etc.) extracted from TDS PDFs or from product-page HTML.
- **`sources.md`** — every URL we pulled data from, with timestamp + HTTP status.
- **`notes.md`** — our written synthesis: who they are, product hierarchy, positioning, IL distribution, outstanding questions.

## Known blockers / re-fetch list

1. **beal.be** (Mortex) — port 443 connection refused on 2026-05-27 from this Mac's IP. Retry. Possibly site outage; possibly geographic restriction.
2. **pavistamp.com** — unresponsive 2026-05-27. Retry.
3. **mapei.com** — Cloudflare WAF 403 on all paths and UAs. Either use headless browser session or accept the synthesised profile.
4. **keim.com** — JavaScript-based bot check (crypto-js challenge). Needs headless browser.
5. **app.stonhard.com Product Data PDFs** — URLs have spaces; need URL-encoded re-fetch via curl `--data-urlencode` or Python `urllib.parse.quote`.
6. **flowcrete.co.uk product-ranges** — navigation moved (404 on previously-valid URL). Re-discover from current homepage.

## Reuse plan

For each brand-profile article on floordsgn.com (e.g. `articles/brands/topciment.html`):

1. Read `data/brands/<slug>/notes.md` for the synthesis.
2. Cite specific products from `data/brands/<slug>/products.json` with TDS source URL.
3. Link out to the manufacturer's TDS URL — do not host PDFs ourselves.
4. Honest IL availability section using `il_distribution` field from `meta.json` or `config/brand-catalog.json`.
5. If a brand is `tier: blocked` or has `notes_status: synthesised`, mark our brand-profile page accordingly ("information current as of 2026-05-27; manufacturer site temporarily unreachable during research") rather than imply we have current data.
