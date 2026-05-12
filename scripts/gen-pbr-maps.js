#!/usr/bin/env node
/* Generate the full PBR map set from a diffuse photo:
 *  - normal.png    — tangent-space normals from luminance gradient (Sobel)
 *  - roughness.png — per-pixel roughness; bright chips read smoother, dark matrix rougher
 *  - ao.png        — ambient occlusion; cracks/recesses darkened relative to peaks
 *
 * Usage:
 *   node scripts/gen-pbr-maps.js                            # all materials
 *   node scripts/gen-pbr-maps.js terrazzo-cement            # one slug
 *   node scripts/gen-pbr-maps.js terrazzo-cement --only=normal,ao
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '3d-assets', 'textures');
const N_RES = 1024;   // normal map resolution
const RA_RES = 512;   // roughness + AO resolution (low-freq → smaller is fine)

// Per-material tuning. Bump strength controls normal map intensity; chip-brightness
// hint helps choose whether chips should read smoother (true) or rougher (false).
const TUNING = {
  'terrazzo-cement':     { bump: 6.5, baseRough: 0.7, chipsSmooth: true,  ao: 1.4 },
  'terrazzo-multi':      { bump: 6.5, baseRough: 0.6, chipsSmooth: true,  ao: 1.3 },
  'terrazzo-epoxy':      { bump: 5.0, baseRough: 0.4, chipsSmooth: true,  ao: 1.2 },
  'decorative-concrete': { bump: 5.5, baseRough: 0.8, chipsSmooth: false, ao: 1.0 },
  'microtopping':        { bump: 3.0, baseRough: 0.75, chipsSmooth: false, ao: 0.6 },
  'parquet':             { bump: 2.5, baseRough: 0.45, chipsSmooth: false, ao: 0.8 },
  'mma':                 { bump: 2.0, baseRough: 0.45, chipsSmooth: false, ao: 0.5 },
  'pu-cement':           { bump: 2.5, baseRough: 0.7,  chipsSmooth: false, ao: 0.6 },
  'epoxy':               { bump: 1.5, baseRough: 0.25, chipsSmooth: false, ao: 0.4 },
  'rubber':              { bump: 4.0, baseRough: 0.92, chipsSmooth: false, ao: 0.8 },
};

async function loadLumaRaw(input, size) {
  return sharp(input)
    .resize(size, size, { fit: 'cover' })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
}

async function makeNormal(inputPath, outputPath, strength) {
  const { data, info } = await loadLumaRaw(inputPath, N_RES);
  // Light blur to suppress JPEG noise before gradient.
  const blurred = await sharp(inputPath)
    .resize(N_RES, N_RES, { fit: 'cover' })
    .greyscale()
    .blur(0.8)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const src = blurred.data;
  const W = info.width, H = info.height;
  const out = Buffer.alloc(W * H * 3);
  const norm = (8 * 255) / strength;

  const sample = (xx, yy) => src[Math.max(0, Math.min(H-1, yy)) * W + Math.max(0, Math.min(W-1, xx))];

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const tl = sample(x-1, y-1), tc = sample(x, y-1), tr = sample(x+1, y-1);
      const ml = sample(x-1, y),                       mr = sample(x+1, y);
      const bl = sample(x-1, y+1), bc = sample(x, y+1), br = sample(x+1, y+1);
      const dx = (tr + 2*mr + br) - (tl + 2*ml + bl);
      const dy = (bl + 2*bc + br) - (tl + 2*tc + tr);
      const nx = -dx / norm;
      const ny = -dy / norm;
      const nz = Math.sqrt(Math.max(0.001, 1 - nx*nx - ny*ny));
      const len = Math.sqrt(nx*nx + ny*ny + nz*nz);
      const i = (y * W + x) * 3;
      out[i    ] = ((nx/len) * 0.5 + 0.5) * 255;
      out[i + 1] = ((ny/len) * 0.5 + 0.5) * 255;
      out[i + 2] = ((nz/len) * 0.5 + 0.5) * 255;
    }
  }
  await sharp(out, { raw: { width: W, height: H, channels: 3 } })
    .png({ compressionLevel: 8 })
    .toFile(outputPath);
}

/* Roughness — derived from luminance with a chosen polarity.
 *   chipsSmooth=true: bright pixels (chips/aggregate) get LOWER roughness (more polished).
 *   chipsSmooth=false: keep base roughness, only a small darken-where-cracked nudge. */
