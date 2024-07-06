import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC0guFX_jtUGqm6kxHkG9b-RORd_tNW16Y",
  authDomain: "hk-temple-library.firebaseapp.com",
  databaseURL: "https://hk-temple-library-default-rtdb.firebaseio.com",
  projectId: "hk-temple-library",
  storageBucket: "hk-temple-library.appspot.com",
  messagingSenderId: "275393124866",
  appId: "1:275393124866:web:81a4cf75525a3de379e51b",
  measurementId: "G-B6FM7BSHWL"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);