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

export default function FriendCard({
  user,
  currentUser,
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleRemove() {
    if (
      !confirm(
        `Xóa ${user.displayName} khỏi danh sách bạn bè?`
      )
    )
      return;

    try {
      setLoading(true);

      await removeFriend(
        currentUser.uid,
        user.uid
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleMessage() {
    const chatId = await createChat(
      currentUser.uid,
      user.uid
    );

    router.push(`/chat/${chatId}`);
  }

  return (
    <div
      className="
      group
      overflow-hidden
      rounded-3xl
      border
      bg-white
      shadow-sm
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-xl"
    >
      {/* Cover */}

      <div className="h-24 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400" />

      {/* Avatar */}

      <div className="flex justify-center -mt-12">

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
            w-24
            h-24
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
              w-5
              h-5
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

        <h2 className="mt-3 text-center text-lg font-bold">
          {user.displayName}
        </h2>

        <p className="text-center text-gray-500">
          @{user.username}
        </p>

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

        </div>

        {/* Buttons */}

        <div className="mt-6 flex gap-3">

          <button
            onClick={handleMessage}
            className="
            flex-1
            rounded-xl
            bg-blue-600
            py-3
            text-white
            font-semibold
            transition
            hover:bg-blue-700"
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
            rounded-xl
            border
            px-4
            transition
            hover:bg-red-50
            hover:border-red-500
            hover:text-red-600"
          >
            <UserMinus size={20} />
          </button>

        </div>

        <button
          onClick={() =>
            router.push(`/profile/${user.uid}`)
          }
          className="
          mt-3
          w-full
          rounded-xl
          border
          py-3
          font-semibold
          transition
          hover:bg-gray-100"
        >
          Xem hồ sơ
        </button>

      </div>
    </div>
  );
}