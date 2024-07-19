// src/utils/importAllImages.js
export const images = importAll(require.context('../assets/profile', false, /\.png$/));

function importAll(r) {
  let images = {};
  r.keys().forEach((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}
