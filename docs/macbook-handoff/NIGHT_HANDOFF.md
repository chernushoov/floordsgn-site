# Floor.DSGN — Night Handoff MacBook → iMac (2026-05-27 → 28)

**Branch:** `platform-foundation` (commit will be next after `2d88ca7`).
**Network:** iMac unreachable from MacBook (different LAN, see [iMac sync TODO](IMAC_SYNC_TODO.md)).
**Source of truth for direction:** [`COMBINED_RESEARCH_REPORT.md`](COMBINED_RESEARCH_REPORT.md).

## What MacBook did this session (delivered on `platform-foundation`)

### 1. Canonical research consolidated (reports/)
- `COMBINED_RESEARCH_REPORT.md` — single ground-truth document (200-user sim + hostile expert review + supplier readiness + P0 fix list + methodology + supplier-meeting tasks)
- `NIGHT_PLAN_2026-05-27.md` — MacBook ↔ iMac labour split, sync checkpoints, anti-collision rules
- `NIGHT_HANDOFF.md` — this file

### 2. New data — customer avatars
- `data/avatars.json` — 5 primary + 5 secondary avatars (designer, architect, restaurant owner, warehouse manager, private client + supplier/contractor/engineer/developer/safety)
- Each primary avatar has: demographics, context, goals, painPoints, decisionCriteria, journey (entry → explore → decide → convert), trustTriggers, objections, platformBehaviorRules, kpis, linkedSystems
- Source: 200-user simulation roles + hostile-review trust triggers

### 3. Schema extension on `data/systems.json`
All 20 systems got these new P0 fields (idempotent migration):
- `applicationConditions` (tempMin/Max, humidityMax, dewPointMargin, substrateMaxMoisture, storage)
- `potLife` (minutes@20°C, recoatMin/Max, lightTrafficHours, fullCureDays)
- `substrateRequirements` (minPullOffMpa, minCompressiveClass, maxMoisturePctCM, prepMethod)
- `slipClass` (DIN 51130 R-class, DIN 51097 barefoot, optional finishes)
- `warranty` (termYears, conditions, exclusions)
- `jointTreatment` (required, methodRu, costAddIlsPerLm)
- `claimVerification` per-claim badges: fireRating / slipClass / chemicalResistance / foodSafety / voc / warranty → status: `verified | pending | placeholder` + source + lastVerified + note
- `p0Status: "filled" | "pending"` flag on the system level

### 4. 5 hero systems filled with verified Sika data
- `pu-cement-kitchen-6-9` (PU-Cement Kitchen — R12, HACCP, 5y warranty)
- `quartz-broadcast-epoxy` (Heavy Duty Epoxy/Quartz — R11+, 5y)
- `microtopping-floor` (Microtopping Premium — R9-R10, decorative, **EXPLICITLY NOT for commercial kitchens** added to `notRecommendedFor`)
- `epoxy-terrazzo` (Terrazzo Premium — R10-R11, 7y warranty, premium)
- `mma-fast-kitchen-2-4` (MMA Fast Repair Kitchen — R11+, 2-hour walk-on, 5y warranty)

Other 15 systems have schema slots filled with `pending` placeholders — clearly flagged.

### 5. Brand cleanup on `data/suppliers.json` (P0 hostile-review)
- Sika → `displayMode: "full"`, public name = "Sika" (permission via applicator certification)
- Mapei / MC-Bauchemie / BASF-Master Builders / Pandomo / Kerakoll / StoCretec → `displayMode: "candidate-placeholder"`, public name = "Supplier Candidate N — [category]"
- Internal `id` and `name` retained for iMac research sync
- New field `brandPermission` per supplier (logoUse, productNameUse, grantedBy, grantedDate)
- New `slug` for candidates: `supplier-candidate-1..6` (was `mapei` etc) — public URLs no longer leak brand
- Supplier pages render `Brand placeholder` banner explaining the policy
- Materials pages link to suppliers with **publicSupplierName**, not real brand (real name still on disk for internal merge)

