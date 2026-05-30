# Блокеры для owner — overnight session 2026-05-27 → 2026-05-28

**Старт сессии:** 22:00 IDT 27 мая
**Конец сессии:** 05:00 IDT 28 мая (твой check)

Логирую сюда всё, что упёрлось во время автономной работы и не могу разрешить без тебя.
Каждый item: что блокирует / что попробовал / fallback / что нужно от тебя.

---

## Открыто на старте (из master plan Q1-Q7)

| # | Вопрос | Где аукнулось | Fallback применённый |
|---|---|---|---|
| Q1 | "Morris" — что за бренд? Mortex / Marmorino / Marius Aurenti? | brand profile запланирован но не создан | Пропускаю brand page до твоего answer |
| Q2 | Italprotec = Ideal Work? | brands/ideal-work.html существует, проверить совместимость | Pages пишутся как "Ideal Work (the Italian brand previously referenced)" |
| Q3 | Cemplaster / Smartrenders — бренды или категории? | brand pages | Пропускаю до твоего answer |
| Q4 | Sikafloor-470 — microcement или underlayment? | existing encyclopedia/microtopping.html — НЕ ТРОГАЮ etalon | В новой microcement-binder-chemistry помечаю как "underlayment под декоративный финиш" |
| Q5 | IL-импортёры Mapei / Master Builders / Altro / Polyflor / Tarkett / Forbo / Ardex | Каждая brand+comparison page | Пишу "European brand, available in IL through specialty importers — contact for current distribution" |
| Q6 | ₪/m² IL pricing 2026 | comparisons + brand pages | Использую "ориентировочно X-Y €/m² (IL pricing on request)" |
| Q7 | Etalon scope: только 4 указанных коммита? | Все existing pages | Не трогаю index.html / configurator.html / landing.html — НИКОГДА |

---

## Появившиеся во время сессии

(заполняется по мере встречи новых блокеров)

---

## 2026-05-28 20:36 — MacBook Claude session update

**Q5 (IL importers) — PARTIAL ANSWER DELIVERED:**

MacBook session ran background web-research agents for the 6 European resin/concrete brands referenced in Q5. Results delivered to:

- `docs/Q5_IL_DISTRIBUTORS_FROM_MACBOOK.md` — concise per-brand summary
- `docs/macbook-handoff/SUPPLIER_OUTREACH_BRIEFS.md` — full outreach briefs with TDS URLs + action plans
- `docs/macbook-handoff/suppliers-research-extract.json` — structured research data (per-supplier _research field)

**Confirmed IL distributors:**
- MC-Bauchemie → **A.Z Marketing Ltd. (Ramle, +972-8-9150190)**
- Ardex / Pandomo → **Harel v'Idan – Hakol L'Binyan (Holon, 058-403-5595)**

**Critical owner-decision flag:**
- Master Builders Solutions was acquired by Sika via MBCC integration in May 2023 (FACTUAL). Listing as a "Sika alternative" is now misleading. iMac already noted this in `articles/comparisons/sika-vs-mapei-vs-mastertop.html` — verify copy aligns.

**Not publicly found (3 brands):** Mapei industrial line, Kerakoll, StoCretec — copy template proposed in `docs/Q5_IL_DISTRIBUTORS_FROM_MACBOOK.md` for honest "no exclusive importer found, here are direct-channel options" framing.

**Part 2 (Altro/Polyflor/Tarkett/Forbo) — coming in ~5 minutes** from a second background agent. Will be delivered to `docs/Q5_IL_DISTRIBUTORS_FROM_MACBOOK_PART2.md`.

**Bonus MacBook handoff in `docs/macbook-handoff/`:**
- `avatars.json` — 5 primary customer avatars (Maya designer, Daniel architect, Yael restaurant, Igor warehouse, Anna villa) with journey + trust triggers + objections + KPIs + linkedSystems
- `systems-p0-extract.json` — 20 systems × P0 schema (applicationConditions, potLife, substrate, slipClass DIN, warranty, jointTreatment, claimVerification per-claim)
- `COMBINED_RESEARCH_REPORT.md` — 200-user simulation + hostile expert review + supplier readiness (Floor.DSGN content strategy reference)

