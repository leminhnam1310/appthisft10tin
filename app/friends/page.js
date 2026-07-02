"use client";

import { useEffect, useState } from "react";
import FriendCard from "@/components/friends/FriendCard";
import { auth } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import {
  listenFriends,
  getSuggestions,
  searchUsers,
} from "@/app/lib/friends";

/* =========================
   SAFE USER FILTER (IMPORTANT)
========================= */
const isValidUser = (u) => {
  if (!u) return false;
  if (!u.uid) return false;
  if (!u.email) return false;
  if (u.displayName === "Unknown") return false;
  if (u.displayName === "Guest") return false;
  return true;
};

export default function FriendsPage() {
  const [search, setSearch] = useState("");

  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  // AUTH
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return () => unsub();
  }, []);

  // FRIENDS
  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsub = listenFriends(currentUser.uid, (list) => {
      setFriends((list || []).filter(isValidUser));
    });

    return () => unsub();
  }, [currentUser?.uid]);

  // SUGGESTIONS
  useEffect(() => {
    if (!currentUser?.uid) return;

    let mounted = true;

    getSuggestions(currentUser.uid).then((data) => {
      if (!mounted) return;

      setSuggestions((data || []).filter(isValidUser));
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [currentUser?.uid]);

  // SEARCH (FIXED)
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await searchUsers(search, currentUser?.uid);

        setSearchResults(
          (res || []).filter(isValidUser)
        );
      } catch (err) {
        console.log(err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, currentUser?.uid]);

  // LOADING
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
        Đang xác thực...
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
        Bạn chưa đăng nhập
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
        Đang tải dữ liệu...
      </div>
    );
  }

  // UI
  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">

      <div className="sticky top-0 z-30 backdrop-blur border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/70">
        <div className="max-w-7xl mx-auto p-6">

          <h1 className="text-3xl font-bold">👥 Bạn bè</h1>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Tìm bạn bè..."
            className="mt-5 w-full p-4 rounded-2xl
              bg-white dark:bg-slate-900
              border border-slate-200 dark:border-slate-800
              outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-12">

        {/* SEARCH */}
        {search.trim() && (
          <section>
            <h2 className="text-xl font-semibold mb-4">🔍 Kết quả tìm kiếm</h2>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {searchResults.map((user) => (
                <FriendCard
                  key={user.uid}
                  user={user}
                  currentUser={currentUser}
                />
              ))}
            </div>
          </section>
        )}

        {/* SUGGESTIONS */}
        <section>
          <h2 className="text-xl font-semibold mb-4">⭐ Gợi ý kết bạn</h2>

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
          <h2 className="text-xl font-semibold mb-4">❤️ Bạn bè</h2>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {friends.map((user) => (
              <FriendCard
                key={user.uid}
                user={user}
                currentUser={currentUser}
              />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}