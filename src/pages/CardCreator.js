// src/components/CardCreator.jsx
import React, { useState } from 'react';
import './CardCreator.css';
import Card from '../components/Card';

const CardCreator = ({ addNewCard }) => {
  const [newCard, setNewCard] = useState({
    Edicion: "Sitio",
    Numero: "",
    Faccion: "",
    Nombre: "",
    Tipo: "",
    Subtipo: "",
    Habilidad: "",
    Epigrafe: "",
    Ilustrador: "",
    Frecuencia: "",
    Imagen: "",
    Marco: ""
  });

  console.log(newCard);

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
      <div>
        <Card card={newCard} />
      </div>
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
        <select id="Faccion" name="Faccion" onChange={handleChange}>
            <option value="qui">Quimera</option>
            <option value="abi">Abismales</option>
            <option value="cor">Corporación</option>
            <option value="acr">Acracia</option>
        </select>
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
        <select id="Marco" name="Marco" onChange={handleChange}>
            <option value="qui">Quimera</option>
            <option value="abi">Abismales</option>
            <option value="cor">Corporación</option>
            <option value="acr">Acracia</option>
        </select>
        <button type="submit">Add Card</button>
      </form>
    </div>
  );
};

export default CardCreator;
