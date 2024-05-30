import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import { firestore } from '../config';

const getCollections = async () => {
  try {
    const snapshot = await getDocs(collection(firestore, 'collections'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting collections:", error);
    throw error;
  }
};

const getCollection = async (collectionId) => {
  try {
    const docRef = doc(firestore, 'collections', collectionId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Collection not found");
    }
  } catch (error) {
    console.error("Error getting collection:", error);
    throw error;
  }
};

const addCollection = async (data) => {
  try {
    const newCollection = {
      ...data,
      itemCount: 0, 
    };
    const docRef = await addDoc(collection(firestore, 'collections'), newCollection);
    return docRef.id;
  } catch (error) {
    console.error("Error adding collection:", error);
    throw error;
  }
};

const updateCollection = async (collectionId, data) => {
  try {
    const docRef = doc(firestore, 'collections', collectionId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating collection:", error);
    throw error;
  }
};

const deleteCollection = async (collectionId) => {
  try {
    const docRef = doc(firestore, 'collections', collectionId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting collection:", error);
    throw error;
  }
};

const getTopCollections = async (limitCount = 5) => {
  try {
    const q = query(collection(firestore, 'collections'), orderBy('itemCount', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting top collections:", error);
    throw error;
  }
};

export { getCollections, getCollection, addCollection, updateCollection, deleteCollection, getTopCollections };
