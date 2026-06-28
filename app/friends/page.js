"use client";

import { useMemo, useState } from "react";
import FriendCard from "@/components/FriendCard";

const demoUsers = [
  {
    uid: "1",
    displayName: "Minh Nam",
    username: "minhnam",
    bio: "AI Developer • Love coding 🤖",
    location: "TP.VT",
    friendCount: 0,
    postCount: 0,
  },
];

export default function FriendsPage() {
  const [search, setSearch] = useState("");

  const users = useMemo(() => {
    const keyword = search.toLowerCase();

    return demoUsers.filter(
      (u) =>
        u.displayName.toLowerCase().includes(keyword) ||
        u.username.toLowerCase().includes(keyword)
    );
  }, [search]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">

      {/* HEADER */}

      <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800">

        <div className="max-w-7xl mx-auto p-6">

          <div className="flex flex-col lg:flex-row justify-between gap-5">

            <div>

              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                👥 Bạn bè
              </h1>

              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Tìm kiếm, kết bạn và trò chuyện với mọi người.
              </p>

            </div>

            <div className="flex gap-3">

              <button
                className="
                px-5
                py-3
                rounded-2xl
                bg-violet-600
                hover:bg-violet-500
                text-white
                transition
                "
              >
                ➕ Tạo nhóm
              </button>

              <button
                className="
                px-5
                py-3
                rounded-2xl
                bg-white
                dark:bg-slate-900
                border
                border-slate-200
                dark:border-slate-700
                hover:bg-slate-100
                dark:hover:bg-slate-800
                transition
                text-slate-800
                dark:text-white
                "
              >
                💬 Tin nhắn
              </button>

            </div>

          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Tìm theo tên hoặc @username..."
            className="
            mt-6
            w-full
            rounded-2xl
            px-5
            py-4
            bg-white
            dark:bg-slate-900
            border
            border-slate-200
            dark:border-slate-700
            text-slate-900
            dark:text-white
            placeholder:text-slate-400
            outline-none
            focus:ring-2
            focus:ring-violet-500
            transition
            "
          />

        </div>

      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-10">

        {/* REQUEST */}

        <section>

          <div className="flex items-center justify-between mb-5">

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              📩 Lời mời kết bạn
            </h2>

            <span className="text-sm text-slate-500">
              0 lời mời
            </span>

          </div>

          <div
            className="
            rounded-3xl
            border
            border-dashed
            border-slate-300
            dark:border-slate-700
            bg-white
            dark:bg-slate-900
            p-10
            text-center
            "
          >
            <p className="text-slate-500 dark:text-slate-400">
              Hiện chưa có lời mời kết bạn.
            </p>
          </div>

        </section>

        {/* PEOPLE */}

        <section>

          <div className="flex items-center justify-between mb-5">

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              ⭐ Có thể bạn biết
            </h2>

            <span className="text-sm text-slate-500">
              {users.length} người
            </span>

          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {users.map((user) => (
              <FriendCard
                key={user.uid}
                user={user}
              />
            ))}
          </div>

        </section>

        {/* FRIENDS */}

        <section>

          <div className="flex items-center justify-between mb-5">

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              ❤️ Bạn bè
            </h2>

            <span className="text-sm text-slate-500">
              {users.length} người
            </span>

          </div>

          {users.length === 0 ? (
            <div
              className="
              rounded-3xl
              border
              border-dashed
              border-slate-300
              dark:border-slate-700
              bg-white
              dark:bg-slate-900
              p-12
              text-center
              "
            >
              <p className="text-slate-500 dark:text-slate-400">
                Không tìm thấy người dùng.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {users.map((user) => (
                <FriendCard
                  key={user.uid}
                  user={user}
                />
              ))}
            </div>
          )}

        </section>

      </div>

    </main>
  );
}