# plates-v2 — Blender-generated floor-system plates (2026-05-23)

10 GLB layered floor samples, generated **headless on the m1 MacBook** via `build_plate.py`
(`Blender 5.1 --background --python build_plate.py -- <slug>`), per `docs/BLENDER_PLATE_PROMPT_2026-05-23.md`.

Each plate: 300×300 mm, real layer thicknesses (height = sum of layers, NOT normalized),
stair-stepped edge profile so the "pirog" reads in explode view, cube-UV (engine clones uv→uv2 for AO),
named meshes/materials (topcoat/body/mesh-layer/membrane/primer/substrate; topcoat material VAR_topcoat).
No embedded textures (configurator loads textures by slug + HDR lighting). 14–16 KB each.

STATUS: staging for owner review. Working plates in `../plates/` are UNTOUCHED.
To switch the configurator to v2: repoint `glb_plate` paths in `3d-assets/manifest.json`
(or copy plates-v2/*.glb over plates/*.glb) AFTER review. Grey renders are geometry-only;
real look = configurator textures + HDR.
