---
version: alpha
name: Floor.DSGN
description: Industrial Proof — premium resin/terrazzo flooring (Terrazzo TLV, Tel Aviv). Engineering voice, zero marketing fluff, no emoji.
colors:
  carbon: "#151515"
  steel: "#72716D"
  signal: "#C86B3C"
  concrete: "#F3F0EA"
  surface-2: "#F5F5F7"
  graphite: "#2D2D2D"
  base-dark: "#101510"
  base-dark-2: "#0A0E0B"
  on-signal: "#FFFFFF"
typography:
  h1:
    fontFamily: Cormorant Garamond
    fontSize: 3.5rem
    fontWeight: 500
    lineHeight: 1.05
  h2:
    fontFamily: Cormorant Garamond
    fontSize: 2.25rem
    fontWeight: 500
    lineHeight: 1.15
  body-md:
    fontFamily: Montserrat
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  label-caps:
    fontFamily: Montserrat
    fontSize: 0.8125rem
    fontWeight: 600
    letterSpacing: "0.08em"
rounded:
  pill: 980px
spacing:
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.on-signal}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.pill}"
    padding: 14px 32px
  button-secondary:
    backgroundColor: "{colors.concrete}"
    textColor: "{colors.carbon}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.pill}"
    padding: 14px 32px
  card:
    backgroundColor: "{colors.concrete}"
    textColor: "{colors.carbon}"
    padding: 24px
  card-dark:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.concrete}"
    padding: 24px
  button-dark:
    backgroundColor: "{colors.base-dark}"
    textColor: "{colors.concrete}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.pill}"
    padding: 14px 32px
  section-dark:
    backgroundColor: "{colors.base-dark}"
    textColor: "{colors.concrete}"
    padding: 24px
  section-dark-deep:
    backgroundColor: "{colors.base-dark-2}"
    textColor: "{colors.concrete}"
    padding: 24px
  surface-alt:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.carbon}"
    padding: 24px
  caption:
    backgroundColor: "{colors.concrete}"
    textColor: "{colors.steel}"
    typography: "{typography.body-md}"
---

# DESIGN.md — Floor.DSGN Brand Canon

Single source of truth for brand, layout, logo, and language. This file was MISSING from the repo; CLAUDE.md, project-wiki and the design-md skill all reference it. Every page must conform. Lint target: `npx @google/design.md lint DESIGN.md`.

Brand: Floor.DSGN (Terrazzo TLV, Tel Aviv). System: "Industrial Proof". Voice: engineering — precise, sourced, zero marketing fluff. No emoji anywhere in UI or content.

---

## 1. Color tokens (the ONLY colors allowed)

```
--carbon:    #151515   /* primary dark — text, dark sections. NEVER use #000 */
--steel:     #72716D   /* muted secondary text, borders */
--signal:    #C86B3C   /* accent. ONE signal point per page. CTA/highlight only */
--concrete:  #F3F0EA   /* primary light surface — section backgrounds */
--surface-2: #F5F5F7   /* secondary light surface */
--graphite:  #2D2D2D   /* dark surface variant */
```

Rules:
- No color outside this set. No `#000` (use `--carbon`). No `#FFFFFF` as a section background (use `--concrete` or `--surface-2`).
- Exactly ONE `--signal` element per page (one CTA / one highlight). More than one = bug.

## 2. Typography

```
--font-display: "Cormorant Garamond", serif;   /* headings / hero only */
--font-body:    "Montserrat", sans-serif;       /* everything else */
```
A third font anywhere = bug. No exceptions.

## 3. Logo — ONE canonical, theme by variant (kills "floating logo")

**Problem being fixed:** 9 logo files in `images/logo/` (White1_tr.png, Black1_tr.png, logo.svg, logo-mark, logo-horizontal, logo-stacked-white…) swapped ad-hoc per page → inconsistent logo everywhere.

**Canon — use ONLY these, nothing else:**
```
logo-horizontal.svg          /* default header logo on light surfaces */
logo-horizontal-white.svg    /* same logo on dark (--carbon/--graphite) surfaces */
logo-mark.svg                /* square mark — favicon, social, tight spaces */
logo-mark-white.svg          /* mark on dark surfaces */
```
Rules:
- SVG only. The `White1_tr.png` / `Black1_tr.png` raster pair is DEPRECATED — remove from all templates.
- Pick variant by surface: light bg → normal, dark bg → `-white`. Never recolor via CSS filters.
- One header component (`partials/header`) renders the logo for the whole site. Pages do not embed logo markup directly.
- Fixed header height; logo locked to a single max-height token `--logo-h: 32px`. No per-page sizing.
- Deprecated files (`White1_tr.png`, `Black1_tr.png`, `logo.svg` legacy, `logo-stacked-white`) move to `images/logo/_deprecated/`, never referenced.

## 4. Layout & components

- Buttons: pill shape, `border-radius: 980px`. Two styles only: primary (filled `--signal`) and secondary (outline `--carbon`).
- No onboarding overlays, no audience pill-tabs (both are UX-liars — removed per Phase 0).
- Section backgrounds alternate `--concrete` / `--surface-2`. Dark sections use `--carbon` or `--graphite`.
- One shared header partial + one shared footer partial. No per-page nav/footer copies (this is what caused logo + language drift).

## 5. Language — every page bilingual EN+RU via data-i18n (kills "разнобой по языкам")

