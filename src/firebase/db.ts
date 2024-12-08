import { db } from './firebase-config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  increment,
} from 'firebase/firestore';
import { User } from '../types/models';

// Users collection
export const usersCollection = collection(db, 'users');

// Skapa en ny användare
export const createUser = async (userData: Omit<User, 'id'>) => {
  const docRef = await addDoc(usersCollection, {
    ...userData,
    createdAt: new Date()
  });
  return docRef.id;
};

// Hämta alla användare
export const getUsers = async () => {
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as User));
};

// Uppdatera en användare
export const updateUser = async (user: User) => {
  const userRef = doc(db, 'users', user.id);
  await updateDoc(userRef, {
    lastFikaDate: user.lastFikaDate,
    fikaCount: user.fikaCount
  });
};

// Ta bort en användare
export const deleteUser = async (id: string) => {
  const userRef = doc(db, 'users', id);
  await deleteDoc(userRef);
};

// Uppdatera fika-information för en användare
export const updateUserFika = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    lastFikaDate: new Date(),
    fikaCount: increment(1)  // Ökar fikaCount med 1
  });
};

// Hämta användare sorterade efter minst antal fika
export const getUsersSortedByFika = async () => {
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data()
    } as User))
    .sort((a, b) => (a.fikaCount || 0) - (b.fikaCount || 0));
};