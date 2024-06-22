// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><img src='./logo.webp' className='navbar-logo'/></li> 
        <li><Link className='active' to="/">Inicio</Link></li>
        <li><Link to="/cards">Colección Cartas</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
