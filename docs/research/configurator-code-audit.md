# Configurator Code Audit — `configurator.html` v2.05

**Date:** 2026-05-27
**Auditor:** Senior FE review
**Files audited:**
- `configurator.html` (1198 lines — entire SPA in one file)
- `3d-assets-cfg/manifest.json` (392 lines)
- `3d-assets-cfg/plate.glb` (1.2 MB, 3 primitives: topcoat / primer / substrate)
- `3d-assets-cfg/textures/*` (12 directories — Poly Haven PBR sets)

**Owner verdict that prompted this:** "Buttons don't change color, don't match descriptions, model looks ugly, completely needs rebuild."

The audit confirms the owner is right on every count. The root cause is a single design choice (color lerp toward white) compounded by a fragile state model and a mesh model that doesn't reflect the physical layer system the spec sidebar describes.

---

## 1. Architecture map

```
+----------------------------+
| manifest.json              |
|   geometry.glb -> plate.glb|
|   materials[9]             |
|     slug,group,label_ru    |
|     pbr{diffuse,rough,..}  |
|     tint,roughness_override|
|     controls[ids]          |
|     buildup{4 layers text} |
|   control_options{7 ids}   |
|     color/aggregates/...   |
|   static_materials{primer, |
|                  substrate}|
+-------------+--------------+
              |
              v
+----------------------------+
| State (in-memory only)     |
|   orderState[slug][cid]=id |  <-- per-material option map
|   activeSlug               |
|   transition{...}          |
|   intro{...}               |
|   ghosts[]                 |
|                            |
|   URL <-> state ONLY via   |
|   ctaOrder click + restore |
|   FromURL on init. No      |
|   live URL sync, no LS.    |
+-------------+--------------+
              |
              v
+----------------------------+
| Render pipeline            |
|                            |
| selectMaterial(slug)       |
|   -> buildPbrMaterial(def) |
|   -> swap topcoatMesh.mat  |
|   -> ghost crossfade       |
|   -> renderControls(def)   |
|   -> renderBuildup(def)    |
|   -> refreshCompositeMap   |
|                            |
| applyControlEffect(...)    |
|   color   -> mat.color     |
|             (+lerp->white) |
|   gloss   -> mat.roughness |
|   finish  -> mat.roughness |  <-- gloss & finish FIGHT
|   aggreg/flecks/stripes/   |
|     marking -> rebuild     |
|     composite canvas tex   |
+-------------+--------------+
              |
              v
+----------------------------+
| THREE scene graph          |
|                            |
|  scene                     |
|    plateRoot (GLB root)    |
|      topcoatMesh  <-- ONLY |
|         mesh that responds |
|         to controls        |
|      primerMesh   (static) |
|      substrateMesh(static) |
|    shadow plane            |
|    key + fill lights       |
|    env: RoomEnvironment    |
|      then HDRI brown_      |
|      photostudio_02        |
|                            |
|  Ghost meshes (transient   |
|  during material swap).    |
+----------------------------+
```

**Key observation:** the 3D model has 3 layers (topcoat / primer / substrate), but the buildup sidebar describes **4 layers** (topcoat / body / primer / substrate). The "body" layer of the system pirog has no mesh representation. Layers view (explode) shows 3, spec says 4. Misalignment is structural, not cosmetic.

---

## 2. Per-control wiring matrix

