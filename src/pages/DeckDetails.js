import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { database } from '../firebase';
import { ref, get } from 'firebase/database';
import cardsData from '../data/cards.json';
import Card from '../components/Card';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './DeckDetails.css';

const DeckDetails = () => {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [activeTab, setActiveTab] = useState('col'); // Default active tab

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const deckRef = ref(database, `decks/${deckId}`);
        const snapshot = await get(deckRef);

        if (snapshot.exists()) {
          const deckData = snapshot.val();
          setDeck(deckData);
          const username = await fetchUser(deckData.user);
          setUsername(username);
          setUserId(deckData.user);
        }
      } catch (error) {
        console.error('Error fetching deck:', error);
      }
    };

    fetchDeck();
  }, [deckId]);

  const fetchUser = async (userId) => {
    try {
      const usersRef = ref(database, `users/${userId}/username`);
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return 'Unknown User';
      }
    } catch (error) {
      console.error('Error fetching username:', error);
      return 'Unknown User';
    }
  };

  const groupCards = (cards) => {
    const groupedCards = {};

    // Initialize groups
    const typesOrder = ['san', 'col', 'per', 'man', 'tec', 'adi'];
    typesOrder.forEach((type) => {
      groupedCards[type] = [];
    });

    cards.forEach((id) => {
      const card = cardsData.find((card) => card.id === id);
      if (card) {
        if (!groupedCards[card.Tipo]) {
          groupedCards[card.Tipo] = [];
        }
        groupedCards[card.Tipo].push(card);
      }
    });

    return groupedCards;
  };

  const renderCardGroup = (cards) => {
    const cardCounts = {};

    // Count cards
    cards.forEach((card) => {
      if (!cardCounts[card.id]) {
        cardCounts[card.id] = { ...card, count: 0 };
      }
      cardCounts[card.id].count += 1;
    });

    return (
      <div className="deck-card-collection">
        {Object.values(cardCounts).map((card) => (
          <div key={card.id} className="deck-card-wrapper">
            <div className="deck-card-container"><Card card={card} /></div>
            {card.count > 1 && <span className="deck-card-count">x{card.count}</span>}
          </div>
        ))}
      </div>
    );
  };

  const getCardTypeData = (groupedCards) => {
    const typesOrder = ['col', 'per', 'man', 'tec', 'adi'];
    const data = typesOrder.map((type) => groupedCards[type].length);
    return data;
  };

  const getCardCostData = (cards) => {
    let minCost = Infinity;
    let maxCost = -Infinity;

    cards.forEach((id) => {
      const card = cardsData.find((card) => card.id === id);
      if (card) {
        const cost = card.Coste || 0;
        if (cost < minCost) minCost = cost;
        if (cost > maxCost) maxCost = cost;
      }
    });

    const costCounts = new Array(maxCost - minCost + 1).fill(0);

    cards.forEach((id) => {
      const card = cardsData.find((card) => card.id === id);
      if (card) {
        const cost = card.Coste || 0;
        costCounts[cost - minCost] += 1;
      }
    });

    return {
      minCost,
      maxCost,
      costCounts,
    };
  };

  if (!deck) {
    return <div>Loading...</div>;
  }

  const groupedCards = groupCards(deck.cards);
  const tabs = ['col', 'per', 'man', 'tec', 'adi'];

  const cardTypeData = {
    labels: ['COL', 'PER', 'MAN', 'TEC', 'ADI'],
    datasets: [
      {
        label: 'Tipo de Cartas',
        data: getCardTypeData(groupedCards),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const { minCost, maxCost, costCounts } = getCardCostData(deck.cards);
  const costLabels = Array.from({ length: maxCost - minCost + 1 }, (_, i) => minCost + i);

  const cardCostData = {
    labels: costLabels,
    datasets: [
      {
        label: 'Cartas por coste',
        data: costCounts,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="deck-details">
      <div className="deck-info">
        <h1>{deck.name}</h1>
        <p>{<Link to={`/users/${userId}`}>{username}</Link>}</p>
      </div>
      <div className="san-cards">
        {renderCardGroup(groupedCards['san'])}
        <div className="deck-detail-charts">
          <div className="deck-detail-chart">
            <Bar data={cardTypeData} options={{ responsive: true }} />
          </div>
          <div className="deck-detail-chart">
            <Bar data={cardCostData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
      <div className="deck-cards">
        <div className="tabs">
          {tabs.map((type) => (
            <button
              key={type}
              className={`tab ${activeTab === type ? 'active' : ''}`}
              onClick={() => setActiveTab(type)}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="tab-content">
            {activeTab !== 'san' && renderCardGroup(groupedCards[activeTab])}
        </div>
      </div>
    </div>
  );
};

export default DeckDetails;
