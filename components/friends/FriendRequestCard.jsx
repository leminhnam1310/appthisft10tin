"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Check,
  X,
  MapPin,
  Users,
} from "lucide-react";

import {
  acceptFriendRequest,
  declineFriendRequest,
} from "@/app/lib/friends";

export default function FriendRequestCard({
  request,
  currentUser,
}) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("pending");

  async function accept() {
    if (loading) return;

    try {
      setLoading(true);

      await acceptFriendRequest({
        id: request.id,
        fromUid: request.fromUid,
        toUid: currentUser.uid,
      });

      setStatus("accepted");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function decline() {
    if (loading) return;

    try {
      setLoading(true);

      await declineFriendRequest(request.id);

      setStatus("declined");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (status === "accepted") {
    return (
      <div className="rounded-3xl border bg-green-50 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
          <Check className="text-white" size={30} />
        </div>

        <h3 className="mt-4 text-lg font-bold text-green-700">
          Đã trở thành bạn bè
        </h3>
      </div>
    );
  }

  if (status === "declined") {
    return (
      <div className="rounded-3xl border bg-red-50 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500">
          <X className="text-white" size={30} />
        </div>

        <h3 className="mt-4 text-lg font-bold text-red-700">
          Đã từ chối lời mời
        </h3>
      </div>
    );
  }

  return (
    <div
      className="
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

      <div className="h-24 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />

      {/* Avatar */}

      <div className="flex justify-center -mt-12">
        <div className="relative">

          <Image
            src={
              request.avatar ||
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

          {request.online && (
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

        <h2 className="mt-3 text-center text-lg font-bold">
          {request.displayName}
        </h2>

        <p className="text-center text-gray-500">
          @{request.username}
        </p>

        {request.bio && (
          <p className="mt-3 text-center text-sm text-gray-500 line-clamp-2">
            {request.bio}
          </p>
        )}

        <div className="mt-5 space-y-3 text-sm text-gray-600">

          {request.location && (
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              {request.location}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Users size={16} />
            {request.mutualFriends || 0} bạn chung
          </div>

        </div>

        <div className="mt-6 flex gap-3">

          <button
            onClick={accept}
            disabled={loading}
            className="
            flex-1
            rounded-xl
            bg-blue-600
            py-3
            font-semibold
            text-white
            transition
            hover:bg-blue-700
            disabled:opacity-60"
          >
            {loading
              ? "Đang xử lý..."
              : "Chấp nhận"}
          </button>

          <button
            onClick={decline}
            disabled={loading}
            className="
            flex-1
            rounded-xl
            border
            py-3
            font-semibold
            transition
            hover:bg-gray-100
            disabled:opacity-60"
          >
            Xóa
          </button>

        </div>

      </div>

    </div>
  );
}