'use client';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import type { User } from 'firebase/auth';

/**
 * Creates a user profile document in Firestore if one doesn't already exist.
 * This is an idempotent function; it will not overwrite an existing profile.
 *
 * @param user The Firebase Auth User object.
 */
export const createUserProfileDocument = async (user: User) => {
  if (!user) return;
  
  const firestore = getFirestore(user.app);
  const userRef = doc(firestore, `users/${user.uid}`);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { email, displayName, photoURL } = user;
    const createdAt = serverTimestamp();

    try {
      await setDoc(userRef, {
        id: user.uid,
        email,
        displayName,
        photoURL,
        createdAt,
        creditBalance: 10, // Initial credit balance for new users
      });
    } catch (error) {
      console.error("Error creating user document in Firestore:", error);
      // Optionally re-throw or handle the error in a way that's visible to the user
      // For now, we log it, as the user is already authenticated at this point.
    }
  }
};
    