import React, { useState } from 'react';
import getImagePath from '../utils/getImagePath';

const Step1 = ({ cardsData, setSantuario, addCardToDeck, nextStep, handleMouseEnter, handleMouseLeave }) => {
  const [faccionFilter, setFaccionFilter] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const faccionOptions = {
    qui: 'Quimera',
    abi: 'Abismales',
    cor: 'Corporación',
    acr: 'Acracia',
    sin: 'Sin Facción'
  };

  const handleSortOptionChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const filteredCards = cardsData.filter(card => 
    card.Tipo === 'san' && (!faccionFilter || card.Faccion === faccionFilter)
  );

  const sortedCards = [...filteredCards].sort((a, b) => {
    const order = sortOrder === 'asc' ? 1 : -1;
    switch (sortOption) {
      case 'adita':
        return order * (a.Adita - b.Adita);
      case 'estructura':
        return order * (a.Estructura - b.Estructura);
      case 'voluntad':
        return order * (a.Voluntad - b.Voluntad);
      default:
        return 0;
    }
  });

  return (
    <div>
      <h2>Selecciona tu Santuario</h2>
      <div className="step-uno-filtros">
        <div className="step-uno-filtro-faccion">
          Filtrar por Facción:
          <select value={faccionFilter} onChange={(e) => setFaccionFilter(e.target.value)}>
            <option value="">Todas las Facciones</option>
            {Object.entries(faccionOptions).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <label>
          Ordenar por:
          <select value={sortOption} onChange={handleSortOptionChange}>
            <option value="">Sin ordenar</option>
            <option value="adita">Aditamentos</option>
            <option value="estructura">Estructura</option>
            <option value="voluntad">Voluntad</option>
          </select>
        </label>
        <label className={`${sortOption=="" ? 'hidden' : ''}`}>
          Orden:
          <select value={sortOrder} onChange={handleSortOrderChange} >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </label>
      </div>
      <div className="san-list">
        {sortedCards.map((card, index) => (
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
};

export default Step1;
