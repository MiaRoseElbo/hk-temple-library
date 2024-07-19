// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './Navbar.css';

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav>
      <ul className="navbar">
        <li><img src='./logo.webp' className='navbar-logo'/></li> 
        <li><Link className='active' to="/">Inicio</Link></li>
        <li><Link to="/deck-list">Lista de Mazos</Link></li>
        {currentUser && (
          <>
            <li><Link to="/deck-builder">Creador de Mazos</Link></li>
            <li><Link to="/card-creator">Creador de Cartas</Link></li>
          </>
        )}
        <li><Link to="/cards">Colección Cartas</Link></li>
        <li><Link to="/rules">Reglas</Link></li>
        <li className='navbar-user'>
          {currentUser ? (
            <>

              
              <span>Bienvenide,
                <b className='navbar-username'>
                  <Link to={`/users/${currentUser.uid}`}>{currentUser.username}</Link>
                </b>
                </span>
              <span className='navbar-logout' onClick={handleLogout}>cerrar sesión</span>
            </>
          ) : (
            <Link to="/login"><b className='navbar-username'><u>Iniciar Sesión</u></b></Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
