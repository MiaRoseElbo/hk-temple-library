import React from 'react';
import getImagePath from '../utils/getImagePath';
import tipoMapping from '../utils/cardJsonMapping';

const Step3 = ({ deckName, setDeckName, selectedCards, handleMouseEnter, handleMouseLeave, handleSaveDeck }) => {
  const finalGroupedSelectedCards = selectedCards.reduce((groups, card) => {
    if (!groups[card.Tipo]) {
      groups[card.Tipo] = {};
    }
    if (!groups[card.Tipo][card.Numero]) {
      groups[card.Tipo][card.Numero] = { ...card, count: 0 };
    }
    groups[card.Tipo][card.Numero].count++;
    return groups;
  }, {});

  const sortedGroups = Object.keys(finalGroupedSelectedCards).sort((a, b) => {
    if (a === 'san') return -1;
    if (b === 'san') return 1;
    return a.localeCompare(b);
  });

  return (
    <div>
      <h2>Nombra tu Mazo</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={deckName}
        onChange={(e) => setDeckName(e.target.value)}
      />

      <h3>Cartas ({selectedCards.length}/41)</h3>
      <div className="mazo">
        {sortedGroups.map((tipo, index) => (
          <div key={index} className={`mazo-group ${tipo === 'san' ? 'highlighted' : ''}`}>
            {tipo !== 'san' && <h4>{(tipoMapping[tipo] || tipo)}</h4>}
            {Object.values(finalGroupedSelectedCards[tipo]).map((card, cardIndex) => (
              <div key={cardIndex} className="mazo-item">
                <div
                  className='card-faccion'
                  onMouseEnter={() => handleMouseEnter(card)}
                  onMouseLeave={handleMouseLeave}
                >
                  <img src={getImagePath('facciones', `${card.Faccion}.png`)} /> {card.Nombre} x{card.count}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={handleSaveDeck}>Guardar Mazo</button>
    </div>
  );
};

export default Step3;
