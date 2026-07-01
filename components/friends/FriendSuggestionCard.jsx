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

export default function FriendSuggestionCard({
  user,
  currentUser,
}) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
      group
      relative
      overflow-hidden
      rounded-3xl
      bg-white
      border
      shadow-sm
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-2xl"
    >
      {/* Cover */}

      <div className="h-24 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />

      {/* Avatar */}

      <div className="relative flex justify-center -mt-12">

        <div className="relative">

          <Image
            src={
              user.avatar ||
              "/default-avatar.png"
            }
            alt=""
            width={96}
            height={96}
            className="
            h-24
            w-24
            rounded-full
            border-4
            border-white
            object-cover"
          />

          {user.online && (
            <span
              className="
              absolute
              bottom-1
              right-1
              h-5
              w-5
              rounded-full
              border-2
              border-white
              bg-green-500"
            />
          )}
        </div>
      </div>

      {/* Content */}

      <div className="px-6 pb-6">

        <h2 className="text-lg font-bold text-center mt-3">
          {user.displayName}
        </h2>

        <p className="text-center text-gray-500 text-sm">
          @{user.username}
        </p>

        {/* AI Match */}

        <div className="mt-5">

          <div className="flex justify-between text-sm">

            <span>AI Match</span>

            <span className="font-semibold text-blue-600">
              {user.score || 0}%
            </span>

          </div>

          <div className="mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">

            <div
              className="h-full bg-blue-500 transition-all duration-700"
              style={{
                width: `${user.score || 0}%`,
              }}
            />

          </div>

        </div>

        {/* Info */}

        <div className="mt-5 space-y-3 text-sm text-gray-600">

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

        {/* Button */}

        <button
          onClick={handleAddFriend}
          disabled={loading || sent}
          className={`
          mt-6
          w-full
          rounded-xl
          py-3
          font-semibold
          transition-all

          ${
            sent
              ? "bg-green-500 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }
          `}
        >
          {loading ? (
            "Đang gửi..."
          ) : sent ? (
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