---

## 2026-05-28 20:39 — MacBook Q5 PART 2 delivered

Second agent finished — Altro/Polyflor/Tarkett/Forbo research delivered to `docs/Q5_IL_DISTRIBUTORS_FROM_MACBOOK_PART2.md`.

**Big finding for IL channel mapping:**

| Brand | IL importer | Confirmed? |
|---|---|---|
| Tarkett | **B-Tech Advanced Building Products** (Tel Aviv, 03-9328431, office@btech-floors.co.il) | ✅ confirmed |
| Altro | UK HQ or Dubai ME regional — no IL importer | ❌ specifier-led import |
| Polyflor | Polyflor FZE Dubai (Ahmad Elwakil, aelwakil@polyflorfze.ae) | ❌ no IL importer |
| Forbo | Hebrew marketing site exists but operational via Forbo FZCO Dubai | ❌ no IL importer |

**STRATEGIC NOTE — B-Tech:** carries both **Tarkett vinyl AND Sika micro-topping**. Single IL distributor relationship covering two key brand families. **Worth direct partnership outreach to office@btech-floors.co.il.**

**Q5 closure status across all 11 brands:**
- 4 of 11 confirmed: Sika (Gilar), MC-Bauchemie (A.Z Marketing), Ardex (Harel v'Idan), Tarkett (B-Tech)
- 1 of 11 invalid/owner-decision: Master Builders (Sika-acquired)
- 6 of 11 no IL channel found (specifier-led import via EU/Dubai regional)

Action plan: direct email outreach to manufacturer Sales contacts listed in `Q5_IL_DISTRIBUTORS_FROM_MACBOOK_PART2.md`. Suggested first call: B-Tech (covers two brands at once).

---

## 2026-05-28 20:47 — MacBook substrate-prep research delivered

Substrate preparation technical reference (~17.5 KB, 2,350 words) delivered to `docs/SUBSTRATE_PREP_TECHNICAL_REFERENCE_FROM_MACBOOK.md`.

**Direct support for Wave A substrate cluster (7 P0 pages) in MASTER_PLAN_ENCYCLOPEDIA §3.1:**

| Page | Topics from reference |
|---|---|
| mechanical-prep.html | TOPIC 4 (shot blast / grind / scarification / scabbling / hydro-demo) + TOPIC 1 method→CSP |
| icri-csp-guide.html | TOPIC 1 full (CSP 1-10 table + ICRI 310.2R-2013) |
| moisture-testing.html (extend existing) | TOPIC 2 (F2170 probe depth, equilibration, thresholds + F1869 + why F2170 preferred) |
| adhesion-pull-off.html | TOPIC 3 (ASTM D7234 + EN 1542 + 1.5 MPa min + failure modes A/B/C) |
| repair-before-coating.html | TOPIC 6 Sika line (Sikadur-52, -31 CF, EpoCem, Combiflex, SikaFix HH, MonoTop R2-R4) |
| coastal-chloride-prep.html | TOPIC 7 EN 14629 + 0.4% threshold + FerroGard-903+ |
| defects-handbook.html | TOPIC 5 (laitance, curing residue, oil, hollow, efflorescence, exposed rebar) |

**All 7 pages have direct factual support — no owner-input dependency, no blockers.**

Reference includes verified product TDS URLs (Sikadur-52, Sikadur-31, MonoTop, FerroGard-903+) so iMac claude can cite primary sources directly.

ICRI CSP method-to-profile mapping matches `docs/MASTER_PLAN_ENCYCLOPEDIA §3.1` row 2 exactly.

---

## 2026-05-28 21:00 — Critical findings from MacBook NIGHT_HANDOFF (5-commit deep-dive)

### CRITICAL FACT #1 — BASF/Master Builders is now Sika

Sika acquired MBCC Group (which owned Master Builders Solutions) in **May 2023**. MasterTop / MasterEmaco / MasterSeal product lines are being rebranded INTO Sika. Listing "Master Builders Solutions" as a Sika-independent alternative in our brand catalog is now **factually outdated**.

**Decision needed from owner:**
- (A) Keep BASF/MBS as historical placeholder with footnote "now part of Sika since 2023"
- (B) Replace MBS slot with a true Sika-independent: **Remmers / Flowcrete (RPM Inc.) / Bautech / Sherwin-Williams General Polymers**
- (C) Drop the slot entirely and add Italian/German competitors to fill it

**Recommended: (B) Remmers** — German manufacturer, has industrial line (Epoxy BS 2000, PU 1K), positions as direct Sika competitor in DACH market. Brand page can be added cleanly.

### CRITICAL FACT #2 — Sika TDS corrections from MacBook agent verification

MacBook's background agent verified the Sika TDS data I had used in iMac brand pages against the actual public TDS PDFs. **Significant inaccuracies surfaced** on 5 hero systems:

| System | Was | Now (verified against actual TDS) |
|---|---|---|
| MMA Fast Kitchen | full cure 1 day | **1 HOUR** (MMA is fast!) |
| MMA Fast Kitchen | temp min -25°C | -10°C |
| MMA Fast Kitchen | "Cleantop" product | replaced with Sikafloor Pronto modular |
| Epoxy Terrazzo | full cure 10 days | 4 days (EM-10 TDS) |
| Epoxy Terrazzo | A2fl claim | **REMOVED** — only Bfl-s1 verified |
| PU-Cement Kitchen | temp min 8°C | 10°C |
| PU-Cement Kitchen | pot life 18 min | 25 min |
| PU-Cement Kitchen | ≤6% CM moisture cap | **DROPPED** — PurCem is moisture-tolerant per TDS |
| Quartz Broadcast | pot life 25 min | 30 min |
| Quartz Broadcast | R11 + Bfl-s1 | **downgraded to PENDING** (system-level, not in product TDS) |
| Microtopping | multiple values | **downgraded to PENDING** (component-TDS-only) |

iMac brand pages (`brands/sika-floor.html` if exists) may carry these values verbatim. Need to audit + correct. The honest-gap principle from hostile review: "better to surface pending than misleading verified."

### CRITICAL FACT #3 — Sika brand permission not formally documented

Memory notes "certified applicator" status — but is logo + name use formally documented in writing? If not, even Sika may need to switch to candidate-placeholder mode until docs are collected. Affects all `brands/sika-floor.html`-style pages on launch branch.

### CRITICAL FACT #4 — Two-branch architecture divergence

- iMac (this branch `launch/floordsgn-com-cf`) — hand-written HTML content pages, 50 pages shipped
- MacBook (`platform-foundation`) — data-driven generator approach, JSON-first (avatars.json, systems.json with P0 fields), `supplier-candidate-N.html` pattern (brand names masked publicly until permissions documented)

These two architectures will need to be reconciled. **Decision needed:** which branch becomes primary trunk for launch?
- (A) Merge `platform-foundation` data layer into `launch/floordsgn-com-cf` (keep content pages as primary surface, treat MacBook generator as data backend)
- (B) Migrate launch content pages onto MacBook's generator (rewrite pages as templates feeding from JSON)
- (C) Ship dual: launch branch as content site, platform branch as future replatform

**Recommended: (A)** — minimal disruption, ships fastest, data layer adds verifiable claim badges on existing content pages.

### CRITICAL FACT #5 — Git remote missing on MacBook clone

MacBook reports `~/Desktop/FLOORdsgn/02-live-code` has NO `origin` remote. 5 commits cannot be pushed for iMac to pull. Owner needs to add canonical repo as remote before MacBook progress is mergeable.

### Avatar data available for content targeting

MacBook produced `data/avatars.json` with 10 personas (5 primary + 5 secondary):
- Primary: designer, architect, restaurant owner, warehouse manager, private client
- Secondary: supplier, contractor, engineer, developer, safety officer

Each has demographics, painPoints, decisionCriteria, journey, trustTriggers, objections, KPIs. **High-value input for landing-page copy, role-targeted CTAs, and FAQ pages.** I can mine this on launch branch to write avatar-targeted articles.

---

## 2026-05-29 06:30 IDT — Hebrew translation directive

**Owner directive received 2026-05-29 ~06:00 IDT (via /loop):** Connect with MacBook, translate site to Hebrew, full RTL mirroring, technical Hebrew for designer/architect audience.

**Foundation built by iMac (committed to launch/floordsgn-com-cf):**
1. `he.css` — RTL stylesheet (Frank Ruhl Libre + Heebo Hebrew web fonts, RTL flex/text/grid overrides, mirrored signal-orange card borders, bidi handling for embedded Latin standards)
2. `docs/HEBREW_TERMINOLOGY_GLOSSARY.md` — ~150 entries technical-grade Hebrew for designer/architect register
3. `articles/he/floor-knowledge-index.html` — pilot translation with full RTL + hreflang + LTR-isolated brand spans, snap-verified
4. `docs/macbook-handoff/HEBREW_TRANSLATION_HANDOFF_FROM_IMAC_2026-05-29.md` — handoff plan splitting work between iMac (Tier-1 reference) + MacBook (Tier-2 specialist + encyclopedia + brands)

**Owner decisions pending (don't get blocked — apply best-guess, flag inline):**

1. **Terminology refinement** — several glossary entries marked ⚠️ for owner confirmation:
   - מיקרו-טופינג vs ציפוי מיקרו for "microtopping"
   - "shot blast" — keep as borrowed English term or translate "התזת חרסיות"
   - Several borrowed-vs-native term choices documented in glossary

2. **Hebrew typography convention** — use nikud (vowel marks) on technical terms? Currently default = no nikud (matches IL technical writing). Confirm preference for designer/architect audience.

3. **Hebrew domain strategy** — `.co.il` deferred per [floordsgn_domain_plan_2026-05-23](floordsgn_domain_plan_2026-05-23 memory). When Hebrew content is ready to ship: does .co.il take primary precedence or is Hebrew added to floordsgn.com under `/he/` sub-path? Affects hreflang + sitemap structure.

4. **Scope of Hebrew translation** — full 84-page reference library? Or Tier-1 owner-facing pages first (10-15 pages)? Owner directive sounded comprehensive; iMac is starting with Tier-1 + handing Tier-2 to MacBook. If owner wants different priority, redirect at next check-in.

5. **Hebrew SEO + Google Search Console** — separate Hebrew sitemap.xml + GSC property for he-IL geo-targeting? Affects discoverability in IL Hebrew search.

6. **Hebrew CTAs** — current EN/RU CTAs offer "matched spec within 48 hours". Hebrew version should match same response time + tone register? Owner may want Hebrew-specific CTA copy (more formal, more direct, different value proposition for IL designer/architect audience).

7. **MacBook brand-mask consequence** — MacBook's `platform-foundation` branch masks brand names as "Supplier Candidate N" pending brand permission documentation. iMac Hebrew translations use real brand names (Sika, Mapei, MC-Bauchemie). If two-branch reconciliation goes MacBook-direction, Hebrew translations may need re-masking. Owner decision on brand permission status precedes Hebrew translation scaling.

**iMac translation pace (per `feedback_token_pacing.md`):** ~5-7 minutes per Hebrew page, not the 3-4 minute sprint pace. ~6-8 Tier-1 pages per hour sustainable. Will deliver Tier-1 list (10 pages) by morning if uninterrupted.

**Visual proof:** `_screens/floor-knowledge-index-desktop-2026-05-30T06-25-36.png` shows clean RTL rendering with all bidi cases handled (Hebrew flow, LTR brand spans, mirrored card borders, RTL navigation, footer alignment).
