"use client";

import { useEffect, useMemo, useState } from "react";
import FriendCard from "@/components/FriendCard";
import { auth } from "@/app/lib/firebase";
import {
  listenUsers,
  listenFriends,
  getSuggestions,
} from "@/app/lib/friends";

export default function FriendsPage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const currentUser = auth.currentUser;

  // ======================
  // LOAD USERS
  // ======================
  useEffect(() => {
    const unsub = listenUsers((list) => {
      setUsers(list);
    });

    return () => unsub();
  }, []);

  // ======================
  // LOAD FRIENDS
  // ======================
  useEffect(() => {
    if (!currentUser) return;

    const unsub = listenFriends(currentUser.uid, (list) => {
      setFriends(list);
    });

    return () => unsub();
  }, [currentUser]);

  // ======================
  // LOAD SUGGESTIONS
  // ======================
  useEffect(() => {
    if (!currentUser) return;

    getSuggestions(currentUser.uid).then(setSuggestions);
  }, [currentUser]);

  // ======================
  // SEARCH FILTER
  // ======================
  const filteredUsers = useMemo(() => {
    const key = search.toLowerCase();

    return users.filter((u) => {
      if (!currentUser) return false;
      if (u.uid === currentUser.uid) return false;

      return (
        u.displayName?.toLowerCase().includes(key) ||
        u.username?.toLowerCase().includes(key)
      );
    });
  }, [users, search, currentUser]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">

      {/* HEADER */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto p-6">

          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            👥 Bạn bè
          </h1>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Tìm bạn bè..."
            className="
              mt-5 w-full p-4 rounded-2xl
              bg-white dark:bg-slate-900
              border border-slate-200 dark:border-slate-700
              text-slate-900 dark:text-white
              outline-none focus:ring-2 focus:ring-violet-500
            "
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-10">

        {/* SUGGESTIONS */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-5">
            ⭐ Gợi ý kết bạn
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {suggestions.map((user) => (
              <FriendCard key={user.uid} user={user} />
            ))}
          </div>
        </section>

        {/* FRIENDS */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-5">
            ❤️ Bạn bè
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {friends.length === 0 ? (
              <p className="text-slate-500">Chưa có bạn bè</p>
            ) : (
              friends.map((user) => (
                <FriendCard key={user.uid} user={user} />
              ))
            )}
          </div>
        </section>

        {/* SEARCH RESULT */}
        {search && (
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-5">
              🔍 Kết quả tìm kiếm
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredUsers.map((user) => (
                <FriendCard key={user.uid} user={user} />
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}