# Substrate Preparation Technical Reference (from MacBook agent, 2026-05-28 20:45)

**Author:** MacBook Claude session, background web-research agent.
**For:** iMac agent — direct support for **Wave A substrate preparation cluster** (7 pages, P0) in `docs/MASTER_PLAN_ENCYCLOPEDIA_2026-05-27.md` §3.1.
**Method:** WebSearch + WebFetch on ICRI 310.2R-2013, ASTM F2170/F1869/D7234, EN 1542/1504, Sika regional TDS, Husqvarna/Blastrac/Trelawny production data.

This is **research-only**: structured facts, citations, and values. iMac claude writes the prose, persona framing, and bilingual RU/EN copy per the master plan.

---

## TOPIC 1 — ICRI CSP 1–10 Profile Guide

**Standard:** ICRI Technical Guideline No. 310.2R-2013 — "Selecting and Specifying Concrete Surface Preparation for Sealers, Coatings, Polymer Overlays, and Concrete Repair." Citation: ICRI store + DeFelsko CSP chip reference.

### CSP → coating system matrix

| CSP | Description | Coating system fit |
|---|---|---|
| **1** | Acid-etched, near-smooth | Sealers, thin-films <3 mil (penetrants, dust-proofers) |
| **2** | Light acid etch / light grinding | Thin films, sealers (3–6 mil) |
| **3** | Light shot blast / grinding | High-build coatings (4–10 mil) |
| **4** | Light scarification / grinding | Thin polymer overlay 10–40 mil |
| **5** | Medium shot blast | Self-leveling overlays, primers for thick systems |
| **6** | Medium scarification / medium shot blast | Polymer overlays 40–100 mil (≈1–2.5 mm) |
| **7** | Heavy abrasive blast / heavy scarification / surface retarder | Polymer overlays / repair >¼″ (6 mm) |
| **8** | Scabbling / heavy abrasive blast / HP water jetting | Repair mortars, heavy overlays |
| **9** | Heavy scabbling / hydro-demolition | Structural repair, bonded overlays |
| **10** | Hydro-demolition / heavy mechanical | Aggressive removal (added in 2013 revision, amplitude >6 mm / ¼″) |

### Method → CSP achieved

- Acid etching → CSP 1–3
- Diamond grinding → CSP 1–3 (FLOOR.DSGN epoxy primers typically target CSP 2–3)
- Shot blast → CSP 2–7 (light to heavy)
- Scarification → CSP 4–7
- Needle scaler / light scabbler → CSP 4–6
- Scabbling → CSP 7–9
- Hydro-demolition (HPWJ) → CSP 8–10

**Pass/fail:** Visual + tactile comparison against ICRI rubber CSP chips. Coating manufacturer TDS dictates required CSP. Under-profile = adhesion risk. Over-profile = pinholing + over-consumption.

**Sources:**
- https://store.icri.org/item/3102r2013-english-pdf-selecting-concrete-surface-preparation-sealers-coatings-polymer-overlays-concrete-repair-342521
- https://www.defelsko.com/csp
- https://www.icri.org/wp-content/uploads/2024/04/CRBMayJun14_WInkler.pdf

---

## TOPIC 2 — ASTM F2170 (in-situ RH) vs ASTM F1869 (CaCl₂ MVER)

**Standards:** ASTM F2170-19a (in-situ probes); ASTM F1869 (anhydrous CaCl₂ moisture-vapor emission rate).

### ASTM F2170 key values

- **Probe depth: 40% of slab thickness** for slabs drying from one side (slab-on-grade with vapor retarder)
- **20% of slab thickness** for slabs drying from both sides (suspended/elevated)
- **Hole equilibration: minimum 24h sealed** before reading (per 2019a; older 2011 required 72h)
- Test ambient: 65–85°F, 40–60% RH
- Sample rate: 3 probes for first 1,000 ft² + 1 per additional 1,000 ft²
- Typical coating thresholds: **≤75% RH** (epoxy/resin), **≤80–85% RH** (vapor-tolerant / Sikafloor EpoCem)

### ASTM F1869 key values

