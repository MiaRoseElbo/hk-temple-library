import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, database } from '../firebase';
import { ref, get } from 'firebase/database';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const usernameRef = ref(database, `users/${user.uid}/username`);
          const snapshot = await get(usernameRef);
          if (snapshot.exists()) {
            const username = snapshot.val();
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              username: username || 'Anonymous',
            });
          } else {
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              username: 'Anonymous',
            });
          }
        } catch (error) {
          console.error('Error fetching username:', error);
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            username: 'Anonymous',
          });
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
