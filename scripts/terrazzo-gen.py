#!/usr/bin/env python3
"""
Procedural terrazzo TEXTURE generator — diffuse + normal + roughness + AO, seamless.

Idea (after Voronoi looked like crazy-paving): real terrazzo is irregular crushed-stone CHIPS
scattered DENSELY on a gritty cement MATRIX — aggregate-dominant, matrix reduced to thin lines.
  1. matrix = warm-neutral binder + dense fine sand grain + low-freq mottle
  2. chips  = angular polygons (jagged shards), POWER-LAW sizes (many fine 1-3mm, few large),
              weighted palette, HARD ~1px edges (ground flush, no feather, no outline),
              packed to ~70% coverage so chips touch and the matrix is thin interstitial lines
  3. seamless by TOROIDAL stamping (chips near an edge are wrapped to the opposite side)
  4. derive maps from diffuse + chip mask: subtle normal, chips-smoother roughness, rim AO

v2 (critique-driven): warm matrix, power-law sizes, hard edges (SS=1), ~70% measured coverage,
denser grain. Usage: terrazzo-gen.py OUTDIR [--preset light-grey-white] [--size 2048] [--seed 7]
"""
import sys, os, math, argparse, json
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

PRESETS = {
    "light-grey-white": {
        "matrix": "#cfcdc8",                                   # warm-neutral light grey (RAL 7047 dir)
        "palette": [("#f4f1ea", 5), ("#e9e4d8", 3), ("#ffffff", 2),
                    ("#cdc9bf", 2), ("#b3b0a7", 2), ("#86837b", 1), ("#56544f", 1)],
        "min_mm": 0.9, "max_mm": 6.5, "alpha": 2.0,            # power-law -> strongly fine-dominated
        "coverage": 0.70, "matrix_rough": 0.52, "chip_rough": 0.18,
    },
    "dark-charcoal": {
        "matrix": "#393836",
        "palette": [("#ece7db", 3), ("#ffffff", 2), ("#9a968c", 2),
                    ("#201f1d", 3), ("#54514b", 2)],
        "min_mm": 1.2, "max_mm": 9.0, "alpha": 1.7,
        "coverage": 0.72, "matrix_rough": 0.5, "chip_rough": 0.16,
    },
    "warm-greige": {                                           # popular warm sand/greige terrazzo
        "matrix": "#d8cfbf",
        "palette": [("#f3ece0", 5), ("#e3d6c1", 3), ("#fffaf2", 2),
                    ("#c2b39a", 2), ("#9a8a72", 2), ("#6d5f4c", 1), ("#3f3a32", 1)],
        "min_mm": 1.0, "max_mm": 6.5, "alpha": 1.8,
        "coverage": 0.70, "matrix_rough": 0.54, "chip_rough": 0.20,
    },
    "graphite-white": {                                        # mid-grey matrix, crisp white marble
        "matrix": "#8d8b87",
        "palette": [("#ffffff", 5), ("#ece7db", 3), ("#b8b4ab", 2),
                    ("#5c5953", 2), ("#262420", 2)],
        "min_mm": 1.0, "max_mm": 7.0, "alpha": 1.75,
        "coverage": 0.70, "matrix_rough": 0.5, "chip_rough": 0.17,
    },
}

