"use client";

import { useEffect, useMemo, useState } from "react";
import { auth } from "@/app/lib/firebase";

import {
  listenUsers,
  sendFriendRequest,
} from "@/app/lib/friends";

export default function FriendSearch() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  const currentUser = auth.currentUser;

  // ==========================
  // Load Users
  // ==========================

  useEffect(() => {
    const unsub = listenUsers((list) => {
      setUsers(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // ==========================
  // Search
  // ==========================

  const filteredUsers = useMemo(() => {
    const key = keyword.trim().toLowerCase();

    return users.filter((u) => {
      if (!currentUser) return false;

      if (u.uid === currentUser.uid) return false;

      return (
        u.displayName
          ?.toLowerCase()
          .includes(key) ||
        u.username
          ?.toLowerCase()
          .includes(key)
      );
    });
  }, [users, keyword, currentUser]);

  // ==========================
  // Friend Request
  // ==========================

  async function handleAddFriend(user) {
    try {
      await sendFriendRequest(
        currentUser.uid,
        user.uid
      );

      alert(
        "Đã gửi lời mời kết bạn 🎉"
      );
    } catch (err) {
      console.error(err);

      alert("Không thể gửi.");
    }
  }

  return (
    <div
      className="
      rounded-3xl
      bg-white
      dark:bg-slate-900
      border
      border-slate-200
      dark:border-slate-800
      shadow-sm
      "
    >
      {/* Header */}

      <div className="p-6 border-b border-slate-200 dark:border-slate-800">

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          🔍 Tìm bạn bè
        </h2>

        <p className="mt-1 text-slate-500">
          Tìm kiếm theo tên hoặc username
        </p>

        <input
          value={keyword}
          onChange={(e) =>
            setKeyword(e.target.value)
          }
          placeholder="Tìm kiếm..."
          className="
          mt-5
          w-full
          rounded-2xl
          border
          border-slate-200
          dark:border-slate-700
          bg-slate-50
          dark:bg-slate-800
          px-5
          py-3
          outline-none
          focus:ring-2
          focus:ring-violet-500
          text-slate-900
          dark:text-white
          "
        />

      </div>

      {/* List */}

      <div className="p-5">

        {loading && (
          <div className="text-center py-10 text-slate-500">
            Đang tải...
          </div>
        )}

        {!loading &&
          filteredUsers.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              Không tìm thấy người dùng.
            </div>
          )}

        <div className="space-y-4">

          {filteredUsers.map((user) => (
            <div
              key={user.uid}
              className="
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-slate-200
              dark:border-slate-800
              p-4
              hover:bg-slate-50
              dark:hover:bg-slate-800
              transition
              "
            >
              {/* Left */}

              <div className="flex items-center gap-4">

                <div
                  className="
                  relative
                  h-14
                  w-14
                  rounded-full
                  overflow-hidden
                  bg-violet-500
                  flex
                  items-center
                  justify-center
                  text-white
                  font-bold
                  text-lg
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

              <button
                onClick={() =>
                  handleAddFriend(user)
                }
                className="
                rounded-xl
                bg-violet-600
                hover:bg-violet-500
                px-5
                py-2.5
                text-white
                transition
                "
              >
                + Kết bạn
              </button>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}