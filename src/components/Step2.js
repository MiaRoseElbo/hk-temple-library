import React, { useState } from 'react';
import getImagePath from '../utils/getImagePath';
import tipoMapping from '../utils/cardJsonMapping';

const Step2 = ({ cardsData, selectedCards, santuario, addCardToDeck, removeCardFromDeck, handleMouseEnter, handleMouseLeave, groupedSelectedCards }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [activeTab, setActiveTab] = useState('per'); // Set default active tab

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
        key={card.id}
        className="san-item"
        onMouseEnter={() => handleMouseEnter(card)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="card-data">
          <div className="title">
            <div className='deck-creator-card-faccion'>
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

  const sortCards = (cards, config) => {
    if (!config.key) return cards;
    const sortedCards = [...cards].sort((a, b) => {
      if (a[config.key] < b[config.key]) return config.direction === 'asc' ? -1 : 1;
      if (a[config.key] > b[config.key]) return config.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortedCards;
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderTableHeaders = (type) => {
    switch (type) {
      case 'per':
        return (
          <>
            <th onClick={() => handleSort('Nombre')}>Nombre {sortConfig.key === 'Nombre' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
            <th onClick={() => handleSort('Coste')}>Coste {sortConfig.key === 'Coste' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
            <th onClick={() => handleSort('Fuerza')}>Fuerza {sortConfig.key === 'Fuerza' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
            <th onClick={() => handleSort('Restriccion')}>R {sortConfig.key === 'Restriccion' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
          </>
        );
      case 'man':
        return (
          <>
            <th onClick={() => handleSort('Nombre')}>Nombre {sortConfig.key === 'Nombre' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
            <th onClick={() => handleSort('Coste')}>Coste {sortConfig.key === 'Coste' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
            <th onClick={() => handleSort('Restriccion')}>R {sortConfig.key === 'Restriccion' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
          </>
        );
      case 'adi':
        return (
          <>
            <th onClick={() => handleSort('Nombre')}>Nombre {sortConfig.key === 'Nombre' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
            <th onClick={() => handleSort('Estructura')}>Estructura {sortConfig.key === 'Estructura' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
            <th onClick={() => handleSort('Voluntad')}>Voluntad {sortConfig.key === 'Voluntad' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
            <th onClick={() => handleSort('Restriccion')}>R {sortConfig.key === 'Restriccion' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
          </>
        );
      case 'tec':
        return (
          <>
            <th onClick={() => handleSort('Nombre')}>Nombre {sortConfig.key === 'Nombre' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
            <th onClick={() => handleSort('Coste')}>Coste {sortConfig.key === 'Coste' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
            <th onClick={() => handleSort('Restriccion')}>R {sortConfig.key === 'Restriccion' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
          </>
        );
      case 'col':
        return (
          <>
            <th onClick={() => handleSort('Nombre')}>Nombre {sortConfig.key === 'Nombre' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
            <th onClick={() => handleSort('Fuerza')}>Fuerza {sortConfig.key === 'Fuerza' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
            <th onClick={() => handleSort('Reanim')}>Reanimación {sortConfig.key === 'Reanim' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
          </>
        );
      // Add more cases for other types as needed
      default:
        return (
          <>
            <th onClick={() => handleSort('Nombre')}>Nombre {sortConfig.key === 'Nombre' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
          </>
        );
    }
  };

  const renderTableRows = (cards, type) => {
    return sortCards(cards, sortConfig).map((card, cardIndex) => {
      const isBanned = card.Estado==='B';
      const cardCount = selectedCards.filter(c => c.id === card.id).length;
      const totalCount = selectedCards.filter(c => c.Nombre === card.Nombre).length;
      const minRestriction = Math.min(...selectedCards.filter(c => c.Nombre === card.Nombre).map(c => c.Restriccion));
      const isDisabled = (totalCount >= minRestriction) || (card.Tipo === 'col' && selectedCards.some(c => c.Tipo === 'col' && c.id !== card.id));

      switch (type) {
        case 'per':
          return (
            <tr
              key={cardIndex}
              className={`card-item ${isDisabled ? 'disabled' : ''} ${isBanned?'banned':''}`}
              onMouseEnter={() => handleMouseEnter(card)}
              onMouseLeave={handleMouseLeave}
            >
              <td>{card.Nombre+' ('+card.Edicion+')'}</td>
              <td>{card.Coste}</td>
              <td>{card.Fuerza}</td>
              <td>{card.Restriccion}</td>
              <td className="button-group">
                <button
                  onClick={() => removeCardFromDeck(card.id)}
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
        case 'man':
          return (
            <tr
              key={cardIndex}
              className={`card-item ${isDisabled ? 'disabled' : ''} ${isBanned?'banned':''}`}
              onMouseEnter={() => handleMouseEnter(card)}
              onMouseLeave={handleMouseLeave}
            >
              <td>{card.Nombre}</td>
              <td>{card.Coste}</td>
              <td>{card.Restriccion}</td>
              <td className="button-group">
                <button
                  onClick={() => removeCardFromDeck(card.id)}
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
        case 'adi':
          return (
            <tr
              key={cardIndex}
              className={`card-item ${isDisabled ? 'disabled' : ''} ${isBanned?'banned':''}`}
              onMouseEnter={() => handleMouseEnter(card)}
              onMouseLeave={handleMouseLeave}
            >
              <td>{card.Nombre}</td>
              <td>{card.Estructura}</td>
              <td>{card.Voluntad}</td>
              <td>{card.Restriccion}</td>
              <td className="button-group">
                <button
                  onClick={() => removeCardFromDeck(card.id)}
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
        case 'tec':
          return (
            <tr
              key={cardIndex}
              className={`card-item ${isDisabled ? 'disabled' : ''} ${isBanned?'banned':''}`}
              onMouseEnter={() => handleMouseEnter(card)}
              onMouseLeave={handleMouseLeave}
            >
              <td>{card.Nombre}</td>
              <td>{card.Coste}</td>
              <td>{card.Restriccion}</td>
              <td className="button-group">
                <button
                  onClick={() => removeCardFromDeck(card.id)}
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
        case 'col':
          return (
            <tr
              key={cardIndex}
              className={`card-item ${isDisabled ? 'disabled' : ''} ${isBanned?'banned':''}`}
              onMouseEnter={() => handleMouseEnter(card)}
              onMouseLeave={handleMouseLeave}
            >
              <td>{card.Nombre}</td>
              <td>{card.Fuerza}</td>
              <td>{card.Reanim}</td>
              <td className="button-group">
                <button
                  onClick={() => removeCardFromDeck(card.id)}
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
        // Add more cases for other types as needed
        default:
          return (
            <tr
              key={cardIndex}
              className={`card-item ${isDisabled ? 'disabled' : ''} ${isBanned?'banned':''}`}
              onMouseEnter={() => handleMouseEnter(card)}
              onMouseLeave={handleMouseLeave}
            >
              <td>{card.Nombre}</td>
              <td className="button-group">
                <button
                  onClick={() => removeCardFromDeck(card.id)}
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
      }
    });
  };

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
          <div className="tabs">
            {Object.keys(groupedCards).map(type => (
              <button key={type} className={`tab ${activeTab === type ? 'active' : ''}`} onClick={() => setActiveTab(type)}>
                {tipoMapping[type] || type}
              </button>
            ))}
          </div>
          <div className='card-tables'>
            {Object.keys(groupedCards).map((type, index) => (
              <div key={index} className={`card-group ${activeTab === type ? 'active' : 'hidden'}`}>
                <table className='card-table'>
                  <thead>
                    <tr>
                      {renderTableHeaders(type)}
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderTableRows(groupedCards[type], type)}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2;
