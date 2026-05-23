#!/usr/bin/env python3
"""FloorDSGN — headless Blender plate builder (run on m1).
Usage: Blender --background --python build_plate.py -- <slug>
Builds a layered 300x300mm floor-system sample per BLENDER_PLATE_PROMPT_2026-05-23,
exports GLB (no embedded textures) + an Eevee preview PNG. Z-up in Blender; glTF
exporter emits +Y up automatically. Parametric — scale to all slugs later.
"""
import bpy, bmesh, sys, os, math

argv = sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else ["epoxy"]
SLUG = argv[0] if argv else "epoxy"
OUT = os.path.expanduser("~/blender-floordsgn/out"); os.makedirs(OUT, exist_ok=True)
MM = 0.001  # 1mm in Blender meters

# layer thickness table (mm) — topcoat..substrate, only present layers
TABLE = {
 "epoxy":            [("topcoat",0.2),("body",4),("primer",0.15),("substrate",40)],
 "pu-cement":        [("topcoat",0.5),("body",6.5),("primer",0.3),("substrate",40)],
 "mma":              [("topcoat",1),("body",4.5),("primer",0.5),("substrate",40)],
 "microtopping":     [("topcoat",0.1),("body",2.4),("mesh-layer",0.3),("primer",0.15),("substrate",40)],
 "terrazzo-cement":  [("topcoat",0.1),("body",15),("primer",0.2),("substrate",60)],
 "terrazzo-multi":   [("topcoat",0.2),("body",15),("primer",0.8),("substrate",60)],
 "terrazzo-epoxy":   [("topcoat",0.5),("body",15),("primer",0.15),("substrate",60)],
 "comfortfloor":     [("topcoat",0.3),("body",2.4),("membrane",5),("primer",0.15),("substrate",40)],
 "decorative-concrete":[("topcoat",0.4),("body",60),("primer",0.3),("substrate",40)],
 "rubber":           [("topcoat",0.6),("body",11),("primer",0.15),("substrate",40)],
}
MAT_NAME = {"topcoat":"VAR_topcoat","body":"body","mesh-layer":"mesh-layer fibreglass",
            "membrane":"membrane","primer":"primer","substrate":"substrate"}
TINT = {"topcoat":(.85,.85,.85),"body":(.55,.5,.45),"mesh-layer":(.8,.75,.3),
        "membrane":(.3,.3,.32),"primer":(.6,.4,.3),"substrate":(.7,.7,.68)}

layers = TABLE.get(SLUG)
if not layers: print("UNKNOWN SLUG", SLUG); sys.exit(1)

# wipe scene
bpy.ops.wm.read_factory_settings(use_empty=True)
PLAN = 300*MM

def make_mat(key):
    m = bpy.data.materials.new(MAT_NAME[key]); m.use_nodes=True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    r,g,b = TINT[key]; bsdf.inputs["Base Color"].default_value=(r,g,b,1)
    bsdf.inputs["Roughness"].default_value = 0.35 if key=="topcoat" else 0.8
    return m

# build stacked layers downward from y(top)=0 ; step-inset each lower layer for readable profile
top_z = 0.0
inset = 0.0
created = []
for i,(key,th) in enumerate(layers):
    t = th*MM
    half = (PLAN/2) - inset
    z_center = top_z - t/2
    # box via bmesh
    mesh = bpy.data.meshes.new(key); obj = bpy.data.objects.new(key, mesh)
    bpy.context.collection.objects.link(obj)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= half*2; v.co.y *= half*2; v.co.z *= t
    bm.to_mesh(mesh); bm.free()
    obj.location = (0,0,z_center)
    obj.data.materials.append(make_mat(key))
    # UV: smart project (cube-ish), then duplicate channel for AO (uv2)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.select_all(action='DESELECT'); obj.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.cube_project(cube_size=1.0)
    bpy.ops.object.mode_set(mode='OBJECT')
    # NOTE: do NOT add a 2nd UV — configurator clones uv->uv2 for AO itself; an empty uv2 breaks AO.
    top_z -= t
    inset += 0.4*MM  # 0.4mm stair-step per layer down
    created.append(obj)

# bevel topcoat top edge (soft chamfer ~1.5mm)
tc = bpy.data.objects.get("topcoat")
if tc:
    bev = tc.modifiers.new("bev","BEVEL"); bev.width=1.5*MM; bev.segments=2; bev.limit_method='ANGLE'

# plateRoot empty at origin (center of top face)
root = bpy.data.objects.new("plateRoot", None); bpy.context.collection.objects.link(root)
root.location=(0,0,0)
for o in created: o.parent = root

# ---- preview render (Eevee) ----
try:
    bpy.context.scene.render.engine = 'BLENDER_EEVEE_NEXT'
except Exception:
    try: bpy.context.scene.render.engine = 'BLENDER_EEVEE'
    except Exception: pass
cam_data = bpy.data.cameras.new("cam"); cam = bpy.data.objects.new("cam", cam_data)
bpy.context.collection.objects.link(cam)
cam.location = (0.32,-0.34,0.26); cam.rotation_euler=(math.radians(58),0,math.radians(43))
bpy.context.scene.camera = cam
sun_d = bpy.data.lights.new("sun","SUN"); sun_d.energy=4
sun = bpy.data.objects.new("sun", sun_d); bpy.context.collection.objects.link(sun)
sun.rotation_euler=(math.radians(40),math.radians(20),0)
sc = bpy.context.scene
sc.render.resolution_x=900; sc.render.resolution_y=700
sc.render.filepath = os.path.join(OUT, f"{SLUG}_preview.png")
try: bpy.ops.render.render(write_still=True); print("RENDER ok")
except Exception as e: print("RENDER skipped:", e)

# ---- export GLB (no embedded textures) ----
glb = os.path.join(OUT, f"{SLUG}.glb")
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=glb, export_format='GLB',
    use_selection=True, export_apply=True, export_yup=True,
    export_image_format='NONE')
sz = os.path.getsize(glb) if os.path.exists(glb) else 0
total = sum(th for _,th in layers)
print(f"DONE slug={SLUG} layers={len(layers)} total_h={total}mm GLB={sz}bytes -> {glb}")
