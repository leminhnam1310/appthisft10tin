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
  updateDoc,
  where,
  writeBatch,
  increment
} from "firebase/firestore";

import { db } from "./firebase";

/* ==========================================================
                        USERS
========================================================== */

export async function createUserIfNotExists(user) {
  if (!user) return;

  const ref = doc(db, "users", user.uid);

  const snap = await getDoc(ref);

  if (snap.exists()) return;

  await setDoc(ref, {
    uid: user.uid,

    displayName: user.displayName || "Unknown",

    username:
      (user.displayName || "user")
        .replace(/\s+/g, "")
        .toLowerCase() +
      Math.floor(Math.random() * 9999),

    email: user.email || "",

    avatar: user.photoURL || "",

    cover: "",

    bio: "",

    location: "",

    school: "",

    website: "",

    online: true,

    friendCount: 0,

    postCount: 0,

    createdAt: serverTimestamp(),

    lastSeen: serverTimestamp(),
  });
}

/* ==========================================================
                    PROFILE
========================================================== */

export async function getProfile(uid) {
  const snap = await getDoc(
    doc(db, "users", uid)
  );

  if (!snap.exists()) return null;

  return snap.data();
}

export async function updateProfile(
  uid,
  data
) {
  await updateDoc(
    doc(db, "users", uid),
    data
  );
}

/* ==========================================================
                REALTIME PROFILE
========================================================== */

export function listenProfile(
  uid,
  callback
) {
  return onSnapshot(
    doc(db, "users", uid),
    (docSnap) => {
      if (!docSnap.exists()) {
        callback(null);
        return;
      }

      callback({
        id: docSnap.id,
        ...docSnap.data(),
      });
    }
  );
}

/* ==========================================================
                ONLINE STATUS
========================================================== */

export async function setOnline(uid) {
  await updateDoc(
    doc(db, "users", uid),
    {
      online: true,

      lastSeen: serverTimestamp(),
    }
  );
}

export async function setOffline(uid) {
  await updateDoc(
    doc(db, "users", uid),
    {
      online: false,

      lastSeen: serverTimestamp(),
    }
  );
}

/* ==========================================================
                SEARCH USERS
========================================================== */

export function listenUsers(callback) {
  const q = query(
    collection(db, "users"),
    orderBy("displayName")
  );

  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
  });
}

/* ==========================================================
        SEARCH DISPLAY NAME
========================================================== */

export async function searchByName(
  keyword
) {
  if (!keyword.trim()) return [];

  const q = query(
    collection(db, "users"),
    orderBy("displayName"),
    limit(30)
  );

  const snap = await getDocs(q);

  return snap.docs
    .map((d) => ({
      id: d.id,
      ...d.data(),
    }))
    .filter((user) =>
      user.displayName
        ?.toLowerCase()
        .includes(keyword.toLowerCase())
    );
}

/* ==========================================================
        SEARCH USERNAME
========================================================== */

export async function searchByUsername(
  keyword
) {
  if (!keyword.trim()) return [];

  const q = query(
    collection(db, "users"),
    orderBy("username"),
    limit(30)
  );

  const snap = await getDocs(q);

  return snap.docs
    .map((d) => ({
      id: d.id,
      ...d.data(),
    }))
    .filter((user) =>
      user.username
        ?.toLowerCase()
        .includes(keyword.toLowerCase())
    );
}

/* ==========================================================
            UNIVERSAL SEARCH
========================================================== */

export async function searchUsers(
  keyword
) {
  if (!keyword.trim()) return [];

  const q = query(
    collection(db, "users"),
    limit(50)
  );

  const snap = await getDocs(q);

  const key = keyword.toLowerCase();

  return snap.docs
    .map((d) => ({
      id: d.id,
      ...d.data(),
    }))
    .filter((user) => {
      return (
        user.displayName
          ?.toLowerCase()
          .includes(key) ||
        user.username
          ?.toLowerCase()
          .includes(key) ||
        user.email
          ?.toLowerCase()
          .includes(key) ||
        user.bio
          ?.toLowerCase()
          .includes(key)
      );
    });
}

/* ==========================================================
            RECENT USERS
========================================================== */

export function listenNewestUsers(
  callback
) {
  const q = query(
    collection(db, "users"),
    orderBy("createdAt", "desc"),
    limit(10)
  );

  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
  });
}

