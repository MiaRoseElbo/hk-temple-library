import React, { useState, useRef } from 'react';
import Card from '../components/Card'; // Adjust the path if necessary

const CardTest = () => {
  const card1 = {
    Edicion: "evo",
    Numero: "000",
    Faccion: "abi",
    Nombre: "Mariposa",
    Tipo: "per",
    Subtipo: "Músico",
    Coste: '1',
    Fuerza: '2',
    Reanim: '',
    Adita: '4',
    Estructura: '11',
    Voluntad: '4',
    Habilidad: "Entropía.\nEn Contemplación, destruye a todos los personajes que hayan bloqueado a esta carta.",
    Restriccion:'1',
    Epigrafe: "Nunca mires sus ojos.",
    Ilustrador: "Mauricio Herrera",
    Frecuencia: "R",
    Marco: "tra",
  };

  const card2 = {
    Edicion: "rad",
    Numero: "000",
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
    Marco: "rad"
  };

  const card3 = {
    Edicion: "col",
    Numero: "000",
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
    Marco: "col"
  };

  const card4 = {
    Edicion: "radcol",
    Numero: "000",
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
    Marco: "radcol"
  };

  const card5 = {
    Edicion: "avl",
    Numero: "000",
    Faccion: "qui",
    Nombre: "El Lugar",
    Tipo: "san",
    Subtipo: "",
    Coste: '2',
    Fuerza: '3',
    Reanim: '4',
    Adita: '4',
    Estructura: '13',
    Voluntad: '4',
    Habilidad: "Una vez por turno, cuando juegues un Personaje con Célula, puedes hacer que el Personaje objetivo obtenga Célula hasta la Contemplación oponente. Si controlas tres o más Personajes Quimera con Célula, en vez de eso, puedes darle Reacicón al Personaje objetivo hasta la Contemplación oponente.",
    Epigrafe: "Fue un refugio para gente asustada, hoy es un santuario para gente valiente.",
    Restriccion:"2",
    Ilustrador: "Sergio Quijada",
    Frecuencia: "P",
    Marco: "avl"
  };
  
  return (
    <>
      <Card card={card1} size={1} />
      <Card card={card2} size={0.4}/>
      <Card card={card3} size={0.4}/>
      <Card card={card4} size={0.4}/>
      <Card card={card5} size={0.4}/>
    </>
  );
};

export default CardTest;
