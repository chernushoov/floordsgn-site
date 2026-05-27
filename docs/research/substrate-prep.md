# Substrate Preparation for Seamless Floor Installation — Research Brief

**Scope.** Engineering reference for a customer-facing guide aimed at Israeli clients (residential, commercial, industrial). Covers every step that happens between "bare concrete slab" and "coating/overlay goes on" — mechanical and chemical preparation, ICRI CSP standards, substrate testing, repair, defect handling, and IL-specific considerations.

**Audience translation note.** This file is the technical substrate; the public guide will translate measurements, test names, and product codes into plain language. Keep all numbers, standard codes, and product names verbatim — they are load-bearing for procurement and warranty claims.

**Why this matters.** Roughly 80% of seamless-floor failures originate in the substrate, not the topping. Adhesion failure, bubbling, delamination, blistering, and pinholes are almost always traceable to skipped or wrong preparation. Selecting the right preparation method is a function of (a) substrate condition, (b) coating chemistry, (c) required surface profile, and (d) site constraints (dust, noise, height, headroom). See ICRI Technical Guideline 310.2R-2013 for the canonical decision tree.

---

## 1. Mechanical Preparation Methods

Mechanical preparation removes weak/contaminated surface concrete and exposes a clean, sound, profiled substrate. It is the only universally accepted method modern coating manufacturers will warrant.

### 1.1 Shot blasting (steel-shot abrasion)

A centrifugal wheel throws steel shot (S110–S660 sizing) at the floor at high velocity. The shot impacts, rebounds, is captured, separated from dust/debris in a cyclone, and recycled. The whole process runs in a closed loop — virtually dust-free.

