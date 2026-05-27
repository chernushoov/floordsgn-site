# Configurator UX Audit — `/configurator.html` (FD-CFG v2.05)

Date: 2026-05-27
Tester: automated Playwright walk-through (`scripts/configurator-audit.js`, `scripts/audit-extra.js`)
Build: working tree `feature/factory-content-pipeline-2026-05-12`, `configurator.html` unchanged from HEAD.
Method: headless Chromium @ 1440×900 DPR=1, serves repo on `127.0.0.1:5480`, clicks every material chip and the first + last option of every control attached to that material, snapshots the stage region, decodes PNG → RGBA via `sharp`, computes pixel-mean-absolute-error similarity (resized to 160×100, RGB only). Threshold:
- `change=yes` → similarity < 0.97 (clearly different render)
- `change=subtle` → 0.97 ≤ similarity < 0.995 (user may not notice)
- `change=no` → ≥ 0.995 (button does nothing visible)

Raw data: `docs/research/configurator-audit-data.json` (90 interactions + 1 console error + 2 CTA dialogs)
Screenshots: `_screens/configurator-audit/` (104 PNGs)

---

## 1. Summary

| Bucket | Count | % |
| --- | --: | --: |
| Total interactions | 86 (first/last per control × 9 materials, plus 8 view tests) | 100% |
| Working (visible change) | 42 | 49% |
| Subtle (sub-perceptual) | 32 | 37% |
| Dead (no visible change) | 12 | 14% |

12 dead controls + 32 sub-perceptual changes = **51% of interactions fail to communicate a real result to the user**.

