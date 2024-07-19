// src/components/AvatarCreator.jsx
import React, { useState, useEffect } from 'react';
import { images } from '../utils/importAllImages';
import './AvatarCreator.css';

const AvatarCreator = ({ onAvatarChange, initialAvatar }) => {
  const [selectedImages, setSelectedImages] = useState(initialAvatar);
  const [imageCounts, setImageCounts] = useState({});
  const [currentIndices, setCurrentIndices] = useState({});

  useEffect(() => {
    onAvatarChange(selectedImages);
  }, [selectedImages, onAvatarChange]);

  useEffect(() => {
    const counts = {};
    Object.keys(images).forEach((key) => {
      const category = key[0];
      if (!counts[category]) {
        counts[category] = 0;
      }
      counts[category]++;
    });
    setImageCounts(counts);

    const initialIndices = {};
    Object.keys(counts).forEach(category => {
      initialIndices[category] = 0;
    });
    setCurrentIndices(initialIndices);
  }, []);

  const handleChange = (category, image) => {
    if (category === 'g' || category === 'h') {
      setSelectedImages((prevState) => ({
        ...prevState,
        [category]: prevState[category].includes(image)
          ? prevState[category].filter((img) => img !== image)
          : [...prevState[category], image]
      }));
    } else {
      setSelectedImages((prevState) => ({
        ...prevState,
        [category]: image
      }));
    }
  };

  const handleNext = (category, count) => {
    setCurrentIndices((prevIndices) => {
      const newIndex = (prevIndices[category] + 1) % count;
      const newImage = `${category}${String(newIndex + 1).padStart(2, '0')}.png`;
      handleChange(category, newImage);
      return { ...prevIndices, [category]: newIndex };
    });
  };

  const handlePrev = (category, count) => {
    setCurrentIndices((prevIndices) => {
      const newIndex = (prevIndices[category] - 1 + count) % count;
      const newImage = `${category}${String(newIndex + 1).padStart(2, '0')}.png`;
      handleChange(category, newImage);
      return { ...prevIndices, [category]: newIndex };
    });
  };

  const renderOptions = (category) => {
    const count = imageCounts[category] || 0;
    const currentIndex = currentIndices[category] || 0;
    const image = `${category}${String(currentIndex + 1).padStart(2, '0')}.png`;
    const imagePath = images[image];
    
    if (category === 'g' || category === 'h') {
      return (
        <div className="option-container">
          {Object.keys(images)
            .filter(img => img.startsWith(category))
            .map((img) => {
              const isChecked = selectedImages[category]?.includes(img);
              const imgPath = images[img];
              return (
                <label key={img}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleChange(category, img)}
                  />
                  <img src={imgPath} alt={img} className={isChecked ? 'selected' : ''} />
                </label>
              );
            })}
        </div>
      );
    } else {
      return (
        <div className="option-container">
          <button onClick={() => handlePrev(category, count)}>&lt;</button>
          <button onClick={() => handleNext(category, count)}>&gt;</button>
        </div>
      );
    }
  };

  return (
    <div className="avatar-creator">
      <div className="avatar-options">
        <div className="category">
          <h4>Cuerpo</h4>
          <div className="options">{renderOptions('a')}</div>
        </div>
        <div className="category">
          <h4>Ojos</h4>
          <div className="options">{renderOptions('b')}</div>
        </div>
        <div className="category">
          <h4>Cejas</h4>
          <div className="options">{renderOptions('c')}</div>
        </div>
        <div className="category">
          <h4>Nariz</h4>
          <div className="options">{renderOptions('d')}</div>
        </div>
        <div className="category">
          <h4>Boca</h4>
          <div className="options">{renderOptions('e')}</div>
        </div>
        <div className="category">
          <h4>Cabello</h4>
          <div className="options">{renderOptions('f')}</div>
        </div>
        <div className="category">
          <h4>Peinado</h4>
          <div className="options">{renderOptions('g')}</div>
        </div>
        <div className="category">
          <h4>Accesorios</h4>
          <div className="options">{renderOptions('h')}</div>
        </div>
      </div>
    </div>
  );
};

export default AvatarCreator;