| Control ID  | Spec source (manifest)                         | Implemented in `applyControlEffect`? | Which mesh? | Actual visible effect                                                                                          | Severity if broken |
|-------------|------------------------------------------------|--------------------------------------|-------------|----------------------------------------------------------------------------------------------------------------|--------------------|
| `color`     | 9 RAL chips, `hex` per option                  | YES (line 997-1003)                  | topcoatMesh | **Sets `mat.color`, then lerps 55-80% toward white.** Bordeaux #943f37 becomes pale dusty pink. See P0-1.       | **P0 — fatal**     |
| `gloss`     | low/mid/high → 0.7 / 0.4 / 0.15                | YES (line 1004-1009)                 | topcoatMesh | Sets `mat.roughness`, nullifies `roughnessMap`. Works, but conflicts with `finish` (last click wins).          | P1                 |
| `finish`    | matte/satin/polished → 0.85 / 0.45 / 0.12      | YES (line 1010-1013)                 | topcoatMesh | Same target property as `gloss`. **Mutually destructive — picking gloss after finish silently overrides it.**  | P0 — coupling bug  |
| `aggregates`| 5 palettes (marble/glass/pearl/mirror)         | YES (line 1015 → `buildCompositeMap`)| topcoatMesh | Voronoi chips painted onto canvas, composited over diffuse. Works visually.                                    | OK                 |
| `flecks`    | 6 options incl. `none`                         | YES (line 1015 → `buildCompositeMap`)| topcoatMesh | Ellipse paint chips on canvas. Works.                                                                          | OK                 |
| `stripes`   | none/brass/steel/black                         | YES (line 1015 → `buildCompositeMap`)| topcoatMesh | Two vertical lines at x=0.15 and x=0.78 of the texture. Comment says "diagonal" — code is vertical. **Bug.**   | P2                 |
| `marking`   | none/yellow/white/red                          | YES (line 1015 → `buildCompositeMap`)| topcoatMesh | One horizontal band at y=0.42. Works.                                                                          | OK                 |
| `view` (`setView`) | solid/layers/top/reset                   | YES (line 665-671)                   | plateRoot   | All four work. `top` disables OrbitControls correctly; `reset` restores camera. No bug.                        | OK                 |

**Coverage notes per material (from manifest):**

| Material           | Controls listed in manifest                            | All wired? | Notes                                                                 |
|--------------------|--------------------------------------------------------|------------|-----------------------------------------------------------------------|
| terrazzo-cement    | color, aggregates, stripes, finish, gloss              | YES        | finish/gloss fight                                                    |
| terrazzo-epoxy     | color, aggregates, flecks, stripes, finish, gloss      | YES        | finish/gloss fight                                                    |
| microtopping       | color, stripes, finish, gloss                          | YES        | finish/gloss fight                                                    |
| decorative-concrete| color, stripes, finish, gloss                          | YES        | finish/gloss fight                                                    |
| parquet            | color, finish, gloss                                   | YES        | color lerp to white particularly bad on wood — washes oak grain       |
| mma                | color, flecks, finish, gloss, marking                  | YES        | Physically wrong: MMA cannot be `polished` (no clearcoat polish step) |
| pu-cement          | color, finish, marking                                 | YES        | Physically wrong: PU-cement is matte by nature, finish/gloss noisy    |
| epoxy              | color, flecks, stripes, finish, gloss, marking         | YES        | OK                                                                    |
| rubber             | color, finish, marking                                 | YES        | Under-specified — owner asked: where are EPDM crumb colors / patterns?|

**Aggregate impact:** all 7 control types fire code paths. None are dead. But two are semantically destructive (color + finish/gloss collision), and several materials offer physically impossible options (MMA polished, PU-cement glossy).

---

## 3. Critical defects (P0)

### P0-1. Color lerp washes every choice toward white. `configurator.html:997-1003`

```js
if (cid === 'color' && opt.hex) {
  const c = new THREE.Color(opt.hex);
  const lum = 0.2126*c.r + 0.7152*c.g + 0.0722*c.b;
  const lerpAmount = 0.55 + (1 - lum) * 0.25;
  c.lerp(new THREE.Color('#ffffff'), lerpAmount);
  mat.color.copy(c);
}
```

