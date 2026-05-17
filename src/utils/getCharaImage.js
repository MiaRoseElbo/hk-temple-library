// Resolves char_NNN identifiers used in the card_database "Per" field to the
// matching image bundled from src/charas/. Filenames use a 4-digit padded
// number, occasionally with a letter suffix (e.g. "0024b.jpg").
const ctx = require.context('../charas', false, /\.jpg$/);

const map = {};
ctx.keys().forEach((key) => {
  const name = key.replace(/^\.\//, '').replace(/\.jpg$/i, '');
  map[name.toLowerCase()] = ctx(key);
});

export const parsePer = (per) => {
  if (per === null || per === undefined) return [];
  return String(per)
    .replace(/^\s*\[/, '')
    .replace(/\]\s*$/, '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

// Normalize a "char_001" reference (or a bare "1" / "0001") to the 4-digit
// padded id used as the primary key in chara_database.json.
export const normalizeCharaId = (id) => {
  if (id === null || id === undefined) return null;
  const raw = String(id).trim();
  if (!raw) return null;
  const match = raw.match(/^\s*char_(.+?)\s*$/i);
  const body = (match ? match[1] : raw).trim();
  const digits = body.match(/^(\d+)([a-z]?)$/i);
  if (digits) return digits[1].padStart(4, '0') + (digits[2] || '').toLowerCase();
  return body.toLowerCase();
};

const getCharaImage = (id) => {
  if (!id) return null;
  const match = String(id).match(/^\s*char_(.+?)\s*$/i);
  const raw = (match ? match[1] : String(id)).toLowerCase();
  if (map[raw]) return map[raw];
  const digits = raw.match(/^(\d+)([a-z]?)$/i);
  if (digits) {
    const num = digits[1];
    const suffix = digits[2] || '';
    for (const width of [4, 3, 2, 1]) {
      const candidate = num.padStart(width, '0') + suffix;
      if (map[candidate]) return map[candidate];
    }
  }
  return null;
};

export default getCharaImage;
