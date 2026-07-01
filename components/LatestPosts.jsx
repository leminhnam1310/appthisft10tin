"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function LatestPosts() {
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(3)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setPosts(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
      },
      (err) => {
        console.error("LatestPosts error:", err);
      }
    );

    return () => unsub();
  }, []);

  return (
    <div
      className="
        w-full max-w-md
        p-4 rounded-2xl
        bg-white/10 dark:bg-white/5
        border border-white/10
        backdrop-blur-md
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm opacity-70">
          🔥 Bài viết mới nhất
        </div>

        <button
          onClick={() => router.push("/posts")}
          className="text-xs opacity-60 hover:opacity-100 underline"
        >
          Xem tất cả
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {posts.length === 0 && (
          <div className="text-xs opacity-50">
            Chưa có bài viết
          </div>
        )}

        {posts.map((p) => (
          <div
            key={p.id}
            onClick={() => router.push("/posts")}
            className="
              cursor-pointer
              p-3 rounded-xl
              bg-black/10 dark:bg-white/5
              hover:bg-black/20 dark:hover:bg-white/10
              transition
            "
          >
            <div className="text-sm font-semibold line-clamp-1">
              {p.title || "No title"}
            </div>

            <div className="text-xs opacity-60 line-clamp-2 mt-1">
              {p.content || ""}
            </div>

            <div className="text-[10px] opacity-40 mt-2">
              #{p.tag || "general"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}