/* ==========================================================
            ONLINE USERS
========================================================== */

export function listenOnlineUsers(
  callback
) {
  const q = query(
    collection(db, "users"),
    where("online", "==", true)
  );

  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
  });
}
/* ==========================================================
                    FRIEND REQUEST
========================================================== */

export async function sendFriendRequest(fromUid, toUid) {
  if (!fromUid || !toUid) return;

  if (fromUid === toUid) return;

  // kiểm tra đã gửi chưa
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

/* ==========================================================
            REQUEST RECEIVED
========================================================== */

export function listenFriendRequests(
  uid,
  callback
) {
  const q = query(
    collection(db, "friendRequests"),
    where("toUid", "==", uid),
    where("status", "==", "pending"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
  });
}

/* ==========================================================
            REQUEST SENT
========================================================== */

export function listenSentRequests(
  uid,
  callback
) {
  const q = query(
    collection(db, "friendRequests"),
    where("fromUid", "==", uid),
    where("status", "==", "pending"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
  });
}

/* ==========================================================
                CANCEL REQUEST
========================================================== */

export async function cancelFriendRequest(
  requestId
) {
  await deleteDoc(
    doc(db, "friendRequests", requestId)
  );
}

/* ==========================================================
                DECLINE REQUEST
========================================================== */

export async function declineFriendRequest(
  requestId
) {
  await deleteDoc(
    doc(db, "friendRequests", requestId)
  );
}
/* ==========================================================
                    FRIEND LIST
========================================================== */

export function listenFriends(
  uid,
  callback
) {
  const q = query(
    collection(db, "friends"),
    where("uid", "==", uid)
  );

  return onSnapshot(q, async (snap) => {
    const list = await Promise.all(
      snap.docs.map(async (friendDoc) => {
        const data = friendDoc.data();

        const profile = await getProfile(
          data.friendUid
        );

        return {
          friendDocId: friendDoc.id,

          ...profile,
        };
      })
    );

    callback(list);
  });
}

/* ==========================================================
                CHECK FRIEND
========================================================== */

export async function isFriend(
  uid,
  friendUid
) {
  const snap = await getDoc(
    doc(db, "friends", `${uid}_${friendUid}`)
  );

  return snap.exists();
}
/* ==========================================================
                ACCEPT REQUEST (OPTIMIZED)
========================================================== */

export async function acceptFriendRequest(request) {
  if (!request) return;

  const { id, fromUid, toUid } = request;

  const batch = writeBatch(db);

  // Friend document của người gửi
  const friendA = doc(
    db,
    "friends",
    `${fromUid}_${toUid}`
  );

  // Friend document của người nhận
  const friendB = doc(
    db,
    "friends",
    `${toUid}_${fromUid}`
  );

  // User
  const fromUser = doc(
    db,
    "users",
    fromUid
  );

  const toUser = doc(
    db,
    "users",
    toUid
  );

  // Request
  const requestRef = doc(
    db,
    "friendRequests",
    id
  );

  // =======================
  // Add Friend
  // =======================

  batch.set(friendA, {
    uid: fromUid,

    friendUid: toUid,

    createdAt: serverTimestamp(),
  });

  batch.set(friendB, {
    uid: toUid,

    friendUid: fromUid,

    createdAt: serverTimestamp(),
  });

  // =======================
  // Increase Friend Count
  // =======================

  batch.update(fromUser, {
    friendCount: increment(1),
  });

  batch.update(toUser, {
    friendCount: increment(1),
  });

  // =======================
  // Delete Request
  // =======================

  batch.delete(requestRef);

  // =======================
  // Commit
  // =======================

  await batch.commit();
}

/* ==========================================================
                    REMOVE FRIEND
========================================================== */

export async function removeFriend(
  uid,
  friendUid
) {
  const batch = writeBatch(db);

  const myFriend = doc(
    db,
    "friends",
    `${uid}_${friendUid}`
  );

  const friendFriend = doc(
    db,
    "friends",
    `${friendUid}_${uid}`
  );

  const myUser = doc(
    db,
    "users",
    uid
  );

  const friendUser = doc(
    db,
    "users",
    friendUid
  );

  batch.delete(myFriend);

  batch.delete(friendFriend);

  batch.update(myUser, {
    friendCount: increment(-1),
  });

  batch.update(friendUser, {
    friendCount: increment(-1),
  });

  await batch.commit();
}

/* ==========================================================
                FRIEND COUNT
========================================================== */

export function listenFriendCount(
  uid,
  callback
) {
  return onSnapshot(
    doc(db, "users", uid),
    (snap) => {
      callback(
        snap.data()?.friendCount || 0
      );
    }
  );
}
/* ==========================================================
            GET FRIEND PROFILE
========================================================== */

export async function getFriendProfile(
  uid,
  friendUid
) {
  const ok = await isFriend(
    uid,
    friendUid
  );

  if (!ok) return null;

  return await getProfile(friendUid);
}

/* ==========================================================
            LISTEN FRIEND PROFILE
========================================================== */

export function listenFriendProfile(
  friendUid,
  callback
) {
  return onSnapshot(
    doc(db, "users", friendUid),
    (snap) => {
      if (!snap.exists()) {
        callback(null);
        return;
      }

      callback({
        id: snap.id,
        ...snap.data(),
      });
    }
  );
}
/* ==========================================================
                    BLOCK USER
========================================================== */

export async function blockUser(uid, targetUid) {
  if (!uid || !targetUid) return;

  await setDoc(
    doc(db, "blocks", `${uid}_${targetUid}`),
    {
      uid,
      targetUid,
      createdAt: serverTimestamp(),
    }
  );

  // nếu đang là bạn thì xóa luôn
  const friendA = doc(db, "friends", `${uid}_${targetUid}`);
  const friendB = doc(db, "friends", `${targetUid}_${uid}`);

  try {
    await deleteDoc(friendA);
    await deleteDoc(friendB);
  } catch {}
}

/* ==========================================================
                    UNBLOCK
========================================================== */

export async function unblockUser(uid, targetUid) {
  await deleteDoc(
    doc(db, "blocks", `${uid}_${targetUid}`)
  );
}

/* ==========================================================
                CHECK BLOCKED
========================================================== */

export async function isBlocked(uid, targetUid) {
  const snap = await getDoc(
    doc(db, "blocks", `${uid}_${targetUid}`)
  );

  return snap.exists();
}

/* ==========================================================
            LISTEN BLOCKED USERS
========================================================== */

export function listenBlockedUsers(uid, callback) {
  const q = query(
    collection(db, "blocks"),
    where("uid", "==", uid)
  );

  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
  });
}

