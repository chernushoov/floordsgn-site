# plates-v2 — validation renders (MacBook 3D-factory, 2026-05-23)

Pair-work handoff back to iMac. iMac generated `plates-v2/*.glb` headless (m1, Blender 5.1);
MacBook validated them in the live Blender (MCP) with **real textures + tile + HDR + AgX**,
since the iMac's grey renders are geometry-only.

Renders in `validation/<slug>.webp` (+ `validation/_CONTACT.webp` montage). Body = real
`3d-assets/textures/<slug>` via the configurator's `b_<slug>` material; body UV scaled by the
manifest `tile` factor; substrate=concrete grey, primer=amber, topcoat hidden (clear in reality).

## Verdict: ✅ geometry is correct and ships well

| check | result |
|---|---|
| named meshes (topcoat/body/[mesh-layer/membrane]/primer/substrate) | ✅ all present per slug |
| `plateRoot` parent empty | ✅ |
| real layer thicknesses (NOT normalized) | ✅ e.g. terrazzo-epoxy = 0.5+15+0.2+60 = **75.65 mm** |
| per-material extra layers | ✅ microtopping has **mesh-layer (fibreglass)**, comfortfloor has **membrane** |
| stair-stepped edge (pirog reads) | ✅ widths 0.300→0.299→0.298 step in |
| cube-UV responds to tile scaling | ✅ tile×UV gives correct aggregate size |
| no embedded textures, 14–16 KB | ✅ |

## ⚠️ Action items before switching the configurator to v2

1. **Topcoat must render CLEAR.** The topcoat is the *widest top* layer (overhangs the body).
   If `VAR_topcoat` is opaque it covers the finished surface → plate looks blank white
   (see what happens when not clear). Confirm the configurator gives `VAR_topcoat`
   transmission/clear-coat (glossy, low/zero alpha). With it clear, the body + layered edge
   read correctly (these renders hide it to simulate clear).
2. **terrazzo-epoxy tile=1 → very large chips.** At tile=1 the aggregates look oversized vs the
   other terrazzos (cement/multi at tile=3). Suggest bumping terrazzo-epoxy to **tile=2** in
   `manifest.json` for a more consistent grain. (Tuning, not a defect.)
3. **Stair-step vs flush edge.** The inset stair profile is great for an **explode view**. For the
   default *solid* plate in the configurator, a flush edge with the layers as flush colour bands
   reads more like a real cut sample. Consider exposing v2 mainly in an explode/anatomy mode, or
   add a flush variant. (Design call — flag for owner.)

## Switch path (unchanged from iMac README)
Repoint `glb_plate` in `manifest.json` to `plates-v2/<slug>.glb` (or copy over `plates/`) **after**
owner review + the clear-topcoat confirmation above. Working `plates/` stay untouched until then.
