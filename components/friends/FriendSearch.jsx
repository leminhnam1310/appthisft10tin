"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, UserPlus, Loader2 } from "lucide-react";

import {
  searchUsers,
  sendFriendRequest,
} from "@/app/lib/friends";

export default function FriendSearch({ currentUser }) {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  // ======================
  // DEBOUNCE SEARCH
  // ======================
  useEffect(() => {
    if (!keyword.trim()) {
      setUsers([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const result = await searchUsers(keyword);

        const filtered = (result || [])
          .filter((u) => u?.uid !== currentUser?.uid)
          .filter((u) => u?.email && u.email.includes("@"));

        setUsers(filtered);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [keyword, currentUser?.uid]);

  // ======================
  // ADD FRIEND
  // ======================
  async function addFriend(uid) {
    if (!currentUser?.uid) return;

    try {
      await sendFriendRequest(currentUser.uid, uid);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="space-y-5">

      {/* SEARCH INPUT */}
      <div className="relative">

        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />

        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm kiếm bạn bè..."
          className="
            w-full rounded-2xl border
            bg-white dark:bg-slate-900
            border-slate-200 dark:border-slate-800
            py-4 pl-12 pr-4
            text-slate-900 dark:text-slate-100
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2 focus:ring-blue-500/20
          "
        />
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-blue-500" size={28} />
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && keyword && users.length === 0 && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Không tìm thấy người dùng
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            Hãy thử từ khóa khác.
          </p>
        </div>
      )}

      {/* RESULTS */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        {users.map((user) => (
          <div
            key={user.uid}
            className="
              overflow-hidden rounded-3xl border
              bg-white dark:bg-slate-900
              border-slate-200 dark:border-slate-800
              shadow-sm
              hover:shadow-xl
              transition-all duration-300
            "
          >

            {/* COVER */}
            <div className="h-20 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />

            {/* AVATAR */}
            <div className="flex justify-center -mt-10">
              <div className="relative">

                <Image
                  src={user.avatar || "/default-avatar.png"}
                  alt="avatar"
                  width={80}
                  height={80}
                  className="
                    h-20 w-20 rounded-full
                    border-4 border-white dark:border-slate-900
                    object-cover
                  "
                />

                {user.online && (
                  <span className="
                    absolute bottom-1 right-1
                    h-4 w-4 rounded-full
                    border-2 border-white dark:border-slate-900
                    bg-green-500
                  " />
                )}

              </div>
            </div>

            {/* INFO */}
            <div className="p-5">

              <h2 className="text-center font-bold text-slate-900 dark:text-white">
                {user.email?.split("@")[0]}
              </h2>

              <p className="text-center text-slate-500 text-sm">
                {user.email}
              </p>

              {user.bio && (
                <p className="mt-3 text-center text-sm text-slate-500 line-clamp-2">
                  {user.bio}
                </p>
              )}

              {/* SCORE */}
              <div className="mt-5">

                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                  <span>AI Match</span>
                  <span className="font-semibold text-blue-500">
                    {user.score || 0}%
                  </span>
                </div>

                <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${user.score || 0}%` }}
                  />
                </div>

              </div>

              {/* BUTTONS */}
              <div className="mt-6 flex gap-3">

                <button
                  onClick={() =>
                    router.push(`/profile/${user.uid}`)
                  }
                  className="
                    flex-1 rounded-xl border
                    border-slate-200 dark:border-slate-800
                    py-3
                    text-slate-900 dark:text-white
                    hover:bg-slate-100 dark:hover:bg-slate-800
                    transition
                  "
                >
                  Hồ sơ
                </button>

                <button
                  onClick={() => addFriend(user.uid)}
                  className="
                    flex items-center justify-center
                    rounded-xl bg-blue-600 px-5
                    text-white hover:bg-blue-700
                    transition
                  "
                >
                  <UserPlus size={18} />
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}