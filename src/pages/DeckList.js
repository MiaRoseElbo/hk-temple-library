// src/components/DeckList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { database } from '../firebase';
import { ref, get } from 'firebase/database';
import getImagePath from '../utils/getImagePath';
import cardsData from '../data/cards.json';
import './DeckList.css';

const DeckList = () => {
  const [decks, setDecks] = useState([]);
  const [usernames, setUsernames] = useState({});
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const userDecksRef = ref(database, 'decks');
        const snapshot = await get(userDecksRef);

        if (snapshot.exists()) {
          const fetchedDecks = [];
          const usernamePromises = [];

          snapshot.forEach((deckSnapshot) => {
            const deckData = deckSnapshot.val();
            fetchedDecks.push({ ...deckData, id: deckSnapshot.key }); // Store the deck ID

            const usernamePromise = fetchUser(deckData.user);
            usernamePromises.push(usernamePromise);
          });

          const fetchedUsernames = await Promise.all(usernamePromises);

          const usernameMap = {};
          fetchedUsernames.forEach((username, index) => {
            usernameMap[fetchedDecks[index].user] = username;
          });

          setUsernames(usernameMap);
          setDecks(fetchedDecks);
        }
      } catch (error) {
        console.error('Error fetching decks:', error);
      }
    };

    fetchDecks();
  }, []);

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

  const getCardImg = (id) => {
    const card = cardsData.find(card => card.id === id);

    return (
      <div className="decklist-san-img">
        <img src={`${card.Imagen ? getImagePath('cards', `${card.Imagen}.jpg`) : getImagePath('cards', `${card.Edicion}${card.Numero}.jpg`)}`} />
      </div>
    );
  };

  return (
    <div className="deck-list">
      <h1>Mazos</h1>
      <div className='deck-list-table'>
        {decks.map((deck, index) => (
          <div key={index} className="deck-item" onClick={() => navigate(`/deck/${deck.id}`)}> {/* Add onClick to navigate */}
            {getCardImg(deck.cards[0])}
            <div className='deck-list-deck-info'>
              <div className='deck-list-name'>{deck.name}</div>
              <div className='deck-list-counter'>{deck.cards.length}/41</div>
              <div className='deck-list-user'>creado por {usernames[deck.user] || 'Loading...'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeckList;
