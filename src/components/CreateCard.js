// src/components/CreateCard.jsx
import React, { useState } from 'react';
import './CreateCard.css';

const CreateCard = ({ addNewCard }) => {
  const [newCard, setNewCard] = useState({
    Nombre: '',
    Tipo: '',
    Faccion: '',
    Coste: '',
    Fuerza: '',
    Reanim: '',
    Adita: '',
    Estructura: '',
    Voluntad: '',
    Imagen: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCard({
      ...newCard,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addNewCard(newCard);
    alert('New card added successfully!');
    setNewCard({
      Nombre: '',
      Tipo: '',
      Faccion: '',
      Coste: '',
      Fuerza: '',
      Reanim: '',
      Adita: '',
      Estructura: '',
      Voluntad: '',
      Imagen: '',
    });
  };

  return (
    <div className="create-card">
      <h2>Create a New Card</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="Nombre"
          placeholder="Card Name"
          value={newCard.Nombre}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Tipo"
          placeholder="Card Type"
          value={newCard.Tipo}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Faccion"
          placeholder="Faction"
          value={newCard.Faccion}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Coste"
          placeholder="Cost"
          value={newCard.Coste}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Fuerza"
          placeholder="Strength"
          value={newCard.Fuerza}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Reanim"
          placeholder="Reanimation"
          value={newCard.Reanim}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Adita"
          placeholder="Adits"
          value={newCard.Adita}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Estructura"
          placeholder="Structure"
          value={newCard.Estructura}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Voluntad"
          placeholder="Will"
          value={newCard.Voluntad}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Imagen"
          placeholder="Image Path"
          value={newCard.Imagen}
          onChange={handleChange}
        />
        <button type="submit">Add Card</button>
      </form>
    </div>
  );
};

export default CreateCard;
