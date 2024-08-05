import React from 'react';
import './Card.css';
import Icons from './Icons';
import tipoMapping from '../utils/cardJsonMapping'; // Import the mapping object
import getImagePath from '../utils/getImagePath';
import IconInfo from './IconInfo';

const iconMapping = {
  //Tipo Carta
  'Personaje': (<Icons type="per" />),
  'Santuario': (<Icons type="san" />),
  'Tecnología': (<Icons type="tec" />),
  'Manipulación': (<Icons type="man" />),
  'Coloso': (<Icons type="col" />),
  'Personajes': (<Icons type="per" />),
  'Aditamentos': (<Icons type="adi" />),
  'Santuarios': (<Icons type="san" />),
  'Tecnologías': (<Icons type="tec" />),
  'Manipulacións': (<Icons type="man" />),
  'Colosos': (<Icons type="col" />),

  //Don
  'Agilidad': (<Icons type="agi" />),
  'Vibración Molecular': (<Icons type="vib" />),
  'Macrófago': (<Icons type="mac" />),
  'Célula': (<Icons type="cel" />),
  'Neutrófilo': (<Icons type="neu" />),
  'Empatía': (<Icons type="emp" />),
  'Predictor': (<Icons type="pre" />),
  'Entropía': (<Icons type="ent" />),
  'Reacción': (<Icons type="rea" />),

  //Facción
  'Quimera': (<Icons type="qui" fill="#34adf3" />),
  'Abismal': (<Icons type="abi" fill="#54df08" />),
  'Corporación': (<Icons type="cor" fill="#e73a1d" />),
  'Acracia': (<Icons type="acr" fill="#fbca35" />),

  //Virtud
  'Virtud': (<Icons type="vir" fill="red" />),
};

const Card = ({ card, size }) => {

  const HabilidadSplit = ( Habilidad ) => {
  
    const splitHabilidad = Habilidad.split('\n');
  
    return (
      <>
        {splitHabilidad.map((line, index) => (
          <div key={index}>{renderHabilidad(line)}</div>
        ))}
      </>
    );
  };  

  const renderHabilidad = (text) => {
    const regex = new RegExp(`(${Object.keys(iconMapping).join('|')})`, 'g');
    const parts = text.split(regex);
  
    return parts.map((part, index) => {
      if (iconMapping[part]) {
        return <IconInfo detail={part} />;
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };
  

  const renderRestriccion = (card) => {
    
    if (card.Restriccion==='4'){
      return('');
    }else if(card.Tipo==='san' || card.Tipo==='col'){
      return('');
    }else{
    return (
          <React.Fragment>
            Restricción {card.Restriccion}.
          </React.Fragment>
        );
      }
  };

  const renderSpheres = () => {
    const spheres = [
      { className: 'coste', value: card.Coste },
      { className: 'fuerza', value: card.Fuerza },
      { className: 'reanim', value: card.Reanim },
      { className: 'adita', value: card.Adita },
      { className: 'estructura', value: card.Estructura },
      { className: 'voluntad', value: card.Voluntad },
    ];

    return spheres.map((sphere, index) => (
      <div key={index} className={`${sphere.className} card-button ${!sphere.value ? 'hidden' : ''}`}>
        <div className={`${sphere.className}-sphere`}>
          <div className='sphere-value'>
            {sphere.value}
          </div>
        </div>
      </div>
    ));
  };

  const cardImagePath = card.Imagen
    ? getImagePath('cards', `${card.Imagen}.jpg`)
    : getImagePath('cards', `${card.Edicion}${card.Numero}.jpg`);
  const cardFramePath = getImagePath('frames', `${card.Marco}/${card.Faccion}.png`);

  const frameClass = `marco-${card.Marco}`;

  const cardScale = size || 0.4;
  const resizeContainerStyle = {
    width: `${711 * cardScale}px`,
    height: `${1018 * cardScale}px`
  };
  const cardContainerStyle = {
    transform: `scale(${cardScale})`
  };

  return (
    <div className='resize-container'  style={resizeContainerStyle}>
      <div className={`card-container ${frameClass}`} style={cardContainerStyle}>
        <div className="card-image full-card-wrapper" style={{ backgroundImage: `url(${cardImagePath})` }}>
        {/* style={{ backgroundImage: `url(${cardFramePath})` }} */}
          <div className="card-frame full-card-wrapper" style={{ backgroundImage: `url(${cardFramePath})` }}>
              <div className="card-name">
                <h1 className="card-name-text">{card.Nombre}</h1>
              </div>
            <div className='card-button-column'>
              {renderSpheres()}
            </div>
              <div className="card-icon">
                <Icons type={card.Tipo} fill="white" />
              </div>
              <div className="card-type">
                <h1>{(tipoMapping[card.Tipo] || card.Tipo) + (card.Subtipo ? " - " + card.Subtipo : "")}</h1>
              </div>
              <div className="card-text">
                <div className="card-text-epigrafe">
                  <p>{card.Epigrafe}</p>
                </div>
                <div className="card-text-habilidad">
                  {HabilidadSplit(card.Habilidad)}
                </div>
                <div className="card-text-restriccion">
                  {renderRestriccion(card)}
                </div>
                <div className="card-text-illus">
                  {`Ilustrador: ${card.Ilustrador}`}
                </div>
                <div className="card-text-number">
                  {card.Edicion +' '+ card.Numero}
                </div>
                <div className="card-text-rarity">
                  {card.Frecuencia ? (' '+card.Frecuencia) : ''}
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
