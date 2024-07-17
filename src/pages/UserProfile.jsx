// src/components/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { database } from '../firebase';
import { ref, get } from 'firebase/database';
import './UserProfile.css';

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState({
    username: '',
  });

  

  useEffect(() => {
    const fetchUser = async (userId) => {
        console.log('fetching user')
        console.log('userId',userId)
        try {
          const usersRef = ref(database, `users/${userId}`);
          const snapshot = await get(usersRef);
    
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUser(userData);
            console.log('userId',userId);
            console.log('userData',userData);
            console.log('user',user);
          }
    
        } catch (error) {
          console.error('Error fetching username:', error);
        }
      };

      fetchUser(id);
  }, [id]);

  

  return (
    <div className="user-profile">
      <h2>Perfil de Usuario</h2>
      <div>{user.username?user.username:'Cargando...'}</div>
    </div>
  );
};

export default UserProfile;
