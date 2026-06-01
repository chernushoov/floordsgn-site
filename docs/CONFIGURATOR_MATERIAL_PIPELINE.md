# Configurator Material Pipeline — Realistic 3D Flooring for Floor.DSGN

**Status:** working spec · **Created:** 2026-06-01 · **Owner:** production-lead (me)
**Scope:** how a *real physical floor sample* becomes a credible PBR material in the Floor.DSGN configurator, with the flagship "Epoxy Terrazzo Light Grey / White Aggregate" worked end-to-end.
**Grounded against the live repo:**

- Three.js is pinned to **r0.158.0** via importmap in `configurator.html` (lines 16-17) — every API/colorSpace note below matches r158.
- Texture layout already in use: `3d-assets/textures/<slug>/{diffuse.jpg, normal.png, roughness.png, ao.png}` (e.g. `terrazzo-multi/`, `terrazzo-cement/`, `microtopping/`).
- HDRI lives in `3d-assets/textures/_hdri/` (currently only `brown_photostudio_02.hdr`).
- Material manifest: `materials.config.json` (v17). The flagship is `id: "terrazzo-light"` (system `terrazzo`, base `эпоксидная смола`, `code: TL`) with a `chips[]` array and a `buildup` of real Sikafloor SKUs.
- `configurator.html` already wires `MeshPhysicalMaterial`, `roughnessMap`, `normalScale(0.85)`, `clearcoatRoughness`, and a `loadTex()` helper — this pipeline upgrades that path, it does not replace it.
- Physical sample size in the UI is **100×100 mm** (`Получить sample-kit · 100×100 мм`).

**Two rules that govern everything here:**

1. **Honest claim, always:** the configurator is a *PBR-based visual simulation*, **not an exact-color guarantee**. Cross-pol capture gets us true diffuse reflectance, but monitor gamut + ambient light make the last-mile color a simulation. Every sample carries a screen-accuracy line (see §5). This is also the strongest legal/marketing posture — every serious poured-floor brand (Sika, Western States) hedges to "real sample."
2. **Ship only what we own or CC0.** External textures/HDRIs are placeholders and quality benchmarks. A bought/scraped concrete scan presented as a Floor.DSGN sample undermines the "real sample" claim **and** breaches most licenses (Poliigon, Adobe Substance, Architextures all forbid serving raw maps from a web app). The shippable material library is **our own captured floors → CC0 fallback only.**

> Brand palette (do not introduce other colors in any configurator UI built off this): Carbon `#151515`, Steel `#72716D`, Signal `#C86B3C` (one per screen), Concrete `#F3F0EA`, Graphite `#2D2D2D`. Fonts: Cormorant Garamond (display) + Montserrat. No emoji in UI.

---

## 1. Research summary — sources, license risk, how we use each

### 1a. Best VISUAL references (poured-system analogs to model the UI/cards/honesty after)

| Source | URL | License / copy risk | How we use it |
|---|---|---|---|
| **Western States Terrazzo — Specs/Design Tools** `★ primary` | https://www.westernstatesterrazzo.com/specs-details | Vocabulary (chip-size grades) is industry-standard, free to adopt. Do NOT copy their CAD cross-sections/PDFs. | Adopt the **chip-size grade system** verbatim as our aggregate-size control: `#0-#1` 1/16-3/16" Traditional · `#2-#4` 1/4-1/2" Standard · `#5-#7` 5/8-1" Venetian · `>#7` Palladiana. System-first gating: chosen binder constrains chip-size max + a color-freedom label (Epoxy "Unlimited"). |
| **Sika — Sikafloor Terrazzo** | https://www.sika.com/en/brands/sikafloor-terrazzo.html · color guides https://usa.sika.com/en/construction/floor-wall/documents/color-guides.html | Do NOT lift Sika color names/numbers or swatch images. Page *structure* + disclaimer phrasing are free. | Swatches must render the **composite** (binder + chips together), never a flat matrix color. Adopt their exact disclaimer near-verbatim: *"colors and textures on the screen are not as accurate as a real sample."* |
| **Ardex PanDOMO** | https://www.ardexamericas.com/products/ardex-surfaces/pandomo/ | "PanDOMO" + tier names are trademarked — mirror the *pattern*, not the names. | Sell per-pour randomness as a feature ("each pour is individual — subtle tonal variation is inherent, not a defect"), not a flaw to hide. Tier = a technical promise (wear/traffic/thickness). |
| **Ideal Work Microtopping — Colours** | https://www.idealwork.com/microtopping/microtopping-colours/ | Color names/charts proprietary; grid logic free. | For microtopping line: a 2-axis tone × intensity color grid, not a flat list. Matte/polished as a labeled spec axis with its own code. |
| **TERRAZZCO collections** | https://terrazzco.com/aggregate-series/ · /designer-series/ · /monochrome-terrazzo-series/ | Epoxy poured-terrazzo supplier — fair structural ref. Do NOT copy sample names or photographed chip blends. | Group presets into 2-3 named collections (Monochrome / Aggregate / Designer); stamp each card with code + name + **real physical sample size**. |
| **Architextures "Create"** | https://architextures.org/create · https://architextures.org/textures/791 | Output is Pro/paid + non-redistributable. **UX reference only — never an asset source, never clone the UI 1:1.** | Parameter-set reference for the live re-seed control: matrix color → chip color(s) → chip size (mapped to #-grade) → density → seed. Visible re-roll sells uniqueness. |
| **AVOID — tile-terrazzo visualizers** (TilesView.ai, Tilesdisplay) | https://tilesview.ai/ | n/a | **Do NOT use as technical refs.** They are tile tools (grout lines, repeating tiles). Poured floors are seamless, continuous, random — borrow only the future "preview in your room photo" idea, never the tiling/grout logic. |

