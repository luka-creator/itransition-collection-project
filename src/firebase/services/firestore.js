import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import { firestore } from '../config';

const createDocument = async (collectionName, data) => {
  try {
    await addDoc(collection(firestore, collectionName), data);
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
};

const updateDocument = async (collectionName, id, data) => {
  try {
    await updateDoc(doc(firestore, collectionName, id), data);
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

const deleteDocument = async (collectionName, id) => {
  try {
    await deleteDoc(doc(firestore, collectionName, id));
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

const getDocument = async (collectionName, id) => {
  try {
    const docRef = await getDoc(doc(firestore, collectionName, id));
    if (docRef.exists()) {
      return docRef.data();
    } else {
      throw new Error("Document not found");
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

const getCollection = async (collectionName) => {
  try {
    const snapshot = await getDocs(collection(firestore, collectionName));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting collection:", error);
    throw error;
  }
};

export { createDocument, updateDocument, deleteDocument, getDocument, getCollection };
