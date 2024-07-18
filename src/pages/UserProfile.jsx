// src/pages/UserProfile.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { database } from '../firebase';
import { ref, get, update } from 'firebase/database';
import { AuthContext } from '../components/AuthContext';
import AvatarCreator from '../components/AvatarCreator';
import { images } from '../utils/importAllImages';
import './UserProfile.css';

const UserProfile = () => {
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const [user, setUser] = useState({
    uid:'',
    username: '',
    avatar: { a: '', b: '', c: '', d: '', e: '', f: '', g: [], h: [] }
  });
  const [avatar, setAvatar] = useState({a: '', b: '', c: '', d: '', e: '', f: '', g: [], h: []});

  useEffect(() => {
    const fetchUser = async (userId) => {
      try {
        const usersRef = ref(database, `users/${userId}`);
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          console.log(userData);
          setAvatar(userData.avatar)
          setUser({
            username: userData.username,
            avatar: userData.avatar,
          });
          console.log ('caught user', user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser(id);
  }, [id]);

  const saveAvatar = async (avatar) => {
    console.log('saving avatar:',avatar)
    try {
      const userRef = ref(database, `users/${id}`);
      await update(userRef, { avatar });
      setUser((prevUser) => ({ ...prevUser, avatar }));
    } catch (error) {
      console.error('Error saving avatar:', error);
    }
  };

  const handleAvatarChange = (avatar) => {
    console.log(avatar);
    console.log('currentUser',currentUser);
    console.log('id',id);
    setAvatar(avatar)
  };

  const renderAvatar = (avatar) => {
    const imageSources = ['g', 'a', 'b', 'c', 'd', 'e', 'f', 'h']
      .flatMap((category) => avatar[category] || [])
      .map((image) => images[image]);

    return (
      <div className="user-profile-avatar-display">
        {imageSources.map((src, index) => (
          <img key={index} src={src} alt={`Layer ${index}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="user-profile">
      <h2>Perfil de Usuario</h2>
      <div>{user.username ? user.username : 'Cargando...'}</div>
      <div className="user-profile-avatar">
        {renderAvatar(avatar)}
      </div>
      {currentUser.uid==id?<><AvatarCreator onAvatarChange={handleAvatarChange} initialAvatar={user.avatar} /><button onClick={() => { saveAvatar(avatar)}}>Guardar Avatar</button></>:'chao'}
      
      
    </div>
  );
};

export default UserProfile;
