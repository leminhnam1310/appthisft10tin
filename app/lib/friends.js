import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
  increment,
} from "firebase/firestore";

import { db } from "./firebase";

/* =========================
        SAFE USER CHECK
========================= */
function isValidUser(u) {
  if (!u) return false;

  // ❌ block rác hệ thống cũ
  if (!u.uid) return false;
  if (!u.email) return false;

  if (u.displayName === "Unknown") return false;
  if (u.displayName === "Guest") return false;

  return true;
}

/* =========================
        GET PROFILE
========================= */
export async function getProfile(uid) {
  if (!uid) return null;

  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;

  const data = { uid: snap.id, ...snap.data() };

  if (!isValidUser(data)) return null;

  return data;
}

/* =========================
        LIST USERS (FIXED)
========================= */
export function listenUsers(currentUid, callback) {
  const q = query(
    collection(db, "users"),
    orderBy("displayName")
  );

  return onSnapshot(q, (snap) => {
    let users = snap.docs.map((d) => ({
      uid: d.id,
      ...d.data(),
    }));

    users = users.filter(isValidUser);

    if (currentUid) {
      users = users.filter((u) => u.uid !== currentUid);
    }

    callback(users);
  });
}

/* =========================
        SEARCH USERS (FIXED)
========================= */
export async function searchUsers(keyword, currentUid) {
  if (!keyword?.trim()) return [];

  const snap = await getDocs(
    query(collection(db, "users"), limit(200))
  );

  const key = keyword.toLowerCase();

  return snap.docs
    .map((d) => ({
      uid: d.id,
      ...d.data(),
    }))
    .filter((u) => {
      if (!isValidUser(u)) return false;
      if (u.uid === currentUid) return false;

      return (
        u.displayName?.toLowerCase().includes(key) ||
        u.username?.toLowerCase().includes(key) ||
        u.email?.toLowerCase().includes(key)
      );
    });
}

/* =========================
        FRIEND REQUEST
========================= */
export async function sendFriendRequest(fromUid, toUid) {
  if (!fromUid || !toUid || fromUid === toUid) return;

  const q = query(
    collection(db, "friendRequests"),
    where("fromUid", "==", fromUid),
    where("toUid", "==", toUid)
  );

  const snap = await getDocs(q);
  if (!snap.empty) return;

  await addDoc(collection(db, "friendRequests"), {
    fromUid,
    toUid,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

/* =========================
        ACCEPT REQUEST
========================= */
export async function acceptFriendRequest(request) {
  const { id, fromUid, toUid } = request;

  const batch = writeBatch(db);

  batch.set(doc(db, "friends", `${fromUid}_${toUid}`), {
    uid: fromUid,
    friendUid: toUid,
    createdAt: serverTimestamp(),
  });

  batch.set(doc(db, "friends", `${toUid}_${fromUid}`), {
    uid: toUid,
    friendUid: fromUid,
    createdAt: serverTimestamp(),
  });

  batch.update(doc(db, "users", fromUid), {
    friendCount: increment(1),
  });

  batch.update(doc(db, "users", toUid), {
    friendCount: increment(1),
  });

  batch.delete(doc(db, "friendRequests", id));

  await batch.commit();
}

/* =========================
        REMOVE FRIEND
========================= */
export async function removeFriend(uid, friendUid) {
  const batch = writeBatch(db);

  batch.delete(doc(db, "friends", `${uid}_${friendUid}`));
  batch.delete(doc(db, "friends", `${friendUid}_${uid}`));

  batch.update(doc(db, "users", uid), {
    friendCount: increment(-1),
  });

  batch.update(doc(db, "users", friendUid), {
    friendCount: increment(-1),
  });

  await batch.commit();
}

/* =========================
        FRIENDS LIST (FIXED)
========================= */
export function listenFriends(uid, callback) {
  if (!uid) return () => {};

  const q = query(
    collection(db, "friends"),
    where("uid", "==", uid)
  );

  return onSnapshot(q, async (snap) => {
    const list = await Promise.all(
      snap.docs.map(async (d) => {
        const data = d.data();
        const profile = await getProfile(data.friendUid);
        return profile;
      })
    );

    callback(list.filter(Boolean));
  });
}

/* =========================
        SUGGESTIONS (FIXED)
========================= */
export async function getSuggestions(uid) {
  const snap = await getDocs(collection(db, "users"));

  const users = snap.docs
    .map((d) => ({ uid: d.id, ...d.data() }))
    .filter((u) => u.uid !== uid)
    .filter(isValidUser);

  return users
    .sort(() => Math.random() - 0.5)
    .slice(0, 20);
}

/* =========================
        CHAT
========================= */
export function getChatId(uid1, uid2) {
  if (!uid1 || !uid2) return null;

  return uid1 < uid2
    ? `${uid1}_${uid2}`
    : `${uid2}_${uid1}`;
}

export async function createChat(uid1, uid2) {
  if (!uid1 || !uid2 || uid1 === uid2) return null;

  const chatId = getChatId(uid1, uid2);

  const ref = doc(db, "chats", chatId);
  const snap = await getDoc(ref);

  if (snap.exists()) return chatId;

  await setDoc(ref, {
    users: [uid1, uid2],
    lastMessage: "",
    lastSender: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return chatId;
}