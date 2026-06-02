# terrazzo-gen.py — procedural terrazzo texture generator

Reproduces terrazzo PBR textures (diffuse + normal + roughness + AO), **seamless**, in ~5s,
from one small script. Built overnight 2026-06-02 to answer "how do we reproduce terrazzo
textures simply" — so any colour / aggregate / chip-size terrazzo can be made on demand
without needing a real photo for each look.

## The idea (why it works where Voronoi failed)
A Voronoi cell pattern looks like **crazy paving** because it space-fills — there is no matrix
between chips. Real terrazzo is **irregular crushed-stone chips scattered on a visible speckled
matrix**. So the generator:

1. **Matrix** = solid binder colour + fine sand speckle (multi-octave noise).
2. **Chips** = irregular polygons (5–8 jittered vertices = angular shards), size-distributed
   (mostly fine 1–3 mm, a few larger), weighted colour palette, soft anti-aliased edges,
   **no dark outline** — scattered only to a target coverage so the matrix stays visible.
3. **Seamless by construction** = TOROIDAL stamping: any chip near an edge is also drawn
   wrapped to the opposite side, so the tile repeats with no seam. No edge-blend hack.
4. **Realism touches**: global fine grain (nothing reads as flat plastic) + low-frequency
   tonal variation applied only inside chips (marble-ish value drift, not flat colour).
5. **Derived maps** (from diffuse + chip mask):
   - normal — subtle relief (polished/ground terrazzo is near-flat), wrap-aware gradient
   - roughness — chips smoother (polished marble) than matrix (binder)
   - ao — faint contact darkening at chip rims

## Usage
```
python3 scripts/terrazzo-gen.py OUTDIR --preset light-grey-white --size 2048 --seed 7
```
Presets: `light-grey-white` (flagship RAL 7047 / white marble), `dark-charcoal`.
Add a preset = one dict entry (matrix hex, palette + weights, chip-size mm, coverage, roughness).

## Wire into configurator-v3 (no manifest edit needed for testing)
```
node scripts/cfg-flagship-shot.js terrazzo-gen OUTDIR --inject=/tmp/cfgqa/gen-testdef.json
```
`--inject` pushes a runtime-only material def pointing at `textures-v4/terrazzo-gen/`.

## Status / findings
- Generalises: 4 presets (light-grey-white, dark-charcoal, warm-greige, graphite-white) +
  per-seed variety — all believable and seamless (verified on the 3D plate + 2×2 tile).
- After the critique-driven v3 tuning the generated light-grey reads as dense as the REAL
  terrazzo reference and is more on-spec (true fine 1–3 mm) than the recolored-photo flagship.
- Practical win over a single photo: any colour/size/density on demand, seamless, instant (~4s).

## Tuning notes (from the 5-agent realism-critique panel, all applied in v3)
1. SIZE (P1) — uniform sizes looked too round/mid-sized. Fix: **power-law** `mm = min*(1-u)^(-1/alpha)`
   → fine-dominated distribution (many 1–3 mm, few large). + more **angular** shards (4–7 verts, wide jitter).
2. DENSITY (P1) — real coverage was only ~25–30% ("stickered" chips on a matrix sea). The old
   area-estimate overcounted. Fix: **measure mask coverage**, pack to ~70% so aggregate dominates
   and matrix is thin interstitial lines.
3. EDGES (P1) — supersample+LANCZOS gave a pillowy feather (chips looked laid-on). Fix: draw at
   **1× (SS=1) = hard ~1px edges** → chips read ground-flush. (Bonus: faster, which the dense field needs.)
4. MATRIX (P1) — flat plastic binder. Fix: **dense fine grain + low-freq mottle + salt/pepper sand**.
5. COLOUR (P2) — matrix had a faint cool/green cast. Fix: **warm-neutral** matrix (#cfcdc8).

## Next ideas (not needed, kept simple)
- Hybrid: use the procedural chip MASK but fill chips with crops of REAL stone photos (max photoreal,
  still seamless + controllable). Only if extreme-macro photorealism is required.
- Wire as the flagship texture: point `terrazzo-epoxy` `pbr.*` at `textures-v4/terrazzo-gen/` to
  replace the recolored-photo hack (owner approval — it changes the customer-facing look).