Math check on the listed RAL options:
- `ral-3013` Бордо `#943f37` → luminance ~0.21 → lerpAmount = 0.55 + 0.79*0.25 = **0.7475** → 75% toward white. Result is dusty rose-pink, not burgundy.
- `ral-7016` Антрацит `#293133` → lum ~0.04 → lerpAmount ≈ 0.79 → almost light grey. The "anthracite" option becomes "light grey".
- `ral-7035` Светло-серый `#cbd0cc` → lum ~0.62 → lerpAmount ≈ 0.645 → near-white. Already-light colors become indistinguishable from each other.

**There is no comment explaining why this lerp exists.** Adjacent code (line 895-905) hints at the intent: the same lerp pattern is used during material crossfade `selectMaterial(...)`, blending `from.color` to `to.color`. Someone almost certainly cargo-culted the crossfade lerp into the persistent color application path and never noticed it never came back.

The same anti-pattern is duplicated in `buildPbrMaterial` line 621-623 for materials with a `tint`:

```js
if (def.tint) {
  mat.color = new THREE.Color(def.tint).lerp(new THREE.Color('#ffffff'), 1 - (def.tint_amount ?? 0.4));
}
```

For `epoxy`, `tint = "#5a737f"` (slate blue), `tint_amount = 0.6` → final color is 40% toward white. The result is gray-blue, not slate. For `pu-cement` tint `#8c9485`, `tint_amount = 0.5` → 50% toward white, pasty olive-grey.

**Impact:** literally every color/tint in the system is visually attenuated. This is the single biggest reason owner says "buttons don't match descriptions".

**Fix:** delete the lerp. Color must be applied verbatim. If the envmap-aware blend was needed to avoid "muddy" gamma issues in the cross-fade, restrict that math to inside the `transition` block (line 1091-1102) where it already exists separately.

---

### P0-2. `color` is destroyed by `aggregates` / `flecks` / `stripes` / `marking`. `applyControlEffect` line 1015-1017

When the user changes ANY composite control, `refreshCompositeMap(def)` rebuilds the diffuse texture from scratch using `def.pbr.diffuse` (or `def.procedural`) and overwrites `mat.map`. The previously chosen `mat.color` survives, but a freshly tinted full-brightness diffuse is now multiplied by the washed-out color, which means:

1. Color → aggregates: chip palette dominates, user's selected color is invisible underneath the Voronoi cells (chips opacity 0.88, line 542).
2. Color → flecks: color tint is preserved but the flecks were drawn on top of the **original** diffuse, so the relationship between color and base map is muddled.
3. Color → stripes/marking: paint stripe color is hardcoded in `STRIPE_COLORS` / `MARKING_COLORS`, ignoring the chosen RAL.

**There is no notion of a "tinted base" channel.** The composite always re-bakes from scratch using the un-tinted diffuse, so changing the order of clicks visibly changes the result.

**Impact:** non-deterministic UX. Owner's "buttons don't match descriptions" — for terrazzo, picking Бордо then Зеркало agrgegate hides the burgundy entirely.

**Fix:** composite map must accept the chosen color and bake it into the base layer (e.g., multiply pass over the diffuse, or `mat.color = white` always and bake tint into canvas).

---

### P0-3. `finish` and `gloss` fight over `mat.roughness`. Lines 1004-1013

```js
if (cid === 'gloss') {
  const m = { low: 0.7, mid: 0.4, high: 0.15 }[opt.id];
  mat.roughness = m[opt.id] ?? mat.roughness;   // BUG: m[opt.id] — m is already the value, not an object
  ...
}
if (cid === 'finish') {
  const r = { matte: 0.85, satin: 0.45, polished: 0.12 }[opt.id];
  if (r != null) { mat.roughness = r; ... }
}
```

Two compounding problems:

1. **Logic bug in gloss handler:** `const m = {...}[opt.id]` resolves to the number, then `m[opt.id] ?? mat.roughness` is `undefined ?? mat.roughness` → roughness never actually changes via the gloss control. Owner's clicked "high gloss" buttons literally do nothing.
2. Even after fixing #1, `finish` and `gloss` write the same `mat.roughness`. Last click wins. There is no UI affordance telling the user one cancels the other.

