import React, { useState } from 'react';
import getImagePath from '../utils/getImagePath';
import tipoMapping from '../utils/cardJsonMapping';

const Step2 = ({ cardsData, selectedCards, santuario, addCardToDeck, removeCardFromDeck, handleMouseEnter, handleMouseLeave, groupedSelectedCards }) => {
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const toggleGroupCollapse = (type) => {
    setCollapsedGroups(prevState => ({
      ...prevState,
      [type]: !prevState[type]
    }));
  };

  const filteredCards = cardsData.filter(card => card.Tipo !== 'san' && (card.Faccion === 'sin' || card.Faccion === santuario.Faccion));
  const groupedCards = filteredCards.reduce((groups, card) => {
    if (!groups[card.Tipo]) {
      groups[card.Tipo] = [];
    }
    groups[card.Tipo].push(card);
    return groups;
  }, {});

  const renderDeckCard = (card) => {
    return (
      <div
        key={card.Numero}
        className="san-item"
        onMouseEnter={() => handleMouseEnter(card)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="card-data">
          <div className="title">
            <div className='card-faccion'>
              <img src={getImagePath('facciones', `${card.Faccion}.png`)} />
            </div>
            <div className="card-nombre">{card.Nombre} {(card.Tipo === 'san') ? '' : ('x' + (card.count))}</div>
          </div>
          <div className="stats">
            <ul>
              <li>{card.Coste ? ("Coste: " + card.Coste) : ''}</li>
              <li>{card.Fuerza ? ("Fuerza: " + card.Fuerza) : ''}</li>
              <li>{card.Reanim ? ("Reanimación: " + card.Reanim) : ''}</li>
              <li>{card.Adita ? ("Aditamentos: " + card.Adita) : ''}</li>
              <li>{card.Estructura ? ("Estructura: " + card.Estructura) : ''}</li>
              <li>{card.Voluntad ? ("Voluntad: " + card.Voluntad) : ''}</li>
            </ul>
          </div>
        </div>
        <div className="san-img" style={{ backgroundImage: `url(${card.Imagen
          ? getImagePath('cards', `${card.Imagen}.jpg`)
          : getImagePath('cards', `${card.Edicion}${card.Numero}.jpg`)})` }}>
        </div>
      </div>
    );
  };

  const sortedGroupedSelectedCards = Object.values(groupedSelectedCards).sort((a, b) => {
    if (a.Tipo === 'san') return -1;
    if (b.Tipo === 'san') return 1;
    return a.Tipo.localeCompare(b.Tipo);
  });

  return (
    <div>
      <h2>Agrega Cartas</h2>
      <div className="step-2">
        <div className="selected-cards">
          <h3>Cartas en Mazo ({selectedCards.length}/41)</h3>
          {sortedGroupedSelectedCards.map((card, index) => (
            <div key={index} className={`selected-card-item ${card.Tipo === 'san' ? 'item-san' : ''}`}>
              {renderDeckCard(card)}
            </div>
          ))}
        </div>
        <div className="card-list">
          {Object.keys(groupedCards).map((type, index) => (
            <div key={index} className="card-group">
              <h3 onClick={() => toggleGroupCollapse(type)} className="group-title">
                {(tipoMapping[type] || type)} <span className={`arrow ${!collapsedGroups[type] ? 'expanded' : ''}`}>&#9662;</span>
              </h3>
              <table className='card-table'>
                {!collapsedGroups[type] && groupedCards[type].map((card, cardIndex) => {
                  const cardCount = selectedCards.filter(c => c.Numero === card.Numero).length;
                  const isDisabled = (cardCount >= 4) || (card.Tipo === 'col' && selectedCards.some(c => c.Tipo === 'col' && c.Numero !== card.Numero));

                  return (
                    <tr
                      key={cardIndex}
                      className={`card-item ${isDisabled ? 'disabled' : ''}`}
                      onMouseEnter={() => handleMouseEnter(card)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <td>{card.Nombre}</td>
                      <td className="button-group">
                        <button
                          onClick={() => removeCardFromDeck(card.Numero)}
                          disabled={cardCount === 0}
                        >
                          -
                        </button>
                        <div>{cardCount}</div>
                        <button
                          onClick={() => addCardToDeck(card, cardCount + 1)}
                          disabled={isDisabled}
                        >
                          +
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step2;
