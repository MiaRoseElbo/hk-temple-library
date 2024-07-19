import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { database } from '../firebase';
import { ref, get, update } from 'firebase/database';
import { AuthContext } from '../components/AuthContext';
import AvatarCreator from '../components/AvatarCreator';
import { images } from '../utils/importAllImages';
import PrimaryButton from '../components/PrimaryButton';
import './UserProfile.css';

const UserProfile = () => {
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const [user, setUser] = useState({
    uid: '',
    username: '',
    avatar: { a: '', b: '', c: '', d: '', e: '', f: '', g: [], h: [] },
    faccion: '',
    agrupacion: ''
  });
  const [avatar, setAvatar] = useState({ a: '', b: '', c: '', d: '', e: '', f: '', g: [], h: [] });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async (userId) => {
      try {
        const usersRef = ref(database, `users/${userId}`);
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          console.log(userData);
          setAvatar(userData.avatar);
          setUser({
            username: userData.username,
            avatar: userData.avatar,
            faccion: userData.faccion,
            agrupacion: userData.agrupacion
          });
          console.log('caught user', user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser(id);
  }, [id]);

  const saveAvatar = async (avatar) => {
    console.log('saving avatar:', avatar);
    try {
      const userRef = ref(database, `users/${id}`);
      await update(userRef, { avatar });
      setUser((prevUser) => ({ ...prevUser, avatar }));
      setIsEditing(false); // Exit editing mode after saving
    } catch (error) {
      console.error('Error saving avatar:', error);
    }
  };

  const handleAvatarChange = (avatar) => {
    console.log(avatar);
    console.log('currentUser', currentUser);
    console.log('id', id);
    setAvatar(avatar);
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
      <div className="user-profile-avatar">
        {renderAvatar(avatar)}
      </div>
      <div className="user-profile-info">
        <h2>{user.username ? user.username : ''}</h2>
        <p>{user.faccion ? user.faccion : 'Sin Facción'}</p>
        <p className="user-profile-info-agrupacion">{user.agrupacion ? user.agrupacion : 'Sin Afiliación'}</p>
      </div>
      
      {currentUser.uid === id ? (
        <>
          {isEditing ? (
            <>
              <AvatarCreator onAvatarChange={handleAvatarChange} initialAvatar={user.avatar} />
              <div className='user-profile-button'><PrimaryButton onClick={() => saveAvatar(avatar)}>Guardar Avatar</PrimaryButton></div>
            </>
          ) : (
            <PrimaryButton onClick={() => setIsEditing(true)}>Edit Avatar</PrimaryButton>
          )}
        </>
      ) : (
        ''
      )}
    </div>
  );
};

export default UserProfile;