### 1b. Best PBR texture sources (for benchmarks + CC0 placeholders only)

> **The web-app embedding constraint** (single most important license finding): we serve image files to the browser, i.e. they are downloadable = **redistribution**. Most paid libs forbid exactly this — Poliigon ("embedding = redistribution, banned"), Adobe Substance ("no standalone raw maps"), Architextures/Textures.com (no public serving), Quixel/Fab (restrictive). **For anything that ships, CC0 only.**

| Source | URL | License | Ship in web app? | Use for |
|---|---|---|---|---|
| **Poly Haven — Terrazzo Tiles** `★ benchmark` | https://polyhaven.com/a/terrazzo_tiles | CC0 | ✅ yes (downscale 2K-4K) | Gloss/scale **benchmark** + fine-aggregate placeholder. Has a grout grid → mask/retouch before any seamless preview. Not a real Floor.DSGN chip mix. |
| **ambientCG — Terrazzo001/004/005/010** | https://ambientcg.com/list?category=Terrazzo · https://ambientcg.com/view?id=Terrazzo004 | CC0 1.0 | ✅ yes | Alternate / **large-chip** placeholder (more honest for cement terrazzo than the fine Poly Haven set). Procedural → clean tiling. |
| **cgbookcase — Polished Concrete 01** | https://www.cgbookcase.com/textures/polished-concrete-01 | CC0 | ✅ yes (4K, seamless) | Strongest polished-concrete / microtopping-base placeholder. No AO map — fine for a flat floor; generate subtle AO if needed. |
| **ambientCG — Concrete / Rubber categories** | https://ambientcg.com/list?category=Concrete · https://ambientcg.com/list?q=rubber | CC0 1.0 | ✅ yes | Industrial/raw concrete (pick smoothest) and the rubber line. |
| **Poly Haven — Smooth Concrete Floor** | https://polyhaven.com/a/smooth_concrete_floor | CC0 | benchmark only | Aged/scuffed, not premium-polished — "industrial worn" look only. |
| **Poliigon / Adobe Substance / Architextures / Textures.com / Quixel-Fab** | https://www.poliigon.com/textures/terrazzo · https://architextures.org/terms | Paid, redistribution-banned | ❌ NO | Internal look-dev / calibration benchmarks ONLY. Their *card tag schema* (aggregate type · chip size · finish · base color) is free to adopt as our metadata model. |

**Microcement, epoxy/resin gloss:** no clean CC0 hero exists. **Build these as owned procedural materials** (flat pigment base color as a *parameter* + clearcoat + faint normal for orange-peel/poured swirl), not photo textures. This is both license-clean and more honest — real resin color = the product's pigment, which the user sets, not a baked photo.

### 1c. Best neutral HDRI sources (IBL/reflections without tinting the floor)

> Use `.exr`/`.hdr` via `EXRLoader`/`RGBELoader`, **never** the tonemapped `.jpg` (baked highlights, no real dynamic range). For color honesty, prefer a HDRI as `scene.environment` only, with a neutral/brand background. Lower Kelvin = warmer = more tint = the enemy. Bundle locally at **4K** (or 2K if environment-only); do not hotlink. All picks below are CC0 → no attribution.

