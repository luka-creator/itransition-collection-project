import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.isBlocked) {
            await signOut(auth);
            setUser(null);
            alert("Your account has been blocked😔. Please contact support.");
          } else {
            setUser({ ...user, isAdmin: userData.isAdmin });
          }
        } else {
          await signOut(auth);
          setUser(null);
          alert("Your account has been deleted😔. Please contact support.");
        }
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.isBlocked) {
          await signOut(auth);
          setUser(null);
          alert("Your account has been blocked😔. Please contact support.");
        } else {
          setUser({ ...user, isAdmin: userData.isAdmin });
        }
      } else {
        await signOut(auth);
        setUser(null);
        alert("Your account has been deleted😔. Please contact support.");
      }
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        alert("Incorrect password. Please try again.");
      } else if (error.code === 'auth/user-not-found') {
        alert("No user found with this email.");
      } else {
        alert("this account does not exist or has been deleted");
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      alert("An error occurred during logout. Please try again.");
    }
  };

  const register = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(firestore, 'users', user.uid), {
        email: user.email,
        isAdmin: false,
        isBlocked: false
      });
      setUser({ ...user, isAdmin: false });
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert("This email is already registered. Please log in.");
      } else {
        alert("An error occurred during registration. Please try again.");
      }
    }
  };

  return (  
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