/* ==========================================================
                MUTUAL FRIENDS
========================================================== */

export async function getMutualFriends(uid, targetUid) {
  const mySnap = await getDocs(
    query(
      collection(db, "friends"),
      where("uid", "==", uid)
    )
  );

  const targetSnap = await getDocs(
    query(
      collection(db, "friends"),
      where("uid", "==", targetUid)
    )
  );

  const myFriends = mySnap.docs.map((d) => d.data().friendUid);

  const targetFriends = targetSnap.docs.map((d) => d.data().friendUid);

  const mutualIds = myFriends.filter((id) =>
    targetFriends.includes(id)
  );

  const profiles = await Promise.all(
    mutualIds.map((id) => getProfile(id))
  );

  return profiles.filter(Boolean);
}

/* ==========================================================
            SEARCH MY FRIENDS
========================================================== */

export async function searchFriends(uid, keyword) {
  if (!keyword.trim()) return [];

  const q = query(
    collection(db, "friends"),
    where("uid", "==", uid)
  );

  const snap = await getDocs(q);

  const profiles = await Promise.all(
    snap.docs.map(async (docSnap) => {
      return await getProfile(
        docSnap.data().friendUid
      );
    })
  );

  const key = keyword.toLowerCase();

  return profiles.filter((u) => {
    if (!u) return false;

    return (
      u.displayName?.toLowerCase().includes(key) ||
      u.username?.toLowerCase().includes(key) ||
      u.bio?.toLowerCase().includes(key)
    );
  });
}

/* ==========================================================
            ONLINE FRIENDS
========================================================== */

export function listenOnlineFriends(uid, callback) {
  return listenFriends(uid, (friends) => {
    callback(
      friends.filter((u) => u.online)
    );
  });
}

/* ==========================================================
            FRIEND SUGGESTIONS
========================================================== */

export async function getSuggestions(uid) {
  const snap = await getDocs(
    collection(db, "users")
  );

  const users = [];

  snap.forEach((d) => {
    const user = d.data();

    if (user.uid !== uid) {
      users.push(user);
    }
  });

  // Random nhẹ
  users.sort(() => Math.random() - 0.5);

  return users.slice(0, 20);
}

