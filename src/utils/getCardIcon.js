// Resolves :xxx: tokens (e.g. :vir:, :tec:) used in ability text to the
// corresponding icon URL from src/assets/card-icons/. The folder holds ~20
// small PNGs so bundling via require.context is fine.
const ctx = require.context('../assets/card-icons', false, /\.png$/);

const iconMap = {};
ctx.keys().forEach((key) => {
  const name = key.replace(/^\.\//, '').replace(/\.png$/i, '').toLowerCase();
  iconMap[name] = ctx(key);
});

const getCardIcon = (name) => {
  if (!name) return null;
  return iconMap[String(name).toLowerCase()] || null;
};

export default getCardIcon;
