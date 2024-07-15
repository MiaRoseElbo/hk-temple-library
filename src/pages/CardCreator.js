import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import './CardCreator.css';
import Card from '../components/Card'; // Adjust the path if necessary
import images from '../utils/importImages';

const CardCreator = () => {
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
    Ilustrador: "xxxxxxxx",
    Frecuencia: "P",
    Marco: "rad",
    Imagen: 'mia001'
  });

  const cardRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCard({
      ...newCard,
      [name]: value,
    });
  };

  const handleDownload = async () => {
    const scale = 1.4; // Increase the scale to improve image quality
    const width = 315*scale;
    const height = 440*scale;

    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const context = canvas.getContext('2d');
    context.scale(scale, scale);

    const cardElement = cardRef.current;
    const clonedCardElement = cardElement.cloneNode(true);
    clonedCardElement.style.width = `${width}px`;
    clonedCardElement.style.height = `${height}px`;
    document.body.appendChild(clonedCardElement);

    const cardCanvas = await html2canvas(clonedCardElement, {
      canvas,
      scale,
    });

    const link = document.createElement('a');
    link.href = cardCanvas.toDataURL('image/jpeg');
    link.download = `${newCard.Nombre}.jpg`;
    link.click();

    document.body.removeChild(clonedCardElement);
  };

  const renderImageOptions = () => {
    return Object.keys(images).map((key) => (
      <option key={key} value={key}>{key}</option>
    ));
  };

  return (
    <div className="create-card">
      <h2>Crea una carta nueva</h2>
      <div className='create-card-group'>
        <div ref={cardRef}>
          <Card card={newCard} />
          <div className='card-creator-btn-wrapper'>
            <button className='card-creator-download-btn' type="button" onClick={handleDownload}>Descargar Carta</button>
          </div>
        </div>
        <form className='cardCreatorForm'>
          <div>
            <p className='section-title'>Nombre de Carta</p>
          </div>
          <input
            type="text"
            name="Nombre"
            placeholder="Nombre"
            value={newCard.Nombre}
            onChange={handleChange}
          />

          <div>
            <p className='section-title'>Facción y Tipo de carta</p>
          </div>
          <select id="Tipo" name="Tipo" value={newCard.Tipo} onChange={handleChange}>
            <option value="san">Santuario</option>
            <option value="per">Personaje</option>
            <option value="adi">Aditamento</option>
            <option value="tec">Tecnología</option>
            <option value="man">Manipulación</option>
            <option value="col">Coloso</option>
          </select>
          <select id="Faccion" name="Faccion" value={newCard.Faccion} onChange={handleChange}>
            <option value="qui">Quimera</option>
            <option value="abi">Abismales</option>
            <option value="cor">Corporación</option>
            <option value="acr">Acracia</option>
            <option value="sin">Sin Facción</option>
          </select>
          <div>
            <p className='section-title'>Valores Esferas</p>
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
            <p className='section-title'>Marco</p>
          </div>
          <select id="Marco" name="Marco" value={newCard.Marco} onChange={handleChange}>
            <option value="tra">Tradicional</option>
            <option value="avl">Contemporáneo</option>
            <option value="sol">Solid</option>
            <option value="col">Colosos</option>
            <option value="radcol">Coloso Raras</option>
            <option value="rad">Radix</option>
          </select>
          <div>
            <p className='section-title'>Imagen</p>
          </div>
          <select id="Imagen" name="Imagen" value={newCard.Imagen} onChange={handleChange}>
            {renderImageOptions()}
          </select>
          <div>
            <p className='section-title'>Habilidad</p>
            <textarea
              name="Habilidad"
              placeholder="Habilidad"
              value={newCard.Habilidad}
              onChange={handleChange}
            />
          </div>
          <div>
            <p className='section-title'>Epígrafe</p>
          </div>
          <input
            type="text"
            name="Epigrafe"
            placeholder="Epigrafe"
            value={newCard.Epigrafe}
            onChange={handleChange}
          />
        </form>
      </div>
    </div>
  );
};

export default CardCreator;
