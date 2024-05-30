import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, where, getDoc, writeBatch, orderBy, limit, increment, Timestamp } from 'firebase/firestore';
import { firestore } from '../config';

const getItems = async () => {
  try {
    const snapshot = await getDocs(collection(firestore, 'items'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting items:", error);
    throw error;
  }
};

const getItemsByCollectionId = async (collectionId) => {
  try {
    const q = query(collection(firestore, 'items'), where('collectionId', '==', collectionId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting items by collectionId:", error);
    throw error;
  }
};

const getItem = async (itemId) => {
  try {
    const docRef = doc(firestore, 'items', itemId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Item not found");
    }
  } catch (error) {
    console.error("Error getting item:", error);
    throw error;
  }
};

const addItem = async (data) => {
  try {
    const newItem = {
      ...data,
      createdAt: Timestamp.now(), 
    };
    const docRef = await addDoc(collection(firestore, 'items'), newItem);

    const collectionRef = doc(firestore, 'collections', data.collectionId);
    await updateDoc(collectionRef, {
      itemCount: increment(1)
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding item:", error);
    throw error;
  }
};

const updateItem = async (itemId, data) => {
  try {
    const docRef = doc(firestore, 'items', itemId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};

const deleteItem = async (itemId) => {
  try {
    const itemRef = doc(firestore, 'items', itemId);
    const itemSnap = await getDoc(itemRef);

    if (itemSnap.exists()) {
      const itemData = itemSnap.data();
      await deleteDoc(itemRef);

      const collectionRef = doc(firestore, 'collections', itemData.collectionId);
      await updateDoc(collectionRef, {
        itemCount: increment(-1)
      });
    } else {
      throw new Error("Item not found");
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};

const deleteItemsByCollectionId = async (collectionId) => {
  try {
    const items = await getItemsByCollectionId(collectionId);
    const batch = writeBatch(firestore);
    items.forEach((item) => {
      const itemRef = doc(firestore, 'items', item.id);
      batch.delete(itemRef);
    });
    await batch.commit();

    const collectionRef = doc(firestore, 'collections', collectionId);
    await updateDoc(collectionRef, {
      itemCount: 0
    });
  } catch (error) {
    console.error("Error deleting items by collectionId:", error);
    throw error;
  }
};

const getLatestItems = async (limitCount = 5) => {
  try {
    const q = query(collection(firestore, 'items'), orderBy('createdAt', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting latest items:", error);
    throw error;
  }
};

export { getItems, getItemsByCollectionId, getItem, addItem, updateItem, deleteItem, deleteItemsByCollectionId, getLatestItems };