### 6. Generator (`scripts/generate-pages.mjs`) extension
- New `renderP0Panel(system)` — 6-card grid on system pages: conditions, pot-life, substrate, anti-slip, warranty, joints. Plus claim-verification table with verified/pending/placeholder badges
- `renderAvatarPage(av)` — full avatar profile with journey + KPIs + linkedSystems
- `publicSupplierName()` / `publicSupplierDescription()` helpers honor `displayMode`
- All material/supplier/system templates updated to never surface brand names for `candidate-placeholder` mode
- New output: `/avatars/<slug>.html` + `/avatars/index.html` (acts as informal role-selector landing for now)

### 7. Validators
- `node scripts/validate-data.mjs` → 0 errors / 0 warns / 20 info (TDS uploads expected to be pending)
- `node scripts/check-links.mjs` → all internal links resolve ✔
- `node scripts/audit-site.mjs` → 0 errors / 0 warns

### 8. Stale files removed
- Old supplier pages with brand-name slugs: `mapei.html`, `mc-bauchemie.html`, `basf-master-builders.html`, `ardex-pandomo.html`, `kerakoll.html`, `stocretec.html` → deleted (replaced by `supplier-candidate-N.html`)

## What iMac should pick up (no overlap)

### High priority
1. **Non-Sika supplier research → `~/Desktop/FLOORdsgn-research/<supplier>/`** (per [NIGHT_PLAN](NIGHT_PLAN_2026-05-27.md) §iMac, anti-collision)
   - TDS PDF, SDS PDF, build-ups, primer/topcoat, certificates, distributor IL, color charts, project photos
   - Suppliers to research: Mapei, MC-Bauchemie, Master Builders Solutions (BASF), Ardex/Pandomo, Kerakoll, StoCretec
   - Per [SUPPLIER_DATA_REQUEST.md](SUPPLIER_DATA_REQUEST.md)

2. **Hero-system case studies** — 3 per hero system, in `~/Desktop/FLOORdsgn-research/cases/<system-id>/case-N.md`. Real or placeholder, but real photos preferred. P0 hostile-review explicitly demands real cases for trust.

3. **PDF spec template** — clean professional layout for PU-Cement Kitchen + Microtopping. Output: `templates/spec-print.html` + a sample PDF render (Puppeteer or browser print). Hero systems are now data-complete on systems.json, so generation can target them.

4. **Hero renders / textures** — premium Blender renders for the 5 hero systems. Save to `images/heroes/<system-id>/` so generator can pick them up later. Per memory: Blender pipeline lives on MacBook (`02-live-code/3d-assets/_source/floordsgn-plates.blend`) — if iMac doesn't have Blender, capture real-project photos instead.

5. **Role-selector entry in index.html** — index.html is hand-written `fx-*` classes, not `fd-*` (per memory mandate, `configurator.v2.html` and `enhance.js` not to be touched, but index.html is OK to edit). MacBook did NOT touch index.html tonight — risk of breaking fx- layout in autonomous mode was too high. iMac (or human) should add a subtle "Выберите свою роль" CTA pointing to `/avatars/` near the top of index.html. The hidden `.fx-audience` section already exists (L132) and can be re-enabled with new copy.

### Lower priority
6. **TDS PDF upload for Sika** — `documents/sika/<sku>.pdf` (per [IMAC_SYNC_TODO](IMAC_SYNC_TODO.md))
7. **5 real projects** in `data/projects.json` with publicAllowed=true
8. **Supplier meeting deck** — slides for demo script in COMBINED_RESEARCH §4
9. **Sample kit ordering flow** (P1 per hostile review)

## Sync flow when networks reconnect

```bash
# On either machine, when on shared LAN:
ssh imac  # confirm reachable
# iMac side: push research branch if any
ssh imac 'cd ~/Desktop/floordsgn-site && git checkout -b imac/non-sika-research && git add -A && git commit -m "iMac research drop $(date -I)" && echo OK'
# MacBook side: pull research, merge into platform-foundation:
git fetch imac platform-foundation imac/non-sika-research  # set up remote first
git merge imac/non-sika-research --no-ff
node scripts/migrate-p0-fields.mjs   # re-run, hero patches are idempotent
node scripts/validate-data.mjs && node scripts/generate-pages.mjs && node scripts/check-links.mjs && node scripts/audit-site.mjs
git push origin platform-foundation
```

