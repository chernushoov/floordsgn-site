# Configurator audit — 2026-05-18

Side-branch: `feature/3d-textures-improve-2026-05-18`. All findings actionable; fixes that ship on this branch are noted as **FIXED** below. Items needing owner decision are **OPEN**.

## A — Code bugs (configurator.html → /quote bridge)

### A1. slugMap typos — FIXED in this commit
`configurator.html:1376-1380` mapped configurator slugs to `/quote` calculator material IDs. Two bugs:

| slug | mapped to (old) | actually accepted by /quote | mapped to (new) |
|---|---|---|---|
| `pu-cement` | `pucement` ❌ (silent: /quote falls back) | `purcem` | `purcem` ✓ |
| `rubber` | `epoxy` ❌ (wrong product on calculator) | `rubber` | `rubber` ✓ |
| `comfortfloor` | `epoxy` | (no native option) | `purcem` (closer PU chemistry) |

Verified accepted slugs via `enhance.js` (LABELS + material === '…' branches): `terrazzo`, `terrazzo-light`, `rubber`, `purcem`, `epoxy`, `mma`, `epoxy-light`, `micro`, `concrete`.

## B — Manifest data inconsistencies

### B1. `decorative-concrete` has dead `chips` data — OPEN
- `controls: [color, finish, stripes]` — no `aggregates` control
- `chips: [6 entries]` — never reached by `buildCompositeMap` because `hasRealPhoto = true` for this slug (has `pbr.diffuse`), so `useAutoChips` branch never runs.
- **Action**: either remove the chips array (data cleanup), or add `aggregates` to controls (more UX). Owner decision required.

### B2. `terrazzo-multi` aggregates pool mismatch — INFORMATIONAL
- 9 chips in manifest (real terrazzo crumb colors).
- `aggregates` control exposes the SHARED `manifest.control_options.aggregates` pool: `default`, `marble-white`, `marble-black`, `glass-color`, `pearl`, `mirror`.
- "default" keeps the real-photo chip pattern.
- Clicking marble-white etc. overlays Voronoi cells of the chosen aggregate palette via `buildCompositeMap`.
- Works as designed; flagged so future work doesn't try to "fix" by removing the default fallback.

### B3. `epoxy` `flecks` control — VERIFIED OK
Earlier scan flagged epoxy as having `flecks` control with no fleck pool. False positive: the pool is global at `manifest.control_options.flecks` (6 options including `none`). Works.

## C — Manifest spec vs sales-page divergence (owner decision)

Sub-agent cross-check 2026-05-18. Pages live at `materials/*.html`.

| slug | issue | manifest | sales page | severity |
|---|---|---|---|---|
| `decorative-concrete` | **fundamental product mismatch** | "литой бетон 40-80мм" (cast slab) | "polished existing concrete, 0mm added, 1-5mm grind" | **high** — these are different products |
| `decorative-concrete` | price | ₪650-1200/м² | "from $60/m² USD" | **medium** — currency/range mismatch |
| `decorative-concrete` | warranty | 25 лет | 5 years (workmanship) | **medium** |
| `rubber` | price | ₪380-650/м² | ₪380-780/м² (metadata) | **low** — page range is ₪130 wider |
| `rubber` | warranty | 10 лет | 5 years (workmanship) | **medium** |
| `terrazzo-cement` | thickness | 12-18 мм | 25-50mm (cement traditional) on page | **medium** — page says cement is thicker |
| `terrazzo-multi` / `terrazzo-epoxy` | thickness | 12-18 мм | 10-12mm (epoxy subset) on page | **medium** |
| `comfortfloor` | no dedicated sales page | — | falls back to epoxy via slugMap | **low** — works because slugMap defaults |
| `rubber` | no dedicated sales page | — | now goes to /quote with `material=rubber` (no `rubber.html`) | **low** — calculator handles it |

**Acceptance criterion** before merging texture work: the manifest spec block for at least `decorative-concrete` must be reconciled with the sales page (or vice versa). The other rows are recommended polish.

## D — UX duplication

### D1. `gloss` vs `finish` controls — INFORMATIONAL
Both modify `mat.roughness` with overlapping ranges:
- `gloss`: low=0.7, mid=0.4, high=0.08
- `finish`: matte=0.85, satin=0.45, polished=0.12

Some materials have both (e.g. mma has gloss; comfortfloor has finish). Last-clicked wins per `applyControlEffect`. Not buggy, but two controls for the same physical property is confusing — consider deprecating one in a future pass.

## E — v2 texture sandbox (separate from this audit)

See [project_floordsgn_3d_textures_2026-05-18 memory entry]. Texture-dup bug fixed; v2 textures behind `?textures=v2`; etalon untouched.

## F — Tests

- `scripts/snap-materials.js` — clicks each material, snaps stage canvas (both old and v2 modes).
- `scripts/audit-controls.js` — exercises every material × control × option, hashes the canvas, flags dead clicks. Current run: 0 findings (controls register, scene re-renders), but pixel-hash may be too sensitive to AA jitter to catch subtle dead clicks. Future: switch to DOM/material-state assertions.

## Outstanding owner decisions

1. **Open the PR for Netlify preview?** Branch is pushed (`https://github.com/chernushoov/floordsgn-site/pull/new/feature/3d-textures-improve-2026-05-18`).
2. **decorative-concrete chips**: remove or expose as `aggregates` control?
3. **decorative-concrete product**: cast slab (manifest) or polished existing (page) — which is the truth?
4. **rubber/terrazzo spec mismatches**: align manifest to page, or page to manifest?
5. **gateway device-signature-invalid**: openclaw version upgrade, config rollback, or device-key reset?
