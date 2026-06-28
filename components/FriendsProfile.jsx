"use client";

import { useState } from "react";
import Link from "next/link";
import { auth } from "@/app/lib/firebase";
import { sendFriendRequest } from "@/app/lib/firebase"; 
// ⚠️ nhớ sửa đúng path nếu bạn tách file

export default function FriendsProfile({ user }) {
  if (!user) return null;

  const currentUser = auth.currentUser;

  const isMe = currentUser?.uid === user.uid;

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleAdd() {
    if (!currentUser || loading || sent) return;

    setLoading(true);

    try {
      await sendFriendRequest(currentUser.uid, user.uid);
      setSent(true);
    } catch (err) {
      console.error("Send friend request error:", err);
    }

    setLoading(false);
  }

  return (
    <div
      className="
      overflow-hidden
      rounded-3xl
      border
      border-slate-200
      dark:border-slate-800
      bg-white
      dark:bg-slate-900
      shadow-sm
      hover:shadow-xl
      transition
      "
    >
      {/* Cover */}
      <div className="relative h-36 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500">
        {user.cover && (
          <img
            src={user.cover}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Body */}
      <div className="px-6">
        {/* Avatar */}
        <div className="-mt-12 relative w-fit">
          <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-900 bg-violet-600 flex items-center justify-center text-white text-3xl font-bold">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              user.displayName?.charAt(0)?.toUpperCase()
            )}
          </div>

          {user.online && (
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-slate-900" />
          )}
        </div>

        {/* Name */}
        <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
          {user.displayName}
        </h2>

        <p className="text-violet-500">@{user.username}</p>

        {/* Bio */}
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          {user.bio || "Chưa có lời giới thiệu."}
        </p>

        {/* Info */}
        <div className="mt-5 space-y-2 text-sm">
          {user.location && <div>📍 {user.location}</div>}
          {user.school && <div>🎓 {user.school}</div>}
          {user.website && <div>🌐 {user.website}</div>}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <h3 className="font-bold text-xl">
              {user.friendCount || 0}
            </h3>
            <p className="text-sm text-slate-500">Friends</p>
          </div>

          <div>
            <h3 className="font-bold text-xl">
              {user.postCount || 0}
            </h3>
            <p className="text-sm text-slate-500">Posts</p>
          </div>

          <div>
            <h3 className="font-bold text-xl">
              {user.online ? "🟢" : "⚪"}
            </h3>
            <p className="text-sm text-slate-500">Status</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-7 flex gap-3">
          {isMe ? (
            <Link
              href="/profile"
              className="
                flex-1
                rounded-xl
                bg-violet-600
                py-3
                text-center
                text-white
                hover:bg-violet-500
                transition
              "
            >
              Edit Profile
            </Link>
          ) : (
            <>
              {/* Add friend */}
              <button
                onClick={handleAdd}
                disabled={loading || sent}
                className={`
                  flex-1 rounded-xl py-3 transition text-white
                  ${
                    sent
                      ? "bg-green-600"
                      : "bg-violet-600 hover:bg-violet-500"
                  }
                  disabled:opacity-50
                `}
              >
                {loading
                  ? "Đang gửi..."
                  : sent
                  ? "✅ Đã gửi lời mời"
                  : "❤️ Kết bạn"}
              </button>

              {/* Chat */}
              <button
                className="
                  flex-1
                  rounded-xl
                  border
                  border-slate-300
                  dark:border-slate-700
                  py-3
                  hover:bg-slate-100
                  dark:hover:bg-slate-800
                  transition
                "
              >
                💬 Chat
              </button>
            </>
          )}
        </div>

        {/* Profile link */}
        <Link
          href={isMe ? "/profile" : `/profile/${user.uid}`}
          className="
            mt-5 mb-6 block text-center
            text-violet-500 hover:underline
          "
        >
          Xem hồ sơ →
        </Link>

        {/* Status message */}
        {sent && (
          <p className="text-center text-sm text-green-500 mb-4">
            Đã gửi lời mời kết bạn, chờ phản hồi 👌
          </p>
        )}
      </div>
    </div>
  );
}