| HDRI | URL | Kelvin / character | toneMappingExposure (ACES) | Use |
|---|---|---|---|---|
| **Studio Small 08** `★ default` | https://polyhaven.com/a/studio_small_08 | 6000K neutral, large softboxes, even wraparound, zero cast | **1.0** (1.0-1.1) | **Default "Studio" toggle.** The honest-color reference environment — fair material-vs-material comparison. No windows (broad soft highlights). |
| **Glasshouse Interior** `★ for reflections` | https://polyhaven.com/a/glasshouse_interior | 5313K neutral daylight, big windows | **0.9** (0.85-1.0) | **"Daylight Room" toggle.** Best soft window-reflection streaks that read "real floor in a real room" with no warm tint. Best of the set for satin/gloss context. |
| **Studio Small 03** | https://polyhaven.com/a/studio_small_03 | neutral-cool, high-contrast umbrella | **0.8** (0.75-0.9) | Swap in for **gloss/sealed presets** only — sharp specular hotspot makes high-gloss epoxy read wet. Too harsh for matte/satin. |
| **Lebombo** *(lifestyle only)* | https://polyhaven.com/a/lebombo | 4200K **warm** + warm wall lamps | 0.9-1.0 | Optional, clearly-labeled "lifestyle scene." **Never** the color-judging default — it pushes neutral greys golden. |
| **ambientCG Indoor Environment HDRI 001** | https://ambientcg.com/view?id=IndoorEnvironmentHDRI001 | furnished daylight room, K not published | ~0.9 (measure on grey swatch) | Alternate furnished-room reflection if we want variety beyond Glasshouse. Verify neutrality in-engine before shipping. |
| **AVOID — NoEmotion HDRs** | http://noemotionhdrs.net/ | n/a | n/a | **CC BY-NC-ND → NOT commercial-safe.** NonCommercial + NoDerivatives both disqualify. Do not use. |
| **CAUTION — HDRMAPS** | https://hdrmaps.com/ | CC BY 4.0 | n/a | Commercial OK **but attribution required**. Use only if clearly better than a CC0 pick; carry the credit. |
| **AVOID — HDRI-Haven ArtStation mirrors / Poliigon HDRIs** | — | re-upload provenance / paid | n/a | Always source from canonical Poly Haven; skip paid. |

> Current repo HDRI `brown_photostudio_02.hdr` is **warm** — replace with `studio_small_08` as the neutral default before shipping any color-sensitive sample.

### 1d. Best capture + cross-polarization references

| Source | URL | Risk | How we use it |
|---|---|---|---|
| **racoon-artworks — PBR Shooting & Calibrating** `★ primary` | https://www.racoon-artworks.de/blog_PBRshootingandcalibrating.php | none (read) | The practical cross-pol + linear-albedo-calibration SOP. Key honesty note: cross-pol'd dark floors come out *darker/more saturated* than the eye expects, and the "min sRGB 50/50/50" validator is **wrong** for pure diffuse — ignore it. Cheap AliExpress polarizer film is spectrally fine. |
| **Poly Haven — Photoscanned Texture Process** | https://blog.polyhaven.com/photoscanned-texture-creation-process/ | none (read) | Overcast/indirect light rule, color chart in frame, **16-bit TIFF** export, seam-removal workflow. |
| **pIXELsHAM / Stephane LB — Portable PBR Scanner** | https://www.pixelsham.com/2019/12/19/building-a-portable-pbr-texture-scanner-by-stephane-lb/ · polycount https://polycount.com/discussion/132603/capturing-real-world-surfaces-for-pbr | none (read) | Two-light + CPL rig layout; rotate CPL in Live View until glare disappears = crossed state. |
| **texturing.xyz — Cross-polarized photos** | https://texturing.xyz/pages/cross-polarized-photos | do NOT redistribute their scans | Cross-pol concept reference only. |
| **Apple ProRAW / Halide / VSCO** | https://support.apple.com/en-us/119916 · https://medium.com/halide/understanding-proraw-4eed556d4c54 · https://www.vsco.co/capture | none | iPhone constraints: 48MP ProRAW is **1x main camera only** (UW/tele/macro/Night/flash drop to 12MP). Stock Camera ignores manual exposure (Deep Fusion merges) → use a manual RAW app (Halide/VSCO/Lightroom) writing DNG. |
| **Tool chain** | Materialize https://www.boundingboxsoftware.com/materialize/ · RawTherapee/Darktable · Quixel Mixer (now free offline) https://quixel.com/en-US/news/offline-version-of-quixel-mixer-now-available · Substance Sampler (paid) https://www.adobe.com/products/substance3d/apps/sampler.html | tools fine commercially; risk is the *input image* | Free path: RawTherapee → Materialize → GIMP delight = all 4 maps at $0. Buy 1mo Sampler only for batch AI-delight + path-traced compare. |
| **Three.js real-world scale** | https://threejs.org/docs/#api/en/textures/Texture.repeat · https://discourse.threejs.org/t/.../66883 | n/a | Don't bake scale into the image; tile at render time via `repeat = floorSize / tileMeters`. |

