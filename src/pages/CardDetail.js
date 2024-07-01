// src/pages/CardDetail.js
import React from 'react';
import { useParams } from 'react-router-dom';
import cardsData from '../data/cards.json';
import './CardDetail.css';
import Card from '../components/Card';

const CardDetail = () => {
  const { id } = useParams(); // Get the card ID from the URL parameters
  const card = cardsData.find((card) => card.id == id); // Find the card based on the ID

  if (!card) {
    return <div>Card not found</div>;
  }

  return (
    <div className="card-detail-container">
      <Card card={card} />
      <div>
        <h1>{card.Nombre}</h1>
      <div className="card-detail-info">
        <p><strong>Habilidad:</strong> {card.Habilidad}</p>
        <p><strong>Epigrafe:</strong> {card.Epigrafe}</p>
        <p><strong>Ilustrador:</strong> {card.Ilustrador}</p>
        <p><strong>Edicion:</strong> {card.Edicion}</p>
        <p><strong>Frecuencia:</strong> {card.Frecuencia}</p>
        <p><strong>Tipo:</strong> {card.Tipo}</p>
        <p><strong>Subtipo:</strong> {card.Subtipo}</p>
        <p><strong>Coste:</strong> {card.Coste}</p>
        <p><strong>Fuerza:</strong> {card.Fuerza}</p>
        <p><strong>Reanim:</strong> {card.Reanim}</p>
        <p><strong>Adita:</strong> {card.Adita}</p>
        <p><strong>Estructura:</strong> {card.Estructura}</p>
        <p><strong>Voluntad:</strong> {card.Voluntad}</p>
        {/* Add any additional information you want to display */}
      </div>
      </div>
      
      <div className="card-strategies">
        <h2>Suggested Strategies</h2>
        {/* Add strategy information here */}
      </div>
    </div>
  );
};

export default CardDetail;
