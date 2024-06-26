import React, { useState, useEffect } from 'react';
import cardsData from '../data/cards.json';
import CardInfo from '../components/CardInfo';
import Step1 from '../components/Step1';
import Step2 from '../components/Step2';
import Step3 from '../components/Step3';
import './DeckBuilder.css';

const DeckBuilder = () => {
  const [deckName, setDeckName] = useState('');
  const [selectedCards, setSelectedCards] = useState([]);
  const [santuario, setSantuario] = useState(null);
  const [step, setStep] = useState(1);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredPosition, setHoveredPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setHoveredPosition({ x: event.pageX + 20, y: event.pageY - 50 });
    };

    if (hoveredCard) {
      document.addEventListener('mousemove', handleMouseMove);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hoveredCard]);

  const handleMouseEnter = (card) => {
    setHoveredCard(card);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  const addCardToDeck = (card, count) => {
    const cardCount = selectedCards.filter(c => c.Numero === card.Numero).length;
  
    if (cardCount < 4 && (card.Tipo !== 'col' || !selectedCards.some(c => c.Tipo === 'col'))) {
      const newSelectedCards = selectedCards.filter(c => c.Numero !== card.Numero);
      setSelectedCards([...newSelectedCards, ...Array(count).fill(card)]);
    }
  };
  
  const removeCardFromDeck = (cardNumero) => {
    const cardIndex = selectedCards.findIndex(c => c.Numero === cardNumero);
    if (cardIndex !== -1) {
      const newSelectedCards = selectedCards.slice();
      newSelectedCards.splice(cardIndex, 1);
      setSelectedCards(newSelectedCards);
    }
  };

  const handleSaveDeck = () => {

    const deck = { name: deckName, cards: selectedCards };
    let decks = JSON.parse(localStorage.getItem('decks')) || [];
    decks.push(deck);
    localStorage.setItem('decks', JSON.stringify(decks));
    alert('Mazo guardado con éxito!');
    setDeckName('');
    setSelectedCards([]);
    setSantuario(null);
    setStep(1);
  };

  const nextStep = () => {
    console.log('step +1',step +1)
    setStep(step + 1);
  };

  const prevStep = () => {
    console.log('step -1',step -1)
    setStep(step - 1);
  };

  const groupedSelectedCards = selectedCards.reduce((groups, card) => {
    if (!groups[card.Numero]) {
      groups[card.Numero] = { ...card, count: 0 };
    }
    groups[card.Numero].count++;
    return groups;
  }, {});

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Step1
            cardsData={cardsData}
            santuario={santuario}
            setSantuario={setSantuario}
            addCardToDeck={addCardToDeck}
            nextStep={nextStep}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
          />
        );
      case 2:
        return (
          <Step2
            cardsData={cardsData}
            selectedCards={selectedCards}
            santuario={santuario}
            addCardToDeck={addCardToDeck}
            removeCardFromDeck={removeCardFromDeck}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            groupedSelectedCards={groupedSelectedCards}
          />
        );
      case 3:
        return (
          <Step3
            deckName={deckName}
            setDeckName={setDeckName}
            selectedCards={selectedCards}
            handleSaveDeck={handleSaveDeck}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="deck-builder">
      <h1>Creador de Mazos</h1>
      {renderStepContent()}
      <div className="navigation-buttons">
        {step > 1 && <button onClick={prevStep}>Back</button>}
        {step < 3 && <button onClick={nextStep}>Next</button>}
      </div>
      {hoveredCard && (
        <div
          className="hovered-card-info"
          style={{ left: `${hoveredPosition.x}px`, top: `${hoveredPosition.y}px` }}
        >
          <CardInfo card={hoveredCard} />
        </div>
      )}
    </div>
  );
};

export default DeckBuilder;
