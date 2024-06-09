import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBJJtJqUUb4mKMtRLhUSsBtzeTumZv4LzI",
  authDomain: "usercollection-53865.firebaseapp.com",
  databaseURL: "https://usercollection-53865-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "usercollection-53865",
  storageBucket: "usercollection-53865.appspot.com",
  messagingSenderId: "46580291217",
  appId: "1:46580291217:web:aef7da7f7f7086e9909130"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage, app };
