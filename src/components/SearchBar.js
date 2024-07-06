// src/components/SearchBar.js
import React, { useState } from 'react';
import './SearchBar.css';

const categories = {
  Edicion: { evo: 'Evolución', dev: 'Desviantes', sub: 'Suburbia', rad: 'Radix', col: 'Colosos', avl: 'Alto Voltaje', cal: 'Calixto' },
  Tipo: { san: 'Santuario', tec: 'Tecnología', per: 'Personaje', man: 'Manipulación', col: 'Coloso', adi: 'Aditamento' },
  Faccion: { qui: 'Quimera', abi: 'Abismales', cor: 'Corporación', acr: 'Acracia', sin: 'Sin Facción' },
  Frecuencia: { P: 'Promo', R: 'Rara', I: 'Infrecuente', C: 'Común' },
};

const SearchBar = ({ onSearch, onFilterChange }) => {
  const [query, setQuery] = useState('');
  const [habilidad, setHabilidad] = useState('');
  const [epigrafe, setEpigrafe] = useState('');
  const [ilustrador, setIlustrador] = useState('');
  const [filters, setFilters] = useState({
    Edicion: [],
    Tipo: [],
    Faccion: [],
    Frecuencia: [],
  });

  const [expandedCategories, setExpandedCategories] = useState({
    Edicion: false,
    Tipo: false,
    Faccion: false,
    Frecuencia: false,
  });

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  const handleCheckboxChange = (category, value) => {
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

  const handleSearchClick = () => {
    onSearch(query, habilidad, epigrafe, ilustrador, filters);
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div className="search-bar">
      <div>Busca una carta</div>
      <div className='search-inputs'>
        <input 
          type="text" 
          placeholder="Por nombre..." 
          value={query} 
          onChange={(e) => handleInputChange(e, setQuery)}
        />
        <input 
          type="text" 
          placeholder="Por Habilidad..." 
          value={habilidad} 
          onChange={(e) => handleInputChange(e, setHabilidad)}
        />
        <input 
          type="text" 
          placeholder="Por Epigrafe..." 
          value={epigrafe} 
          onChange={(e) => handleInputChange(e, setEpigrafe)}
        />
        <input 
          type="text" 
          placeholder="Por Ilustrador..." 
          value={ilustrador} 
          onChange={(e) => handleInputChange(e, setIlustrador)}
        />
      </div>
      <button onClick={handleSearchClick} className='btn'>Buscar en la biblioteca</button>
      <div className='filtros'>
        <div>Filtrar por</div>
        <div className="filter-container">
          {Object.keys(categories).map((category) => (
            <div key={category} className="filter-category">
              <h3 onClick={() => toggleCategory(category)}>
                {category} <span className={`arrow ${expandedCategories[category] ? 'expanded' : ''}`}>&#9662;</span>
              </h3>
              {expandedCategories[category] && (
                <div className="filter-options">
                  {Object.keys(categories[category]).map((value) => (
                    <div key={value}>
                      <input
                        type="checkbox"
                        id={`${category}-${value}`}
                        checked={filters[category].includes(value)}
                        onChange={() => handleCheckboxChange(category, value)}
                      />
                      <label htmlFor={`${category}-${value}`}>{categories[category][value]}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
