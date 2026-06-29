"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "@/app/lib/firebase";

import {
  sendFriendRequest,
  removeFriend,
  listenFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  isFriend,
} from "@/app/lib/friends";

export default function FriendCard({ user, compact = false }) {
  const currentUser = auth.currentUser;

  const [friendStatus, setFriendStatus] = useState("none");
  const [requestId, setRequestId] = useState(null);

  if (!user) return null;

  const isMe = currentUser?.uid === user.uid;

  // =========================
  // CHECK STATUS REALTIME
  // =========================
  useEffect(() => {
    if (!currentUser || !user) return;

    let unsub;

    async function check() {
      const friend = await isFriend(currentUser.uid, user.uid);

      if (friend) {
        setFriendStatus("friend");
        return;
      }

      // listen incoming requests
      unsub = listenFriendRequests(currentUser.uid, (requests) => {
        const req = requests.find(
          (r) => r.fromUid === user.uid
        );

        if (req) {
          setFriendStatus("incoming");
          setRequestId(req.id);
        } else {
          setFriendStatus("none");
          setRequestId(null);
        }
      });
    }

    check();

    return () => unsub && unsub();
  }, [currentUser, user]);

  // =========================
  // ACTIONS
  // =========================
  async function handleAddFriend() {
    await sendFriendRequest(currentUser.uid, user.uid);
    setFriendStatus("sent");
  }

  async function handleAccept() {
    await acceptFriendRequest({
      id: requestId,
      fromUid: user.uid,
      toUid: currentUser.uid,
    });

    setFriendStatus("friend");
  }

  async function handleDecline() {
    await declineFriendRequest(requestId);
    setFriendStatus("none");
  }

  async function handleRemoveFriend() {
    if (!confirm("Xóa bạn bè?")) return;

    await removeFriend(currentUser.uid, user.uid);
    setFriendStatus("none");
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">

      {/* COVER */}
      <div className="h-24 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500" />

      {/* BODY */}
      <div className="p-5">

        {/* AVATAR */}
        <div className="-mt-10 w-fit relative">
          <div className="h-20 w-20 rounded-full bg-violet-600 text-white flex items-center justify-center text-xl font-bold border-4 border-white dark:border-slate-900 overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} className="w-full h-full object-cover" />
            ) : (
              user.displayName?.charAt(0)
            )}
          </div>
        </div>

        {/* INFO */}
        <h2 className="mt-3 font-bold text-lg text-slate-900 dark:text-white">
          {user.displayName}
        </h2>

        <p className="text-violet-500">@{user.username}</p>

        {!compact && (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {user.bio || "Chưa có bio"}
          </p>
        )}

        {/* BUTTONS */}
        <div className="mt-5 flex gap-2">

          {/* ME */}
          {isMe && (
            <Link
              href="/profile"
              className="flex-1 bg-violet-600 text-white py-2 rounded-xl text-center"
            >
              Edit
            </Link>
          )}

          {/* FRIEND */}
          {!isMe && friendStatus === "friend" && (
            <>
              <Link
                href={`/messages/${user.uid}`}
                className="flex-1 bg-violet-600 text-white py-2 rounded-xl text-center"
              >
                💬 Chat
              </Link>

              <button
                onClick={handleRemoveFriend}
                className="px-4 border border-red-300 rounded-xl text-red-500"
              >
                ❌
              </button>
            </>
          )}

          {/* INCOMING REQUEST */}
          {!isMe && friendStatus === "incoming" && (
            <>
              <button
                onClick={handleAccept}
                className="flex-1 bg-green-600 text-white py-2 rounded-xl"
              >
                ✔ Accept
              </button>

              <button
                onClick={handleDecline}
                className="px-4 border border-red-300 rounded-xl text-red-500"
              >
                ❌
              </button>
            </>
          )}

          {/* SENT */}
          {!isMe && friendStatus === "sent" && (
            <button className="flex-1 bg-gray-400 text-white py-2 rounded-xl cursor-not-allowed">
              ⏳ Đã gửi
            </button>
          )}

          {/* NONE */}
          {!isMe && friendStatus === "none" && (
            <button
              onClick={handleAddFriend}
              className="flex-1 bg-violet-600 text-white py-2 rounded-xl"
            >
              ❤️ Kết bạn
            </button>
          )}

        </div>

      </div>
    </div>
  );
}