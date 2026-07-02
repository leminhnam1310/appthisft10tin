import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "./firebase";
import { createUserIfNotExists } from "./friends";

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

// ======================
// GOOGLE LOGIN (ONLY VALID USERS)
// ======================
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    const user = result.user;

    // ❌ BLOCK INVALID USER
    if (!user?.email) {
      throw new Error("No email found");
    }

    // ✔ SET DEFAULT DISPLAY NAME = EMAIL PREFIX
    if (!user.displayName) {
      await updateProfile(user, {
        displayName: user.email.split("@")[0],
      });
    }

    await createUserIfNotExists(user);

    return user;
  } catch (error) {
    console.error("Google Login Error:", error);
    throw error;
  }
}

// ======================
// REMOVE GUEST LOGIN (IMPORTANT)
// ======================
// ❌ KHÔNG DÙNG ANONYMOUS NỮA
export async function loginAsGuest() {
  throw new Error(
    "Guest login disabled: system requires email authentication"
  );
}

// ======================
// LOGOUT
// ======================
export async function logout() {
  await signOut(auth);
}

// ======================
// CURRENT USER
// ======================
export function getCurrentUser() {
  return auth.currentUser;
}

// ======================
// UPDATE NAME (EMAIL SAFE)
// ======================
export async function changeDisplayName(name) {
  if (!auth.currentUser) return;

  const safeName =
    name ||
    auth.currentUser.email?.split("@")[0];

  await updateProfile(auth.currentUser, {
    displayName: safeName,
  });

  return auth.currentUser;
}