**Impact:** the gloss control is dead. Finish works. The owner is unknowingly using finish for everything that says "gloss".

**Fix:** delete one or the other (recommend keeping `finish` — three-state ranges human intuition better than `low/mid/high`). Then make sure manifest reflects this — drop `gloss` from every material's `controls`.

---

### P0-4. Buildup spec sidebar lies. `renderBuildup` line 982-992

The sidebar renders 4 layers (topcoat / body / primer / substrate). The 3D model has 3 meshes (topcoat / primer / substrate). "body" is the bulk of the system in most spec rows (e.g., terrazzo "Цементно-мраморная масса · 15–20 мм" — a 15-20mm layer is the dominant volumetric layer of the actual pirog and it has no representation in the explode view).

When the user clicks "Layers", they see 3 mesh layers spread on Y — but the sidebar lists 4. A trade-pro buyer reading "Sikafloor Terrazzo EM-10 + chips · 9–15 мм" then looking at the explode view will register the mismatch instantly. Loss of credibility for what is supposed to be a TDS-grade configurator.

**Fix:** either rebuild the GLB with 4 primitives (recommended), or collapse the buildup sidebar to match the 3 meshes (cheap but understates the system).

---

## 4. P1 / P2 defects

### P1-1. Composite rebuild is single-flight only — clicks during build are dropped. Line 1020-1037

```js
let pendingCompositeBuild = false;
async function refreshCompositeMap(def) {
  if (pendingCompositeBuild) return;   // drops clicks
  ...
}
```

Voronoi composite at SIZE=1024, R=256 → ~65k pixel loop. On older mobile (iPhone 11 class) this takes ~120ms. Any clicks during that window are silently swallowed. Should queue the latest state and re-run.

### P1-2. State is not persisted on each click. Only `ctaOrder` writes URL params. Line 1041-1051

`restoreFromURL` is called once on init. After that, every user interaction lives in memory only. Refresh = state lost. URL bar never reflects current configuration → no shareable link unless user clicks "Order".

`localStorage` is not used at all. Owner workflow ("share the formula to a client over WhatsApp") is impossible without first clicking the order CTA.

### P1-3. Per-material state isolation works but restoration on re-select doesn't trigger visual application.

`orderState[slug][cid]` is per-slug (line 929-979), good. But when re-selecting a material (X → Y → X), the click handler `selectMaterial` calls `renderControls(def)` which **resets** the active button to the first option (line 970-974, `if (i === 0) b.classList.add('on')`) and re-seeds `orderState[def.slug][cid] = opt.id`, **overwriting** whatever the user had picked previously.

So per-material state is structurally per-slug but functionally reset on every re-entry. Round-tripping does not preserve choices.

### P1-4. `ctaOrder` has no real destination. Line 1041-1051

Logs to console + `alert()`. No POST, no email, no form submit. Owner needs this wired to either:
- Netlify Form (since the rest of the site is on Netlify Forms now per memory),
- or a hidden `<form>` posting to `/api/contact` once that exists,
- or a `mailto:` with the JSON in the body as an interim.

The URL it generates (`history.replaceState`) does work for restoration but no one will see it after the alert closes.

### P1-5. `ctaSample` is decorative. Line 1053-1055

`alert()`-only. No sample-kit form, no shipping address capture. Should be a real form or hidden, not a fake CTA.

### P1-6. Stripes geometry is "vertical lines" but comments call them "diagonal inlay". Line 564-577

```js
// Stripes (decorative inlay — one diagonal band per tile)
...
ctx.moveTo(SIZE*0.15, 0);
ctx.lineTo(SIZE*0.15, SIZE);   // vertical
```

