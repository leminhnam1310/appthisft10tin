"use client";

import { useEffect, useMemo, useState } from "react";
import { auth } from "@/app/lib/firebase";
import { listenUsers, sendFriendRequest } from "@/app/lib/friends";

export default function FriendSearch() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  // ==========================
  // AUTH LISTENER
  // ==========================
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setAuthReady(true);
    });

    return () => unsub();
  }, []);

  // ==========================
  // LOAD USERS
  // ==========================
  useEffect(() => {
    const unsub = listenUsers((list) => {
      setUsers(list || []);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // ==========================
  // FILTER USERS (FIXED)
  // ==========================
  const filteredUsers = useMemo(() => {
    const key = keyword.trim().toLowerCase();

    return users.filter((u) => {
      if (!u) return false;

      // chờ auth load xong mới filter chính xác
      if (!authReady) return false;

      // loại chính mình (fix cả uid/id mismatch)
      const userId = u.uid || u.id;
      const myId = currentUser?.uid;

      if (myId && userId === myId) return false;

      if (!key) return true;

      return (
        u.displayName?.toLowerCase().includes(key) ||
        u.username?.toLowerCase().includes(key)
      );
    });
  }, [users, keyword, currentUser, authReady]);

  // ==========================
  // SEND FRIEND REQUEST
  // ==========================
  async function handleAddFriend(user) {
    if (!currentUser) return;

    const targetUid = user.uid || user.id;

    try {
      await sendFriendRequest(currentUser.uid, targetUid);
      alert("Đã gửi lời mời 🎉");
    } catch (err) {
      console.error(err);
      alert("Không thể gửi lời mời.");
    }
  }

  // ==========================
  // UI
  // ==========================
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          🔍 Tìm bạn bè
        </h2>

        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Tìm kiếm theo tên hoặc username
        </p>

        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm kiếm..."
          className="
            mt-4 w-full p-3 rounded-xl
            border border-slate-300 dark:border-slate-700
            bg-white dark:bg-slate-800
            text-slate-900 dark:text-white
            outline-none
            focus:ring-2 focus:ring-violet-500
          "
        />
      </div>

      {/* LIST */}
      <div className="p-5 space-y-4">

        {!authReady && (
          <p className="text-center text-slate-500">
            Đang xác thực...
          </p>
        )}

        {authReady && loading && (
          <p className="text-center text-slate-500">
            Đang tải...
          </p>
        )}

        {authReady && !loading && filteredUsers.length === 0 && (
          <p className="text-center text-slate-500">
            Không tìm thấy người dùng.
          </p>
        )}

        {filteredUsers.map((user) => {
          const id = user.uid || user.id;

          return (
            <div
              key={id}
              className="
                flex items-center justify-between
                p-4 rounded-2xl
                border border-slate-200 dark:border-slate-800
                bg-white dark:bg-slate-900
                hover:bg-slate-50 dark:hover:bg-slate-800
                transition
              "
            >
              {/* LEFT */}
              <div className="flex items-center gap-4">

                <div className="
                  relative h-14 w-14 rounded-full overflow-hidden
                  bg-violet-500 flex items-center justify-center
                  text-white font-bold text-lg
                ">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user.displayName?.charAt(0)?.toUpperCase()
                  )}

                  {user.online && (
                    <span className="
                      absolute bottom-0 right-0
                      h-3 w-3 rounded-full
                      bg-green-500 border-2 border-white dark:border-slate-900
                    " />
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {user.displayName}
                  </h3>

                  <p className="text-sm text-violet-500">
                    @{user.username}
                  </p>

                  <p className="text-sm text-slate-500 line-clamp-1">
                    {user.bio || "Chưa có giới thiệu"}
                  </p>
                </div>

              </div>

              {/* RIGHT */}
              <button
                onClick={() => handleAddFriend(user)}
                className="
                  px-5 py-2.5 rounded-xl
                  bg-violet-600 hover:bg-violet-500
                  text-white transition
                "
              >
                + Kết bạn
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}