Critical UX failure: the **color picker is functionally broken on 7 of 9 materials**. Of 18 color-button clicks, 11 produce "no change" or "sub-perceptual change" — including dark colors like Бордо (#943f37) and Антрацит (#293133), which the owner specifically flagged.

`Системный пирог` sidebar updates correctly when the user switches material (4/4 unique), but **never reflects user-selected options** (color, finish, stripes, marking, etc.) — even though those are part of the order CTA payload. Users have no way to verify what they configured against what is being ordered.

Console: 1 noise — `/favicon.ico 404`. No JS exceptions, no shader errors.

---

## 2. Defect matrix

Severity scale:
- **P0** — feature is misleading or broken in a way that would lose a sale (e.g. wrong color picker, wrong colors)
- **P1** — control is dead or visibly broken on a specific material
- **P2** — subtle / cosmetic / overlapping behavior, won't lose a sale but feels janky

| # | Material | Control | Option(s) | Expected | Actual | Severity |
| - | --- | --- | --- | --- | --- | --- |
| 1 | **ALL materials** | color | Бордо (#943f37) → dark wine | Plate stays pale beige; mean canvas color of epoxy after Бордо = `rgb(168,159,151)` (washed grey-beige). No visible red anywhere. | **P0** |
| 2 | **ALL materials** | color | Антрацит (#293133) → near-black | Plate stays pale beige; mean canvas color of epoxy after Антрацит = `rgb(163,156,148)` — **lighter than Бордо**, both unidentifiable as the selected RAL. | **P0** |
| 3 | terrazzo-epoxy | color | any | similarity 0.997 vs base, mean colors barely move (rgb 194/186/172 → 196/191/176). Color does nothing on the marquee material. | **P0** |
| 4 | parquet, mma, pu-cement, decorative-concrete, microtopping, rubber, epoxy | color | first + last options | similarity 0.995–0.999 — color picker is **dead** on 7 of 9 materials. | **P0** |
| 5 | terrazzo-cement, terrazzo-epoxy | stripes | Чёрные | Single decorative inlay between plates (саргелим). Reality: 25+ vertical stripes tiled across the surface because the canvas stripe is drawn inside the 1024px texture and `tile=2 or 5` repeats it. Worse, on `terrazzo-epoxy` aggregates completely cover stripes (sim 0.99) — zero visibility. | **P1** |
| 6 | epoxy | stripes | brass / steel / black | Same tiling issue — many thin vertical lines instead of one or two decorative bands. Tile factor 5 → 25 lines. | **P1** |
| 7 | decorative-concrete | stripes | Чёрные | sim 0.9896 — visible but only as faint tiled noise. | **P2** |
| 8 | microtopping | stripes | Чёрные | sim 0.9827 — same tiling problem; intent unclear. | **P2** |
| 9 | epoxy | marking | yellow / white / red | Should paint a SINGLE bold zone-marking line. Instead draws ~5 parallel lines because the 1024px marker is laid down once but the topcoat tile factor is 5. Looks like prison-yard striping, not industrial разметка. | **P1** |
| 10 | mma, pu-cement, rubber | marking | red / yellow | Lines drawn but tile factor (4) multiplies them. Same root cause as #9. | **P2** |
| 11 | epoxy, mma | flecks | Металлики vs Нет / Красные крупные | Flecks DO render (red and silver dots clearly visible on epoxy), BUT random seed includes color leakage from prior flecks state in the noise pattern. Acceptable result, minor seed-stability issue. | **P2** |
| 12 | **terrazzo-epoxy, terrazzo-cement** | aggregates | Белый мрамор / Зеркало | sim 0.91–0.93 — aggregates DO swap (Voronoi terrazzo cells visible), but visual differences between palettes (white-marble vs mirror vs glass) are subtle — colors very similar. | **P2** |
| 13 | ALL | finish | matte / satin / polished | Roughness map gets nulled out (`mat.roughnessMap = null`) and replaced with a flat value. Visible difference is small (0.97–0.99 similarity); user can't tell matte from polished without scrubbing. | **P2** |
| 14 | ALL | gloss | low / mid / high | **Conflicts with finish** — both write `mat.roughness`; last-clicked wins. UI keeps both highlighted as `.on`, but only one has effect. | **P1** |
| 15 | parquet | finish/gloss | polished + high | sim 0.974 — barely visible polish, parquet looks the same matte across all three. | **P2** |
| 16 | pu-cement | color | Кварцевый / Бордо | sim 0.998 — color picker dead. PU-cement shows as brown-textured but never recolors. | **P0** (same root cause as #1) |
| 17 | rubber | color | Бордо | sim 0.995 — color dead on rubber too. | **P0** (same root cause) |
| 18 | epoxy view | Solid | — | Plate returns to 3/4 view. sim 0.92 vs base. **Works**. | OK |
| 19 | epoxy view | Layers | — | Topcoat lifts up; 3-layer "пирог" reveal. sim 0.87 (largest delta of any control). Effect is great. **Works**. | OK |
| 20 | epoxy view | Top | — | Camera moves to (0.001, 0.85, 0.001) but the plate is still rendered at perspective; result looks like *steep* angle, not true top-down ortho. The chamfer + side faces are still visible. Misleading. | **P2** |
| 21 | epoxy view | Reset | — | Resets CAMERA only — does NOT clear the `orderState[slug]` options. After clicking Reset, all previously-chosen color/finish/stripes/marking buttons remain `.on` and the composite map is unchanged. Misleading: user expects "start over". | **P1** |
| 22 | All materials | Системный пирог | any option click | Pirog text never updates when user picks color/finish/stripes/marking/etc. Only updates on material switch. The order CTA payload includes the options, but the user never sees them reflected. | **P1** |
| 23 | All materials | UI state | finish + gloss simultaneously | Both buttons remain `.on` after sequential clicks — no mutex / no warning. Internally only one wins. | **P1** |
| 24 | All | Реset of options | — | No button anywhere clears `orderState` for a material. View → Reset is camera-only. | **P1** |
| 25 | favicon | — | — | `/favicon.ico` 404 — only console error. | **P2** |

---

## 3. Console errors / exceptions log

Captured during full 9-material walk (90 interactions):

```
[console.error] Failed to load resource: the server responded with a status of 404 (Not Found)
```

Root cause: `/favicon.ico` is requested by Chromium for every page load and the site has no favicon at the root. No app-side JS error, no shader error, no GL warning, no `pageerror`.

CTA dialogs (verified handlers fire):

```
[alert] Формула собрана:
{
  "material": "epoxy",
  "options": { "color": "ral-7032", "flecks": "none", "stripes": "none", "finish": "matte", "gloss": "low", "marking": "yellow" }
}
Этот state передаётся в систему заказа через URL-параметры.
[alert] Sample-kit 100×100 мм для материала: epoxy
```

URL state encoding after order CTA: `?fd_material=epoxy&fd_state=%7B%22color%22%...%7D` — restoreFromURL path works, options round-trip.

---

## 4. Specific findings on the 5 known problem areas

### 4.1 Color picker washes colors toward white — **CONFIRMED, severe**

`applyControlEffect` (`configurator.html:994-1018`):

```js
if (cid === 'color' && opt.hex) {
  const c = new THREE.Color(opt.hex);
  const lum = 0.2126*c.r + 0.7152*c.g + 0.0722*c.b;
  const lerpAmount = 0.55 + (1 - lum) * 0.25;   // 0.55..0.80 toward WHITE
  c.lerp(new THREE.Color('#ffffff'), lerpAmount);
  mat.color.copy(c);
}
```

The lerp blend toward white is between 55% and 80% depending on luminance. For dark colors (low `lum`), `lerpAmount` is *highest* (0.80), so dark colors get pushed *more* toward white than light ones. End result:
- Бордо `#943f37` (lum ≈ 0.16) → 0.79 white = `rgb(207,191,189)` — pale pink-grey
- Антрацит `#293133` (lum ≈ 0.13) → 0.79 white = `rgb(206,205,205)` — pale grey
- Кварцевый `#b8b1a0` (lum ≈ 0.69) → 0.63 white = `rgb(232,228,221)` — near-white

Modulating against the textured `mat.map` further desaturates because color * texture preserves only the darkness of the texture, not the hue chosen. Owner is right: every color reads as pale beige.

Mean canvas-pixel color confirms (sampled from cropped plate region, near-white background excluded):

| Material | Color | Expected hex | Observed mean | Should-be ~mean |
| --- | --- | --- | --- | --- |
| epoxy | Кварцевый | #b8b1a0 | rgb(163,156,148) | rgb(184,177,160) |
| epoxy | Бордо | #943f37 | rgb(168,159,151) | rgb(120,55,50) |
| epoxy | Антрацит | #293133 | rgb(163,156,148) | rgb(50,55,60) |
| terrazzo-epoxy | Бордо | #943f37 | rgb(194,186,172) | terrazzo so darker mid-tone |
| terrazzo-epoxy | Антрацит | #293133 | rgb(196,191,176) | should drop ~50 pts |

The white-bias is so heavy that **Бордо and Антрацит produce nearly identical observed RGB** on epoxy (mean Δ = 5 pts across rgb). Side-by-side: `epoxy-color-burgundy.png` vs `epoxy-color-anthracite.png` are pixel-twins to the human eye.

### 4.2 Stripes (саргелим / латунь / сталь / чёрные) — **PARTIALLY BROKEN**

Stripes use canvas-painted vertical bands at x = 15% and 78% of a 1024px tile (`configurator.html:565-578`). Combined with `tile = 2..5` of the topcoat material, this produces 4–10+ stripe pairs across the surface instead of one decorative inlay.

- `epoxy-stripes-black.png` — 10+ thin vertical lines (tile factor 5 → 2 stripes × 5 tiles = 10).
- `terrazzo-epoxy-stripes-black.png` — **zero stripes visible**: the Voronoi aggregates layer is painted *over* the stripes (or vice-versa with opacity 0.85 hidden by aggregates opacity 0.88).
- `terrazzo-epoxy-stripes-brass.png` (captured during targeted test, which happened to occur in TOP view) — also zero brass visible.
- `terrazzo-cement-stripes-black.png` — zero (aggregates dominate).

Conceptual problem: a single 30×30 cm plate is not the right object to demonstrate саргелим — саргелим is the brass/steel divider *between* plates. The current render-on-a-single-plate approach makes the inlay either a tile-aware geometry feature (it isn't here) or a non-existent feature.

### 4.3 Flecks (Красные крупные vs Металлики) — **VISIBLY DIFFERENT, MINOR ISSUES**

`epoxy-flecks-red-large.png` vs `epoxy-flecks-metallic.png`: visibly different.
- Red-l: warm red specks of varying size, density ~80 per 1024px tile.
- Metallic: cool silver/grey specks + small brass dots, density ~95.

Two minor issues:
1. The "red-l" image shows a few cold blue-looking specks too. Investigation: `red-l` palette is `['#c33b2e','#e68876','#5a1f17','#fff']`. Small dark-red dots (`#5a1f17`) at low-res alongside warm reds read as bluish in the eye. Acceptable but optimisable.
2. Flecks share `globalAlpha = 0.9` and paint ON TOP of any aggregates. On terrazzo-epoxy, flecks largely vanish under Voronoi chips. They are a topcoat-paint phenomenon and shouldn't apply to a terrazzo body anyway — should be hidden in the right-rail when `aggregates` is on.

### 4.4 Marking (разметка yellow / white / red) — **WORKS, BUT TILED & UGLY**

A single horizontal `lineWidth: 28` stripe at y=42% of the 1024 tile. With `tile=5` on epoxy, this multiplies to ~5 parallel yellow lines (`epoxy-marking-yellow.png`). Industrial разметка should be ONE highly visible zone-marker (e.g. across the centre of the floor), not a tile-repeating pattern.

Same root cause as stripes: drawing into a tile-able texture and then repeating the tile destroys the intent. The whole "stripes / marking" feature wants a separate non-repeating overlay decal, not a paint inside the diffuse tile.

### 4.5 Solid vs Layers vs Top vs Reset views

| View | Result | Comment |
| --- | --- | --- |
| Solid | 3/4 perspective of the assembled plate. Works. | OK |
| Layers | Topcoat lifts up, primer/substrate spread vertically. Reads beautifully as "пирог". **Best feature in the app.** | OK |
| Top | Camera goes to `(0.001, 0.85, 0.001)`, but `minPolarAngle = π * 0.18` clamps the angle back. Result is steep oblique, not true plan view. The plate side & chamfer are still visible. Doesn't match the "Top" label. | P2 |
| Reset | Camera resets to `(0.55, 0.42, 0.55)`. Does NOT reset `orderState` — all option `.on` buttons stay highlighted, the composite map is unchanged. Mislabelled — should be "Camera reset" or there should be a separate "Reset options" CTA. | P1 |

---

## 5. UX gaps (missing features, not bugs)

1. **No way to reset configured options.** Once you've clicked color + flecks + marking on a material, there is no UI to clear them on this material short of reloading the page. The "Reset" view button only moves the camera.
2. **Системный пирог never reflects user choices.** It updates on material switch only. Options like color, finish, gloss, stripes, marking are part of the order payload but never displayed back to the user. The user is asked to trust that what's on screen matches what gets ordered.
3. **Finish + Gloss are silent rivals.** Both write `mat.roughness`; UI keeps both `.on` after sequential clicks but only the last write persists. Either merge them into one control or make picking one auto-deselect the other.
4. **No price feedback.** Manifest has `pricing.ils_per_m2` per material (e.g. epoxy 180–260 ₪/m²) and `warranty_years` but the right rail never surfaces them. The CTA "Заказать эту формулу" pops an `alert()` with JSON — no price, no spec sheet, no PDF.
5. **CTA fires `alert()` instead of routing.** Both CTAs (Order, Sample-kit) emit a vanilla browser alert. No transition to /quote or /sample-kit forms. The order state URL is set on the same page; user has to manually copy it.
6. **No "current configuration" recap.** Right rail has Параметры (controls) and Системный пирог (material spec), but no "what you selected" tally. Pricing & lead-time hidden.
7. **No mobile-specific tested layout.** Audit ran 1440×900 only; the configurator's stage canvas autosizes but the left rail (chips) likely scrolls horizontally on mobile (CSS exists at line 162). Out of scope for this audit.
8. **No undo / no compare.** Cannot save two formulas to compare side by side.
9. **No way to know "this control is incompatible with that material".** E.g. flecks on a terrazzo body are visually swallowed by aggregates; the UI cheerfully lets you pick them. Should be gated or merged.
10. **No language toggle on this page** (rest of site has RU/EN). The page is RU-only.
11. **Hover preview popover** (`.matprev`) shows `previews/{slug}_light.png` but only on desktop and only on the left-rail; it disappears once the material is selected. Owner mentioned "первый показ" should be photo-realistic — these previews are exactly that asset, but they're hidden after selection. Could be surfaced as a corner thumb.
12. **No "Save & share" link.** The order CTA writes to URL but never copies the link to clipboard or shows it.
13. **No keyboard hint shown.** `↑↓` cycles materials, `Space` toggles explode, `T` = top, `R` = reset. Confirmed working but not advertised anywhere except a tiny `Drag ↻ orbit · scroll · explode` line.
14. **The "Top" view doesn't reset on material switch.** If you click "Top" on epoxy and then switch to parquet, the camera might re-orbit because of the breath/scroll/orbit code, but the user's view intent is lost.
15. **Aggregates palette is a name list, no chips.** Five options shown as text buttons (Белый мрамор, Чёрный мрамор, Цветное стекло, Перламутр, Зеркало). A 20-px swatch row would make the difference visible. Owner has called material-list chips a known issue.
16. **No camera-rotation control on desktop other than drag.** No "rotate left/right 30°" buttons; a designer wants to see the chamfer.

---

## 6. Screenshot inventory

All saved to `/Users/agentmachine/Work/02-Projects/floordsgn/floordsgn-site-new/_screens/configurator-audit/`. 104 PNGs total.

Naming: `<material>-<control>-<optionId>.png`, plus `<material>-00-base.png` (default selection), `<material>-view-<view>.png` (view buttons), and targeted checks `<material>-color-burgundy.png` / `<material>-color-anthracite.png` / `epoxy-flecks-red-large.png` / `epoxy-flecks-metallic.png` / `terrazzo-epoxy-stripes-brass.png` / `epoxy-marking-yellow.png`.

Key files for the bug review (open these first):

| File | What it shows |
| --- | --- |
| `epoxy-color-burgundy.png` | Бордо selected — pale beige plate, no red. |
| `epoxy-color-anthracite.png` | Антрацит selected — pale beige plate, no dark. Pixel-twin of burgundy. |
| `terrazzo-epoxy-color-burgundy.png` | Same washing effect on the marquee terrazzo material. |
| `terrazzo-epoxy-color-anthracite.png` | Twin of above. |
| `parquet-color-ral-3013.png` | Parquet with Бордо — looks identical to default parquet, color is dead. |
| `rubber-color-ral-3013.png` | Rubber with Бордо — orange/grey EPDM crumb, color barely registers. |
| `epoxy-stripes-black.png` | Many thin parallel vertical lines instead of two decorative inlays. |
| `terrazzo-epoxy-stripes-black.png` | Zero stripes visible — eaten by aggregates. |
| `terrazzo-epoxy-stripes-brass.png` | Zero brass visible (captured during top-view, but same problem on side view). |
| `epoxy-marking-yellow.png` | 5 parallel yellow stripes (tile multiplier × 1 marker = 5). |
| `epoxy-flecks-red-large.png` | Red flecks visible — works. |
| `epoxy-flecks-metallic.png` | Silver/brass flecks visible — works. |
| `epoxy-view-layers.png` | 3-layer explode — the standout effect of this UI. |
| `epoxy-view-top.png` | "Top" isn't really top — still see the side/chamfer. |
| `terrazzo-epoxy-aggregates-mirror.png` vs `terrazzo-epoxy-aggregates-marble-white.png` | Aggregates change works visually, palette differences subtle. |
| `microtopping-00-base.png` | A nearly-white, clean concrete-looking plate — base state for microtopping. |
| `parquet-00-base.png` | Herringbone-pattern wood — works. |
| `rubber-00-base.png` | EPDM crumb texture — works. |

Full filename list (alphabetical): see `ls _screens/configurator-audit/` (104 entries).

---

## 7. Closing — if I were rebuilding this from scratch

If I were rebuilding this from scratch, the top 3 changes would be:

1. **Burn the canvas-composite topcoat painter and replace with a real PBR pipeline.** Right now every option (aggregates, flecks, stripes, marking, color) is drawn into a 1024×1024 canvas that is then *tiled* 2–5× on the plate — which is why a single saved stripe becomes 10 stripes, a single marking line becomes 5, and `mat.color * texture` washes out any picked color. Move to a single non-tiled UV-mapped topcoat plane (the plate face is 300×300 mm, one UV island) with: (a) a real PBR diffuse for the *body*, (b) a separate decal-overlay texture for stripes/marking that is *not* tiled, (c) a tint pass that multiplies in linear space without lerp-toward-white. The color picker will then actually do what its name says.
2. **Make Системный пирог a live spec card — and put price on it.** Today the right rail shows the static material build-up; the user's actual choices (color, finish, stripes, etc.) are invisible until the alert popup at the end. Change the pirog into a configuration recap: `Цвет · Бордо · RAL 3013`, `Финиш · Полированный`, `Глянец · средний`, ending with `Цена · 180–260 ₪/m²` and `Гарантия · 5–10 лет`. The user always sees what they're about to order. And drop the alert() — route Order to /quote with the state already encoded in the form.
3. **Collapse `Финиш` and `Глянец` into one control, and add a real "Reset options" button.** They both control `mat.roughness` and currently fight; merge into a single "Финиш" with five steps (Mat / Soft satin / Satin / Semi-gloss / Mirror) mapping to one roughness scale. Then add an explicit "Сбросить параметры" link near the CTAs that actually clears `orderState[activeSlug]` and rebuilds the composite — so the user can start over without reloading. While at it, rename the camera "Reset" view button to "↺ Камера" so it doesn't promise to reset state.
