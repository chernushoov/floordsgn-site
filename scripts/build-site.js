#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.parcel-cache', '.netlify', '.openclaw']);

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (name.endsWith('.html')) out.push(path.relative(ROOT, full));
  }
  return out.sort();
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status);
}

run(process.execPath, [path.join('scripts', 'generate-english-site.js')]);

const entries = walk(ROOT);
const parcelBin = path.join(
  ROOT,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'parcel.cmd' : 'parcel'
);

run(parcelBin, ['build', ...entries, '--dist-dir', 'dist']);

// Copy static assets that Parcel doesn't fingerprint/process (referenced via fetch at runtime)
const STATIC_PASSTHROUGH = ['materials.config.json'];
for (const name of STATIC_PASSTHROUGH) {
  const src = path.join(ROOT, name);
  if (!fs.existsSync(src)) continue;
  fs.copyFileSync(src, path.join(ROOT, 'dist', name));
  // Also mirror under /en/ so the EN page can fetch ../materials.config.json (already lives at root,
  // but copying to /en/ as a safety net in case any localized page resolves relatively)
  const enDir = path.join(ROOT, 'dist', 'en');
  if (fs.existsSync(enDir)) {
    fs.copyFileSync(src, path.join(enDir, name));
  }
}