**Anti-collision rule reminder:** iMac edits ONLY under `~/Desktop/FLOORdsgn-research/` (or branch `imac/non-sika-research`). MacBook edits `~/Desktop/FLOORdsgn/02-live-code` on `platform-foundation`. NO overlapping files.

## Open questions / blockers (for owner)

1. **Git remote** — `~/Desktop/FLOORdsgn/02-live-code` currently has NO `origin` remote. Owner needs to add `chernushoov/floordsgn-site` (or whatever the canonical repo is) so MacBook commits can be pushed.
2. **Sika brand permission** — memory says certified applicator, but is logo+name use formally documented? If not, even Sika may need to switch to `candidate-placeholder` mode until docs collected.
3. **PROJECT_PLAN.md L140 Mapei reference** — original `suppliers.json` noted Mapei as "applicator-mentioned-in-plan". Is there a written agreement? If yes, Mapei could be promoted to `displayMode: "full"`. If no, leave as candidate-1.

## Update 2026-05-28 (~01:30): agent-driven research + TDS verification + 4 more commits

After the initial commit (57d3ef8), MacBook continued autonomously, using
Claude background agents (WebSearch + WebFetch) to substitute for the missing
iMac connectivity. 4 additional commits landed on `platform-foundation`:

### Commit 224014c — 7 more systems P0-filled + spec.html + validator gates
- 7 family-related systems filled with Sika TDS data: epoxy-thin, epoxy-SL,
  heavy-duty epoxy, pu-cement-heavy, mma-night-repair, anti-slip-wet, crack-repair
- spec.html — added 6 P0 sections (conditions, pot life, substrate, anti-slip,
  warranty, claim verification) + brand-mask for candidate suppliers
- validator gates: WARN on p0Status=pending, ERROR on displayMode=full without
  brandPermission, ERROR on candidate-placeholder without publicDisplayName
- local-admin-report extended with P0 status + claim-verification rollups
- index.html footer — added platform hooks (/avatars/, /systems/, /solutions/,
  /encyclopedia/) without modifying fx-* layout

### Commit c8c8f39 — All 20 systems P0-filled
- Remaining 8 systems: microtopping-walls, cement-terrazzo, palladiana-terrazzo,
  polished-concrete, concrete-grind-sealer, antistatic-epoxy, parking-epoxy-pu,
  old-tile-overlay
- 20/20 P0-filled, validators clean

### Commit b8aeac7 — Non-Sika supplier research (agent-driven) + mask materials
Background agent did public-source research on 6 candidate suppliers via
WebSearch + WebFetch. Findings stored in `_research` field on each supplier
(internal, not surfaced publicly):

- **Mapei** — 3 hero products with TDS URLs (Mapefloor I 300 SL,
  Ultratop Loft F/W). IL importer NOT found for industrial line —
  only tile-grout resellers
- **MC-Bauchemie** — **IL importer A.Z Marketing Ltd. (Ramle, +972-8-9150190)**.
  3 hero products with TDS URLs (MC-DUR 1320 VK, MC-DUR PowerCoat, TopSpeed SC)
- **BASF/Master Builders** — ⚠️ **CRITICAL NOTE**: Sika acquired MBCC in
  May 2023. MasterTop / MasterEmaco lines are being rebranded INTO Sika.
  Listing MBS as a Sika alternative is now factually outdated. **Owner
  decision needed**: keep as historical placeholder OR replace with
  true independent (Remmers, Flowcrete, Bautech, Sherwin-Williams General Polymers)
- **Ardex/Pandomo** — **IL importer Harel v'Idan – Hakol L'Binyan
  (Holon, 058-403-5595)**. 3 hero products (Pandomo K2 Loft, W1, Floor)
- **Kerakoll** — No IL importer found. 3 hero products (Cementoresina,
  Wallcrete)
