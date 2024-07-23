import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { database } from '../firebase';
import { ref, get, update } from 'firebase/database';
import { AuthContext } from '../components/AuthContext';
import AvatarCreator from '../components/AvatarCreator';
import { images } from '../utils/importAllImages';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
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
  const [isEditingFaction, setIsEditingFaction] = useState(false);
  const [faction, setFaction] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [affiliationOptions, setAffiliationOptions] = useState([]);

  const factions = {
    Quimera: ['Sin afiliación','Centinela','Fundación Lázarus','Génesis', 'Hawkline', 'Hijas de Lilith','Hijos de la Atlántida','Hijos de la Ceniza', 'Ifeoma', 'Portador de Luz','Yue Yan'],
    Abismales: ['Sin afiliación','Baalitas', 'Cazadores','Centinela','Circo de Medianoche','El Consejo', 'Familia Baltazo', 'Hankar', 'Los Profundos', 'Moloch', 'Oni'],
    Corporación: ['Sin afiliación','Agente Libre','Centinela', 'Programa Héroe','La Máquina','Sacristán',],
    Acracia: ['Sin afiliación','Centinela','Hermandad Esmeralda','Hijos de la Revolución','Los Malditos','Mano Negra','Nautilos','Orden Esmeralda','Oshi','Tai Ku','Tiamath'],
    SinFacción: ['Sin afiliación','F.I.S.T','OTAN','UN','Orden Esmeralda','Hijos de la Ceniza','Interpol']
  };

  useEffect(() => {
    const fetchUser = async (userId) => {
      try {
        const usersRef = ref(database, `users/${userId}`);
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          setAvatar(userData.avatar);
          setUser({
            username: userData.username,
            avatar: userData.avatar,
            faccion: userData.faccion,
            agrupacion: userData.agrupacion
          });
          setFaction(userData.faccion);
          setAffiliation(userData.agrupacion);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser(id);
  }, [id]);

  useEffect(() => {
    if (faction) {
      setAffiliationOptions(factions[faction]);
    }
  }, [faction]);

  const saveAvatar = async (avatar) => {
    try {
      const userRef = ref(database, `users/${id}`);
      await update(userRef, { avatar });
      setUser((prevUser) => ({ ...prevUser, avatar }));
      setIsEditing(false); // Exit editing mode after saving
    } catch (error) {
      console.error('Error saving avatar:', error);
    }
  };

  const saveFactionAndAffiliation = async () => {
    try {
      const userRef = ref(database, `users/${id}`);
      await update(userRef, { faccion: faction, agrupacion: affiliation });
      setUser((prevUser) => ({ ...prevUser, faccion: faction, agrupacion: affiliation }));
      setIsEditingFaction(false); // Exit editing mode after saving
    } catch (error) {
      console.error('Error saving faction and affiliation:', error);
    }
  };

  const handleAvatarChange = (avatar) => {
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

  if (!currentUser) {
    return <div>Loading...</div>; // Show a loading message while the user is being fetched
  }

  return (
    <div className="user-profile">
      <div className="user-profile-avatar">
        {renderAvatar(avatar)}
      </div>
      <div className="user-profile-info">
        <h2>{user.username ? user.username : ''}</h2>
        {isEditingFaction ? (
          <>
            <select className='user-profile-info-select' value={faction} onChange={(e) => setFaction(e.target.value)}>
              {Object.keys(factions).map((faction) => (
                <option key={faction} value={faction}>{faction}</option>
              ))}
            </select>
            <select className="user-profile-info-agrupacion-select" value={affiliation} onChange={(e) => setAffiliation(e.target.value)}>
              {affiliationOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </>
        ) : (
          <>
            <p>{user.faccion ? user.faccion : 'Sin Facción'}</p>
            <p className="user-profile-info-agrupacion">{user.agrupacion ? user.agrupacion : 'Sin Afiliación'}</p>
          </>
        )}
      </div>

      {currentUser.uid === id ? (
        <>
          {isEditing ? (
            <>
              <AvatarCreator onAvatarChange={handleAvatarChange} initialAvatar={user.avatar} />
              <div className='user-profile-button'><PrimaryButton onClick={() => saveAvatar(avatar)}>Guardar Avatar</PrimaryButton></div>
            </>
          ) : (
            <PrimaryButton onClick={() => setIsEditing(true)}>Editar Avatar</PrimaryButton>
          )}
          {isEditingFaction ? (
            <SecondaryButton onClick={saveFactionAndAffiliation}>Guardar Facción y Afiliación</SecondaryButton>
          ) : (
            <SecondaryButton onClick={() => setIsEditingFaction(true)}>Editar Facción y Afiliación</SecondaryButton>
          )}
        </>
      ) : (
        ''
      )}
    </div>
  );
};

export default UserProfile;
