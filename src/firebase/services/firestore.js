// src/firebase/services/firestore.js
import { getFirestore, collection, addDoc, query, where, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { app } from '../config';

const db = getFirestore(app);

export const useFirestore = () => {
  const addTicket = async (userId, ticket) => {
    await addDoc(collection(db, 'tickets'), {
      ...ticket,
      userId,
      createdAt: new Date(),
    });
  };

  const getUserTickets = async (userId, pageSize = 10, lastDoc = null) => {
    try {
      let q = query(
        collection(db, 'tickets'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const tickets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      return { tickets, lastDoc: lastVisible };
    } catch (error) {
      console.error("Error getting user tickets:", error);
      throw error;
    }
  };

  return { addTicket, getUserTickets };
};