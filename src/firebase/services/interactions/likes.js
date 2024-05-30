import { collection, addDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../config';

const addLike = async (data) => {
  try {
    const docRef = await addDoc(collection(firestore, 'likes'), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding like:", error);
    throw error;
  }
};

const removeLike = async (itemId, userId) => {
  try {
    const q = query(collection(firestore, 'likes'), where('itemId', '==', itemId), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    snapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  } catch (error) {
    console.error("Error removing like:", error);
    throw error;
  }
};

const hasUserLikedItem = async (itemId, userId) => {
  try {
    const q = query(collection(firestore, 'likes'), where('itemId', '==', itemId), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error("Error checking if user liked item:", error);
    throw error;
  }
};

const getLikesByItemId = async (itemId) => {
  try {
    const q = query(collection(firestore, 'likes'), where('itemId', '==', itemId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting likes:", error);
    return []; 
  }
};

export { addLike, removeLike, hasUserLikedItem, getLikesByItemId };
