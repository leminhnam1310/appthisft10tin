"use client";

import { useEffect, useMemo, useState } from "react";
import FriendCard from "@/components/friends/FriendCard";
import { auth } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

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

  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  // ======================
  // AUTH FIX (QUAN TRỌNG NHẤT)
  // ======================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return () => unsub();
  }, []);

  // ======================
  // LOAD USERS
  // ======================
  useEffect(() => {
    const unsub = listenUsers((list) => {
      setUsers(list || []);
    });

    return () => unsub();
  }, []);

  // ======================
  // LOAD FRIENDS
  // ======================
  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsub = listenFriends(currentUser.uid, (list) => {
      setFriends(list || []);
    });

    return () => unsub();
  }, [currentUser?.uid]);

  // ======================
  // LOAD SUGGESTIONS
  // ======================
  useEffect(() => {
    if (!currentUser?.uid) return;

    let mounted = true;

    getSuggestions(currentUser.uid).then((data) => {
      if (!mounted) return;

      setSuggestions(data || []);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [currentUser?.uid]);

  // ======================
  // SEARCH FILTER
  // ======================
  const filteredUsers = useMemo(() => {
    const key = search.toLowerCase();

    if (!currentUser?.uid) return [];

    return users.filter((u) => {
      if (u.uid === currentUser.uid) return false;

      return (
        u.displayName?.toLowerCase().includes(key) ||
        u.username?.toLowerCase().includes(key)
      );
    });
  }, [users, search, currentUser?.uid]);

  // ======================
  // LOADING STATES (FIX VERCEL STUCK)
  // ======================
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-gray-500">Đang xác thực...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-gray-500">Bạn chưa đăng nhập</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  // ======================
  // UI
  // ======================
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
              <FriendCard
                key={user.uid}
                user={user}
                currentUser={currentUser}
              />
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
                <FriendCard
                  key={user.uid}
                  user={user}
                  currentUser={currentUser}
                />
              ))
            )}
          </div>
        </section>

        {/* SEARCH */}
        {search && (
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-5">
              🔍 Kết quả tìm kiếm
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredUsers.map((user) => (
                <FriendCard
                  key={user.uid}
                  user={user}
                  currentUser={currentUser}
                />
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}