---

## 2. The Floor.DSGN material pipeline (real sample → shipped PBR)

```
[1] CAPTURE          [2] PBR GENERATE        [3] BLENDER VALIDATE     [4] THREE.JS IMPL        [5] COMPARE
real sample    ->    albedo+normal+    ->    light at known angle ->  MeshPhysicalMaterial -> side-by-side
(cross-pol)          rough+AO (+disp)        vs real photo            + HDRI + scale          render vs photo
grey card+ruler      (free tool chain)       (path-traced)            (r158)                  -> approved_real_sample
```

### Step 1 — Real-sample capture (cross-pol SOP)

**What cross-pol buys us:** a CPL on the lens + polarizing film on the lights, crossed 90°, kills specular glare → a clean **diffuse/albedo** with no baked highlights. Albedo + grey card = the closest a camera gets to true surface color = our `real_sample` anchor. The "PBR simulation, not exact color" disclaimer covers the last-mile gap.

**Lane A — iPhone-minimum** (film + grey card only):
1. Sample flat & clean, lit by **soft indirect daylight** (north window / open shade — no direct sun beam). Diffuse light = fewer baked shadows to delight later.
2. Phone **parallel to the floor** (lens dead-on), braced on a tripod/box. Handheld tilt = perspective + scale error.
3. Manual RAW app (Halide/VSCO/Lightroom): **lock focus, lock exposure, lowest ISO (32-64), fixed WB, 48MP ProRAW/Max DNG, 1× lens.** No HDR, no Night, never ultrawide/macro auto-switch.
4. **Grey card + ruler in frame, same plane** as the sample (WB + real-world scale anchor).
5. Cross-pol: tape polarizing film over each light (or the window), film/clip-CPL over the lens; in Live View **rotate until the glare hotspot vanishes** = 90° cross.
   *Output: glare-free albedo DNG + a 45° relief shot. Believable, not metrologically calibrated.*

**Lane B — DSLR/mirrorless-better** (the one that earns `approved`):
1. Sharp 50-100mm macro-ish prime on a tripod/copy-stand, **sensor plane parallel to floor, straight down.**
2. Linear film over **each** of two ~45° lights + **CPL on lens**; rotate CPL in Live View until glare disappears.
3. ISO 100, f/8-f/11, manual focus locked, **RAW**, manual WB. Two captures per sample: **crossed** (albedo) + **parallel/un-polarized** (specular reference → sets the roughness target).
4. **ColorChecker (or 18% grey) + tape measure on both axes in frame, every shot.**
5. RAW develop (RawTherapee/Darktable, free): WB off the grey patch → export **16-bit TIFF**. For true albedo: set tone curve to **LINEAR**, aim the ~90% patch near **0.9 linear RGB**. (Avoid Lightroom for this step — hidden black-point compensation.)

