import React, { useState, useEffect } from 'react';
import './DeckList.css';

const DeckList = () => {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    const storedDecks = JSON.parse(localStorage.getItem('decks')) || [];
    setDecks(storedDecks);
  }, []);

  return (
    <div className="deck-list">
      <h1>Mazos</h1>
      {decks.map((deck, index) => (
        <div key={index} className="deck-item">
          <h2>{deck.name}</h2>
          <ul>
            {deck.cards.map((card, idx) => (
              <li key={idx}>{card.Nombre}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default DeckList;