/* ==========================================================
            RECENT FRIENDS
========================================================== */

export function listenRecentFriends(uid, callback) {
  const q = query(
    collection(db, "friends"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
    limit(10)
  );

  return onSnapshot(q, async (snap) => {
    const friends = await Promise.all(
      snap.docs.map(async (d) => {
        return await getProfile(
          d.data().friendUid
        );
      })
    );

    callback(friends.filter(Boolean));
  });
}
/* ==========================================================
                    FAVORITE FRIENDS
========================================================== */

export async function favoriteFriend(uid, friendUid) {
  await setDoc(
    doc(db, "favorites", `${uid}_${friendUid}`),
    {
      uid,
      friendUid,
      createdAt: serverTimestamp(),
    }
  );
}

export async function unfavoriteFriend(uid, friendUid) {
  await deleteDoc(
    doc(db, "favorites", `${uid}_${friendUid}`)
  );
}

export function listenFavoriteFriends(uid, callback) {
  const q = query(
    collection(db, "favorites"),
    where("uid", "==", uid)
  );

  return onSnapshot(q, async (snap) => {
    const friends = await Promise.all(
      snap.docs.map(async (d) => {
        return await getProfile(
          d.data().friendUid
        );
      })
    );

    callback(friends.filter(Boolean));
  });
}

/* ==========================================================
                    NOTIFICATIONS
========================================================== */

export async function pushNotification({
  uid,
  title,
  body,
  type,
  data = {},
}) {
  await addDoc(collection(db, "notifications"), {
    uid,
    title,
    body,
    type,
    data,
    read: false,
    createdAt: serverTimestamp(),
  });
}

export function listenNotifications(uid, callback) {
  const q = query(
    collection(db, "notifications"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
  });
}

export async function readNotification(id) {
  await updateDoc(
    doc(db, "notifications", id),
    {
      read: true,
    }
  );
}

/* ==========================================================
                    CHAT ROOM
========================================================== */

export function getChatId(uid1, uid2) {
  return [uid1, uid2].sort().join("_");
}

export async function createChat(uid1, uid2) {
  const chatId = getChatId(uid1, uid2);

  const ref = doc(db, "chats", chatId);

  const snap = await getDoc(ref);

  if (snap.exists()) return chatId;

  await setDoc(ref, {
    users: [uid1, uid2],
    lastMessage: "",
    lastSender: "",
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });

  return chatId;
}

/* ==========================================================
                    CHAT LIST
========================================================== */

export function listenChats(uid, callback) {
  const q = query(
    collection(db, "chats"),
    where("users", "array-contains", uid),
    orderBy("updatedAt", "desc")
  );

  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
  });
}

/* ==========================================================
                    SEND MESSAGE
========================================================== */

export async function sendMessage(
  chatId,
  uid,
  text
) {
  if (!text.trim()) return;

  await addDoc(
    collection(db, "chats", chatId, "messages"),
    {
      sender: uid,
      text,
      createdAt: serverTimestamp(),
    }
  );

  await updateDoc(
    doc(db, "chats", chatId),
    {
      lastMessage: text,
      lastSender: uid,
      updatedAt: serverTimestamp(),
    }
  );
}

/* ==========================================================
                REALTIME MESSAGE
========================================================== */

export function listenMessages(
  chatId,
  callback
) {
  const q = query(
    collection(
      db,
      "chats",
      chatId,
      "messages"
    ),
    orderBy("createdAt")
  );

  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
  });
}

/* ==========================================================
                    GROUP
========================================================== */

export async function createGroup(
  name,
  owner,
  members = []
) {
  const ref = await addDoc(
    collection(db, "groups"),
    {
      name,
      owner,
      members: [...members, owner],
      avatar: "",
      createdAt: serverTimestamp(),
    }
  );

  return ref.id;
}

/* ==========================================================
                GROUP LIST
========================================================== */

export function listenGroups(
  uid,
  callback
) {
  const q = query(
    collection(db, "groups"),
    where("members", "array-contains", uid)
  );

  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
  });
}

/* ==========================================================
            UPDATE LAST SEEN
========================================================== */

export async function updateLastSeen(uid) {
  await updateDoc(
    doc(db, "users", uid),
    {
      lastSeen: serverTimestamp(),
    }
  );
}
/* ==========================================================
                    FRIEND STATS
========================================================== */

