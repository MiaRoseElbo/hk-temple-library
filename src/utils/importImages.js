// src/utils/importImages.js

function importAll(r) {
    let images = {};
    r.keys().forEach((item, index) => {
      const key = item.replace('./', '').replace('.jpg', '');
      images[key] = r(item);
    });
    return images;
  }
  
  const images = importAll(require.context('../assets/cards', false, /\.jpg$/));
  
  export default images;
  