import {
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "./firebase";

// ==========================
// Google Login
// ==========================
const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    return result.user;
  } catch (error) {
    console.error("Google Login Error:", error);
    throw error;
  }
}

// ==========================
// Guest Login
// ==========================
export async function loginAsGuest() {
  try {
    const result = await signInAnonymously(auth);

    return result.user;
  } catch (error) {
    console.error("Guest Login Error:", error);
    throw error;
  }
}

// ==========================
// Logout
// ==========================
export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
}

// ==========================
// Get Current User
// ==========================
export function getCurrentUser() {
  return auth.currentUser;
}

// ==========================
// Update Display Name
// (Sau này đổi tên user)
// ==========================
export async function changeDisplayName(name) {
  if (!auth.currentUser) return;

  await updateProfile(auth.currentUser, {
    displayName: name,
  });
}