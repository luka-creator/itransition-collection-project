// src/firebase/services/firestore.js
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
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

  const getUserTickets = async (userId, pageSize, lastDoc) => {
    const ticketsQuery = query(
      collection(db, 'tickets'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(pageSize),
      startAfter(lastDoc || 0)
    );

    const ticketDocs = await getDocs(ticketsQuery);
    const tickets = ticketDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { tickets, lastDoc: ticketDocs.docs[ticketDocs.docs.length - 1] };
  };

  return { addTicket, getUserTickets };
};