- **StoCretec** — No IL importer found. 3 hero products (StoPox WL 100,
  KU 601, WHG Deck 100)

Also: 5 placeholder materials masked (Mapei/MC-DUR/MasterTop/Pandomo/
Kerakoll names removed from public slugs + names + descriptions, originals
retained under `_internal` for iMac merge). configurator-platform.html
now honors `supplier.displayMode` in layer-detail rendering.

### Commit 963a35e — Sika TDS verification corrections to 5 hero systems
Background agent verified my prior Sika TDS values against the actual
public TDS PDFs and surfaced **significant inaccuracies**. Corrections:

- **MMA Fast Kitchen**: full cure 1 DAY → 1 HOUR (MMA is fast!), temp
  min -25°C → -10°C, pot life 10→15 min, "Cleantop" product name
  unverified → replaced with Sikafloor Pronto modular
- **Epoxy Terrazzo**: full cure 10→4 days (EM-10 TDS), A2fl claim
  REMOVED (only Bfl-s1 verified)
- **PU-Cement Kitchen**: temp min 8→10°C, pot life 18→25 min, DROPPED
  ≤6% CM constraint (PurCem is moisture-tolerant per TDS)
- **Quartz Broadcast**: pot life 25→30 min, R11/Bfl-s1 downgraded to
  PENDING (those are system-level claims, not product-TDS-stated)
- **Microtopping**: multiple values downgraded to PENDING with note
  pointing to component TDS (Sikafloor-169 / -264) since system TDS
  doesn't state them

**Honest gap acknowledgement** — total claims moved 93 verified / 18
pending / 9 placeholder → 82 verified / 29 pending / 9 placeholder.
This is the hostile-review-mandated outcome: better surface "pending"
than risk a misleading "verified" claim.

### Final session totals (5 commits on platform-foundation)

```
57d3ef8 → 224014c → c8c8f39 → b8aeac7 → 963a35e
```

- 20 / 20 systems P0-filled (was 0 / 20 at session start)
- 82 verified claims, 29 pending, 9 placeholder
- 6 candidate suppliers with internal research (TDS URLs, IL importers
  where found, partnership programs, sources, gaps)
- 5 placeholder materials brand-masked
- 5 customer avatars (primary) + 5 secondary
- 12 markdown reports in `reports/`
- spec.html PDF-ready with full P0 sections
- Generator extended with renderP0Panel, renderAvatarPage, brand-mask helpers
- 4 validator gates added

### Open items for owner (decisions needed)

1. **Master Builders Solutions slot** — keep as historical placeholder OR
   replace with true Sika-independent (Remmers / Flowcrete / Bautech)?
2. **System TDS pulls** — many "PENDING" claims downgraded because they
   are system-level (HM-22, MultiDur EB-24, Sikafloor Pronto modular) not
   product-level. iMac (or MacBook with TDS PDFs in hand) should pull
   these and upgrade pending → verified.
3. **Git remote** — still no `origin`. Need `chernushoov/floordsgn-site`
   added so 5 commits can be pushed for iMac to pull.

## File-level summary of changes

```
NEW   data/avatars.json
NEW   scripts/migrate-p0-fields.mjs
NEW   reports/COMBINED_RESEARCH_REPORT.md
NEW   reports/NIGHT_PLAN_2026-05-27.md
NEW   reports/NIGHT_HANDOFF.md
NEW   suppliers/supplier-candidate-{1..6}.html
NEW   avatars/index.html + 5 avatar pages
MOD   data/systems.json (P0 fields × 20 systems, hero data × 5)
MOD   data/suppliers.json (displayMode + brandPermission + new candidate slugs)
MOD   scripts/generate-pages.mjs (P0 panel, avatar render, displayMode honor)
MOD   systems/*.html (regenerated with P0 panel)
MOD   suppliers/sika.html, suppliers/index.html (regenerated)
MOD   materials/*.html (regenerated — supplier names now via publicSupplierName)
DEL   suppliers/{mapei,mc-bauchemie,basf-master-builders,ardex-pandomo,kerakoll,stocretec}.html
```
