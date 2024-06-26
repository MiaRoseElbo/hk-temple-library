import React from 'react';
import tipoMapping from '../utils/cardJsonMapping';
import './CardInfo.css';

const CardInfo = ({ card }) => {
  if (!card) return null;

  return (
    <div className={"card-info"}>
        <div className={`${card.Faccion ? card.Faccion : ''}`}>
            <div className='title'>{card.Nombre}</div>
            <div className='type'>{(tipoMapping[card.Tipo] || card.Tipo) + (card.Subtipo ? " - " + card.Subtipo : "")}</div>
            <div className="stats">
                <ul>
                    <li> {card.Coste?("Coste: "+card.Coste):''}</li>
                    <li> {card.Fuerza?("Fuerza: "+card.Fuerza):''}</li>
                    <li> {card.Reanim?("Reanimación: "+card.Reanim):''}</li>
                    <li> {card.Adita?("Aditamentos: "+card.Adita):''}</li>
                    <li> {card.Estructura?("Estructura: "+card.Estructura):''}</li>
                    <li> {card.Voluntad?("Voluntad: "+card.Voluntad):''}</li>
                </ul>

            </div>
            <div className='text'>
            <p>{card.Habilidad}</p>
            </div>
        </div>
    </div>
  );
};

export default CardInfo;
