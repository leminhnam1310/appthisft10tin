"use client";

import Link from "next/link";
import { auth } from "@/app/lib/firebase";
import {
  sendFriendRequest,
  removeFriend,
} from "@/app/lib/friends";

export default function FriendCard({
  user,
  isFriend = false,
  requestSent = false,
  compact = false,
}) {
  const currentUser = auth.currentUser;

  if (!user) return null;

  const isMe =
    currentUser &&
    currentUser.uid === user.uid;

  async function handleAddFriend() {
    if (!currentUser) return;

    try {
      await sendFriendRequest(
        currentUser.uid,
        user.uid
      );

      alert("🎉 Đã gửi lời mời kết bạn");
    } catch (err) {
      console.error(err);
      alert("Không thể gửi lời mời.");
    }
  }

  async function handleRemoveFriend() {
    if (
      !confirm(
        `Xóa ${user.displayName} khỏi danh sách bạn bè?`
      )
    )
      return;

    try {
      await removeFriend(user.friendDocId);

      alert("Đã xóa bạn.");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div
      className="
      rounded-3xl
      border
      border-slate-200
      dark:border-slate-800
      bg-white
      dark:bg-slate-900
      shadow-sm
      hover:shadow-xl
      transition-all
      duration-300
      overflow-hidden
      "
    >
      {/* Cover */}

      <div className="relative h-24 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500">

        {user.cover && (
          <img
            src={user.cover}
            alt=""
            className="w-full h-full object-cover"
          />
        )}

      </div>

      {/* Avatar */}

      <div className="px-5">

        <div className="-mt-10 relative w-fit">

          <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white dark:border-slate-900 bg-violet-600 flex items-center justify-center text-white text-2xl font-bold">

            {user.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              user.displayName?.charAt(0)
            )}

          </div>

          {user.online && (
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-slate-900" />
          )}

        </div>

        {/* Info */}

        <div className="mt-3">

          <h2 className="font-bold text-lg text-slate-900 dark:text-white">
            {user.displayName}
          </h2>

          <p className="text-violet-500">
            @{user.username}
          </p>

          {!compact && (
            <>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {user.bio ||
                  "Chưa có lời giới thiệu."}
              </p>

              <div className="mt-4 flex gap-4 text-sm text-slate-500">

                <span>
                  👥 {user.friendCount || 0}
                </span>

                <span>
                  📝 {user.postCount || 0}
                </span>

              </div>
            </>
          )}

        </div>

        {/* Buttons */}

        <div className="mt-6 flex gap-2 pb-5">

          {isMe ? (
            <Link
              href="/profile"
              className="flex-1 rounded-xl bg-violet-600 py-2.5 text-center text-white hover:bg-violet-500"
            >
              Edit
            </Link>
          ) : isFriend ? (
            <>
              <Link
                href={`/messages/${user.uid}`}
                className="flex-1 rounded-xl bg-violet-600 py-2.5 text-center text-white hover:bg-violet-500"
              >
                💬 Chat
              </Link>

              <button
                onClick={handleRemoveFriend}
                className="rounded-xl border border-red-300 px-4 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/30"
              >
                ❌
              </button>
            </>
          ) : requestSent ? (
            <button
              disabled
              className="flex-1 rounded-xl bg-gray-400 py-2.5 text-white cursor-not-allowed"
            >
              ⏳ Đã gửi
            </button>
          ) : (
            <button
              onClick={handleAddFriend}
              className="flex-1 rounded-xl bg-violet-600 py-2.5 text-white hover:bg-violet-500"
            >
              ❤️ Kết bạn
            </button>
          )}

        </div>

      </div>
    </div>
  );
}