**Problem being fixed:** pages are RU-only or EN-only, mixed at random (e.g. homepage has RU body + English "Our Process"/"How We Work"). No page may be half one language.

Rules:
- Default locale at `floordsgn.com` root = **RU**. EN is one toggle away via footer/header switcher. (HE = Phase 2, `he/` layer stays unpublished until native review.)
- Every user-facing string comes from `translations.js` keyed `{ ru, en }`. No hardcoded copy in HTML.
- A page is "done" only when 100% of its visible strings resolve in BOTH ru and en. A single untranslated string = page not done.
- The language switcher swaps the whole page locale, never fragments.
- HE (`he/`) and AR are RTL when published. Not in current scope.

## 6. Personas (content must serve all four)

Architect · Builder · Contractor · Owner. Engineering voice for all; depth scales by persona. Material claims trace to Sika / Mapei / BASF / ICRI / ACI — no invented numbers.

## 7. Hard constraints — never violate

1. **`landing.html` is FROZEN** — the 7-layer animated page is never modified, not even "small" fixes. (Note: live homepage is `index.html`, a different file — that one is editable.)
2. **No emoji** in any UI or content.
3. **Etalon commits — never revert/alter without explicit operator request:** `cc421cf` (hero3d), `076fdbc` (cfg-mobile), `23ed628` (audit-fix), `db80612` (sprint0).
4. **One stack:** vanilla HTML/CSS/JS (PROJECT_PLAN canon). The `astro/` experiment is ARCHIVED, not the live stack.
5. Sourcing: every spec/number cites a recognized source. No invented figures.

---

## 8. Dark-green premium skin (NARYAD 08) — APPLIED to `index.html` (fix/design-premium-pass)

Operator chose the vibe of the old site (victoriameiri.wixsite.com/floordsgn): a deep, desaturated
pine-green base instead of pure Carbon on dark surfaces. **Calibrated by rendering the old site**, now
formal tokens (`colors.base-dark`, `colors.base-dark-2`; mirrored in `styles.css :root`):

```
--base-dark:   #101510   /* deep pine-green — dark sections / footer / dark buttons (replaces Carbon there) */
--base-dark-2: #0A0E0B   /* darker pine variant — Studio band, footer */
```

**Where base-dark earns it:** dark section bands, footer, dark buttons. Carbon stays for text and as
the #000-replacement. Exactly ONE Signal `#C86B3C` per page still holds (homepage = hero CTA only;
the system-card "+" turns Signal on hover, which is transient and allowed).

**Reusable component spec (homepage, prefix `hp-`):**

- **Radius:** `--radius-photo` ≈ **28px** on hero/Studio photos, **24px** on cards, **20px** on proof
  cells. Buttons stay pill (980px).
- **Overlap / naplyv (the signature "expensive" move):** the hero photo sits in its own `hp-wrap` and is
  pushed down with `transform: translateY(72px)` (48px ≤960, 36px ≤560) so it overhangs the green band
  into the next section. The next section adds matching top padding to clear it. Depth, never flush-stacked.
- **Big airy sans headings:** hero + section H2 use **Montserrat**, uppercase, large
  (`clamp(30px,4.4vw,58px)` H2; hero `clamp(46px,9vw,124px)`, weight 300 with a 700 second word in a
  muted pine-grey `#6f8a7d`). NB: this is a deliberate homepage exception to §2 (Cormorant) — Cormorant
  remains the display font on article/listing/encyclopedia pages.
- **System cards (`hp-syscard`):** photo + dark gradient + **vertical side label** (`writing-mode:
  vertical-rl; rotate(180deg)`; RESIN / TERRAZZO / MICRO-TOPPING / CONCRETE) + **"+" corner** affordance
  (Signal on hover) + name/meta bottom-left.
- **Hero copy:** "DESIGN IN EVERY LAYER" / RU subline "Не просто полы — поверхности, которые меняют
  пространство."
- **IA = EXPERT-PORTAL funnel:** hero → choose system → 3D/Studio → library → proof → /lead. NOT a
  "shop of services" (the old `process` / `clients` / "book a consultation" sections were removed).

**Hard:** **Do NOT** carry the old site's unverified "10+/99%/100+" stats or its clients/trust block
(same fabricated-proof class the audit flagged — homepage now shows real systems + real work photos only).
No emoji (the old `trust-section` emoji icons ✓⌬⌖⏳ were removed).

**Logo — RESOLVED (operator «лого с викса»):** canonical = the **FLOOR.DSGN tile-mosaic mark** (identical
to the old Wix logo). Use `images/logo/logo-mark-orig.png` (+ `-white` variant) + Montserrat wordmark.
White variant on dark surfaces (homepage hero header, Studio chrome); black on light (Configurator chrome).
No CSS recoloring; pick variant by surface (per §3).

**Tool-chrome — DONE:** unified minimal bar = canonical logo + «← на сайт» added to Studio
(`floor-room.html` — it had no way home) and Configurator (`configurator.html`). Homepage header →
`header--hero` (white logo over green hero, solidifies to pine `--base-dark` on scroll). Configurator
`--mono` JetBrains Mono → **Montserrat** (it was a 3rd-font §2 violation; 19 usages, one token line).

**Still pending (next slices):** base-dark globally (footer is home-scoped for now); Configurator
`--accent #0071e3` blue → Signal (separate brand-color violation); listing-page H1 Cormorant drift;
mobile table overflow; Studio persona-modal is an onboarding overlay (§4 violation, pre-existing).
