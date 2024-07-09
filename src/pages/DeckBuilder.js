import React, { useState, useEffect, useContext } from 'react';
import { database, auth } from '../firebase';
import { AuthContext } from '../components/AuthContext';
import { ref, push } from 'firebase/database'; // Import necessary functions for database
import cardsData from '../data/cards.json'; 
import CardInfo from '../components/CardInfo';
import Step1 from '../components/Step1';
import Step2 from '../components/Step2';
import Step3 from '../components/Step3';
import './DeckBuilder.css';

const DeckBuilder = () => {
  const [deckName, setDeckName] = useState('');
  const [selectedCards, setSelectedCards] = useState([]);
  const [cardList, setCardList] = useState([]);
  const [santuario, setSantuario] = useState(null);
  const [step, setStep] = useState(1);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredPosition, setHoveredPosition] = useState({ x: 0, y: 0 });

  const { currentUser } = useContext(AuthContext);

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
    const cardCount = selectedCards.filter(c => c.id === card.id).length;
  
    if (cardCount < 4 && (card.Tipo !== 'col' || !selectedCards.some(c => c.Tipo === 'col'))) {
      const newSelectedCards = selectedCards.filter(c => c.id !== card.id);
      const newCardList = cardList.filter(c => c !== card.id);
      setSelectedCards([...newSelectedCards, ...Array(count).fill(card)]);
      setCardList([...newCardList, ...Array(count).fill(card.id)]);
    }
  };
  
  const removeCardFromDeck = (cardNumero) => {
    const cardIndex = selectedCards.findIndex(c => c.id === cardNumero);
    if (cardIndex !== -1) {
      const newSelectedCards = selectedCards.slice();
      const newCardList = cardList.slice();
      newCardList.splice(cardIndex,1);
      newSelectedCards.splice(cardIndex, 1);
      setSelectedCards(newSelectedCards);
      setCardList(newCardList);
    }
  };

  const handleSaveDeck = async () => {
    const userId = currentUser.uid;
    const deck = { user: userId, name: deckName, cards: cardList };

    try {
      await push(ref(database, 'decks/'), deck);
      alert('Mazo guardado con éxito!');
      setDeckName('');
      setSelectedCards([]);
      setSantuario(null);
      setStep(1);
    } catch (error) {
      console.error('Error saving deck: ', error);
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
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
      <div className="deck-builder-navigation-buttons">
        {step > 1 && <button onClick={prevStep}>Retroceder</button>}
        {step < 3 && <button onClick={nextStep}>Avanzar</button>}
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