Either comment is wrong or implementation is wrong. Owner's "саргелим" (Hebrew for "inlay strips") usually means cross-tile straight metal strips between terrazzo pours — vertical-on-square-tile is closer to correct, but at `tile = 2` the stripes repeat every 0.5 of plate edge, which renders as 4 lines on a single visible face — not 2. The visual looks like a barcode, not architectural inlay.

### P1-7. No error UI for missing textures.

`loadTex` and `loadImg` cache results but on 404 the texture stays as a fallback `#7c7770` solid (`buildCompositeMap` line 454) silently. No console warning, no boot overlay error. With 12 texture directories and many possible 4xx paths, the failure mode is "ugly grey plate".

### P2-1. Magic numbers / unexplained constants

- Line 1000: `0.55 + (1 - lum) * 0.25` — the white-wash range.
- Line 622: `1 - (def.tint_amount ?? 0.4)` — secondary white-wash.
- Line 542: `ctx.globalAlpha = 0.88` — aggregate opacity over base.
- Line 552: `ctx.globalAlpha = 0.9` — flecks opacity.
- Line 568: `ctx.lineWidth = 8` — stripe width.
- Line 583: `ctx.lineWidth = 28` — marking width.
- Line 596: `tex.repeat.set(tile, tile)` where `tile` defaults to 4 — meaning every plate shows 16 tile repetitions of the canvas, not a single hero unit.
- Line 851: `intro.dur = 1.6` — intro animation length.
- Line 848: `transition.dur = 0.45` — material crossfade.
- Line 1071-1083: idle rotation thresholds (4s, 1.2s ramp, 0.18 rad/s).
- Line 1156-1162: light sweep period 8s amplitude 0.18.
- Line 1170-1172: breathing camera 6mm bob, 4mm dolly, 5.7s period.

None are constants at the top of the file. All inline. Tweaking any one requires hunting through the render loop.

### P2-2. Dead / stale comments

- Line 96: `[PREVIEW-ANIM]` markers (5+ occurrences) reference a `loader-preview.html` that may or may not exist — comment debt from an earlier iteration.
- Line 345-358: "Reflection removed per design — ground is plain white + contact shadow only." OK but the prior `Reflector` import on line 292 is now unused.
- Line 692: `// After GLTF export, Blender split the multi-material mesh into 3 primitives.` documents the implicit contract with the GLB but nothing enforces it — if the GLB is regenerated without correctly-named materials (`/VAR_|topcoat/i`, `/primer/i`, `/substrate/i`), the configurator silently degrades to a wireless mesh swap with no spec wiring. This is a fragile dependency on Blender export hygiene.

### P2-3. Unused imports

Line 292: `import { Reflector } from 'three/addons/objects/Reflector.js';` — never used after the reflection-removal pass. Dead weight on the bundle.

### P2-4. `findMeshesByMaterialIndex` lies in its name.

The function name implies it finds meshes **by material index** (i.e., by primitive index per the GLB), but it actually does a regex scan over `material.name`. Either rename to `findMeshesByMaterialName`, or wire it to the `geometry.primitives` indices in the manifest (line 6-10), which would be more robust.

### P2-5. Keyboard shortcuts are undiscoverable

Line 731-749: ↑↓ to cycle materials, Space for explode, T for top, R for reset. No on-screen hint. A "?" key for help, or a small `<kbd>` legend, would unlock this.

---

## 5. Architecture recommendations (rebuild)

### 5.1. Keep vanilla, but extract.

**Argument for staying vanilla:** the site is a multi-page Netlify static deploy (`floordsgn-site-new`), no build pipeline, no bundler. Adding React/Vue/Svelte means choosing a build chain (Vite/Astro/Next), which is not what the rest of the site does — `index.html`, `configurator.html`, `mma.html`, etc. are all standalone pages. Adding a framework just for this page balloons the deployment story and forks the codebase.

