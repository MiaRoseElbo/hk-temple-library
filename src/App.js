// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CardCollection from './pages/CardCollection';
import CardCreator from './pages/CardCreator';
import DeckBuilder from './pages/DeckBuilder';
import DeckList from './pages/DeckList';
import CardDetail from './pages/CardDetail.js';
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/deck-builder" element={<DeckBuilder />} />
        <Route path="/deck-list" element={<DeckList />} />
        <Route path="/cards" element={<CardCollection />} />
        <Route path="/card-creator" element={<CardCreator />} />
        <Route path="/cards/:id"  element={<CardDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
