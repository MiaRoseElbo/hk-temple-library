// src/pages/CardCollection.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import cardsData from '../data/cards.json';
import './CardCollection.css';

const CardCollection = () => {
  const [cards, setCards] = useState([]);
  const [cardSize, setCardSize] = useState(0.4);
  const [filters, setFilters] = useState({
    Edicion: [],
    Tipo: [],
    Faccion: [],
    Frecuencia: [],
  });
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 25;

  const handleSearch = (query, habilidad, epigrafe, ilustrador, filters) => {
    // Step 1: Sort the cards by ID and Version
    const sortedCards = [...cardsData].sort((a, b) => {
      if (a.ID === b.ID) {
        // Compare versions (assumes Version is in a format that supports string comparison)
        return b.Version.localeCompare(a.Version);
      }
      return a.ID - b.ID;
    });
  
    // Step 2: Filter to keep only the latest version for each ID
    const uniqueCards = [];
    const seenIds = new Set();
    for (const card of sortedCards) {
      if (!seenIds.has(card.ID)) {
        uniqueCards.push(card);
        seenIds.add(card.ID);
      }
    }
  
    // Step 3: Apply search filters
    const filteredCards = uniqueCards.filter(card => 
      (card.Nombre?.toLowerCase() ?? '').includes(query.toLowerCase()) &&
      (card.Habilidad?.toLowerCase() ?? '').includes(habilidad.toLowerCase()) &&
      (card.Epigrafe?.toLowerCase() ?? '').includes(epigrafe.toLowerCase()) &&
      (card.Ilustrador?.toLowerCase() ?? '').includes(ilustrador.toLowerCase()) &&
      Object.keys(filters).every((key) =>
        filters[key].length === 0 || filters[key].includes(card[key])
      )
    );
  
    setCards(filteredCards);
    setCurrentPage(1); // Reset to the first page whenever a new search is performed
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
    setCardSize(prevSize => (prevSize === 1 ? 1 : (prevSize+0.1)));
  };

  const decreaseCardSize = () => {
    setCardSize(prevSize => (prevSize === 0.1 ? 0.1 : prevSize-0.1));
  };

  const totalPages = Math.ceil(cards.length / cardsPerPage);
  const paginatedCards = cards.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage);

  const goToPreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const handleCardClick = (cardId) => {
    navigate(`/cards/${cardId}`);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} onFilterChange={handleFilterChange} />
      <div className="size-buttons">
        <button onClick={decreaseCardSize}>-</button>
        <button onClick={increaseCardSize}>+</button>
      </div>
      <div className={`card-collection`}>
        {paginatedCards.length === 0 ? (
          <p>{"No hay cartas en tu búsqueda :("}</p>
        ) : (
          paginatedCards.map((card, index) => (
            <div 
              key={index}
              className={`card-wrapper`}
              // onClick={() => handleCardClick(card.id)}
            >
                <Card card={card} size={cardSize}/>
            </div>
          ))
        )}
      </div>
      {cards.length > cardsPerPage && (
        <div className="pagination">
          {console.log(currentPage)}
          <button onClick={goToPreviousPage} disabled={currentPage === 1}>Atrás</button>
          <span>Página {currentPage} de {totalPages}</span>
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>Siguiente</button>
        </div>
      )}
    </div>
  );
}

export default CardCollection;