def make_rng(seed): return np.random.default_rng(seed)
def hex_rgb(h):
    h = h.lstrip("#"); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def extract_preset_from_photo(path, k=9):
    """REPRODUCE any reference: quantise a terrazzo photo to a palette and build a preset.
    Binder/matrix = the colour of the FLAT (low-gradient) regions — the binder is smooth while
    chips create edges — which is more accurate than raw frequency on chip-dense photos. The
    quantised colours are the chips, weighted by area share."""
    im = Image.open(path).convert("RGB").resize((320, 320))
    arr = np.asarray(im, np.float32)
    gray = arr.mean(2)
    gy, gx = np.gradient(gray)
    grad = np.hypot(gx, gy)
    flat = grad < np.percentile(grad, 35)            # flattest 35% of pixels = binder, not chips
    mr, mg, mb = (np.median(arr[flat], axis=0) if flat.sum() > 50 else arr.reshape(-1, 3).mean(0))
    matrix = "#%02x%02x%02x" % (int(mr), int(mg), int(mb))
    q = im.quantize(colors=k, method=Image.MEDIANCUT)
    pal = q.getpalette()[:k * 3]
    counts = np.bincount(np.asarray(q).ravel(), minlength=k).astype(float)
    cols = [(pal[i * 3], pal[i * 3 + 1], pal[i * 3 + 2]) for i in range(k)]
    total = counts.sum()
    # chips = quantised colours that are NOT within ~22 of the detected binder (those ARE matrix)
    palette = []
    for i in np.argsort(counts)[::-1]:
        if counts[i] <= total * 0.012:
            continue
        if abs(cols[i][0] - mr) + abs(cols[i][1] - mg) + abs(cols[i][2] - mb) < 22:
            continue
        palette.append(("#%02x%02x%02x" % cols[i], float(counts[i])))
    return {"matrix": matrix, "palette": palette or [("#ffffff", 1.0)],
            "min_mm": 1.0, "max_mm": 6.5, "alpha": 2.0, "coverage": 0.70,
            "matrix_rough": 0.5, "chip_rough": 0.18}

def chip_poly(rng, cx, cy, r):
    """Angular crushed-stone shard: 4-7 vertices, strong radius jitter, no near-circle."""
    n = int(rng.integers(4, 8))
    base = rng.random() * 2 * math.pi
    pts = []
    for i in range(n):
        a = base + (i / n) * 2 * math.pi + (rng.random() - 0.5) * (1.6 / n) * 2 * math.pi
        rad = r * (0.45 + 0.75 * rng.random())             # wide jitter = splintery shard
        pts.append((cx + math.cos(a) * rad, cy + math.sin(a) * rad))
    return pts

def jitter_color(rng, rgb, amt=16):
    v = int(rng.integers(-amt, amt + 1))
    return tuple(int(max(0, min(255, c + v))) for c in rgb)