- **Test duration: 60–72h** in sealed dish
- Coverage: 3 tests / first 1,000 ft² + 1 per additional 1,000 ft²
- Reported as **lb H₂O / 1,000 ft² / 24h** (MVER)
- Typical max for adhesives/resilient: **3 lb / 1,000 ft² / 24h**; some epoxies **5 lb max**

### Why F2170 is preferred

F1869 only measures the top 12–19 mm; surface conditioning skews results. F2170 measures internal slab RH at 40% depth — represents long-term equilibrium moisture once the slab is sealed. F1869 cannot be used on lightweight aggregate concrete or surface-treated slabs; may understate risk by **50%+ for moisture-barrier decisions**.

**Pass/fail:** Coating/adhesive manufacturer TDS dictates. Common: F2170 ≤75% RH OR F1869 ≤3 lb/1,000 ft²/24h.

**Sources:**
- https://store.astm.org/f2170-19a.html
- https://store.astm.org/f1869-03.html
- https://ifti.com/astm-f2170-vs-f1869-which-moisture-test-fits-your-project/
- https://www.wagnermeters.com/concrete-moisture-test/concrete-info/test-moisture-concrete-floors/
- https://tramexmeters.com/moisture-testing/concrete/in-situ-concrete-rh-test-ASTM-F2170

---

## TOPIC 3 — ASTM D7234 / EN 1542 Pull-Off Adhesion

**Standards:** ASTM D7234-21 (concrete coatings, portable testers); EN 1542:1999 (protection & repair of concrete structures — bond strength by pull-off).

### Equipment

- DeFelsko PosiTest AT-A / AT-M
- Proceq DY-2
- Elcometer 510
- Germann BOND-TEST
- Loading rate per EN 1542: **0.05 ± 0.01 MPa/s** (constant) until failure

### Procedure

1. Surface prep + cure the coating
2. Bond 50 mm dolly with rapid epoxy (Sikadur-31 or 2-part fast cyanoacrylate per tester maker)
3. Core through coating + ~10–15 mm into substrate using diamond core bit (partial-depth)
4. Attach tester, apply perpendicular tension at 0.05 MPa/s
5. Record peak stress (MPa) + failure mode

### Pass criteria (typical — verify against project spec)

| Application | Min pull-off |
|---|---|
| Epoxy / PU resin floor systems | **≥1.5 MPa (217 psi)** (EN 1504-2 Principle 5 / EN 1542) |
| EN 1504-3 R1/R2 mortar | ≥0.8 MPa |
| EN 1504-3 R3 mortar | ≥1.5 MPa |
| EN 1504-3 R4 mortar | ≥2.0 MPa |
| ACI 503R minimum | ≥200 psi (≈1.4 MPa) with substrate failure |

Sikafloor system TDS frequently spec: **≥1.5 N/mm² with concrete-substrate failure mode**.

### Failure mode codes

- **A** — substrate cohesive (in concrete) → pass if value ≥ min; preferred mode
- **A/B** — adhesion at substrate/primer interface → prep failure (laitance, contamination, low CSP)
- **B** — primer cohesive
- **B/C** — primer/topcoat interface
- **C** — coating cohesive → coating quality / over-thinned
- **-/Y** — glue failure (test invalid, re-run)

**Sources:**
- https://store.astm.org/d7234-21.html
- https://www.defelsko.com/positest-at
- https://www.icri.org/wp-content/uploads/2024/04/CRBJulAug12_Courard-etal-1.pdf

---

## TOPIC 4 — Mechanical Preparation Methods Comparison

### Shot blast

- Equipment: Blastrac/Husqvarna **1-10DPS75** (10″/250 mm); 1-15DSGI (15″); ride-on 1-10DLP
- Production: **~120 m²/h (1,290 ft²/h)** for 1-10DPS75 light pass; heavy/profile pass ~30–60 m²/h
- CSP: **2–7** (steel-shot size + travel speed)
- Dust: integrated HEPA vac; near-dust-free
- Use: large open floors, deck profiling, coating removal pre-coat

### Diamond grinding

