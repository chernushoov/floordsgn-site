# MacBook → iMac Handoff Bundle

**Created:** 2026-05-28 20:35 IDT
**Source:** MacBook FLOORdsgn `platform-foundation` branch (10 commits this 24h cycle).
**Target:** iMac Astro project `~/Work/02-Projects/floordsgn/floordsgn-site-new` — branch `launch/floordsgn-com-cf` (ahead 95).

This bundle is **read-only handoff data** — not code to merge. iMac claude may reference these files when writing brand pages, comparisons, encyclopedia articles, and Q&A.

## Files in this bundle

| File | Purpose | Suggested use on iMac |
|---|---|---|
| `Q5_IL_DISTRIBUTORS_FROM_MACBOOK.md` | Answers to Q5 (Mapei/MC-Bauchemie/BASF/Ardex/Kerakoll/StoCretec IL channels) | Already placed in `docs/`. Use in brand pages + comparisons. |
| `Q5_IL_DISTRIBUTORS_FROM_MACBOOK_PART2.md` | Q5 part 2 (Altro/Polyflor/Tarkett/Forbo) — coming within ~5 min | Will be placed in `docs/` when ready. |
| `COMBINED_RESEARCH_REPORT.md` | Consolidated 200-user simulation + hostile expert review + supplier readiness + P0 fix list | High-level context for content strategy and tone. |
| `SUPPLIER_OUTREACH_BRIEFS.md` | Per-supplier outreach briefs with TDS URLs, IL channels found, critical-note flags, action steps | Direct support for brand-page writing and supplier-partnership content. |
| `NIGHT_HANDOFF.md` | Full MacBook session work log (10 commits, P0 schema, 5 hero TDS verification corrections, brand cleanup) | Reference for what MacBook has done — for cross-coordination. |
| `avatars.json` | 5 primary + 5 secondary customer avatars with journey, trust triggers, objections, KPIs, linkedSystems | Reusable persona data for content targeting and CTA copy. |
| `systems-p0-extract.json` | 20 systems × full P0 schema (applicationConditions, potLife, substrateRequirements, slipClass DIN 51130/51097, warranty, jointTreatment, claimVerification per-claim badges) | Reference values for brand-page "specifications" sections, comparison tables, and technical accuracy. |
| `suppliers-research-extract.json` | 6 candidate suppliers with `_research` field — TDS URLs, IL distributors, certifications, partnership programs, sources, gaps | Direct support for brand-page facts + supplier-outreach. |

## Key verified facts from MacBook research

### Sika System-Level TDS (verified via aus.sika.com 2026-05-28)
- **Sikafloor PurCem HB-22** (kitchen broadcast system): R13 / V6, Bfl-s1, HACCP food-grade approved
- **Sikafloor MultiDur EB-24** (heavy-duty epoxy/quartz broadcast): R11 V4 (med quartz) / R12 V6 (coarse quartz), Bfl-s1, BUT "light to medium duty" food rating only (NO HACCP for this system)
- **Sikafloor Pronto kitchen system** (EU): no published system TDS with R-class + Bfl-s1 + HACCP combo. Recommendation: either per-project spec, or replace with PurCem HB-22 in kitchen brand-page references

### IL distributors confirmed for Q5
- **MC-Bauchemie** → A.Z Marketing Ltd. (Ramle, +972-8-9150190)
- **Ardex / Pandomo** → Harel v'Idan – Hakol L'Binyan (Holon, 058-403-5595)

### IL distributor NOT publicly found
- Mapei (industrial line), Kerakoll, StoCretec, Master Builders Solutions

### Critical owner-decision flag
- **Master Builders Solutions (formerly BASF)** was acquired by Sika via MBCC integration in May 2023. Listing as a "Sika alternative" is now factually outdated. iMac already noted this in `articles/comparisons/sika-vs-mapei-vs-mastertop.html` — verify the copy aligns.

### Customer avatars (5 primary)
- **Maya** — interior designer (20% audience), Tel Aviv/Herzliya, decorative microtopping/terrazzo focus
- **Daniel** — architect (15%), Tel Aviv/Haifa, requires verified TDS + standards + substrate requirements
- **Yael** — restaurant owner (12.5%), Tel Aviv/Jerusalem, R11/R12 + HACCP + minimal downtime
- **Igor** — warehouse manager (12.5%), Ashdod/Haifa, heavy-duty epoxy + cost breakdown + night shift
- **Anna** — private villa client (5%), Caesarea/Herzliya, decorative + simple language + sample kit

Each avatar has detailed journey (entry → explore → decide → convert), trust triggers, objections, platform behavior rules, KPIs, linkedSystems.

## Cross-coordination notes

- **MacBook branch:** `platform-foundation` (commits 57d3ef8..22fb06a). Sits in `~/Desktop/FLOORdsgn/02-live-code/`. Not directly merged to Astro — handoff via this docs bundle.
- **iMac branch:** `launch/floordsgn-com-cf` (ahead 95 from origin). Active brand/comparison/encyclopedia sprint.
- **MacBook is the static-gen / 3D-asset factory line.** iMac is the canonical Astro site (deployed to floordsgn.netlify.app).
- **No file conflicts** — MacBook never touches Astro project paths. iMac never touches `~/Desktop/FLOORdsgn/02-live-code/`.
- **Synchronization:** drop files in iMac `docs/` for reference. Reverse direction (iMac → MacBook): commit to `imac-astro` remote (already configured via SSH), MacBook fetches via `git fetch imac-astro`.
