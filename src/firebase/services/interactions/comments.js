import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../../config';

const addComment = async (data) => {
    try {
      const newComment = {
        ...data,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(firestore, 'comments'), newComment);
      return docRef.id;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
};

const getCommentsByItemId = async (itemId) => {
    try {
      console.log(`Fetching comments for itemId: ${itemId}`);
      const q = query(collection(firestore, 'comments'), where('itemId', '==', itemId), orderBy('createdAt', 'asc'));
      const snapshot = await getDocs(q);
      console.log('Comments fetched:', snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting comments:", error);
      return []; 
    }
};

const getCommentsByText = async (text) => {
    try {
      const q = query(collection(firestore, 'comments'), where('text', '>=', text), where('text', '<=', text + '\uf8ff'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting comments:", error);
      return [];
    }
};

export { addComment, getCommentsByItemId, getCommentsByText };
