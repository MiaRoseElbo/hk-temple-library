// src/utils/getImagePath.js
const cardImages = require.context('../assets/cards', false, /\.jpg$/);
const frameImages = require.context('../assets/frames', false, /\.png$/);
const faccionesImages = require.context('../assets/facciones', false, /\.png$/);

const getImagePath = (folder, path) => {
  try {
    if (folder === 'cards') {
      return cardImages(`./${path}`);
    } else if (folder === 'frames') {
      return frameImages(`./${path}`);
    } else if (folder === 'facciones') {
      if (path == 'sin.png') {
        return '';
      }else{
        return faccionesImages(`./${path}`);
      }
    }
  } catch (err) {
    return cardImages('./avl001.jpg'); // Fallback image for card images
  }
};

export default getImagePath;
