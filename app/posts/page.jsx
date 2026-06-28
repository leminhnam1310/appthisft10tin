"use client";

import { useEffect, useMemo, useState } from "react";
import { auth, db } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

export default function PostsPage() {
  const [user, setUser] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ================= AUTH SAFE =================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
    });
    return () => unsub();
  }, []);

  // ================= REALTIME FEED (FIX F5 BUG) =================
  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
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
        console.error("Firestore error:", err);
      }
    );

    return () => unsub();
  }, []);

  // ================= CREATE POST =================
  const createPost = async () => {
    if (!user) return alert("Bạn cần đăng nhập");

    if (!title.trim() || !content.trim() || !tag.trim()) {
      return alert("Thiếu dữ liệu");
    }

    setLoading(true);
    setSuccess(false);

    try {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        tag: tag.toLowerCase(),
        uid: user.uid,
        authorName: user.displayName || "Guest",
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setContent("");
      setTag("");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi đăng bài");
    }

    setLoading(false);
  };

  // ================= SEARCH FILTER =================
  const filteredPosts = useMemo(() => {
    const k = search.toLowerCase();

    return posts.filter((p) =>
      (p.title || "").toLowerCase().includes(k) ||
      (p.content || "").toLowerCase().includes(k) ||
      (p.tag || "").toLowerCase().includes(k)
    );
  }, [search, posts]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-black dark:text-white">

      {/* ================= SEARCH ================= */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur p-4 border-b border-slate-200 dark:border-slate-800">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Tìm bài viết / tag..."
          className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-6xl mx-auto">

        {/* ================= CREATE POST ================= */}
        <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-900 space-y-3">
          <h2 className="text-xl font-bold">📝 Viết bài</h2>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tiêu đề"
            className="w-full p-3 rounded-xl bg-white dark:bg-slate-800"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nội dung..."
            className="w-full h-32 p-3 rounded-xl bg-white dark:bg-slate-800"
          />

          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="tag (vd: happy)"
            className="w-full p-3 rounded-xl bg-white dark:bg-slate-800"
          />

          <button
            onClick={createPost}
            disabled={loading}
            className={`w-full p-3 rounded-xl text-white transition ${
              loading
                ? "bg-gray-500"
                : "bg-violet-600 hover:bg-violet-500"
            }`}
          >
            {loading
              ? "Đang đăng..."
              : success
              ? "Đăng thành công ✅"
              : "Đăng bài"}
          </button>
        </div>

        {/* ================= FEED ================= */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">🔥 Feed</h2>

          {filteredPosts.length === 0 ? (
            <p className="text-slate-500">Chưa có bài viết</p>
          ) : (
            filteredPosts.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900"
              >
                <h3 className="font-bold text-lg">{p.title}</h3>

                <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">
                  {p.content}
                </p>

                <div className="mt-3 flex gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded-full bg-violet-500 text-white">
                    #{p.tag}
                  </span>

                  <span className="text-xs text-slate-500">
                    👤 {p.authorName}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}