**Shot list per sample (= the `approved_real_sample` set):** top/parallel (albedo, w/ grey card+ruler) · cross-pol albedo · 45° raking (relief/QA) · macro close-up (chip/aggregate grain) · side/cut edge (proves it's a *system* w/ layer thickness) · optional warm-window variant.

**Cheap cross-pol shopping list (USD):**

| Item | Why | Rough price |
|---|---|---|
| Linear polarizing film, A4 sheets (K&F / Selens, ~99.9%) — cut to fit lights | polarizer on the **light** side | $10-18 / 2-4 sheets |
| CPL filter for your lens thread (match diameter, e.g. 67mm) | polarizer on the **lens** side; rotate to cross | $15-30 budget · $65 "true-color" low-cast |
| Grey card 18% + white | WB + exposure anchor | $8-15 |
| X-Rite ColorChecker Passport Photo 2 *(upgrade)* | full color profiling — the `approved` gold standard | ~$90-120 |
| 2 LED/flash lights + tripod | — | (already have) |

> **Floor-minimum kit ≈ $35** (A4 film + budget CPL + grey card). **"Approved" kit ≈ $130** (add ColorChecker).
> Links: K&F A4 film https://www.amazon.com/dp/B0C2P9P833 · Selens 2-pack https://www.amazon.com/dp/B0D2DK3XV9 · 67mm true-color CPL https://www.kentfaith.com/KF01.2893_67mm-true-color... · ColorChecker https://www.bhphotovideo.com/c/product/1043609-REG/

### Step 2 — PBR generation (free tool chain)

1. **RawTherapee / Darktable** (free) — RAW develop, grey-card WB, linear-tone albedo calibration, export 16-bit TIFF/PNG.
2. **Materialize** (free, open-source) — single albedo → **Normal, Roughness, AO, Height** with live 3D preview + seam help. Core photo→4-maps engine.
3. **GIMP / Photoshop / Affinity** — delight (duplicate layer → blend mode **Luminosity** → **High Pass** to flatten large-scale lighting, then clone out stubborn shadows), seam cleanup, crop to **power-of-two**. (Cross-pol + flat light makes delighting minor — that's the point.)
4. **Quixel Mixer** (now free, offline) — optional richer height/mixing fallback.
5. **Paid upgrade (owner approval required):** Substance 3D Sampler — AI Image-to-Material + **Delight (AI)** + path-traced preview for the render-vs-real loop. $24.99/mo Texturing plan. Only buy for a batch.
6. **Roughness from the parallel-pol shot:** the un-polarized capture tells you how shiny the real surface is → set the scalar roughness + author the roughness *map* variation (polished high spots vs slightly rougher chip boundaries).

### Step 3 — Blender validation

Re-photograph the physical sample at a **known angle under known light**; in Blender (Cycles/path-traced) place one light at the **same angle** and compare side-by-side. Adjust roughness (from the parallel shot) + normal strength until relief/sheen match. Blender is the high-fidelity ground truth before porting to the lower-cost Three.js shader. (MCP Blender tooling is available in this environment for an automated probe render.)

### Step 4 — Three.js implementation

Port to `MeshPhysicalMaterial` per §4. Same maps, same real-world `repeat`, neutral HDRI, contact shadow. The existing `configurator.html` `loadTex()`/`refreshCompositeMap()` path is the integration point — extend it, keep the etalon mobile behavior intact.

### Step 5 — Side-by-side comparison with the real reference

Final gate (§5): screenshot the Three.js slab next to the cross-pol macro + the known-angle photo. Only when chip color, sheen, relief, and edge read true does the material flip to `approved_real_sample` in the manifest.

---

## 3. Exact asset list — FLAGSHIP "Epoxy Terrazzo Light Grey / White Aggregate"

**Manifest id:** `terrazzo-light` (already in `materials.config.json` v17, `code: TL`, system `terrazzo`, base эпоксидная смола, buildup = Sikafloor-156 primer + 264 white body + multicolor chips + 304W PU topcoat).
**Texture slug / directory:** `3d-assets/textures/terrazzo-multi/` (existing placeholder set lives here — replace file-by-file as the real sample is shot).
**STATUS: `needs_calibration`** — every value below is a defensible starting point from the research; nothing flips to `approved_real_sample` until a real sample is shot, cross-pol captured, and passes §5.

### 3a. Sample photos to shoot (Lane B preferred)

| File | What | Notes |
|---|---|---|
| `samples/terrazzo-light/top.dng` | top/parallel albedo | grey card + ruler in frame |
| `samples/terrazzo-light/top_xpol.dng` | **cross-pol albedo** | color of record |
| `samples/terrazzo-light/45deg.dng` | 45° raking light | relief / normal+height intuition + QA |
| `samples/terrazzo-light/macro.dng` | macro close-up | white-aggregate chip grain (target chip size #1-#2, ~2-6 mm) |
| `samples/terrazzo-light/edge.dng` | side / cut edge | exposes sliced chips → side-edge texture + proves the 12 mm system |
| `samples/terrazzo-light/greycard.dng` | ColorChecker/grey frame | WB + linear-albedo calibration reference |

### 3b. PBR maps to generate (write into `3d-assets/textures/terrazzo-multi/`)

| Map | File | colorSpace | Source | Status |
|---|---|---|---|---|
| Albedo / diffuse | `diffuse.jpg` | **SRGBColorSpace** | cross-pol top, delit, tileable, 2K(mobile)/4K(desktop) | needs_calibration |
| Normal | `normal.png` | NoColorSpace | Materialize from 45° + albedo (DirectX or GL — verify green channel in Blender) | needs_calibration |
| Roughness | `roughness.png` | NoColorSpace | from parallel-pol shot; polished chips darker (glossier), matrix lighter | needs_calibration |
| AO | `ao.png` | NoColorSpace | Materialize; needs **UV channel 1** in Three.js or it's ignored | needs_calibration |
| Displacement *(optional)* | `height.png` | NoColorSpace | only if exposed-aggregate relief is visible; needs tessellated plane | optional / off by default |
| Side-edge | `edge_diffuse.jpg` (+ `edge_roughness.png`) | sRGB / data | from `edge.dng` cross-section — sliced chips, denser, matte | needs_calibration |

### 3c. Material values (MeshPhysicalMaterial — this is a *sealed* epoxy terrazzo → clearcoat is mandatory)

```
metalness            = 0.0          // ALWAYS for floors (dielectric)
roughness            = 0.45         // base; honed-to-satin epoxy terrazzo. roughnessMap modulates.
clearcoat            = 0.9          // PU/resin topcoat (Sikafloor-304 W, 2 coats)
clearcoatRoughness   = 0.06         // satin-gloss sealed look; lower=sharper mirror, higher=satin
ior                  = 1.5          // resin/varnish — leave default, do NOT fake
reflectivity         = 0.5          // = IOR 1.5 — leave default
normalScale          = (0.85, 0.85) // matches existing configurator value; lower for subtler relief
envMapIntensity      = 1.0          // honest baseline; do NOT boost (fakes gloss, shifts color)
```

- **Finish toggle mapping (must keep working with the existing `applyControlEffect`):** matte `roughness 0.85, clearcoat 0.7, ccRough 0.4` · satin `0.45 / 0.9 / 0.06` (default) · polished `0.12 / 1.0 / 0.03`. Gloss comes from **clearcoat**, never from lowering base roughness or raising metalness — that preserves the white-aggregate chip color while the surface gains room reflections.

### 3d. Side-edge texture + bevel

- **Side faces** of the slab box = a *cut-edge* material: `edge_diffuse.jpg` (sliced chips, flat), roughness ~0.75-0.85, **clearcoat 0 / low** (a raw cut isn't sealed). This is the honesty detail competitors miss.
- **Bevel:** ~**2 mm** chamfer on the top edge (`RoundedBoxGeometry` radius ≈ 0.002 m, or modeled) so a thin lit fillet catches the key light → machined, premium read; avoids the razor-thin CG edge.

### 3e. Chosen HDRI

- **Default:** `studio_small_08` (download → `3d-assets/textures/_hdri/studio_small_08.hdr`, 4K) at `toneMappingExposure 1.0`. Replaces the current warm `brown_photostudio_02.hdr`.
- **Daylight Room toggle:** `glasshouse_interior.hdr` @ 0.9. **Gloss preset:** `studio_small_03.hdr` @ 0.8.

### 3f. Reference-card fields (store alongside the material; surface on the Sample view)

```yaml
id: terrazzo-light
display_name_en: "Epoxy Terrazzo — Light Grey / White Aggregate"
collection: "Designer"          # Monochrome | Aggregate | Designer
code: "TL"
binder: "Epoxy (Sikafloor-264 white)"
color_freedom: "Unlimited"      # epoxy → Western States grade
chip_grade: "#1-#2 (Traditional-Standard)"
chip_size_mm: "2-6"
aggregate: "white marble + multicolor"
finish: "satin (PU topcoat, 2 coats)"
system_thickness_mm: 12
physical_sample_size_mm: "100x100"   # matches UI sample-kit
texture_real_world_coverage_m: 0.50  # what one tile represents — calibrate against macro
hdri: "studio_small_08"
status: "needs_calibration"          # -> approved_real_sample after §5
screen_accuracy_note: "Colors and textures on screen are a PBR simulation and are not as accurate as a real sample."
```

---

## 4. Three.js implementation checklist (r0.158.0 — matches repo)

### Renderer

```js
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));   // cap at 2 — Retina killer
renderer.outputColorSpace = THREE.SRGBColorSpace;               // default since r152, set anyway
renderer.toneMapping = THREE.ACESFilmicToneMapping;             // industry default
renderer.toneMappingExposure = 1.0;                             // tune per HDRI (§1c table)
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// r155+: physically-correct lights are default (useLegacyLights=false). Build the scene in METERS.
// If EffectComposer/SSAO is added later: move toneMapping+sRGB to OutputPass at end of chain.
```
*Do NOT cargo-cult Three.js Journey's exposure≈3 / light intensity≈6 — that's tuned to a bright outdoor HDRI and blows out a neutral studio.*

### Material (MeshPhysicalMaterial for sealed; MeshStandardMaterial for matte-only to save shader cost)

Use §3c values. `metalness = 0` always. Gloss via `clearcoat` + `clearcoatRoughness`, not base roughness.

### Textures / colorSpace / anisotropy

```js
albedo.colorSpace = THREE.SRGBColorSpace;        // color
// normal/roughness/ao/height = NoColorSpace (default) — DO NOT set sRGB (the #1 muddy-PBR bug)
const maxAniso = renderer.capabilities.getMaxAnisotropy(); // ~16
[albedo, normalTex, roughnessTex, aoTex].forEach(t => {
  t.anisotropy = maxAniso;                        // mandatory for grazing-angle floors
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
});
// aoMap reads UV CHANNEL 1 in r152+ (no longer uv2). For a flat slab, duplicate UVs:
geometry.setAttribute('uv1', geometry.attributes.uv);   // else AO silently does nothing
// Ship KTX2/Basis + power-of-two + mipmaps for mobile.
```

### HDRI / PMREM (neutral — do not tint the floor)

```js
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
const pmrem = new THREE.PMREMGenerator(renderer);   // ONE generator, reuse, dispose once
// Fastest neutral, zero-asset:
scene.environment = pmrem.fromScene(new RoomEnvironment()).texture;
// OR our chosen HDRI (preferred for realistic window reflections):
new RGBELoader().load('3d-assets/textures/_hdri/studio_small_08.hdr', (hdr) => {
  hdr.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = pmrem.fromEquirectangular(hdr).texture;
  hdr.dispose();
});
scene.environmentIntensity = 1.0;                   // Scene-level (r163+); keep ~1.0
// scene.background = brand Concrete/Carbon, NOT the env.
```

### Contact shadow / AO (don't let the slab float)

- **Contact-shadow plane** (the `examples/webgl_shadow_contact.html` technique): render the slab underside into a small depth RT, H/V-blur it, map onto a ground plane just under the slab. Crisp under, soft at edges, no per-frame cost for a static slab. **OR** one `DirectionalLight castShadow`, `shadow.bias = -0.0001`, `shadow.radius ≈ 4`, `mapSize 2048`, tight ortho frustum; `ground.receiveShadow = true`.
- Keep **both** `aoMap` (micro-occlusion in the texture) and a contact shadow (macro grounding) — different scales.
- Optional desktop-only SSAO/GTAO to deepen the contact line + bevel crevice (forces tone mapping into `OutputPass`).

### Real-world texture scale (the premium-vs-toy difference)

```js
// Demo slab = real sample size. UI sample-kit is 100x100mm; research math example used 0.6 m.
const SLAB_M = 0.6;          // or 0.10 for a true 100mm sample chip
const TEX_COVERS_M = 0.50;   // real area one texture tile represents (from the in-frame ruler)
const r = SLAB_M / TEX_COVERS_M;            // 1.2
[albedo, normalTex, roughnessTex, aoTex].forEach(t => t.repeat.set(r, r)); // SAME repeat on all
```
Target texel density ≈ **2048 px/m** (≈52 px/cm) so a 2 mm chip is ~4 px and reads as a real chip, not noise. Keep the same `repeat` across albedo/normal/roughness or the relief desyncs from the visible chips.

### Slab geometry

Thin box `0.6 × 0.02 × 0.6 m`. BoxGeometry material array order `[+X, -X, +Y(top=2), -Y(bottom=3), +Z, -Z]`: top = sealed material (§3c), 4 sides = cut-edge material (§3d), bottom = cheap plain. ~2 mm bevel on the top edge. Plane `widthSegments/heightSegments ≥ 128` **only** if using a displacementMap (else a flat plane; default to normal-only on mobile).

### Mobile / Retina

`setPixelRatio(Math.min(dpr, 2))` · KTX2/Basis compressed textures + power-of-two + mipmaps · normalMap over displacementMap · skip SSAO on phones (use the baked contact shadow) · MeshStandardMaterial for matte finishes to save shader cost · 1K HDRI input is plenty post-PMREM.

---

## 5. Quality checklist

### Render-vs-real comparison method (the gate to `approved_real_sample`)

1. Re-photograph the physical sample at a **known camera angle under a known single light.**
2. In Three.js (and/or Blender first), place one light at the **same angle**, same slab size, neutral HDRI at the documented exposure.
3. Screenshot the render **next to** (a) the known-angle photo and (b) the cross-pol macro.
4. Compare: chip color & distribution, base/matrix tone, sheen/gloss level, surface relief, edge read.
5. Iterate roughness (from the parallel-pol shot) + normalScale + exposure until it matches. **Only then** flip status to `approved_real_sample`.

### The "looks fake" list — if any is true, it's not shippable

- [ ] Floor reads metallic/steely → `metalness ≠ 0`. **Set to 0.**
- [ ] Matte microcement looks **wet** → roughness too low or an accidental clearcoat.
- [ ] Chips look washed-out/plasticky → gloss was faked by lowering base roughness instead of using clearcoat.
- [ ] Muddy / too-dark / over-contrasty surface → a normal/roughness/AO map was set to `SRGBColorSpace` (must be `NoColorSpace`).
- [ ] AO map does nothing → missing **UV channel 1** (`uv1`).
- [ ] Far half of the slab turns to mush at a grazing angle → **anisotropy** not set to max on all maps.
- [ ] Chip size looks wrong / texture stretched → `repeat` not derived from real-world coverage; or `repeat` differs across maps.
- [ ] Slab **floats** → no contact shadow / AO grounding.
- [ ] Color is tinted golden/blue → warm or colored HDRI used as the color reference (use `studio_small_08`).
- [ ] Razor-thin CG edge / no cut-aggregate on the side → missing bevel + side-edge material.
- [ ] Blown-out highlights → `toneMappingExposure` too high for the HDRI; or cargo-culted exposure≈3.
- [ ] Janky/shimmering on mobile → uncapped pixelRatio, no KTX2, non-power-of-two, no mipmaps.

### What MUST be fixed before publishing

- Material status is `approved_real_sample`, **not** `needs_calibration` (or the card is clearly labeled "preview / reference").
- Every shipped texture/HDRI is **CC0 or owned** — no Poliigon/Substance/Architextures/paid files served to the browser.
- The screen-accuracy disclaimer is visible **beneath the sample**, not buried in a footer.
- Swatch/thumbnail renders the **composite** (binder + chips), never a flat matrix color.
- Neutral default HDRI (`studio_small_08`) replaces the warm `brown_photostudio_02.hdr`.
- DESIGN.md brand check: configurator UI uses only the Industrial Proof palette, one Signal point, Cormorant/Montserrat, no emoji; run the design.md linter (0 errors).

---

## 6. Action plan (Mac + iPhone, free tools first)

### TODAY (no purchases, no real sample yet — get the rig honest)

1. **Swap the default HDRI to neutral.** Download `studio_small_08` (4K `.hdr`) from https://polyhaven.com/a/studio_small_08 → `3d-assets/textures/_hdri/studio_small_08.hdr`; wire it via `RGBELoader`+PMREM at `toneMappingExposure 1.0`. Drop the warm `brown_photostudio_02.hdr` from the color path.
2. **Audit the live configurator material against §4.** Verify `metalness=0`, anisotropy=max on all maps, `albedo.colorSpace=SRGBColorSpace` + others `NoColorSpace`, AO has `uv1`, `repeat` is identical across maps. Fix any "looks fake" item already present.
3. **Pull CC0 benchmark placeholders** (license-clean) into `3d-assets/textures/terrazzo-multi/` as the interim flagship: Poly Haven Terrazzo Tiles (downscale to 4K, retouch grout) + an ambientCG large-chip alt — clearly tag the manifest `status: needs_calibration` / "preview".
4. **Stamp the manifest reference-card fields** (§3f) on `terrazzo-light` and add the screen-accuracy disclaimer string.
5. **Add the side-edge + 2 mm bevel** to the slab geometry (multi-material box) using the placeholder edge texture — the structural honesty win is free and independent of the real sample.

### TOMORROW (capture the flagship for real — ~$35 kit)

6. **Buy the floor-minimum kit:** A4 linear polarizing film + a budget CPL (match your lens thread) + an 18% grey card.
7. **Shoot the real sample** (Lane B if a camera is available, else Lane A iPhone): the full §3a shot list under soft indirect daylight, grey card + ruler in frame, cross-pol crossed.
8. **Generate the 4 maps free:** RawTherapee (linear albedo calibration, 16-bit) → Materialize (normal/rough/AO/height) → GIMP delight + seam + power-of-two. Write into `terrazzo-multi/`.
9. **Validate in Blender** (path-traced, light at a known angle) vs the real photo; tune roughness from the parallel-pol shot.
10. **Port + run §5 comparison** in Three.js; iterate to match; capture the side-by-side.

### AFTER FLAGSHIP APPROVED

11. Flip `terrazzo-light` to `status: approved_real_sample`; publish the side-by-side as proof.
12. Convert shipped textures to **KTX2/Basis** + power-of-two; keep originals as the gloss benchmark.
13. **Roll the SOP to the next 2-3 systems** in priority order: polished concrete (cgbookcase CC0 base + real sample), microtopping (2-axis color grid; build owned procedural microcement), epoxy gloss (owned procedural: pigment-param base + clearcoat). One material a session at the documented token pace.
14. **Only if batch volume demands it:** request owner approval for 1 month of Substance Sampler (AI delight + path-traced compare).
15. Re-run the design.md linter and the existing configurator smoke/screenshot checks before any deploy; keep etalon commits (`cc421cf`, `076fdbc`, `23ed628`, `db80612`) untouched.

---

*Sources are inlined per section above. Primary picks: Three.js r158 docs · Western States Terrazzo (visual/vocabulary) · Poly Haven Terrazzo Tiles (CC0 PBR) · Poly Haven Studio Small 08 (CC0 neutral HDRI) · racoon-artworks (cross-pol capture) · Materialize (free photo→PBR).*
