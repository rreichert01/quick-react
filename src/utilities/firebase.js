import { useCallback, useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { connectDatabaseEmulator ,getDatabase, onValue, ref, update } from 'firebase/database';
import { connectAuthEmulator, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, signInWithCredential  } from 'firebase/auth';

let emulate = !window.EMULATION && !import.meta.env.MODE || import.meta.env.MODE === "development"

const firebaseConfig = {
    apiKey: "AIzaSyAGYUmIzhUGFJKam5kL0uo0wyBLbG9fIxg",
    authDomain: "quick-rea.firebaseapp.com",
    projectId: "quick-rea",
    storageBucket: "quick-rea.appspot.com",
    messagingSenderId: "782328531548",
    appId: "1:782328531548:web:0cc245b29f3ee662a47499",
    measurementId: "G-ECY5FM64LL",
    databaseURL: emulate ? "https://quick-rea.firebaseio.com": "https://quick-rea-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service
const auth = getAuth(app);
const database = getDatabase(app);

if (!window.EMULATION && !import.meta.env.MODE || import.meta.env.MODE === "development") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectDatabaseEmulator(database, "127.0.0.1", 9000);
  

  signInWithCredential(auth, GoogleAuthProvider.credential(
    '{"sub": "qEvli4msW0eDz5mSVO6j3W7i8w1k", "email": "tester@gmail.com", "displayName":"Test User", "email_verified": true}'
  ));
  
  // set flag to avoid connecting twice, e.g., because of an editor hot-reload
  window.EMULATION = true;
}

export const useDbData = (path) => {
  const [data, setData] = useState();
  const [error, setError] = useState(null);

  useEffect(() => (
    onValue(ref(database, path), (snapshot) => {
     setData( snapshot.val() );
    }, (error) => {
      setError(error);
    })
  ), [ path ]);

  return [ data, error ];
};

const makeResult = (error) => {
  const timestamp = Date.now();
  const message = error?.message || `Updated: ${new Date(timestamp).toLocaleString()}`;
  return { timestamp, error, message };
};

export const useDbUpdate = (path) => {
  const [result, setResult] = useState();
  const updateData = useCallback((value) => {
    update(ref(database, path), value)
    .then(() => setResult(makeResult()))
    .catch((error) => setResult(makeResult(error)))
  }, [database, path]);

  return [updateData, result];
};

export const signInWithGoogle = () => {
  signInWithPopup(getAuth(app), new GoogleAuthProvider());
};

const firebaseSignOut = () => signOut(getAuth(app));

export { firebaseSignOut as signOut };

export const useAuthState = () => {
  const [user, setUser] = useState();
  
  useEffect(() => (
    onAuthStateChanged(getAuth(app), setUser)
  ), []);

  return [user];
};