#!/usr/bin/env node
/**
 * swap-canonical-domain.js
 *
 * One-shot canonical-domain swap for FloorDSGN repo.
 *
 * Usage:
 *   node scripts/swap-canonical-domain.js --to floordsgn.co.il
 *   node scripts/swap-canonical-domain.js --to floordsgn.co.il --dry-run
 *   node scripts/swap-canonical-domain.js --to floordsgn.co.il --from floordsgn-site.vercel.app,floor.dsgn.co.il,floordsgn.netlify.app
 *   node scripts/swap-canonical-domain.js --to floordsgn.co.il --root ~/Work/02-Projects/meltbot/moltbot-dashboard/sales
 *
 * Default OLD domains (replaced):
 *   - floordsgn-site.vercel.app
 *   - floor.dsgn.co.il
 *   - floordsgn.netlify.app  (only when explicitly listed — keep .netlify.app working otherwise)
 *
 * What it touches:
 *   - *.html, *.xml, *.json, *.md, *.toml, *.txt
 *   - Skips: node_modules, _backups, _audit, .git, dist, .netlify
 *
 * Safety:
 *   - Backs up every modified file to ~/.openclaw/dashboard-data/backups/domain-swap-<timestamp>/<relpath>.bak
 *   - --dry-run prints planned diffs without writing
 *   - Idempotent: running twice with same target is a no-op
 *
 * Exit codes: 0 ok, 1 cli/error, 2 nothing to change
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const DEFAULT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_OLD = ['floordsgn-site.vercel.app', 'floor.dsgn.co.il'];

function parseArgs(argv) {
  const out = { dryRun: false, to: null, from: null, root: DEFAULT_ROOT };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') out.dryRun = true;
    else if (a === '--to') out.to = argv[++i];
    else if (a === '--from') out.from = argv[++i];
    else if (a === '--root') out.root = path.resolve(expandHome(argv[++i]));
    else if (a === '-h' || a === '--help') { printHelp(); process.exit(0); }
    else { console.error('unknown arg:', a); printHelp(); process.exit(1); }
  }
  if (!out.to) { console.error('--to <domain> required'); printHelp(); process.exit(1); }
  if (out.to.startsWith('http')) {
    console.error('--to must be a bare host, e.g. floordsgn.co.il (no protocol)'); process.exit(1);
  }
  if (!fs.existsSync(out.root) || !fs.statSync(out.root).isDirectory()) {
    console.error(`--root must point at an existing directory: ${out.root}`); process.exit(1);
  }
  out.fromList = out.from ? out.from.split(',').map(s => s.trim()).filter(Boolean) : DEFAULT_OLD;
  return out;
}

function expandHome(p) {
  if (!p) return p;
  if (p.startsWith('~/')) return path.join(os.homedir(), p.slice(2));
  if (p === '~') return os.homedir();
  return p;
}

function printHelp() {
  console.log(`Usage: node scripts/swap-canonical-domain.js --to <new-domain> [--from list,of,old] [--root <path>] [--dry-run]`);
}

const SKIP_DIRS = new Set(['node_modules', '_backups', '_audit', '.git', 'dist', '.netlify', '_external', '_screens']);
const EXTS = new Set(['.html', '.xml', '.json', '.md', '.toml', '.txt']);

function walk(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('.') && e.name !== '.netlifyignore') continue;
    if (SKIP_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, files);
    else if (EXTS.has(path.extname(e.name))) files.push(full);
  }
  return files;
}

function ensureBackupDir() {
  const ts = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);
  const dir = path.join(os.homedir(), '.openclaw', 'dashboard-data', 'backups', `domain-swap-${ts}`);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function backup(filePath, backupRoot, scanRoot) {
  const rel = path.relative(scanRoot, filePath);
  const dest = path.join(backupRoot, rel + '.bak');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(filePath, dest);
}

function swap(content, fromList, to) {
  let out = content;
  let count = 0;
  for (const old of fromList) {
    if (!old || old === to) continue;
    const escaped = old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escaped, 'g');
    const matches = out.match(re);
    if (matches) {
      count += matches.length;
      out = out.replace(re, to);
    }
  }
  return { out, count };
}

function main() {
  const args = parseArgs(process.argv);
  console.log(`Target canonical: ${args.to}`);
  console.log(`Replacing: ${args.fromList.join(', ')}`);
  console.log(`Dry run: ${args.dryRun}`);
  console.log(`Scan root: ${args.root}`);

  const files = walk(args.root);
  let totalFiles = 0;
  let totalReplacements = 0;
  let backupRoot = null;

  for (const file of files) {
    let content;
    try { content = fs.readFileSync(file, 'utf8'); } catch { continue; }
    const { out, count } = swap(content, args.fromList, args.to);
    if (count === 0 || out === content) continue;
    totalFiles++;
    totalReplacements += count;
    const rel = path.relative(args.root, file);
    console.log(`  [${count}x] ${rel}`);
    if (!args.dryRun) {
      if (!backupRoot) backupRoot = ensureBackupDir();
      backup(file, backupRoot, args.root);
      fs.writeFileSync(file, out, 'utf8');
    }
  }

  console.log(`\nFiles touched: ${totalFiles}`);
  console.log(`Total replacements: ${totalReplacements}`);
  if (backupRoot) console.log(`Backups: ${backupRoot}`);
  if (args.dryRun) console.log('\nDRY RUN — no files written. Re-run without --dry-run to apply.');

  if (totalFiles === 0) {
    console.log('\nNothing to change. Either already migrated or wrong --from list.');
    process.exit(2);
  }
}

main();
