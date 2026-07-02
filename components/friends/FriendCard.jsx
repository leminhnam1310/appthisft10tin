"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  MessageCircle,
  UserMinus,
  MapPin,
  GraduationCap,
} from "lucide-react";

import {
  removeFriend,
  createChat,
} from "@/app/lib/friends";

// ======================
// EMAIL-BASED NAME
// ======================
const getName = (user) => {
  if (!user?.email) return "";

  return user.email.split("@")[0];
};

export default function FriendCard({
  user,
  currentUser,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ======================
  // SAFETY GUARD
  // ======================
  if (!user || !currentUser || !user.uid) {
    return null;
  }

  async function handleRemove() {
    if (loading) return;

    if (!confirm(`Xóa ${getName(user)} khỏi danh sách bạn bè?`)) {
      return;
    }

    try {
      setLoading(true);

      await removeFriend(currentUser.uid, user.uid);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleMessage() {
    try {
      setLoading(true);

      const chatId = await createChat(
        currentUser.uid,
        user.uid
      );

      router.push(`/chat/${chatId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="
      group overflow-hidden rounded-3xl border
      bg-white dark:bg-slate-900
      border-slate-200 dark:border-slate-800
      shadow-sm
      transition-all duration-300
      hover:-translate-y-1 hover:shadow-xl
    ">

      {/* COVER */}
      <div className="h-24 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400" />

      {/* AVATAR */}
      <div className="flex justify-center -mt-12">

        <div className="relative">

          <Image
            src={user.avatar || "/default-avatar.png"}
            alt="avatar"
            width={96}
            height={96}
            className="
              w-24 h-24 rounded-full
              border-4 border-white dark:border-slate-900
              object-cover
            "
          />

          {user.online && (
            <span className="
              absolute bottom-1 right-1
              w-5 h-5 rounded-full
              border-2 border-white dark:border-slate-900
              bg-green-500
            " />
          )}

        </div>

      </div>

      {/* CONTENT */}
      <div className="px-6 pb-6">

        {/* NAME = EMAIL */}
        <h2 className="mt-3 text-center text-lg font-bold text-slate-900 dark:text-white">
          {getName(user)}
        </h2>

        {/* EMAIL */}
        <p className="text-center text-slate-500 text-sm">
          {user.email}
        </p>

        {/* INFO */}
        <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">

          {user.location && (
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              {user.location}
            </div>
          )}

          {user.school && (
            <div className="flex items-center gap-2">
              <GraduationCap size={16} />
              {user.school}
            </div>
          )}

        </div>

        {/* BUTTONS */}
        <div className="mt-6 flex gap-3">

          <button
            onClick={handleMessage}
            disabled={loading}
            className="
              flex-1 rounded-xl
              bg-blue-600 hover:bg-blue-700
              text-white font-semibold
              py-3 transition
              disabled:opacity-60
            "
          >
            <span className="flex items-center justify-center gap-2">
              <MessageCircle size={18} />
              Nhắn tin
            </span>
          </button>

          <button
            onClick={handleRemove}
            disabled={loading}
            className="
              rounded-xl border
              border-slate-200 dark:border-slate-800
              px-4
              text-slate-700 dark:text-slate-300
              hover:bg-red-50 dark:hover:bg-red-950/20
              hover:text-red-600
              transition
              disabled:opacity-60
            "
          >
            <UserMinus size={20} />
          </button>

        </div>

        {/* PROFILE */}
        <button
          onClick={() => router.push(`/profile/${user.uid}`)}
          className="
            mt-3 w-full rounded-xl border
            border-slate-200 dark:border-slate-800
            py-3 font-semibold
            text-slate-700 dark:text-slate-300
            hover:bg-slate-100 dark:hover:bg-slate-800
            transition
          "
        >
          Xem hồ sơ
        </button>

      </div>
    </div>
  );
}