// src/components/CardCreator.jsx
import React, { useState } from 'react';
import './CardCreator.css';
import Card from '../components/Card';

const CardCreator = ({ addNewCard }) => {
  const [newCard, setNewCard] = useState({
    Edicion: "web",
    Numero: "###",
    Faccion: "acr",
    Nombre: "M14",
    Tipo: "per",
    Subtipo: "",
    Coste: '3',
    Fuerza: '1',
    Habilidad: "Agilidad.\nSi porta una Tecnología Acracia, obtiene +1 a la Fuerza.",
    Epigrafe: "Todas las balas se van a devolver.",
    Ilustrador: "Mia Rose Elbo",
    Frecuencia: "P",
    Imagen: "mia001",
    Marco: "rad"
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
      <h2>Crea una carta nueva</h2>
      <div className='create-card-group'>
        <Card card={newCard} />
      <form className='cardCreatorForm' onSubmit={handleSubmit}>
        <div>
            <p className='section-title'>
                Nombre de Carta
            </p>
        </div>
        <input
            type="text"
            name="Nombre"
            placeholder="Nombre"
            value={newCard.Nombre}
            onChange={handleChange}
        />
       
        <div>
            <p className='section-title'>
                Facción y Tipo de carta
            </p>
        </div>
        <select id="Tipo" name="Tipo de Carta" defaultValue="per" onChange={handleChange}>
            <option value="san">Santuario</option>
            <option value="per" >Personaje</option>
            <option value="adi">Aditamento</option>
            <option value="tec">Tecnología</option>
            <option value="man">Manipulación</option>
            <option value="col">Coloso</option>
        </select>
        <select id="Faccion" name="Faccion" defaultValue="acr" onChange={handleChange}>
            <option value="qui">Quimera</option>
            <option value="abi">Abismales</option>
            <option value="cor">Corporación</option>
            <option value="acr" >Acracia</option>
            <option value="sin">Sin Facción</option>
        </select>
        <div>
            <p className='section-title'>
                Valores Esferas
            </p>
        </div>
        <input
          type="text"
          name="Coste"
          placeholder="Coste de Voluntad"
          value={newCard.Coste}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Fuerza"
          placeholder="Fuerza"
          value={newCard.Fuerza}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Reanim"
          placeholder="Coste de Reanimación"
          value={newCard.Reanim}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Adita"
          placeholder="Límite de Aditamentos"
          value={newCard.Adita}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Estructura"
          placeholder="Puntos de Estructura"
          value={newCard.Estructura}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Voluntad"
          placeholder="Puntos de Voluntad"
          value={newCard.Voluntad}
          onChange={handleChange}
        />
        <div>
            <p className='section-title'>
                Marco
            </p>
        </div>
        <select id="Marco" name="Marco" defaultValue="rad" onChange={handleChange}>
            <option value="tra">Tradicional</option>
            <option value="avl">Contemporáneo</option>
            <option value="sol">Solid</option>
            <option value="rad">Radix</option>
        </select>
        <div>
            <p className='section-title'>
                Habilidad
            </p>
        <textarea
          type='textarea'
          name="Habilidad"
          placeholder="Habilidad"
          value={newCard.Habilidad}
          onChange={handleChange}
        />
        </div>
        <div>
            <p className='section-title'>
                Epígrafe
            </p>
        </div>
        <input
            type="text"
            name="Epigrafe"
            placeholder="Epigrafe"
            value={newCard.Epigrafe}
            onChange={handleChange}
        />        
        {/* <div>
            <button type="submit">Agregar Carta</button>
        </div> */}
      </form>
      </div>
    </div>
  );
};

export default CardCreator;
