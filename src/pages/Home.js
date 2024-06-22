// src/pages/Home.js
import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <h1 className='title'>Bienvenide Desviante</h1>
      <p className='sub-title'>Últimos cambios - v0.1</p>
      <p className='text'>
        <ul className='lista-cambios'>
            <li>
                Creación del sitio
            </li>
        </ul>
      </p>
    </div>
  );
}

export default Home;