async function makeRoughness(inputPath, outputPath, baseRough, chipsSmooth) {
  const { data, info } = await loadLumaRaw(inputPath, RA_RES);
  const W = info.width, H = info.height;
  const out = Buffer.alloc(W * H);

  for (let i = 0; i < W * H; i++) {
    const lum = data[i] / 255;
    let r;
    if (chipsSmooth) {
      // Bright pixels (chips) → r ≈ 0.25. Dark pixels (matrix) → r ≈ baseRough + 0.15.
      r = (1 - lum) * 0.5 + baseRough * 0.45 + 0.05;
    } else {
      // Uniform-ish materials — mostly base roughness with tiny modulation from luma.
      r = baseRough + (0.5 - lum) * 0.15;
    }
    out[i] = Math.max(0, Math.min(255, r * 255));
  }
  await sharp(out, { raw: { width: W, height: H, channels: 1 } })
    .png({ compressionLevel: 8 })
    .toFile(outputPath);
}

/* Ambient occlusion — heuristic high-pass on the height map.
 * Pixels darker than their neighbourhood (cracks/grout) get darkened in the AO. */
async function makeAO(inputPath, outputPath, intensity) {
  const origObj = await loadLumaRaw(inputPath, RA_RES);
  const blurredObj = await sharp(inputPath)
    .resize(RA_RES, RA_RES, { fit: 'cover' })
    .greyscale()
    .blur(8)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const a = origObj.data, b = blurredObj.data;
  const W = origObj.info.width, H = origObj.info.height;
  const out = Buffer.alloc(W * H);
  for (let i = 0; i < W * H; i++) {
    const diff = (a[i] - b[i]) / 255;       // [-1, 1]
    // Map: pixel darker than neighbours → diff < 0 → AO < 0.85 (darker, more occluded).
    // Lifted base of 0.85 keeps the overall scene from going too dark.
    const ao = 0.85 + diff * intensity;
    out[i] = Math.max(0, Math.min(255, ao * 255));
  }
  await sharp(out, { raw: { width: W, height: H, channels: 1 } })
    .png({ compressionLevel: 8 })
    .toFile(outputPath);
}

async function processSlug(slug, only) {
  const diffuse = path.join(ROOT, slug, 'diffuse.jpg');
  if (!fs.existsSync(diffuse)) {
    console.log(`- ${slug.padEnd(20)} (no diffuse.jpg, skipped)`);
    return;
  }
  const t = TUNING[slug] ?? { bump: 4.0, baseRough: 0.7, chipsSmooth: false, ao: 0.8 };
  const wants = (m) => !only || only.includes(m);
  const t0 = Date.now();
  const made = [];
  try {
    if (wants('normal'))    { await makeNormal(diffuse,    path.join(ROOT, slug, 'normal.png'),    t.bump);                         made.push('N'); }
    if (wants('roughness')) { await makeRoughness(diffuse, path.join(ROOT, slug, 'roughness.png'), t.baseRough, t.chipsSmooth);     made.push('R'); }
    if (wants('ao'))        { await makeAO(diffuse,        path.join(ROOT, slug, 'ao.png'),        t.ao);                           made.push('A'); }
    console.log(`✓ ${slug.padEnd(20)} ${made.join('+')}  ${Date.now()-t0}ms`);
  } catch (e) {
    console.error(`✗ ${slug}: ${e.message}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const onlyArg = args.find(a => a.startsWith('--only='));
  const only = onlyArg ? onlyArg.split('=')[1].split(',') : null;
  const targetSlug = args.find(a => !a.startsWith('--'));

  const slugs = fs.readdirSync(ROOT).filter(d => {
    const p = path.join(ROOT, d);
    return fs.statSync(p).isDirectory() && !d.startsWith('_') && fs.existsSync(path.join(p, 'diffuse.jpg'));
  });

  for (const slug of slugs) {
    if (targetSlug && targetSlug !== slug) continue;
    await processSlug(slug, only);
  }
}

main();
