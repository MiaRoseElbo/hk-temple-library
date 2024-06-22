// src/components/Card.js
import React from 'react';
import './Card.css';
import { PersonajeIcon } from './Icons';
import tipoMapping from '../utils/cardJsonMapping'; // Import the mapping object
import getImagePath from '../utils/getImagePath';

const iconMapping = {
  '[Personaje]': <PersonajeIcon />,
//   '[Empatía]': <EmpatiaIcon />,
};

const Card = ({ card }) => {
  const { Habilidad } = card;

  const renderHabilidad = (text) => {
    const parts = text.split(/(\[.*?\])/);
    return parts.map((part, index) => {
      if (iconMapping[part]) {
        return <React.Fragment key={index}>{iconMapping[part]}</React.Fragment>;
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  const renderSpheres = () => {
    const spheres = [
      { className: 'coste', value: card.Coste },
      { className: 'fuerza', value: card.Fuerza },
      { className: 'reanim', value: card.Reanim },
      { className: 'adita', value: card.Adita },
      { className: 'estructura', value: card.Estructura },
      { className: 'voluntad', value: card.Voluntad },
    ];

    return spheres.map((sphere, index) => (
      <div key={index} className={`${sphere.className} card-button ${!sphere.value ? 'hidden' : ''}`}>
        <div className={`${sphere.className}-sphere`}>
          <div className='sphere-value'>
            {sphere.value}
          </div>
        </div>
      </div>
    ));
  };

  const cardImagePath = card.Imagen?getImagePath('cards', `${card.Imagen}.jpg`):getImagePath('cards', `${card.Edicion}${card.Numero}.jpg`);
  const cardFramePath = getImagePath('frames', `${card.Marco}.png`);


  return (
    <div className="card-container">
      <div className="card-image" style={{ backgroundImage: `url(${cardImagePath})` }}>
        <div className="card-frame" style={{ backgroundImage: `url(${cardFramePath})` }}>
          <div className="card-name">
            <h1 className="name">{card.Nombre}</h1>
          </div>
          {renderSpheres()}
          <div className="card-icon">
            <PersonajeIcon />
          </div>
          <div className="card-type">
            <h1 className="type">{tipoMapping[card.Tipo] || card.Tipo}</h1>
          </div>
          <div className="card-text">
            <p className="habilidad">{renderHabilidad(Habilidad)}</p>
            <p className="epigrafe">{card.Epigrafe}</p>
            <div className="card-illus">{`Ilustrador: ${card.Ilustrador}`}</div>
            <div className="card-rarity">{(card.Frecuencia?card.Frecuencia:'')+' '+card.Edicion+card.Numero}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
