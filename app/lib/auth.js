import {
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "./firebase";
import { createUserIfNotExists } from "./friends";

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    await createUserIfNotExists(result.user); // ⭐ FIX

    return result.user;
  } catch (error) {
    console.error("Google Login Error:", error);
    throw error;
  }
}

export async function loginAsGuest() {
  try {
    const result = await signInAnonymously(auth);

    await createUserIfNotExists(result.user); // ⭐ FIX

    return result.user;
  } catch (error) {
    console.error("Guest Login Error:", error);
    throw error;
  }
}

export async function logout() {
  await signOut(auth);
}

export function getCurrentUser() {
  return auth.currentUser;
}

export async function changeDisplayName(name) {
  if (!auth.currentUser) return;

  await updateProfile(auth.currentUser, {
    displayName: name,
  });

  return auth.currentUser;
}