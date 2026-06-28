"use client";

import { useEffect, useState } from "react";
import { auth } from "@/app/lib/firebase";

import {
  listenFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  getProfile,
} from "@/app/lib/friends";

export default function FriendRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load requests
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsub = listenFriendRequests(user.uid, async (list) => {
      const result = await Promise.all(
        list.map(async (req) => {
          const profile = await getProfile(req.fromUid);

          return {
            ...req,
            profile,
          };
        })
      );

      setRequests(result);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Accept
  async function handleAccept(request) {
    try {
      await acceptFriendRequest(request);

      alert("🎉 Đã trở thành bạn bè!");
    } catch (err) {
      console.error(err);
      alert("Không thể chấp nhận.");
    }
  }

  // Decline
  async function handleDecline(id) {
    try {
      await declineFriendRequest(id);

      alert("Đã từ chối.");
    } catch (err) {
      console.error(err);
      alert("Không thể từ chối.");
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
      "
    >
      {/* Header */}

      <div className="border-b border-slate-200 dark:border-slate-800 p-6">

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          📩 Lời mời kết bạn
        </h2>

        <p className="mt-1 text-slate-500">
          {requests.length} lời mời đang chờ
        </p>

      </div>

      {/* Loading */}

      {loading && (
        <div className="p-8 text-center text-slate-500">
          Đang tải...
        </div>
      )}

      {/* Empty */}

      {!loading && requests.length === 0 && (
        <div className="p-10 text-center text-slate-500">
          Bạn chưa có lời mời kết bạn.
        </div>
      )}

      {/* Requests */}

      <div className="divide-y divide-slate-200 dark:divide-slate-800">

        {requests.map((request) => {
          const user = request.profile;

          if (!user) return null;

          return (
            <div
              key={request.id}
              className="
              flex
              items-center
              justify-between
              p-5
              hover:bg-slate-50
              dark:hover:bg-slate-800
              transition
              "
            >
              {/* Left */}

              <div className="flex items-center gap-4">

                <div className="relative">

                  <div
                    className="
                    h-14
                    w-14
                    rounded-full
                    overflow-hidden
                    bg-violet-600
                    flex
                    items-center
                    justify-center
                    text-white
                    font-bold
                    "
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      user.displayName
                        ?.charAt(0)
                        ?.toUpperCase()
                    )}
                  </div>

                  {user.online && (
                    <span
                      className="
                      absolute
                      bottom-0
                      right-0
                      h-3
                      w-3
                      rounded-full
                      bg-green-500
                      border-2
                      border-white
                      dark:border-slate-900
                      "
                    />
                  )}

                </div>

                <div>

                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {user.displayName}
                  </h3>

                  <p className="text-sm text-violet-500">
                    @{user.username}
                  </p>

                  <p className="mt-1 text-sm text-slate-500 line-clamp-1">
                    {user.bio || "Chưa có giới thiệu"}
                  </p>

                </div>

              </div>

              {/* Right */}

              <div className="flex gap-2">

                <button
                  onClick={() =>
                    handleAccept(request)
                  }
                  className="
                  rounded-xl
                  bg-violet-600
                  hover:bg-violet-500
                  px-4
                  py-2
                  text-white
                  transition
                  "
                >
                  Chấp nhận
                </button>

                <button
                  onClick={() =>
                    handleDecline(request.id)
                  }
                  className="
                  rounded-xl
                  border
                  border-slate-300
                  dark:border-slate-700
                  px-4
                  py-2
                  hover:bg-slate-100
                  dark:hover:bg-slate-800
                  transition
                  "
                >
                  Từ chối
                </button>

              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}