def gen(outdir, P, size, seed, label):
    rng = make_rng(seed)
    W = size                                  # SS=1: draw at final res -> HARD ~1px edges (the fix)
    mm_to_px = W / 150.0                       # texture represents ~150 mm of floor

    # ---- matrix: warm-neutral binder + dense fine sand grain + low-freq mottle ----
    mrgb = np.array(hex_rgb(P["matrix"]), np.float32)
    base = np.zeros((W, W, 3), np.float32) + mrgb
    base += rng.normal(0, 9.0, (W, W, 1)).astype(np.float32)                       # dense fine grain
    mb = max(8, W // 128) * 8                                                      # block size divides W
    mott = np.repeat(np.repeat(rng.normal(0, 6.0, (W // mb, W // mb, 1)), mb, 0), mb, 1)
    base += mott[:W, :W].astype(np.float32)                                        # low-freq mottle
    sp = (rng.random((W, W, 1)) < 0.05).astype(np.float32) * rng.normal(0, 22, (W, W, 1)).astype(np.float32)
    base = np.clip(base + sp, 0, 255)                                              # salt/pepper sand
    img = Image.fromarray(base.astype(np.uint8), "RGB")
    draw = ImageDraw.Draw(img)
    mask = Image.new("L", (W, W), 0)
    mdraw = ImageDraw.Draw(mask)

    pal = [(hex_rgb(h), w) for h, w in P["palette"]]
    cols = [c for c, _ in pal]
    wts = np.array([w for _, w in pal], float); wts = wts / wts.sum()

    def stamp(cx, cy, r, col, shape_seed):
        for ox in (0, -W, W):
            for oy in (0, -W, W):
                if abs(cx + ox - W / 2) > W / 2 + r or abs(cy + oy - W / 2) > W / 2 + r:
                    continue
                pts = chip_poly(np.random.default_rng(shape_seed), cx + ox, cy + oy, r)
                draw.polygon(pts, fill=col)            # default = hard edge, no feather
                mdraw.polygon(pts, fill=255)

    # ---- scatter to MEASURED coverage (power-law sizes) ----
    target, guard = P["coverage"], 0
    while guard < 120000:
        guard += 1
        cx, cy = rng.random() * W, rng.random() * W
        u = rng.random()
        mm = min(P["max_mm"], P["min_mm"] * (1 - u) ** (-1.0 / P["alpha"]))         # heavy-tailed
        r = max(1.5, mm * mm_to_px * 0.5)
        stamp(cx, cy, r, jitter_color(rng, cols[int(rng.choice(len(cols), p=wts))]),
              int(cx * 131.1 + cy * 977.7 + r * 17.3))
        if guard % 500 == 0 and (np.asarray(mask, np.uint8).mean() / 255.0) >= target:
            break

    os.makedirs(outdir, exist_ok=True)
    arr = np.asarray(img, np.float32) / 255.0
    m = np.asarray(mask, np.float32) / 255.0

    # chip internal MINERAL variation: two octaves (coarse drift + fine speckle) so chips read
    # as sliced stone with internal character, not one flat printed tone (critique). + tiny global grain.
    def octave(div):
        k = max(2, size // div)
        n = rng.normal(0, 1, (k, k)).astype(np.float32)
        n = (n - n.min()) / (np.ptp(n) + 1e-6)
        return np.asarray(Image.fromarray((n * 255).astype(np.uint8)).resize((size, size), Image.LANCZOS),
                          np.float32) / 255.0
    mottle = (octave(6) - 0.5) * 0.10 + (octave(2) - 0.5) * 0.13     # coarse + fine intra-chip variation
    arr = np.clip(arr + rng.normal(0, 3.0 / 255.0, (size, size, 1)).astype(np.float32)
                  + mottle[..., None] * m[..., None], 0, 1)
    Image.fromarray((arr * 255).astype(np.uint8), "RGB").save(os.path.join(outdir, "diffuse.jpg"), quality=92)

    # ---- normal: subtle relief (polished/ground = near-flat), wrap-aware ----
    lum = arr @ np.array([0.299, 0.587, 0.114], np.float32)
    gy, gx = np.gradient(np.pad(lum, 1, mode="wrap"))
    gx, gy = gx[1:-1, 1:-1], gy[1:-1, 1:-1]
    s = 1.3
    nx, ny, nz = -gx * s, -gy * s, np.ones_like(lum)
    ln = np.sqrt(nx * nx + ny * ny + nz * nz)
    normal = np.stack([nx / ln * 0.5 + 0.5, ny / ln * 0.5 + 0.5, nz / ln * 0.5 + 0.5], -1)
    Image.fromarray((normal * 255).astype(np.uint8), "RGB").save(os.path.join(outdir, "normal.png"))

    # ---- roughness: chips smoother than matrix ----
    rough = np.clip((1 - m) * P["matrix_rough"] + m * P["chip_rough"] + rng.normal(0, 0.03, m.shape), 0, 1)
    Image.fromarray((rough * 255).astype(np.uint8), "L").save(os.path.join(outdir, "roughness.png"))

    # ---- AO: faint rim darkening ----
    edge = np.asarray(mask.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(1.2)), np.float32) / 255.0
    ao = np.clip(1.0 - edge * 0.30, 0, 1)
    Image.fromarray((ao * 255).astype(np.uint8), "L").save(os.path.join(outdir, "ao.png"))

    cov = float(np.asarray(mask, np.uint8).mean() / 255.0)
    meta = {"preset": label, "matrix": P["matrix"], "size": size, "seed": seed, "coverage_measured": round(cov, 3), "chips": guard}
    with open(os.path.join(outdir, "gen.json"), "w") as f: json.dump(meta, f, indent=1)
    print("terrazzo-gen:", outdir, meta)

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("outdir")
    ap.add_argument("--preset", default="light-grey-white")
    ap.add_argument("--from-photo", default=None, help="reproduce a reference terrazzo photo (extract palette)")
    ap.add_argument("--size", type=int, default=2048)
    ap.add_argument("--seed", type=int, default=7)
    a = ap.parse_args()
    if a.from_photo:
        P, label = extract_preset_from_photo(a.from_photo), "from-photo:" + os.path.basename(a.from_photo)
    else:
        P, label = PRESETS[a.preset], a.preset
    gen(a.outdir, P, a.size, a.seed, label)
