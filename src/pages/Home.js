// src/pages/Home.js
import React from 'react';
import Changelog from '../components/Changelog';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <h1 className='title'>Bienvenide Desviante</h1>
            <Changelog />
    </div>
  );
}

export default Home;