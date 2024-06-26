import React from 'react';
import getImagePath from '../utils/getImagePath';

const Step1 = ({ cardsData, setSantuario, addCardToDeck, nextStep, handleMouseEnter, handleMouseLeave }) => (
  <div>
    <h2>Selecciona tu Santuario</h2>
    <div className="san-list">
      {cardsData.filter(card => card.Tipo === 'san').map((card, index) => (
        <div
          key={index}
          className="san-item"
          onMouseEnter={() => handleMouseEnter(card)}
          onMouseLeave={handleMouseLeave}
          onClick={() => { setSantuario(card); addCardToDeck(card, 1); nextStep(); }}
        >
          <div className="card-data">
            <div className="title">
              <div className='faccion-card'>
                <img src={getImagePath('facciones', `${card.Faccion}.png`)} />
              </div>
              <div className="card-nombre">{card.Nombre}</div>
            </div>
            <div className="card-stats">
              <div>Aditamentos</div><div>{card.Adita}</div>
              <div>Estructura</div><div>{card.Estructura}</div>
              <div>Voluntad</div><div>{card.Voluntad}</div>
            </div>
          </div>
          <div className="san-img" style={{ backgroundImage: `url(${card.Imagen
            ? getImagePath('cards', `${card.Imagen}.jpg`)
            : getImagePath('cards', `${card.Edicion}${card.Numero}.jpg`)})` }}>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Step1;
