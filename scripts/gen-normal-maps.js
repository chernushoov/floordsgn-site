#!/usr/bin/env node
/* Generate tangent-space normal maps from diffuse photos.
 * Algorithm: luminance(diffuse) → height map → Sobel gradients → packed RGB normal map.
 * Output is 1024×1024 PNG saved alongside the input as `normal.png`.
 *
 * Usage:  node scripts/gen-normal-maps.js
 *         node scripts/gen-normal-maps.js terrazzo-cement       (single material)
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '3d-assets', 'textures');
const TARGET = 1024;

// Per-material bump strength — terrazzo has chunky chips so it gets a bigger bump,
// uniform coatings get less so they don't look noisy.
const STRENGTH = {
  'terrazzo-cement':     6.5,
  'terrazzo-multi':      6.5,
  'terrazzo-epoxy':      5.0,
  'decorative-concrete': 5.5,
  'microtopping':        3.0,
  'parquet':             2.5,
  'mma':                 2.0,
  'pu-cement':           2.5,
  'epoxy':               1.5,
  'rubber':              4.0,
};

async function makeNormal(inputPath, outputPath, strength) {
  const buf = await sharp(inputPath)
    .resize(TARGET, TARGET, { fit: 'cover' })
    .greyscale()
    .blur(0.8) // tiny blur to suppress JPEG noise before gradient
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = buf;
  const W = info.width, H = info.height;
  const out = Buffer.alloc(W * H * 3);

  // Constant for normalising Sobel magnitude. Higher `strength` → bolder bumps.
  const norm = (8 * 255) / strength;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      // Sample 3x3 neighbourhood with edge clamping.
      const sample = (xx, yy) => {
        xx = Math.max(0, Math.min(W - 1, xx));
        yy = Math.max(0, Math.min(H - 1, yy));
        return data[yy * W + xx];
      };
      const tl = sample(x-1, y-1), tc = sample(x, y-1), tr = sample(x+1, y-1);
      const ml = sample(x-1, y),                       mr = sample(x+1, y);
      const bl = sample(x-1, y+1), bc = sample(x, y+1), br = sample(x+1, y+1);

      // Sobel — horizontal and vertical luminance gradients (height differences).
      const dx = (tr + 2*mr + br) - (tl + 2*ml + bl);
      const dy = (bl + 2*bc + br) - (tl + 2*tc + tr);

      // Convert gradients into a unit-length surface normal in tangent space.
      // Negate dx (R) so brighter peaks face the +X light direction conventionally.
      const nx = -dx / norm;
      const ny = -dy / norm;
      const nz = Math.sqrt(Math.max(0.001, 1 - nx*nx - ny*ny));
      const len = Math.sqrt(nx*nx + ny*ny + nz*nz);

      // Pack [-1, 1] → [0, 255]. Z stays mostly near 255 (surface mostly faces up).
      const i = (y * W + x) * 3;
      out[i    ] = Math.max(0, Math.min(255, ((nx / len) * 0.5 + 0.5) * 255));
      out[i + 1] = Math.max(0, Math.min(255, ((ny / len) * 0.5 + 0.5) * 255));
      out[i + 2] = Math.max(0, Math.min(255, ((nz / len) * 0.5 + 0.5) * 255));
    }
  }

  await sharp(out, { raw: { width: W, height: H, channels: 3 } })
    .png({ compressionLevel: 8 })
    .toFile(outputPath);
}

async function main() {
  const only = process.argv[2];
  const slugs = fs.readdirSync(ROOT).filter(d => {
    const p = path.join(ROOT, d);
    if (!fs.statSync(p).isDirectory()) return false;
    if (d.startsWith('_')) return false;
    return fs.existsSync(path.join(p, 'diffuse.jpg'));
  });

  for (const slug of slugs) {
    if (only && only !== slug) continue;
    const diffuse = path.join(ROOT, slug, 'diffuse.jpg');
    const normal = path.join(ROOT, slug, 'normal.png');
    const strength = STRENGTH[slug] ?? 4.0;
    const t0 = Date.now();
    try {
      await makeNormal(diffuse, normal, strength);
      const size = (fs.statSync(normal).size / 1024).toFixed(1);
      console.log(`✓ ${slug.padEnd(20)} strength=${strength}  ${size}KB  ${Date.now()-t0}ms`);
    } catch (e) {
      console.error(`✗ ${slug}: ${e.message}`);
    }
  }
}

main();
