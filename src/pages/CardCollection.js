// src/pages/CardCollection.js
import React, { useState } from 'react';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import cardsData from '../data/cards.json';
import './CardCollection.css';

const CardCollection = () => {
  const [cards, setCards] = useState([]);
  const [cardSize, setCardSize] = useState('medium');
  const [filters, setFilters] = useState({
    Edicion: [],
    Tipo: [],
    Faccion: [],
    Frecuencia: [],
  });

  const handleSearch = (query, habilidad, epigrafe, ilustrador, filters) => {
    const filteredCards = cardsData.filter(card => 
      card.Nombre.toLowerCase().includes(query.toLowerCase()) &&
      card.Habilidad.toLowerCase().includes(habilidad.toLowerCase()) &&
      card.Epigrafe.toLowerCase().includes(epigrafe.toLowerCase()) &&
      card.Ilustrador.toLowerCase().includes(ilustrador.toLowerCase()) &&
      Object.keys(filters).every((key) =>
        filters[key].length === 0 || filters[key].includes(card[key])
      )
    );
    setCards(filteredCards);
  };

  const handleFilterChange = (category, value) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      if (newFilters[category].includes(value)) {
        newFilters[category] = newFilters[category].filter((item) => item !== value);
      } else {
        newFilters[category].push(value);
      }
      return newFilters;
    });
  };

  const increaseCardSize = () => {
    setCardSize(prevSize => (prevSize === 'small' ? 'medium' : 'large'));
  };

  const decreaseCardSize = () => {
    setCardSize(prevSize => (prevSize === 'large' ? 'medium' : 'small'));
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} onFilterChange={handleFilterChange} />
      <div className="size-buttons">
        <button onClick={decreaseCardSize}>Smaller</button>
        <button onClick={increaseCardSize}>Larger</button>
      </div>
      <div className={`card-collection ${cardSize}`}>
        {cards.length === 0 ? (
          <p>{"No hay cartas en tu búsqueda :("}</p>
        ) : (
          cards.map((card, index) => (
            <div className={`card-wrapper ${cardSize}`}>
                <Card key={index} card={card} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CardCollection;