- Equipment: Husqvarna **PG 450** (18″/450 mm, 1-phase 230V); **PG 680** (27″/680 mm, 3-phase, 10.6 kW, Dual-Drive); **PG 820** (32″/820 mm, 3-phase)
- Production (coating removal, metal-bond):
  - PG 450 ~10–15 m²/h
  - PG 680 ~25–40 m²/h
  - PG 820 ~40–60 m²/h
  - (verify against current Husqvarna production-rate sheet)
- CSP: **1–3**
- Use: smooth profiling for thin films, polishing, transitions/edges, removing glue/paint where shot blast not feasible (indoors, occupied); levels minor undulation

### Scarification (milling/planing)

- Equipment: **Trelawny TFP200** (195 mm width, max 3 mm depth/pass, TCT cutters)
- CSP: **4–6**
- Removal: up to 3 mm/pass
- Use: trip-hazard removal, thick coating stripping, transition tapering

### Scabbling

- Equipment: Trelawny TCB / TF / multi-head pneumatic scabbler (3-, 4-, 7-head)
- CSP: **6–9**
- Removal: up to 5–10 mm/pass, heavy aggressive
- Use: laitance + contaminated concrete + spalled deck repair preparation

### Hydro-demolition

- Equipment: 700–2,500 bar HP water jet (Aquajet, Conjet) — covered by **ICRI 310.3R-2014**
- CSP: **7–10**
- Use: large bridge decks, contaminated/chloride-laden concrete, selective removal preserving sound concrete + rebar; no micro-cracking vs mechanical breakers
- Trade-off: water management, slurry containment

**Sources:**
- https://jordanpower.com/product/blastrac-1-10dps75-shot-blaster/
- https://www.husqvarnaconstruction.com/ae/floor-grinders/pg680rc/
- https://trelawny.com/p/tfp200-floor-scarifier/
- https://www.icri.org/wp-content/uploads/2024/04/CRBSeptOct14_Winkler.pdf

---

## TOPIC 5 — 6 Concrete Substrate Defects Checklist

**Standards:** ICRI 310.2R-2013, ACI 503R "Use of Epoxy Compounds with Concrete", ASTM D4580 (sounding), EN 14629 (chlorides).

### 1. Laitance

- **Def:** weak friable layer of cement paste + fines drawn to surface by bleed water during placing/curing
- **Detection:** scratch test (steel screwdriver removes powder); pull-off <1.0 MPa with cohesive substrate failure in top 1–2 mm
- **Removal:** shot blast / grinding / scarification (NOT acid etch alone — leaves softened gel)

### 2. Curing-compound residue

