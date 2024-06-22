import React from 'react';
import './Card.css';
import Icons from './Icons';
import tipoMapping from '../utils/cardJsonMapping'; // Import the mapping object
import getImagePath from '../utils/getImagePath';

const iconMapping = {
  'Personaje': (<Icons type="per" />),
  'Santuario': (<Icons type="san" />),
  'Tecnología': (<Icons type="tec" />),
  'Manipulación': (<Icons type="man" />),
  'Coloso': (<Icons type="col" />),
  'Aditamento': (<Icons type="adi" />),
};

const Card = ({ card }) => {
  const { Habilidad } = card;

  const renderHabilidad = (text) => {
    const regex = new RegExp(`(${Object.keys(iconMapping).join('|')})`, 'g');
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (iconMapping[part]) {
        return (
          <React.Fragment key={index}>
            {iconMapping[part]} {part}
          </React.Fragment>
        );
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

  const cardImagePath = card.Imagen
    ? getImagePath('cards', `${card.Imagen}.jpg`)
    : getImagePath('cards', `${card.Edicion}${card.Numero}.jpg`);
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
            <Icons type={card.Tipo} fill="white" />
          </div>
          <div className="card-type">
            <h1 className="type">{(tipoMapping[card.Tipo] || card.Tipo) + (card.Subtipo ? " - " + card.Subtipo : "")}</h1>
          </div>
          <div className="card-text">
            <p className="habilidad">{renderHabilidad(Habilidad)}</p>
            <p className="epigrafe">{card.Epigrafe}</p>
            <div className="card-illus">{`Ilustrador: ${card.Ilustrador}`}</div>
            <div className="card-rarity">{(card.Frecuencia ? card.Frecuencia : '') + ' ' + card.Edicion + card.Numero}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
