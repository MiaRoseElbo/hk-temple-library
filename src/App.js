// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Library from "./pages/Library";
import LibraryDetail from "./pages/LibraryDetail";
import DeckBuilder from "./pages/DeckBuilder";
import DeckList from "./pages/DeckList";
import CardCreator from "./pages/CardCreator";
import CardCollection from "./pages/CardCollection";
import CardDetail from "./pages/CardDetail.js";
import DeckDetails from "./pages/DeckDetails.js";
import Rules from "./pages/Rules.js";
import Login from "./components/Login";
import Profile from "./pages/UserProfile";
import CardTest from "./pages/CardTest";
import "./App.css";

const App = () => {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Library />} />
        <Route path="/library/:edi/:num" element={<LibraryDetail />} />
        <Route path="/home" element={<Home />} />
        <Route path="/deck-builder" element={<DeckBuilder />} />
        <Route path="/deck-list" element={<DeckList />} />
        <Route path="/deck/:deckId" element={<DeckDetails />} />
        <Route path="/cards" element={<CardCollection />} />
        <Route path="/card-creator" element={<CardCreator />} />
        <Route path="/cards/:id" element={<CardDetail />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/users/:id" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/card-test" element={<CardTest />} />
      </Routes>
    </Router>
  );
};

export default App;
