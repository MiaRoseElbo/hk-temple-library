// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, database } from '../firebase';
import { ref, set } from 'firebase/database';

import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Navigate to home after login
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      console.log(username);
      await updateProfile(userCredential.user, { displayName: username });
      await set(ref(database, 'users/' + userId), {
        username: username,
        email: email,
        avatar:{
          a:'a01.png',
          b:'b00.png',
          c:'c00.png',
          d:'d00.png',
          e:'e00.png',
          f:'f00.png',
        }
      });
      navigate('/'); // Navigate to home after signup
    } catch (error) {
      console.error("Error signing up: ", error);
    }
  };

  return (
    <div className="login">
      <img src='./logo.webp' className='login-logo'/>
      <h2>{isSigningUp ? 'Registrarse' : 'Iniciar Sesión'}</h2>
      <div className='login-form'>
        {isSigningUp && (
            <>
            <div>Nombre de usuario</div>
            <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="usuario"
            /></>
        )}
        <div>Correo</div>
        <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo"
        />
        <div>Clave</div>
        <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Clave"
        />
        {isSigningUp ? (
            <button onClick={handleSignup}>Registrarse</button>
        ) : (
            <button onClick={handleLogin}>Iniciar Sesión</button>
        )}
        <span className='login-switch' onClick={() => setIsSigningUp(!isSigningUp)}>
            {isSigningUp ? 'Iniciar Sesión' : 'Registrarse'}
        </span>
      </div>
    </div>
  );
};

export default Login;