export async function getFriendStats(uid) {
  const profile = await getProfile(uid);

  if (!profile) return null;

  return {
    friendCount: profile.friendCount || 0,
    postCount: profile.postCount || 0,
    online: profile.online || false,
    lastSeen: profile.lastSeen || null,
  };
}

/* ==========================================================
                    RANDOM USERS
========================================================== */

export async function getRandomUsers(limitCount = 8) {
  const snap = await getDocs(collection(db, "users"));

  const users = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  users.sort(() => Math.random() - 0.5);

  return users.slice(0, limitCount);
}

/* ==========================================================
                ACTIVE USERS
========================================================== */

export async function getMostActiveUsers() {
  const snap = await getDocs(
    query(
      collection(db, "users"),
      orderBy("postCount", "desc"),
      limit(10)
    )
  );

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

/* ==========================================================
                UPDATE POST COUNT
========================================================== */

export async function increasePostCount(uid) {
  await updateDoc(doc(db, "users", uid), {
    postCount: increment(1),
  });
}

export async function decreasePostCount(uid) {
  await updateDoc(doc(db, "users", uid), {
    postCount: increment(-1),
  });
}

/* ==========================================================
                    USER EXISTS
========================================================== */

export async function userExists(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists();
}

/* ==========================================================
                AI FRIEND SCORE
========================================================== */

export function calculateFriendScore(userA, userB) {
  let score = 0;

  if (
    userA.location &&
    userA.location === userB.location
  )
    score += 20;

  if (
    userA.school &&
    userA.school === userB.school
  )
    score += 20;

  if (
    userA.bio &&
    userB.bio &&
    userA.bio
      .toLowerCase()
      .includes(userB.bio.toLowerCase())
  )
    score += 10;

  return score;
}

/* ==========================================================
                AI SUGGESTION
========================================================== */

export async function getAISuggestions(uid) {
  const me = await getProfile(uid);

  if (!me) return [];

  const users = await getRandomUsers(100);

  return users
    .filter((u) => u.uid !== uid)
    .map((u) => ({
      ...u,
      score: calculateFriendScore(me, u),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

/* ==========================================================
                FORMAT LAST SEEN
========================================================== */

export function formatLastSeen(timestamp) {
  if (!timestamp?.toDate) return "";

  const diff =
    Date.now() - timestamp.toDate().getTime();

  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Vừa xong";

  if (minutes < 60)
    return `${minutes} phút trước`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24)
    return `${hours} giờ trước`;

  const days = Math.floor(hours / 24);

  return `${days} ngày trước`;
}

/* ==========================================================
                FORMAT NAME
========================================================== */

export function shortName(name = "") {
  return name
    .split(" ")
    .slice(-2)
    .join(" ");
}

/* ==========================================================
                    SORT USERS
========================================================== */

export function sortUsers(users = []) {
  return [...users].sort((a, b) =>
    (a.displayName || "").localeCompare(
      b.displayName || ""
    )
  );
}

/* ==========================================================
                FILTER ONLINE
========================================================== */

export function onlyOnline(users = []) {
  return users.filter((u) => u.online);
}

/* ==========================================================
                FILTER OFFLINE
========================================================== */

export function onlyOffline(users = []) {
  return users.filter((u) => !u.online);
}

/* ==========================================================
                GROUP MEMBERS
========================================================== */

export async function getGroupMembers(groupId) {
  const snap = await getDoc(
    doc(db, "groups", groupId)
  );

  if (!snap.exists()) return [];

  const members = snap.data().members || [];

  return Promise.all(
    members.map((uid) => getProfile(uid))
  );
}

/* ==========================================================
                    GROUP INVITE
========================================================== */

export async function inviteToGroup(
  groupId,
  uid
) {
  const ref = doc(db, "groups", groupId);

  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const members = snap.data().members || [];

  if (members.includes(uid)) return;

  members.push(uid);

  await updateDoc(ref, {
    members,
  });
}

/* ==========================================================
                    LEAVE GROUP
========================================================== */

export async function leaveGroup(
  groupId,
  uid
) {
  const ref = doc(db, "groups", groupId);

  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const members = snap
    .data()
    .members.filter((m) => m !== uid);

  await updateDoc(ref, {
    members,
  });
}