- **Def:** membrane curing compounds seal pores, block bonding
- **Detection:** water bead test (drops don't wet surface within 30s); UV inspection (some compounds fluoresce)
- **Removal:** mechanical (shot blast / grinding) — solvent wipe alone insufficient

### 3. Oil / grease contamination

- **Detection:** water bead test, dark staining, repellence
- **Removal sequence (ACI 503R):**
  1. Hot detergent scrub + low-pressure rinse
  2. Emulsifying degreaser / poultice (sodium metasilicate / TSP, or commercial citrus degreaser) for deep penetration
  3. Mechanical removal (shot blast / grinding) of remaining contaminated layer
  4. Re-test with water bead
- **Deep oil:** may need full removal to 6–25 mm depth

### 4. Hollow areas / delamination

- **Detection:** **ASTM D4580** chain-drag (Procedure B) or hammer sounding — dull/drum sound (1–3 kHz audible range) flags delamination
- Mark perimeter with chalk
- **Repair:** small voids → epoxy injection (Sikadur-52); large → saw-cut perimeter, chip out to sound concrete, partial-depth replacement with R3/R4 mortar (Sika MonoTop-412/4012) with bonding primer (MonoTop-1010)

### 5. Efflorescence

- **Cause:** dissolved calcium hydroxide + soluble salts migrate to surface via capillary action, evaporate as CaCO₃ / sulphate crystals
- **Removal:** dry brush light deposits; heavy → diluted **phosphoric acid 1:9 in water** (preferred over muriatic) followed by neutralization wash, then rinse + dry
- **Prevention:** fix moisture source first (vapor retarder, drainage), low-alkali cement, silane/siloxane penetrating sealer, EpoCem moisture barrier before topcoat

### 6. Exposed / corroded rebar

- **Detection:** visual + sounding around bar; chloride profile per **EN 14629** (acid-soluble) or ASTM C1152
- **Treatment:**
  1. Expose bar 360° + 20 mm behind
  2. Grit-blast to **SA 2½** (ISO 8501-1)
  3. Brush 2 coats Sika MonoTop-1010 (EN 1504-7) or SikaTop Armatec-110 EpoCem
  4. Apply R3/R4 repair mortar
- **For at-risk uncorroded bar:** surface-applied corrosion inhibitor **Sika FerroGard-903+** (EN 1504-9 / Principle 11)

**Sources:**
- https://www.icri.org/wp-content/uploads/2024/04/CRBMayJun14_WInkler.pdf
- https://store.astm.org/d4580-23.html
- https://www.graco.com/us/en/contractor/solutions/articles/concrete-surface-prep-part-2-oil-grease-dirt.html

---

## TOPIC 6 — Crack & Repair Products (Sika line, EN 1504)

### Sikadur-52 Injection Normal — low-viscosity epoxy injection

- Viscosity: ~290 mPa·s (Normal); LP variant ~20 mPa·s — verify regional TDS
- Pot life @ 20°C: ~25–30 min (Normal)
- Mix ratio: 2:1 by volume (A:B) — varies by region
- Tensile strength: ~37–50 MPa; compressive: ~52–60 MPa (7-day)
- Min crack width: 0.2–0.5 mm (dry or damp)
- Standard: **EN 1504-5**
- TDS: https://industry.sika.com/dam/dms/ie01/r/sikadur_-52_injectionnormal.pdf

### Sikadur-31 CF Normal — thixotropic structural epoxy paste adhesive

- Pot life: ~120 min @ 10°C, ~60 min @ 20°C, ~30 min @ 35°C
- Mix ratio: 2:1 by volume (100:32 by weight)
- Compressive strength: ~70 MPa; bond to concrete: > concrete tensile (substrate failure)
- Application thickness: up to 30 mm vertical (non-sag)
- Use: dolly bonding for pull-off tests, structural bonding, dowel grouting, surface seal for crack injection
- Standard: **EN 1504-4**
- TDS: https://aus.sika.com/dam/dms/au01/k/sikadur_-31_cf_normal.pdf

### Sikafloor-81/-82 EpoCem — 3-component temporary moisture barrier

- Use when substrate moisture >4% (by mass, Tramex CME) and full drying not feasible, or RH >75%
- Apply 1.5–3 mm (81) or 2–3 mm (82, smoother)
- Cures for resin topcoat in ~24h
- Standard: EN 1504-2 (surface protection) / EN 13813 SR
- Index: https://usa.sika.com/en/construction-products/flooring/flooring-productsbysystem/moisture-mitigation/

### Sikadur-Combiflex SG System — high-movement joint sealing

- FPO (flexible polyolefin) tape (10/15/20/25 mm widths) bonded with Sikadur-31 CF
- Tolerates extreme movement / multi-axial including moving cracks
- TDS: https://gbr.sika.com/content/dam/dms/gb01/p/sikadur-combiflexsgsystem.pdf

### SikaFix HH (Hydrophilic) — PU injection foam for active leaks

- Free-foam expansion ~6× liquid volume on water contact
- Closed-cell flexible cured product, seals moving cracks and active water flow
- Use: stop leaks before structural epoxy injection
- TDS: https://usa.sika.com/dam/dms/us01/2/sikafix_hh_hydrophilic.pdf

### Sika MonoTop range (EN 1504-3 cementitious repair mortars)

| Class | Example SKU | Compressive | Pull-off | Type |
|---|---|---|---|---|
| R2 | MonoTop-352 N/W | ≥15 MPa | — | Non-structural |
| R3 | MonoTop-615 / -3020 | ≥25 MPa | ≥1.5 MPa | Light structural |
| R4 | MonoTop-412 S / -4012 | ≥45 MPa | ≥2.0 MPa | Structural |

Index: https://www.sika.com/content/dam/dms/corporate/z/glo-concrete-repair-protection-en-1504.pdf

---

## TOPIC 7 — Coastal / Chloride Substrate

### Standards

- **ASTM C1152/C1152M** — Acid-soluble chloride in mortar and concrete (total Cl⁻)
- **ASTM C1218** — Water-soluble chloride (free Cl⁻ available for corrosion)
- **EN 14629:2007** — Determination of chloride content in hardened concrete (acid-soluble, by mass of binder/cement)

### Corrosion-risk thresholds (Cl⁻ by mass of cement)

| Threshold | Application |
|---|---|
| **≥0.4%** | Conservative corrosion-initiation for ordinary reinforced concrete (EN 206 CL 0.40) |
| **≥0.2%** | Limit for prestressed concrete (EN 206 CL 0.20) |
| 0.05–0.10% | Background "safe" level |
| Research β-mean: 0.6% (range 0.2–2.0%) | Actual initiation depends on carbonation depth, RH, cover, cement type |

### Sampling

Dust samples drilled at multiple depths (e.g. 0–10, 10–20, 20–30, 30–40 mm) → diffusion modelling for service life.

### Remediation sequence

1. Remove all chloride-contaminated concrete to depth where Cl⁻ < threshold (hydro-demolition preferred — preserves bond + no micro-cracking)
2. Sandblast exposed rebar to SA 2½ (ISO 8501-1)
3. Apply anti-corrosion bonding primer: **Sika MonoTop-1010** (EN 1504-7, 2 coats brush, ~2 mm total)
4. Optional surface-applied inhibitor on adjacent uncontaminated concrete: **Sika FerroGard-903+** (EN 1504-9 Principle 11, method 11.1 — control of anodic areas). Spray/roller, min 2 coats, ≥1h between coats; supply rate per TDS ~300–500 g/m² total
5. Reprofile with EN 1504-3 R3/R4 mortar (MonoTop-412/4012)
6. Surface protection coating (EN 1504-2) for chloride / carbonation barrier

### Product TDS

- Sika FerroGard-903+: https://gbr.sika.com/dam/dms/gb01/t/sika-ferrogard-903-plus.pdf
- Sika MonoTop-1010: https://industry.sika.com/dam/dms/dk01/v/sika-monotop-1010.pdf (Jan 2026 v04.01)

---

## Caveats for the iMac writing pass

- **Sikadur-52 viscosity / pot life:** Sika sells "Normal" and "LP" (long pot life) variants; numbers differ between regional TDS (US, IE, GCC). For RU/coastal-climate articles cite the **regional Sika RU/EU TDS** the contractor will actually buy.
- **EN 1542 minima:** 1.5 MPa is the most-cited spec for resin-substrate bond; EN 1504-3 mortar minima vary by class. Confirm against project Principle (5, 7, 11 etc.) being claimed.
- **Husqvarna PG production rates:** ranges quoted are common field rates; cite Husqvarna's official production-rate sheet by URL and let the writer fill exact m²/h per material removed.
- **CSP-to-method mapping:** the mapping above (acid etch → CSP 1–3, grinding → CSP 1–3, scarification → CSP 4–7, shot-blast → CSP 2–7, scabbling → CSP 7–9, hydro-demo → CSP 8–10) is consistent with ICRI 310.2R-2013 narrative and is the safe spec to use for the articles.

## Page-by-page mapping to Master Plan §3.1

| iMac page | Topics from this reference |
|---|---|
| 1. mechanical-prep.html | TOPIC 4 (all 5 methods) + TOPIC 1 method→CSP mapping |
| 2. icri-csp-guide.html | TOPIC 1 (full) + bridge to TOPIC 4 |
| 3. moisture-testing.html (extend existing) | TOPIC 2 (F2170 + F1869 + comparison) |
| 4. adhesion-pull-off.html | TOPIC 3 (ASTM D7234 + EN 1542 + failure modes) |
| 5. repair-before-coating.html | TOPIC 6 (Sika line) + TOPIC 5 (delamination repair) |
| 6. coastal-chloride-prep.html | TOPIC 7 (full) + TOPIC 5 (exposed rebar) + Sika FerroGard |
| 7. defects-handbook.html | TOPIC 5 (6 defects) |

All 7 P0 substrate pages have direct factual support from this reference. No owner-input dependency.