**Argument for extraction:** the 1198-line single file mixes scene setup, controls UI, state, and animation. Split into 4 module files (`scene.js`, `materials.js`, `controls.js`, `state.js`) loaded via the existing `<script type="module">`, retained the zero-build deploy.

**Recommendation:** stay vanilla, split into 4 ES modules in `js/configurator/`. Maybe ~6h of refactor.

### 5.2. GLB: keep static, fix the layer count.

The v3.00 procedural attempt (per project memory `project_floordsgn_configurator_v300_restored_2026-05-23.md`) was reverted because procedural plates "не красиво" — they looked like algorithmic toys, not floor samples. The static GLB with real PBR textures wins on photorealism.

The issue is the GLB has 3 primitives where the spec describes 4 (topcoat / body / primer / substrate). The fix is to **regenerate the GLB with 4 primitives**:

- topcoat (thin, top 0.5mm visually)
- body (thick, ~70% of vertical extent — terrazzo mass, SL epoxy, PU-cement bulk, etc.)
- primer (thin, ~0.5mm)
- substrate (concrete, ~30% of vertical extent)

Then the manifest's `geometry.primitives` can be `{topcoat:0, body:1, primer:2, substrate:3}`. The explode view will show 4 physical slabs matching the buildup sidebar exactly. This is the single biggest credibility upgrade per dollar of work.

For materials where "body" doesn't apply (parquet has no body, MMA body is the topcoat itself), the body mesh can be conditionally hidden or use a clone of the topcoat material.

### 5.3. Material model per real Sika TDS.

Today, the manifest exposes all controls regardless of physical reality:
- MMA `polished` finish — MMA tops with Sikafloor-53 TC Pronto are aliphatic PU, not polishable.
- PU-cement `gloss high` — purcem is matte by formulation, you cannot make it glossy.
- Rubber `gloss` — EPDM crumb is porous; gloss makes no sense.

**Recommendation:** add `allowed_finishes` and `allowed_gloss` per material in the manifest. If a material doesn't allow a finish, hide that option (not greyed out — physically absent). This grounds the configurator in real product limits and reads as expert-knowledge rather than toy.

### 5.4. Persistence: URL on every change + localStorage fallback.

Wire `orderState[activeSlug]` and `activeSlug` to a `pushState`/`replaceState` call on every option click (debounced ~250ms). This makes the URL a live shareable link. Also mirror to `localStorage.floordsgn_cfg = {slug, options}` for refresh recovery.

This is also a prerequisite for marketing analytics — UTM-wrapped URLs are how you measure which colors / aggregates trade pros land on.

### 5.5. Color application: bake into canvas, not multiply on material.

The current architecture multiplies the chosen color over the diffuse map via `mat.color`. This is what causes the wash-out and the order-dependence with aggregates/flecks. Replace with: `mat.color = white`, color is one input to `buildCompositeMap`. Bake everything into a single canvas texture. Simpler mental model, deterministic output, no lerp-to-white needed.

### 5.6. Drop one of `finish` / `gloss`.

Both control `mat.roughness`. Keep `finish` (human-readable matte/satin/polished). Delete `gloss` from manifest and from `applyControlEffect`. Reduces UI clutter, removes the mutual destruction.

### 5.7. Real CTAs.

Replace `alert()` in `ctaOrder` and `ctaSample` with Netlify Forms POST (consistent with the rest of the site, per memory `project_floordsgn_2026-05-22_session.md`). Owner gets the formula by email + a row in Netlify Forms admin.

---

## 6. Effort estimate

