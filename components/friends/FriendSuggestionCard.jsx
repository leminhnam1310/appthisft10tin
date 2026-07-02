"use client";

import { useState } from "react";
import Image from "next/image";
import {
  UserPlus,
  MapPin,
  GraduationCap,
  Users,
  Check,
} from "lucide-react";

import { sendFriendRequest } from "@/app/lib/friends";

// ======================
// NAME = EMAIL BASED
// ======================
const getName = (user) => {
  if (!user?.email) return "";

  return user.email.split("@")[0];
};

const getEmail = (user) => {
  return user?.email || "";
};

export default function FriendSuggestionCard({
  user,
  currentUser,
}) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // ======================
  // HARD FILTER (EMAIL ONLY SYSTEM)
  // ======================
  if (!user || !user.uid || !currentUser) return null;

  if (user.uid === currentUser.uid) return null;

  // ❌ CHỈ CHO USER CÓ EMAIL
  if (!user.email || !user.email.includes("@")) {
    return null;
  }

  async function handleAddFriend() {
    if (loading || sent) return;

    try {
      setLoading(true);

      await sendFriendRequest(
        currentUser.uid,
        user.uid
      );

      setSent(true);
    } catch (err) {
      console.log("Friend request error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="
      group relative overflow-hidden rounded-3xl
      bg-white dark:bg-slate-900
      border border-slate-200 dark:border-slate-800
      shadow-sm
      transition-all duration-300
      hover:-translate-y-1 hover:shadow-xl
    ">

      {/* COVER */}
      <div className="h-24 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />

      {/* AVATAR */}
      <div className="relative flex justify-center -mt-12">

        <div className="relative">

          <Image
            src={user.photoURL || user.avatar || "/default-avatar.png"}
            alt="avatar"
            width={96}
            height={96}
            className="h-24 w-24 rounded-full border-4 border-white dark:border-slate-900 object-cover"
          />

          {user.online && (
            <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white dark:border-slate-900 bg-green-500" />
          )}

        </div>
      </div>

      {/* CONTENT */}
      <div className="px-6 pb-6">

        {/* NAME = EMAIL PREFIX */}
        <h2 className="text-lg font-bold text-center mt-3 text-slate-900 dark:text-slate-100">
          {getName(user)}
        </h2>

        {/* EMAIL */}
        <p className="text-center text-slate-500 text-sm">
          {getEmail(user)}
        </p>

        {/* AI SCORE */}
        <div className="mt-5">
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
            <span>AI Match</span>
            <span className="font-semibold text-blue-500">
              {user.score || 0}%
            </span>
          </div>

          <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${user.score || 0}%` }}
            />
          </div>
        </div>

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

          <div className="flex items-center gap-2">
            <Users size={16} />
            {user.mutualFriends || 0} bạn chung
          </div>

        </div>

        {/* BUTTON */}
        <button
          onClick={handleAddFriend}
          disabled={loading || sent}
          className={`
            mt-6 w-full rounded-xl py-3 font-semibold
            transition-all
            ${sent
              ? "bg-green-500 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"}
          `}
        >
          {loading ? "Đang gửi..." : sent ? (
            <span className="flex items-center justify-center gap-2">
              <Check size={18} />
              Đã gửi
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <UserPlus size={18} />
              Kết bạn
            </span>
          )}
        </button>

      </div>
    </div>
  );
}