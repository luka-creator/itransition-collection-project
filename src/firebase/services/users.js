import { collection, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { getAuth, deleteUser as firebaseDeleteUser } from 'firebase/auth';
import { firestore } from '../config';

const getUsers = async () => {
  try {
    const snapshot = await getDocs(collection(firestore, 'users'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

const updateUserRole = async (userId, isAdmin) => {
  try {
    await updateDoc(doc(firestore, 'users', userId), { isAdmin });
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

const blockUser = async (userId) => {
  try {
    await updateDoc(doc(firestore, 'users', userId), { isBlocked: true });
  } catch (error) {
    console.error("Error blocking user:", error);
    throw error;
  }
};

const unblockUser = async (userId) => {
  try {
    await updateDoc(doc(firestore, 'users', userId), { isBlocked: false });
  } catch (error) {
    console.error("Error unblocking user:", error);
    throw error;
  }
};

const deleteUser = async (userId) => {
  const auth = getAuth();
  const user = auth.currentUser;
  try {
    await deleteDoc(doc(firestore, 'users', userId));
    if (user && user.uid === userId) {
      await firebaseDeleteUser(user);
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

const getUser = async (userId) => {
  try {
    const docRef = doc(firestore, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error getting user:", error);
    return null; 
  }
};


export { getUsers, updateUserRole, blockUser, unblockUser, deleteUser, getUser };