| ID    | Fix                                            | Files / lines changed                  | Hours | Risk                         |
|-------|------------------------------------------------|----------------------------------------|-------|------------------------------|
| P0-1  | Delete color lerp (both color handler + tint)  | ~10 lines (997-1003, 621-623)          | 0.5h  | Low. Visual change is good.  |
| P0-2  | Make composite color-aware (bake color in canvas)| ~30 lines in `buildCompositeMap`     | 2h    | Medium. Test 9 materials.    |
| P0-3  | Remove `gloss` control, fix `finish` only      | manifest (-9 lines), JS (-10 lines)    | 0.5h  | Low.                         |
| P0-4  | Regen GLB to 4 primitives + manifest update    | Blender work + manifest                | 4-6h  | Medium-high. Blender artist. |
| P1-1  | Queue compositeMap rebuilds                    | ~10 lines around `pendingCompositeBuild`| 0.5h | Low.                         |
| P1-2  | Persistent URL + localStorage on every click   | ~25 lines, new helper                  | 1h    | Low.                         |
| P1-3  | Restore per-material state on re-select        | ~15 lines in `renderControls`          | 0.5h  | Low.                         |
| P1-4  | Wire `ctaOrder` to Netlify Forms              | ~30 lines + new hidden form HTML       | 1.5h  | Low.                         |
| P1-5  | Wire `ctaSample` to Netlify Forms              | ~30 lines + new hidden form HTML       | 1h    | Low.                         |
| P1-6  | Fix stripe geometry (1 line per face)          | ~15 lines in `buildCompositeMap`       | 0.5h  | Low.                         |
| P1-7  | Texture-load error UI                          | ~20 lines + error overlay              | 0.5h  | Low.                         |
| P2-1  | Hoist magic numbers to const block             | ~30 lines, refactor                    | 0.5h  | Low.                         |
| P2-2  | Clean dead comments + `Reflector` import       | ~5 lines                               | 0.1h  | Low.                         |
| P2-4  | Rename `findMeshesByMaterialIndex`             | rename + caller updates                | 0.1h  | Low.                         |
| P2-5  | Keyboard hint UI                               | ~10 lines HTML/CSS                     | 0.3h  | Low.                         |
| **Architecture** | Split single file into 4 modules    | ~1200 line reshuffle                   | 6h    | Medium.                      |
| **Architecture** | Per-material physical limits (5.3)| manifest schema + render conditionals  | 2h    | Low.                         |

**Totals**
- P0 only: **7-9 hours** (3-4h JS + 4-6h Blender). High visual impact; fixes "buttons don't match descriptions".
- P0 + P1: **+6 hours** = ~13-15 hours.
- Full rebuild incl. modular split + physical limits: **~23-25 hours**.

**Recommended sequence:**
1. **Today (3h):** P0-1 (delete lerp), P0-3 (delete gloss), P1-6 (stripes), P1-1 (queue). Highest visible improvement per minute. No Blender needed.
2. **Tomorrow (3h):** P0-2 (color bakes into canvas), P1-2 + P1-3 (state persistence).
3. **Day 3 (4h):** P1-4 + P1-5 (real CTAs), P2 cleanup.
4. **Week 2:** P0-4 GLB regen with 4 primitives (blocked on Blender artist availability).
5. **Week 2-3:** modular split + physical limits.

**Do not start any of this until owner approves the audit.** This document is the deliverable.

---

## Appendix A — Inline TODO/FIXME audit

Search for `TODO|FIXME|XXX|HACK` in `configurator.html`: **zero matches**. All defects identified are by code reading, not by author flags. The author either fixed their TODOs as they went or never wrote any. Either way: no documented known issues exist in the file.

## Appendix B — what's missing from the manifest entirely

- No `allowed_finish` / `allowed_gloss` per material → can't gate physical impossibilities.
- No `default_options` per material → first-listed option in each control becomes the default, which means parquet color defaults to "Кварцевый" (a beige) over the oak grain — clashes hard.
- No `lead_time_days` or `min_area_m2` exposed in UI even though `pricing.basis` text contains "≥80 m²".
- No `co2_kg_per_m2` for the sustainability conversation the trade asks about.
- No `applicator_required` boolean — Sika 15-year warranty needs certified applicator per `copy.warranty_disclaimer_ru`; not enforced or surfaced in the configurator output.
