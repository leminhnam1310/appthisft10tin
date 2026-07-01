"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Search,
  UserPlus,
  Loader2,
} from "lucide-react";

import {
  searchUsers,
  sendFriendRequest,
} from "@/app/lib/friends";

export default function FriendSearch({
  currentUser,
}) {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!keyword.trim()) {
      setUsers([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const result =
          await searchUsers(keyword);

        setUsers(
          result.filter(
            (u) => u.uid !== currentUser.uid
          )
        );
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [keyword, currentUser.uid]);

  async function addFriend(uid) {
    try {
      await sendFriendRequest(
        currentUser.uid,
        uid
      );
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="space-y-5">

      {/* Search */}

      <div className="relative">

        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />

        <input
          value={keyword}
          onChange={(e) =>
            setKeyword(e.target.value)
          }
          placeholder="Tìm kiếm bạn bè..."
          className="
          w-full
          rounded-2xl
          border
          bg-white
          py-4
          pl-12
          pr-4
          outline-none
          transition
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-200"
        />

      </div>

      {/* Loading */}

      {loading && (
        <div className="flex justify-center py-10">

          <Loader2
            className="animate-spin text-blue-500"
            size={28}
          />

        </div>
      )}

      {/* Empty */}

      {!loading &&
        keyword &&
        users.length === 0 && (
          <div className="rounded-2xl bg-white border p-8 text-center">

            <h3 className="font-semibold">
              Không tìm thấy người dùng
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Hãy thử từ khóa khác.
            </p>

          </div>
        )}

      {/* Result */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        {users.map((user) => (

          <div
            key={user.uid}
            className="
            overflow-hidden
            rounded-3xl
            border
            bg-white
            shadow-sm
            hover:shadow-xl
            transition"
          >
            {/* Cover */}

            <div className="h-20 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />

            {/* Avatar */}

            <div className="flex justify-center -mt-10">

              <div className="relative">

                <Image
                  src={
                    user.avatar ||
                    "/default-avatar.png"
                  }
                  alt=""
                  width={80}
                  height={80}
                  className="
                  rounded-full
                  border-4
                  border-white
                  object-cover
                  h-20
                  w-20"
                />

                {user.online && (
                  <span
                    className="
                    absolute
                    bottom-1
                    right-1
                    h-4
                    w-4
                    rounded-full
                    border-2
                    border-white
                    bg-green-500"
                  />
                )}

              </div>

            </div>

            {/* Info */}

            <div className="p-5">

              <h2 className="text-center font-bold">
                {user.displayName}
              </h2>

              <p className="text-center text-gray-500 text-sm">
                @{user.username}
              </p>

              {user.bio && (
                <p className="mt-3 text-center text-sm text-gray-500 line-clamp-2">
                  {user.bio}
                </p>
              )}

              {/* Score */}

              <div className="mt-5">

                <div className="flex justify-between text-sm">

                  <span>AI Match</span>

                  <span className="font-semibold text-blue-600">
                    {user.score || 0}%
                  </span>

                </div>

                <div className="mt-2 h-2 rounded-full bg-gray-200">

                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: `${
                        user.score || 0
                      }%`,
                    }}
                  />

                </div>

              </div>

              {/* Buttons */}

              <div className="mt-6 flex gap-3">

                <button
                  onClick={() =>
                    router.push(
                      `/profile/${user.uid}`
                    )
                  }
                  className="
                  flex-1
                  rounded-xl
                  border
                  py-3
                  hover:bg-gray-100
                  transition"
                >
                  Hồ sơ
                </button>

                <button
                  onClick={() =>
                    addFriend(user.uid)
                  }
                  className="
                  flex
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-600
                  px-5
                  text-white
                  hover:bg-blue-700
                  transition"
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