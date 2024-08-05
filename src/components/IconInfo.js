import React, { useState, useEffect } from 'react';
import Portal from '../utils/Portal';
import Icons from './Icons';
import './IconInfo.css';

const IconInfo = ({ detail }) => {
    const [hover, setHover] = useState(false);
    const [hoveredPosition, setHoveredPosition] = useState({ x: 0, y: 0 });

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

      useEffect(() => {
        const handleMouseMove = (event) => {
          setHoveredPosition({ x: event.pageX + 20, y: event.pageY - 50 });
        };
    
        if (hover) {
          document.addEventListener('mousemove', handleMouseMove);
        } else {
          document.removeEventListener('mousemove', handleMouseMove);
        }
    
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
        };
      }, [hover]);



    const infoBoxDetail = (info) => {

        switch (info) {
            case "Agilidad":
              return (
                   <p>Puede atacar el turno que entra en juego.</p>
              );
            case "Vibración Molecular":
                return (
                     <p>No puede ser bloqueado.</p>
                );
                case "Macrófago":
                    return (
                         <p>No puede atacar ni bloquear.</p>
                    );
                    case "Célula":
                        return (
                             <p>No puede retar a Duelo.</p>
                        );
                        case "Neutrófilo":
                            return (
                                 <p>Los personajes bloqueados por esta carta no hacen Daño a Santuario.</p>
                            );
                            case "Empatía":
                                return (
                                     <p>Dos o más personajes con este Don pueden bloquear a un mismo atacante.</p>
                                );
                                case "Predictor":
                                    return (
                                         <p>Puede bloquear a personajes con Vibración Molecular.</p>
                                    );
                                    case "Entropía":
                                        return (
                                             <p>Debe atacar todos los turnos que pueda, de no hacerlo, es destruido.</p>
                                        );
                                        case "Reacción":
                                        return (
                                             <p>No puede atacar ni retar a Duelo.</p>
                                        );
        };
    };

      if (iconMapping[detail]) {
        const icon = iconMapping[detail];
        return (
            <>
                <div
                    className="iconinfo-div"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    {icon}
                </div>
                {hover && (
                    <Portal>
                        <div className="hovered-icon-info" style={{ left: `${hoveredPosition.x}px`, top: `${hoveredPosition.y}px` }} >
                          <div className="icon-info-infobox">
                            <h1>{icon} {detail}</h1>
                            <div>{infoBoxDetail(detail)}</div>
                          </div>
                        </div>
                    </Portal>
                )}
                </>
        );
    };
};

export default IconInfo;
