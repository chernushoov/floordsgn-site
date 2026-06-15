#!/usr/bin/env python3
"""FLOORdsgn — generator of all 10 floor-system sample plates as GLB.

Per docs/BLENDER_PLATE_PROMPT_2026-05-23.md. Reproducible, headless, runs on
either Mac's Blender (use the iMac for 24/7 batch). Merges the MacBook + iMac
(build_epoxy_v2.py) approaches: per-face bmesh box UV (clean, deterministic),
per-material UV grain scale, named slots, beveled stair-step edge, no embedded
textures (the site loads PBR maps by slug at runtime).

Run:
    blender --background --python tools/blender/build_plates.py -- [OUT_DIR]
OUT_DIR defaults to ./3d-assets/plates relative to repo root (or pass absolute).
"""
import bpy, bmesh, sys, os

MM = 0.001
PLATE = 0.3  # 300 mm

# resolve output dir (after the '--' separator), else repo plates folder
_argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
if _argv:
    OUT = os.path.abspath(_argv[0])
else:
    here = os.path.dirname(os.path.abspath(__file__))
    OUT = os.path.normpath(os.path.join(here, '..', '..', '3d-assets', 'plates'))

# object name -> material slot name (exact, the site swaps by these)
MAT = {'topcoat': 'VAR_topcoat', 'body': 'body', 'mesh-layer': 'mesh-layer fibreglass',
       'membrane': 'membrane', 'primer': 'primer', 'substrate': 'substrate'}
# placeholder PBR (runtime overrides body/topcoat with real maps by slug)
COL = {'topcoat': (0.10, 0.09, 0.08, 1), 'body': (0.55, 0.55, 0.56, 1),
       'mesh-layer': (0.85, 0.82, 0.60, 1), 'membrane': (0.18, 0.18, 0.22, 1),
       'primer': (0.55, 0.50, 0.40, 1), 'substrate': (0.60, 0.60, 0.59, 1)}
ROU = {'topcoat': 0.12, 'body': 0.40, 'mesh-layer': 0.60, 'membrane': 0.80,
       'primer': 0.70, 'substrate': 0.85}

# slug -> (layers [(obj_key, thickness_mm)], body UV grain scale in metres)
# UV scale: smaller = more tiling = finer pattern. Smooth resins ~plate (0.3),
# terrazzo ~0.17 (stones read real size), rubber ~0.10 (fine EPDM granules).
PLATES = {
    'epoxy':               ([('topcoat', 0.2), ('body', 4),  ('primer', 0.15), ('substrate', 40)], 0.30),
    'mma':                 ([('topcoat', 1.0), ('body', 4.5),('primer', 0.5),  ('substrate', 40)], 0.30),
    'pu-cement':           ([('topcoat', 0.5), ('body', 6.5),('primer', 0.3),  ('substrate', 40)], 0.30),
    'microtopping':        ([('topcoat', 0.1), ('body', 2.4),('mesh-layer', 0.3), ('primer', 0.15), ('substrate', 40)], 0.30),
    # terrazzo: tile=1 (UV=plate) — use monolithic delit textures, NOT seamless-tiled (avoids cross-seams)
    'terrazzo-cement':     ([('topcoat', 0.1), ('body', 15), ('primer', 0.2),  ('substrate', 60)], 0.30),
    'terrazzo-multi':      ([('topcoat', 0.2), ('body', 15), ('primer', 0.8),  ('substrate', 60)], 0.30),
    'terrazzo-epoxy':      ([('topcoat', 0.5), ('body', 15), ('primer', 0.15), ('substrate', 60)], 0.30),
    'rubber':              ([('topcoat', 0.5), ('body', 11), ('primer', 0.15), ('substrate', 40)], 0.10),
    'decorative-concrete': ([('topcoat', 0.1), ('body', 60), ('primer', 0.2),  ('substrate', 40)], 0.30),
    'comfortfloor':        ([('topcoat', 0.3), ('body', 2.4),('membrane', 5),  ('primer', 0.15), ('substrate', 40)], 0.30),
}


def mat(key):
    name = MAT[key]
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    b = next((n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
    if b:
        b.inputs['Base Color'].default_value = COL[key]
        for k, v in (('Roughness', ROU[key]), ('Metallic', 0.0)):
            try:
                b.inputs[k].default_value = v
            except Exception:
                pass
    return m


def box(key, thick, z_top, inset, uv):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    side = PLATE - 2 * inset
    bmesh.ops.scale(bm, vec=(side, side, thick), verts=bm.verts)
    bm.normal_update()
    uvl = bm.loops.layers.uv.verify()
    for f in bm.faces:
        n = f.normal
        ax = max(range(3), key=lambda i: abs(n[i]))
        for lp in f.loops:
            co = lp.vert.co
            u, v = (co.y, co.z) if ax == 0 else (co.x, co.z) if ax == 1 else (co.x, co.y)
            lp[uvl].uv = (u / uv + 0.5, v / uv + 0.5)
    me = bpy.data.meshes.new(key)
    bm.to_mesh(me)
    bm.free()
    me.materials.append(mat(key))
    uv2 = me.uv_layers.new(name='uv2')   # AO channel (three.js reads AO from uv2)
    uv1 = me.uv_layers[0]
    for i in range(len(me.loops)):
        uv2.data[i].uv = uv1.data[i].uv
    o = bpy.data.objects.new(key, me)
    o.location = (0, 0, z_top - thick / 2)
    md = o.modifiers.new('bevel', 'BEVEL')
    md.width = min(thick * 0.3, 0.5 * MM)
    md.segments = 2
    md.limit_method = 'ANGLE'
    return o


def build(slug, layers, uv):
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    coll = bpy.context.scene.collection
    root = bpy.data.objects.new('plateRoot', None)
    coll.objects.link(root)
    z, objs = 0.0, []
    for i, (key, th_mm) in enumerate(layers):
        th = th_mm * MM
        o = box(key, th, z, 0.4 * MM * i, uv)   # stair-step inset per layer
        coll.objects.link(o)
        o.parent = root
        objs.append(o)
        z -= th
    for o in bpy.data.objects:
        o.select_set(False)
    root.select_set(True)
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = root
    out = os.path.join(OUT, slug + '.glb')
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True,
                              export_image_format='NONE', export_apply=True)
    return out, sum(t for _, t in layers)


os.makedirs(OUT, exist_ok=True)
print('OUT_DIR =', OUT)
for slug, (ly, uv) in PLATES.items():
    out, h = build(slug, ly, uv)
    print('built %-20s h=%6.2fmm -> %s' % (slug, h, out))
print('ALL_PLATES_DONE')