- **Achievable CSP.** Shot size and machine speed determine profile. Small shot → CSP 3; medium → CSP 4–6; large shot or slow pass → CSP 7–8. Source: [Shot Blast Inc. Preparation Guide](https://shotblastinc.com/wp-content/uploads/Shot-Blast-Preparation-Guide-2015.pdf).
- **Typical machines.** Blastrac (1-8DM, 1-15D, 1-30D), Diamatic, Skidabrader. Blastrac 1-8DM = 8-inch path, single-phase, residential/light commercial. Blastrac 1-15D and larger = three-phase, industrial throughput up to 600 m²/shift. See [515 Decorative Concrete Supply — Blastrac 1-8DM](https://www.515dcs.com/product/blastrac-1-8dm-shot-blaster/).
- **Best for.** Open floors with line-of-sight access, removing laitance, light coatings, traffic-line markings, curing compound residue. Required by most epoxy/PU manufacturers as the default prep for industrial floors >100 m².
- **Limits.** Cannot reach within ~50 mm of walls/columns (edges need diamond grinding). Oil-contaminated concrete is a hard contraindication — blasting opens oil-filled pores and pulls hydrocarbons deeper, guaranteeing later adhesion failure. See [Graco — Removing Oil, Grease, & Dirt Before Blasting](https://www.graco.com/us/en/contractor/solutions/articles/concrete-surface-prep-part-2-oil-grease-dirt.html).
- **Dust.** Modern shot blasters integrate HEPA-filtered dust collectors with pulse-jet cleaning and air-wash separation that returns clean shot to the blast wheel. See [Polycote — Captive Shot Blasting](https://polycote.com/installation/our-services/captive-shot-blasting/).

### 1.2 Captive (closed-system) shot blasting

This is shot blasting performed with an integrated vacuum/HEPA recovery package so that no abrasive or dust escapes the housing. Practically all professional shot blasting in occupied buildings, hospitals, and food plants today is captive — open-shed blasting is now confined to outdoor pavement work. See [Polycote — Vacuum-Assisted Shot Blasting](https://polycote.com/product/vacuum-assisted-shot-blasting/) and [Ruwac — Concrete Surface Preparation](https://www.ruwac.com/concrete-surface-preparation/).

Practical implications:

- Allowable inside occupied stores, kitchens, clinics during off-hours.
- No respirable crystalline silica release if HEPA filters are intact (still PPE-mandated under OSHA 29 CFR §1926.1153).
- Spent shot + concrete fines accumulate in a hopper — single waste stream, easy disposal.

### 1.3 Diamond grinding

A rotating head holds diamond-impregnated segments that abrade the surface. Used for flatness, light profile, residue removal, edges, and detail work. Industry standard for the last 5–10 mm next to walls/columns and for inside small rooms where shot blasters won't fit.

- **Grit sequence.** Coarse metal-bond 16/30 → 30/40 → 40/60 → 80/120 (resin) → 200 → 400 → 800 → 1500/3000 for polished concrete; for prep before coating, stop at 30/40 or 40/60 (CSP 2–3). See [Ideal Machinery — 5 Essential Steps for Grinding](https://www.hnmachines.com/what-are-the-5-essential-steps-for-grinding-concrete-surfaces/).
- **Dust extraction.** HEPA-filtered vacuum (M-class or H-class) mandatory under OSHA 29 CFR §1926.1153 Table 1 for crystalline-silica control. Vacuum CFM must match shroud diameter (typically 150+ CFM for 250 mm grinders). See [OSHA — Occupational Exposure to Respirable Crystalline Silica](https://www.osha.gov/silica-crystalline/construction-info).
- **Wet vs dry.** Wet grinding suppresses silica but generates slurry needing collection and pH-neutral disposal; dry grinding is faster but demands HEPA + N95/APF10 respirator and a written exposure-control plan.
- **Residential vs commercial.** Residential = 250 mm planetary or single-disc grinder with vacuum (Husqvarna PG 280, HTC 270, Lavina 25); commercial = 500–800 mm planetary (Husqvarna PG 820 RC, HTC 800, Lavina 30G) with twin 4-kW HEPA vacuum.
- **Profile.** Diamond grinding alone produces CSP 1–3. To get CSP 4+ you must either change tooling to PCD (polycrystalline diamond) cup wheels or follow grinding with shot blasting.

### 1.4 Vacuum-assisted grinding

Identical mechanically to diamond grinding but with a sealed shroud and high-CFM HEPA vacuum locked to the grinder head. The shroud captures ≥95% of dust at source. This is the residential/retrofit default — kitchens, apartments, dental clinics, hospitals — anywhere dust escape into adjacent rooms is unacceptable. Same CSP achievable as dry grinding.

### 1.5 Scarification (planers)

Drum-mounted star cutters or tungsten-carbide cutters strike the surface in rapid succession, milling concrete to a controlled depth.

- **Depth.** Up to ~6 mm (¼ inch) per pass. Aggressive removal of thick coatings, traffic paint, mastic, rubber adhesives, or uneven slab edges. See [United Rentals — Concrete Scarifier Guide](https://www.unitedrentals.com/project-uptime/equipment/tips-using-concrete-scarifier).
- **CSP produced.** CSP 4–7 depending on cutter type and pattern. Lines are linear, leaving a corduroy texture.
- **Drawbacks.** Induces micro-cracking at impact points — most coating manufacturers require a follow-up pass with diamond grinding or shot blasting to remove the bruised layer (see [TCC Materials — Concrete Surface Preparation & Profiles](https://www.tccmaterials.com/wp-content/uploads/2020/06/ConcreteSurfaceProfiles.pdf)).
- **When to use.** Pre-leveling before self-leveling overlays; coating removal where the coating is too thick or rubbery for grinding/shot blasting alone.

### 1.6 Scabbling (needle gun, scabbler)

Pneumatic piston-driven tungsten-carbide bits hammer the surface up to 1,200 impacts per minute, fracturing concrete in small cratered patterns.

- **Geometry.** Used for small areas, sharp transitions, vertical surfaces, raised points, around drains, in elevator pits. See [Runyon — Grinders, Scarifiers, Shot Blasters & Scabblers](https://www.runyonsurfaceprep.com/what-grinders-scarifiers-shot-blasters-scabblers-can-do-for-you/).
- **CSP.** CSP 7–9 — aggressive. Used before thick polymer overlays (>6 mm) needing strong mechanical key.
- **Needle gun specifics.** Bundle of steel rods driven pneumatically; pulverizes brittle scale, efflorescence, rust on rebar, and curing-compound crust on small or irregular surfaces.
- **Drawbacks.** Loud (>105 dB), slow, severe micro-cracking — always follow with grinding/shot blasting to remove the bruised layer. Operator HAVS (hand-arm vibration) limits apply per local OH&S codes.

---

## 2. Chemical Preparation

Almost universally deprecated for floor-coating prep in 2025. Documented here so you can recognize legacy specs and explain to clients why "acid wash" is not a substitute for mechanical prep.

### 2.1 Acid etching (muriatic / hydrochloric)

Dilute HCl (typ. 10–15%) is applied, allowed to react, then rinsed and neutralized. Reacts with surface calcium hydroxide, opening pores.

- **Why it is now banned/deprecated by major coating manufacturers.** Sherwin-Williams Protective & Marine, Sika, and most epoxy specifiers no longer accept acid etch as primary prep. See [Sherwin-Williams — Acid Etching Is No Longer Recommended](https://industrial.sherwin-williams.com/na/us/en/resin-flooring/contractor-center/technical-articles/acid-etching-no-longer-recommended-concrete-prep-method.html).
- **Failure modes:**
  - Under-/over-etching is unpredictable; surface roughness is uneven.
  - Residual acid (if neutralization is skipped or incomplete) keeps reacting in the slab — slow weakening of the substrate and adhesion loss at 6–18 months. See [Tuff Industrial — Why Acid Etching Is Bad](https://tuffindustrialproducts.com/dont-use-acid-etching-as-concrete-surface-prep/).
  - Does not remove oils, curing compounds, or previous coatings.
  - Introduces water and chlorides into the slab — incompatible with 100%-solids epoxies and corrosive to embedded rebar (a serious problem in coastal IL projects).
- **Neutralization.** Required when used at all: rinse with potable water, then 1:10 ammonia or sodium-bicarbonate wash, rinse again, dry to ASTM-acceptable moisture. Confirm pH 8–10 by pH-paper before priming.
- **Legitimate residual use.** Very small DIY garage jobs with water-based acrylic sealers; never industrial or commercial.

### 2.2 Phosphoric acid etching (buffered)

Less aggressive than HCl, neutral by-products, no chloride contamination. Still inferior to mechanical prep but acceptable in some legacy specs for water-based sealers on dense, contaminant-free slabs. Same neutralization protocol applies.

### 2.3 Detergent washing

Alkaline degreasers (typ. sodium-metasilicate or potassium-hydroxide based) scrubbed in with stiff bristle brush or auto-scrubber, then rinsed. Sole purpose: pull oil/grease out of the top millimeter **before** any mechanical prep. Critical step on slabs in mechanical workshops, parking, kitchens. Sequence is: degrease → rinse → dry → mechanical prep → secondary water-drop test → coat. See [Graco — Oil/Grease/Dirt removal](https://www.graco.com/us/en/contractor/solutions/articles/concrete-surface-prep-part-2-oil-grease-dirt.html).

---

## 3. ICRI CSP (Concrete Surface Profile) Standards

ICRI Technical Guideline No. **310.2R-2013** — "Selecting and Specifying Concrete Surface Preparation for Sealers, Coatings, Polymer Overlays, and Concrete Repairs" — is the international reference. It defines nine (now ten) replica chips marketed by ICRI and DeFelsko as the visual benchmarks used to specify and verify prep. See [ICRI Guideline 310.2R store page](https://store.icri.org/item/3102r2013-english-pdf-selecting-concrete-surface-preparation-sealers-coatings-polymer-overlays-concrete-repair-342521) and [DeFelsko CSP Chips](https://www.defelsko.com/csp).

| CSP | Description | Typical method | Typical use |
|-----|-------------|----------------|-------------|
| CSP 1 | Nearly flat, very light texture | Acid etch (phosphoric) or very fine grind | Penetrating sealers, thin film stains |
| CSP 2 | Light shotblast / fine grind | Diamond grinding 60–120 grit | Thin-film sealers <0.25 mm |
| CSP 3 | Light shotblast | Diamond grind 30/40 + light shotblast | High-build sealers, water-based epoxy <0.5 mm |
| CSP 4 | Light scarification / medium shotblast | Shotblast (small/medium shot) | 100% solids epoxy 0.4–1 mm |
| CSP 5 | Medium shotblast | Shotblast (medium shot) | Self-leveling epoxy 1.5–3 mm |
| CSP 6 | Medium scarification / heavy shotblast | Shotblast (large shot) | Polymer overlays 3–6 mm, urethane cement |
| CSP 7 | Heavy abrasive blast / light scarification | Heavy shotblast, scarifier | Trowel-applied epoxy mortar 6 mm+ |
| CSP 8 | Scarification | Scarifier or heavy shotblast | Polymer overlays 6–10 mm |
| CSP 9 | Heavy scarification / scabbling | Scabbler, needle gun, hydroblasting | Polymer overlay >10 mm, concrete repair |
| CSP 10 (added 2013) | Very rough, amplitude >6 mm | Scabbling, hydrodemolition | Structural concrete repair, deep overlays |

**Application rule.** Match the CSP to the coating thickness: roughly, CSP × 0.5 mm ≈ minimum coating thickness needed. Under-profiled = mechanical key fails; over-profiled = "telegraphing" of the texture through thin coatings, pinholing, excessive material consumption. See [Stronghold Floors — CSP Explained](https://www.strongholdfloors.com/blog/epoxy-floor-coatings-concrete-surface-profiles-explained).

**Verification.** Compare prepared surface against ICRI replica chips under raking light immediately after prep. Document with photographs alongside the chip per ICRI 310.2R Appendix.

---

## 4. Substrate Testing Before Prep

Test results dictate whether the slab is even a candidate for seamless flooring. Run all relevant tests *before* the bid hardens — they change the price and the warranty.

### 4.1 Moisture

Moisture-vapor transmission is the #1 cause of coating failure in IL. Three accepted standards, used in combination, not isolation.

- **ASTM F2170 — In-situ Relative Humidity (RH probe).** Drill to 40% slab depth, insert sleeve, equilibrate 24 h, read RH with digital probe (Wagner Rapid RH, Vaisala HM44, Tramex). Industry standard. Required: 3 tests per 100 m², +1 per additional 100 m². Most coatings need RH ≤ 75–85% depending on chemistry. See [DeFelsko — How to Measure Concrete RH per ASTM F2170](https://www.defelsko.com/resources/how-to-measure-concrete-rh) and [Wagner Meters — Calcium Chloride vs RH](https://www.wagnermeters.com/concrete-moisture-test/concrete-info/calcium-chloride-moisture-test/).
- **ASTM F1869 — Anhydrous Calcium Chloride (CaCl₂).** Pre-weighed dish, 72 h sealed under plastic dome on cleaned slab, re-weigh. Result in lb/1000 ft²/24 h or g/m²/24 h. Most resins accept ≤ 3 lb / 14 g. Slower, surface-only result; F2170 has largely replaced it but it is still spec'd by many US manufacturers.
- **ASTM D4263 — Plastic-Sheet Test.** Tape 450×450 mm clear polyethylene to slab, seal edges, wait 16+ h, check for condensation/darkening. Qualitative go/no-go pre-screen — fast, free, never sufficient on its own. See [ASTM D4263 standard summary](https://www.astmd4263.com/).
- **CM-Method (CM-Messung / DIN 18560).** European calcium-carbide bottle test. Sample drilled chip + reagent + steel ball, shake, read pressure → moisture % by mass. Spec for screed-grade floors in EU/IL where DIN 18560 applies. Limits: cement screed ≤ 2.0% CM; with underfloor heating ≤ 1.8%; calcium-sulfate screed ≤ 0.5%.
- **Tramex CME / CMEXpert** — non-destructive impedance meter. Useful for mapping moisture variation across the slab before drilling F2170 probes; never as final acceptance.

**Practical IL note.** A ground-floor slab on grade in Tel Aviv or Haifa, no vapour barrier underneath, near coast — assume failed RH until proven otherwise. Plan for an epoxy moisture-vapour barrier primer (e.g., Sikafloor-EpoCem, MasterTop P 657) as a contingency line item.

### 4.2 Adhesion (substrate pull-off)

The slab is sound if it can develop a pull-off tensile strength ≥ 1.5 MPa (most epoxy systems) or ≥ 1.0 MPa (cementitious overlays).

- **ASTM D7234** — pull-off adhesion strength of coatings on concrete using portable pull-off testers. 50 mm dolly glued (typ. methacrylate or 5-min epoxy), perimeter scored through the coating to bare concrete, hydraulic/digital tester pulls perpendicular. Report failure mode (substrate cohesive / adhesive at interface / glue failure). See [ASTM D7234 standard summary](https://store.astm.org/d7234-21.html) and [DeFelsko PosiTest AT](https://www.defelsko.com/positest-at).
- **BS EN 1542** — equivalent European standard for "Products and systems for the protection and repair of concrete structures — Measurement of bond strength by pull-off." Conforming testers (Proceq DY-2, PosiTest AT-A) report identically.
- **Acceptance criteria.** Per EN 1504-2 for coatings on concrete: ≥ 1.5 MPa for rigid systems; ≥ 0.8 MPa for flexible. Test 3 dollies per 100 m², worst result governs.

### 4.3 Carbonation

A carbonated surface zone has neutralized calcium hydroxide, lost alkaline passivation of rebar, and may be powdery. Critical on slabs >15 years old or where rebar corrosion is suspected.

- **Phenolphthalein test, per EN 14630.** Spray 1% phenolphthalein in ethanol on a freshly broken/drilled concrete surface. Magenta-pink = pH > 9 = sound. Colourless = carbonated. Measure depth from surface to colour transition with a steel rule. See [Understanding Cement — Carbonation](https://www.understanding-cement.com/carbonation.html).
- **Action.** Any carbonated layer in the bond zone must be mechanically removed before coating. For deep carbonation (>5 mm) plus rebar exposure, structural repair per EN 1504 takes precedence over flooring.

### 4.4 Compressive strength

- **Rebound (Schmidt) hammer, EN 12504-2.** Spring-loaded plunger rebounds off the surface; rebound number correlates (with calibration curve) to surface compressive strength. Take 10–12 readings per location, discard outliers, average. Fast, non-destructive, surface-only — sanity check, not a structural verdict. Most seamless-floor specs require an in-place concrete strength ≥ 25 MPa for 100%-solids epoxy and ≥ 20 MPa for polyurethane.
- **Core sampling, EN 12504-1.** Required for disputes, structural retrofits, or low rebound readings.

### 4.5 Chloride content

Coastal IL is chloride-rich. Embedded rebar corrodes once free-chloride exceeds ~0.4% by mass of cement.

- **EN 14629** — determination of chloride content in hardened concrete. Drill powder samples at 10 mm increments, digest in nitric acid, titrate with silver nitrate (AgNO₃) using potentiometric or Volhard endpoint.
- **Quick field check.** AgNO₃ spray on a freshly fractured surface: white silver-chloride precipitate indicates free chloride present. Not quantitative.
- **Action.** Total chloride >0.4% by mass of cement + active corrosion → structural repair required first. >0.2% with intact passive layer → coat with chloride-barrier primer (e.g., Sika MonoTop-1010 anti-corrosion coating on exposed rebar; Sikafloor EpoCem moisture-and-chloride barrier on slab) before topping.

---

## 5. Repair Before Prep

Cracks, spalls, and hollow areas must be repaired *before* the final profile pass. Repairs follow EN 1504 family standards.

### 5.1 Crack injection — structural (epoxy)

- **Sikadur-52 (Injection Normal / Injection LP).** 2-component low-viscosity 100%-solids epoxy. Used to *bond* dormant structural cracks back into a monolith. Viscosity ~310 mPa·s — penetrates hairlines down to 0.2 mm. Compressive strength ~52 MPa, tensile ~37 MPa. Apply by pressure injection (low-pressure pump or pail) through surface ports glued every 150–300 mm along the crack; seal crack face with Sikadur-31 paste between ports; inject port-by-port until adjacent port weeps. See [Sikadur-52 USA TDS](https://usa.sika.com/en/construction/repair-protection/multi-purpose-epoxies/overlays/sikadur-52-us.html) and [Sikadur Crack Fix](https://usa.sika.com/en/construction/repair-protection/multi-purpose-epoxies/cracks/sikadur-crack-fix.html).
- **Mapei Epojet / Epojet LV** — equivalent injection epoxy from the other big EU supplier.
- **Indication.** Cracks that are not moving (no thermal/structural cycling). If the crack reopens after epoxy injection, you used the wrong product — switch to PU.

### 5.2 Crack injection — moving (polyurethane)

- **SikaFix HH (LV)** — hydrophobic PU injection resin. Cures to a flexible elastomer; elongation ~150%, accommodates cyclic crack movement and is water-tolerant (cures *in contact* with water and seals active leaks). Used for working joints, expansion-induced cracks, slab-on-grade cracks over voids. See [SikaFix HH LV USA TDS](https://usa.sika.com/en/construction/repair-protection/grouts/polyurethane-grouts/sikafix-hh-lv.html).
- **Note on product naming.** The brief lists "SikaFix 11-FC" — that exact SKU does not appear in current Sika USA catalog; the active hydrophobic PU SKU for moving-crack injection is **SikaFix HH LV**. If a TDS literally says "11-FC" on the bucket, it is an older or regional variant — confirm against the local Sika IL distributor before pricing.
- **Indication.** Active cracks (moving), wet cracks, slab-on-grade cracks. **Never** under a seamless floor without first stopping the leak and a stress-relief detail at the surface (saw-cut + flexible joint sealant or fabric-reinforced bridge in the coating system).

### 5.3 Spall and divot repair

- **Sika MonoTop / SikaTop family.** Polymer-modified cementitious repair mortars per EN 1504-3. SikaTop-122 PLUS = trowel-applied R4 structural repair mortar (compressive ~60 MPa @ 28 d) with internal bonding agent.
- **Mapei Planitop family.** Planitop 400 (R3) for general repair; Planitop 23 for thin patching; Planitop HDM for high-strength structural. Equivalent EN 1504-3 R-classes.
- **Workflow.** Saw-cut perimeter 5–10 mm deep (square edges — no feathering), break out unsound concrete to sound substrate (chain-drag test confirms), expose aggregate, clean (vacuum + water), pre-wet to SSD (saturated surface dry) condition, apply bonding agent, place mortar, finish flush, cure per TDS, then include in the global grind/shotblast pass for uniform CSP.

### 5.4 Bonding agents (slurry coats)

- **Sikadur-32 Hi-Mod / Sikadur-32 LPL.** 2-component 100%-solids structural epoxy bonding agent — fresh concrete to hardened concrete, or repair mortar to substrate. Conforms to ASTM C-881 Types I, II, V Grade 2 Class C and AASHTO M-235. Open time ~2–4 h depending on temperature. See [Sikadur-32 Hi-Mod USA TDS](https://usa.sika.com/en/construction/repair-protection/multi-purpose-epoxies/adhesives/sikadur-32-hi-mod.html).
- **Mapei Eporip.** 2-component epoxy bonding agent for casting fresh concrete onto hardened, repairing fixed cracks, and sealing screed shrinkage cracks. See [Mapei Eporip](https://www.mapei.com/ae/en/products-and-solutions/products/detail/eporip).
- **Rule of thumb.** Bonding agent is required only when the repair mortar manufacturer specifies it. Most modern polymer-modified mortars (e.g., SikaTop-122 PLUS) are self-bonding and explicitly *forbid* a separate bonding agent. Always follow the mortar TDS, not folklore.

---

## 6. Common Defects and Handling

| Defect | How to detect | Why it matters | Treatment |
|---|---|---|---|
| **Laitance** (cement bloom — weak, fine layer of cement + fines on the top surface) | Visual (chalky/dusty), scratch test with a coin, water-drop test (beads then absorbs unevenly) | Friable layer; any coating bonded to it will delaminate at <0.5 MPa pull-off | **Mechanical removal only** — shot blast or diamond grind to expose sound aggregate. Acid will not fix it. See [Evolving Elements — Removing Cement Laitance](https://evolvingelements.com.au/removing-cement-laitance-from-new-concrete/) and [Brick'n'Bolt — Concrete Laitance Causes, Effects & Removal](https://www.bricknbolt.com/blogs-and-articles/construction-guide/concrete-laitance) |
| **Curing-compound residue** (membrane-forming chemicals applied to fresh concrete to retain moisture) | Water-drop test (water beads, does not absorb) | Seals pores → primer/coating cannot wet or bond | Mechanical (shot blast, grind) until water absorbs uniformly. Some non-membrane sodium-silicate cures are coatable but still demand mechanical prep. See [ChemCo — Preparation of Surfaces](https://chemcosystems.com/tech_surfaceprep) |
| **Oil / grease contamination** (vehicle drips, hydraulic oil, kitchen fats) | Visual stain, water-drop test, UV lamp for fluorescent oils | Coating fish-eyes, cratering, total adhesion loss | (1) Degrease with alkaline cleaner + scrub + rinse; (2) cover stain with bentonite/sawdust poultice if persistent; (3) re-test water-drop; (4) only then grind/shotblast (blasting before degrease drives oil deeper). If contamination is structural (e.g., transformer-oil-soaked slab), the coating is **not feasible** — break out and recast. |
| **Hollow / delaminated areas** (loss of bond between top wear-course and base slab, voids) | **Chain drag** (ASTM D4580) — drag chain across slab, listen: ring = sound, thud/drum = hollow. Also tap with steel rod or geologist's hammer. Mark hollows with chalk/lumber crayon | Coating spans an unsupported area → cracks on first loading. Hollow tiles delaminate. | Cut out unsound zone to sound concrete, repair per §5.3. Small isolated hollows in monolithic slabs (no overlay) can be salvaged by **epoxy injection** through 4+ drilled ports until resin weeps from adjacent ports. See [For Construction Pros — Sounding Concrete](https://www.forconstructionpros.com/concrete/equipment-products/repair-rehabilitation-products/article/22954113/oldcastle-apg-a-crh-company-sounding-concrete-detect-damage-before-repair) |
| **Surface dusting / efflorescence** | Hand swipe leaves white residue | Indicates curing failure or moisture migration carrying salts | Grind to sound concrete; address root-cause moisture path (vapor barrier, ground-water control) before coating |
| **Rebar exposure / spalling** | Visual | Loss of structural cover; chloride/carbonation present | Mechanically remove all loose concrete to 20 mm behind rebar, abrasive-clean rebar to SA 2½, prime rebar with Sika MonoTop-1010 (epoxy/cement anti-corrosion primer), reinstate cover with R3/R4 mortar, then prep |

---

## 7. Israel-Specific Considerations

### 7.1 Hot-summer prep (May–October, surface temps 35–50 °C)

- **Substrate temperature window.** Most epoxies cure between 10 °C and 30 °C *substrate* (not air). Above 32 °C: pot life collapses, off-gassing intensifies, pinholing risk surges. Schedule grinding/shotblasting and coating between 04:00–10:00 or after 17:00, or run mechanical cooling/shade.
- **Dust control.** Hot dry days = airborne silica drifts further. Always close adjacent rooms, run HEPA negative-air machines, post silica-warning signage. OSHA-equivalent IL rules (משרד העבודה — בטיחות במקומות עבודה) require dust-monitoring on jobs > 100 m².
- **Dew point.** Substrate temp must be ≥ 3 °C above dew point during coating. In a hot day → cool night, condensation can form on a freshly prepared slab between 02:00 and 06:00 — schedule the prime coat to bracket prep, not skip a day.
- **Water for prep.** Israeli water is hard. Use potable but flush wet-grinding slurry tanks daily to avoid scale on tooling.

### 7.2 Coastal chloride (Tel Aviv, Haifa, Bat Yam, Ashdod, Ashkelon, Netanya, Hadera)

- **Default assumption** within ~5 km of the coast and any building exposed to salt-laden wind: surface chloride > 0.1% by mass of cement; rebar passivation compromised in carbonated zones.
- **Field protocol.** Phenolphthalein + AgNO₃ spot tests on every project. If positive → drill EN 14629 powder samples (10, 20, 30 mm depths) + lab titration.
- **Chloride-extractor / barrier strategy.** Mechanical removal of contaminated top millimeters is the first defence. For deeper contamination not warranting demolition, options are:
  - **Electrochemical chloride extraction (ECE)** — applied to structural rebar in marine RC; outside scope of typical floor work but a valid path before a thick polymer overlay.
  - **Migrating corrosion inhibitor (MCI)** — Sika FerroGard-903+, Cortec MCI-2020 — applied to surface, penetrates and forms protective film at rebar.
  - **Chloride-barrier primer / membrane** — Sikafloor-EpoCem (3-component cementitious epoxy moisture-and-chloride barrier) or MasterSeal 7000 CR. Mandatory under any 100%-solids epoxy on a chloride-positive slab.
- **Rebar protection.** Where chlorides have reached rebar: full mechanical exposure, abrasive cleaning, Sika MonoTop-1010 (cementitious anti-corrosion) or Sikadur-32 Hi-Mod epoxy primer, then R4 mortar reinstatement.

### 7.3 Israeli Standards (תקנים ישראליים)

- **ת״י 466** (IS 466) — Concrete Code, "חוקת הבטון", referenced together with IS 118 (concrete production) and IS 26 (concrete works on site). Sets baseline concrete strength, cover, and durability classes (similar in structure to EN 206 + EN 1992). Used to define the minimum substrate the floor system inherits.
- **ת״י 1923** — bonded screeds and floor toppings; mirror of EN 13813 in scope; specifies bond and surface preparation requirements for screeds.
- **ת״י 1004** — flatness/levelness tolerances for finished floors.
- **ת״י 1555** — adhesives and surface preparation for tile work (cross-referenced for cementitious bond-strength minimums).
- **IS 18001 / מינהל הבטיחות** — occupational safety; relevant for silica-dust control during prep.
- **EN 1504 family** — adopted in IL practice for concrete repair (EN 1504-2 coatings, -3 mortars, -5 injection, -10 application). EN 13813 for screed-grade floor systems.

When writing customer documentation in Hebrew, cross-reference both the תקן ישראלי number and the corresponding EN/ISO standard — most Israeli specifiers move between both, and the EU number is what the European product TDS will use.

---

## 8. Process Order — Standard Sequence for a Seamless-Floor Job

This is the order I recommend for the customer-facing guide. Each step gates the next; skipping is the single biggest cause of warranty claims.

1. **Pre-survey** — visual + chain drag + moisture screen (D4263 + Tramex) + chloride spot test + age/history of slab.
2. **Quantitative testing** — F2170 RH probes, D7234 pull-off, EN 14630 carbonation, EN 14629 chloride if coastal, Schmidt rebound. Document with photographs and coordinates.
3. **Decontamination** — degrease oil/grease zones, remove standing water, vacuum loose debris.
4. **Crack and spall repair** — inject structural cracks (Sikadur-52), bridge moving cracks (SikaFix HH LV + surface detail), reinstate spalls (SikaTop / Planitop), let cure to TDS strength.
5. **Mechanical prep** — choose method per target CSP and site constraints (shot blast for open floors; vacuum-assisted diamond grind for residential/edges/small rooms; scarify only where deep removal is needed and follow with a finishing pass).
6. **Edge and detail prep** — diamond grind within 50 mm of walls, columns, drains; scabble around penetrations.
7. **Surface verification** — compare to ICRI CSP chips under raking light; photograph; re-run pull-off on a representative dolly.
8. **Final clean** — HEPA vacuum, then tack-rag or solvent wipe per primer TDS.
9. **Moisture re-check** — F2170 reading must hold; if RH > coating limit, install Sikafloor-EpoCem or equivalent vapor barrier.
10. **Prime / coat** — within the manufacturer's open window (typ. 4–24 h after prep, before atmospheric re-contamination).

---

## 9. Quick Reference — Method × CSP × Application

| If client wants | Coating thickness | Required CSP | Default method |
|---|---|---|---|
| Penetrating sealer / dust-proofer | < 0.1 mm | CSP 1–2 | Light diamond grind, 60–120 grit |
| Decorative water-based stain/topical | 0.1–0.3 mm | CSP 2–3 | Diamond grind 30/40 + light shotblast |
| Thin epoxy garage floor | 0.3–0.5 mm | CSP 3 | Diamond grind 16/30 + vacuum, or light shotblast |
| 100%-solids epoxy showroom | 0.5–1 mm | CSP 4 | Shot blast (medium shot) |
| Self-levelling epoxy retail/office | 1.5–3 mm | CSP 5 | Shot blast (medium-large) |
| Urethane cement food plant | 4–6 mm | CSP 5–6 | Shot blast (large) |
| Epoxy mortar industrial | 6–10 mm | CSP 7–8 | Heavy shot blast + scarify |
| Polymer overlay heavy industrial | > 10 mm | CSP 9 | Scarify + scabble |

---

## 10. Bibliography (canonical sources)

**ICRI / industry guidelines**
- [ICRI Technical Guideline 310.2R-2013 — Selecting and Specifying Concrete Surface Preparation](https://store.icri.org/item/3102r2013-english-pdf-selecting-concrete-surface-preparation-sealers-coatings-polymer-overlays-concrete-repair-342521)
- [ICRI CSP Chips reference / DeFelsko](https://www.defelsko.com/csp)
- [TCC Materials — Concrete Surface Preparation & Profiles (CSP visual reference)](https://www.tccmaterials.com/wp-content/uploads/2020/06/ConcreteSurfaceProfiles.pdf)
- [Stronghold Floors — CSP Explained for epoxy coatings](https://www.strongholdfloors.com/blog/epoxy-floor-coatings-concrete-surface-profiles-explained)
- [Sherwin-Williams — Concrete Surface Preparation guide (water/wastewater)](https://industrial.sherwin-williams.com/na/us/en/protective-marine/media-center/articles/water-wastewater-concrete-surface-preparation-guide.html)

**Mechanical prep**
- [Shot Blast Inc. — Preparation Guide 2015](https://shotblastinc.com/wp-content/uploads/Shot-Blast-Preparation-Guide-2015.pdf)
- [AB Tool Rentals — Shot Blasting Tips](https://abtoolrentals.com/instruct/Shot_Blasting.pdf)
- [Polycote — Captive Shot Blasting](https://polycote.com/installation/our-services/captive-shot-blasting/)
- [Polycote — Vacuum-Assisted Shot Blasting](https://polycote.com/product/vacuum-assisted-shot-blasting/)
- [Ruwac — Concrete Surface Preparation vacuum systems](https://www.ruwac.com/concrete-surface-preparation/)
- [Substrate Technology — What is a scarifier](https://substratetechnology.com/what-is-a-scarifier-and-when-is-it-a-good-choice-for-surface-prep/)
- [Runyon — Grinders, Scarifiers, Shot Blasters & Scabblers](https://www.runyonsurfaceprep.com/what-grinders-scarifiers-shot-blasters-scabblers-can-do-for-you/)
- [United Rentals — Concrete Scarifier in 6 Steps](https://www.unitedrentals.com/project-uptime/equipment/tips-using-concrete-scarifier)
- [Graco — Concrete Surface Preparation: Grades of Roughness](https://www.graco.com/au/en/contractor/solutions/articles/concrete-surface-prep-part-3-grades-of-roughness.html)
- [Ideal Machinery — 5 Essential Steps for Grinding Concrete](https://www.hnmachines.com/what-are-the-5-essential-steps-for-grinding-concrete-surfaces/)
- [Blastrac 1-8DM specs](https://www.515dcs.com/product/blastrac-1-8dm-shot-blaster/)

**Silica safety**
- [OSHA — Occupational Exposure to Respirable Crystalline Silica, 29 CFR §1926.1153](https://www.osha.gov/silica-crystalline/construction-info)
- [OSHA Fact Sheet — Handheld Grinders & Silica](https://www.osha.gov/sites/default/files/publications/OSHA_FS-3628.pdf)

**Chemical prep**
- [Sherwin-Williams — Acid Etching Is No Longer Recommended](https://industrial.sherwin-williams.com/na/us/en/resin-flooring/contractor-center/technical-articles/acid-etching-no-longer-recommended-concrete-prep-method.html)
- [Tuff Industrial — Why Acid Etching Is Bad](https://tuffindustrialproducts.com/dont-use-acid-etching-as-concrete-surface-prep/)
- [SealGreen — Acid Etching Bad Idea](https://sealgreen.com/blogacid-etching-bad-idea-for-cleaning-concrete/)
- [Alliance Chemical — Cleaning Concrete with Muriatic Acid](https://alliancechemical.com/blogs/articles/clean-concrete-muriatic-acid)

**Testing standards**
- [ASTM D7234 — Pull-Off Adhesion Strength on Concrete](https://store.astm.org/d7234-21.html)
- [DeFelsko PosiTest AT — pull-off testers](https://www.defelsko.com/positest-at)
- [ASTM F2170 — In-situ RH probes](https://www.f2170.org/)
- [DeFelsko — How to Measure Concrete RH per ASTM F2170](https://www.defelsko.com/resources/how-to-measure-concrete-rh)
- [Tramex — ASTM F2170 in-situ RH](https://tramexmeters.com/moisture-testing/concrete/in-situ-concrete-rh-test-ASTM-F2170)
- [Wagner Meters — Calcium Chloride vs RH](https://www.wagnermeters.com/concrete-moisture-test/concrete-info/calcium-chloride-moisture-test/)
- [ASTM D4263 — Plastic Sheet Method](https://www.astmd4263.com/)
- [Material Testing Expert — ASTM D4263 details](https://www.materialtestingexpert.com/concrete/astm-d4263-moisture-in-concrete-plastic-sheet)
- [Understanding Cement — Carbonation](https://www.understanding-cement.com/carbonation.html)
- [The Constructor — Chemical Tests on Concrete Structures](https://theconstructor.org/concrete/chemical-tests-on-concrete-structures/2953/)

**Repair / bonding (Sika TDS — primary)**
- [Sikadur-52 (NZ TDS)](https://nzl.sika.com/en/construction/concrete-refurbishment/cracks/sikadur-52-injection-normal.html)
- [Sikadur-52 (USA TDS)](https://usa.sika.com/en/construction/repair-protection/multi-purpose-epoxies/overlays/sikadur-52-us.html)
- [Sikadur Crack Fix](https://usa.sika.com/en/construction/repair-protection/multi-purpose-epoxies/cracks/sikadur-crack-fix.html)
- [Sikadur Injection Gel](https://usa.sika.com/en/construction/repair-protection/multi-purpose-epoxies/cracks/sikadur-injectiongel.html)
- [SikaFix HH LV — hydrophobic PU injection](https://usa.sika.com/en/construction/repair-protection/grouts/polyurethane-grouts/sikafix-hh-lv.html)
- [Sikadur-32 Hi-Mod — bonding agent](https://usa.sika.com/en/construction/repair-protection/multi-purpose-epoxies/adhesives/sikadur-32-hi-mod.html)
- [Mapei Eporip — epoxy bonding agent](https://www.mapei.com/ae/en/products-and-solutions/products/detail/eporip)

**Defects**
- [Evolving Elements — Removing Cement Laitance](https://evolvingelements.com.au/removing-cement-laitance-from-new-concrete/)
- [Brick'n'Bolt — Concrete Laitance Causes, Effects & Removal](https://www.bricknbolt.com/blogs-and-articles/construction-guide/concrete-laitance)
- [ChemCo — Preparation of Surfaces in Bonding, Coating and Flooring](https://chemcosystems.com/tech_surfaceprep)
- [Graco — Contaminant-Free Concrete (oil/grease/dirt)](https://www.graco.com/us/en/contractor/solutions/articles/concrete-surface-prep-part-2-oil-grease-dirt.html)
- [Graco — Sound vs. Unsound Concrete (scaling, spalling, delamination)](https://www.graco.com/us/en/contractor/solutions/articles/concrete-surface-prep-part-1-unsound-concrete.html)
- [For Construction Pros — Sounding Concrete](https://www.forconstructionpros.com/concrete/equipment-products/repair-rehabilitation-products/article/22954113/oldcastle-apg-a-crh-company-sounding-concrete-detect-damage-before-repair)
- [Stone Forensics — Epoxy Injection for Hollow Tiles](https://stoneforensics.com/the-magic-of-epoxy-injection-salvaging-hollow-floor-tiles/)

**Visual references suitable for the public guide**
- ICRI CSP replica chips — photographic close-ups: https://www.defelsko.com/csp
- TCC Materials CSP visual chart (PDF, free): https://www.tccmaterials.com/wp-content/uploads/2020/06/ConcreteSurfaceProfiles.pdf
- Blastrac equipment imagery: https://www.515dcs.com/product/blastrac-1-8dm-shot-blaster/
- DeFelsko PosiTest AT pull-off setup photos: https://www.defelsko.com/positest-at

---

## 11. Open Items for the Customer-Facing Guide

- **Product SKU verification for IL market.** SikaFix HH LV is the USA SKU. The IL distributor (Sika Israel) lists local SKUs that may differ; before publishing prices/spec sheets, pull TDS from `il.sika.com`. Same for Mapei Israel.
- **Hebrew terminology.** Establish the Hebrew translation glossary up front: ליטוש יהלום (diamond grinding), שיוף שוט (shot blasting), שיוף מסור (scarification), נמלים / מקור עטים (needle gun / scabbler), פרופיל פני בטון (CSP), בדיקת לחות (moisture test), בדיקת היצמדות (pull-off / adhesion test).
- **Photo set.** Need real-job photographs of: a CSP 3 vs CSP 5 surface (raking light), shot-blaster in operation, a chain drag with chalk-marked hollow, a dolly mid-pull-off, a moisture probe in slab. Capture during the next FloorDSGN job.
- **Price brackets.** Add an order-of-magnitude price column (₪/m²) once the IL subcontractor quotes are normalised.
- **IL coastal map.** Add an overlay graphic showing the 5 km coastal-chloride zone and which cities default to chloride-extractor protocol.

---

*End of brief — content is research substrate, not customer copy. Translate, tighten, and add brand voice in the public guide.*
