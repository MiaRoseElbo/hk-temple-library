// Walks public/legacy/ and writes src/data/legacy-manifest.json mapping
// uppercased GUID -> public URL. Mirrors the precedence rules previously
// implemented in src/utils/getLegacyImage.js: non-wip beats wip, and within
// the same tier png > jpg > jpeg. Files ending in "_foil" are tracked under
// the key "{GUID}_FOIL" and used as a holographic mask in the UI.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LEGACY_DIR = path.join(ROOT, 'public', 'legacy');
const OUT_FILE = path.join(ROOT, 'src', 'data', 'legacy-manifest.json');

const EXT_RANK = { png: 3, jpg: 2, jpeg: 1 };

const walk = (dir, acc = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
};

const buildManifest = () => {
  if (!fs.existsSync(LEGACY_DIR)) {
    console.warn(`[legacy-manifest] ${LEGACY_DIR} not found, writing empty manifest`);
    return {};
  }
  const map = {};
  for (const file of walk(LEGACY_DIR)) {
    const rel = path.relative(LEGACY_DIR, file).split(path.sep).join('/');
    const match = rel.match(/([A-Za-z0-9]+)(_foil)?\.(png|jpe?g)$/i);
    if (!match) continue;
    const baseGuid = match[1].toUpperCase();
    const isFoil = Boolean(match[2]);
    const ext = match[3].toLowerCase();
    const isWip = /(^|\/)wip\//i.test(rel);
    const score = (isWip ? 0 : 100) + (EXT_RANK[ext] || 0);
    const url = `legacy/${rel}`;
    const key = isFoil ? `${baseGuid}_FOIL` : baseGuid;
    const existing = map[key];
    if (!existing || score > existing.score) {
      map[key] = { url, score };
    }
  }
  const out = {};
  for (const guid of Object.keys(map).sort()) out[guid] = map[guid].url;
  return out;
};

const manifest = buildManifest();
fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(manifest, null, 0));
console.log(`[legacy-manifest] wrote ${Object.keys(manifest).length} entries to ${path.relative(ROOT, OUT_FILE)}`);
