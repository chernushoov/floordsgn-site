# Hero 3D-block redesign — worklog (2026-05-09)

Branch: `enhance-features`
Backup tag: `pre-hero-3d-redesign-2026-05-09`
Backup branch: `backup/hero-3d-before-redesign-2026-05-09`
File snapshots: `_backups/hero-3d-2026-05-09/`

## Goal
Apple-grade material configurator: 3-column lab — material list LEFT, 3D plate CENTER,
dynamic per-material controls RIGHT. Fix header overlap, polish plate edges, add real
interactivity (every control mutates the plate visually), add `rubber` material.

## Files touched (only)
- `index.html` — replaced hero block (~163-243).
- `enhance.js` — extended `PALETTES` (added `rubber`, per-material `controls` & `edge` schema, `aggregateChips`, `flecksOverlay`, `system` URL builders), rewrote `fx.init3DPlate` with state object + dynamic re-render.
- `enhance.css` — appended new `/* ===== HERO LAB v3 (2026-05-09) ===== */` section with `.fx-hero-lab__*` rules; kept legacy `.fx-plate*` selectors intact (JS depends on `.fx-plate`, `.fx-l-*`, `.fx-face-*`).
- `dist/index.html` — auto-regenerated via `npm run build` (parcel).

## Layout changes
- Section padding-top: `clamp(128px, 16vh, 200px)` (header is 104px; reserves 24-96px breathing room).
- `scroll-margin-top: 120px` for clean anchor landing.
- Eyebrow + H2 + lede full-width (max-width 720px) above the lab grid.
- Grid: `260px minmax(0, 1fr) 320px` with `gap: 56px` on desktop, single col under 980px.
- Removed: `.fx-plate-mat-seg` segmented control, floating SKU cards, old `.fx-plate-meta-row` chip layout.

## Material list (LEFT)
Grouped by tiny eyebrow labels:
- ДЕКОРАТИВНЫЕ: terrazzo-dark, terrazzo-light, terrazzo, epoxy-light, micro, rubber
- ИНДАСТРИАЛ: epoxy, concrete, purcem, mma

Each row: 18×18 swatch dot + RU name. Active row = full-width dark fill (#1d1d1f / white text), hover = #f5f5f7.

## Right-column controls (per-material schema)
Source-of-truth for SKUs/RAL: `SIKA_CATALOG.md`. Each control group: uppercase 11px Montserrat eyebrow + button row (2-3 rows × 4-7 buttons).

- terrazzo* — Цвет основы / Агрегат / Саргелим / Финиш
- epoxy / epoxy-light — Цвет (RAL) / Флеки / Топкоат / Кварц-broadcast
- micro — Цвет / Финиш / Текстура / Топкоат
- purcem — Цвет / Поверхность / Толщина / Cove-base
- mma — Цвет / Cure / Кварц-broadcast / Топкоат
- concrete — Aggregate exposure / Polish grit / Sealer
- rubber — Тип / Цвет / Поверхность / Толщина

State binding: single delegated click handler on `.fx-hero-lab__controls`, reads `data-control`/`data-value`, mutates `state[material]` and re-applies plate.

## Live mutations (every control category visibly mutates plate)
1. **Color** → sets `--plate-base` & `--plate-body` CSS vars + recolors body face background, regenerates SVG terrazzo pattern with new base.
2. **Aggregate** (terrazzo) → swaps `chips` array and re-runs `buildTerrazzo` SVG.
3. **Саргелим** → toggles `.fx-hero-lab__strips` overlay over body face (repeating-linear-gradient at chosen color/spacing).
4. **Финиш** matte/satin/glossy → sets `--plate-gloss` (controls box-shadow inset highlight) + filter brightness/contrast on top face.
5. **Текстура** rough/smooth/wave (micro) → toggles noise / wave overlay div on top face.
6. **Флеки** (epoxy) → swaps fleck overlay SVG (small circles, density-driven by chip-class).
7. **Толщина** (purcem/rubber) → sets `--plate-body-h` CSS var → body layer scales vertical thickness.
8. **Polish grit** (concrete) → controls `--plate-gloss` + filter contrast.

## Plate edge polish (per-material side faces)
- terrazzo body sides → chip cross-section painted via radial-gradient from chip palette.
- epoxy body sides → smooth resin gradient + subtle pour-line.
- micro body sides → 2-pass stratification (1mm bands).
- purcem body sides → grain texture.
- mma body sides → smooth dark resin.
- topcoat side → reflective sheen line (already there, refined).

## "Открыть систему →" routing
Material → URL with state-encoded params:
- terrazzo* → `floors/terrazzo.html?finish=&aggregate=&color=`
- epoxy → `floors/epoxy.html?ral=&fleck=&finish=`
- epoxy-light → `floors/epoxy.html?ral=&fleck=&finish=` (decorative)
- micro → `floors/microtopping.html?color=&finish=&texture=`
- concrete → `floors/concrete.html?exposure=&grit=&sealer=`
- purcem → `floors/pu-cement.html?color=&surface=&thickness=`
- mma → `floors/mma.html?color=&cure=&topcoat=`
- rubber → `floors/rubber.html?type=&color=&thickness=`

## Mobile (<980px)
- Single column.
- Material list → horizontal scroll chip row with snap-points.
- Plate centered, height 480px.
- Controls stack vertically below plate.
- Bottom-sheet (`.fx-plate-sheet`) preserved for layer labels on explode.

## i18n
All user-visible strings still routed through `localize()`. EN fallbacks default to RU label where no translation exists (consistent with existing pattern).

## Testing
- Static server on port 5500, `curl -I http://localhost:5500/index.html` → 200.
- Markup spot-check via `curl -s | grep "fx-hero-lab"` confirms new structure served.
- Build via `npm run build` regenerates `dist/index.html`.

## Known limitations / honest disclosures
- Build chain runs `generate-english-site.js` first then parcel — both are slow. If the build fails for unrelated reasons (parcel version pin etc.), dist may not regenerate cleanly; in that case dist should be hand-checked before push.
- "Strips" (саргелим) overlay uses CSS gradient on top face; works but it stacks under the topcoat film — visual is convincing in compact mode, slightly muted when exploded.
- Rubber doesn't use the SVG terrazzo pattern (no chip splatter); instead its top face uses a cross-hatched granule pattern (pre-rendered CSS).
- Texture "wave" for microtopping is implemented as an angled bands overlay — convincing but not a perfect trowel-mark simulation.
