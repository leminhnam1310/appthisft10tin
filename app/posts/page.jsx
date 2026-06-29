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
  updateDoc,
  doc,
} from "firebase/firestore";

export default function PostsPage() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [commentInput, setCommentInput] = useState({});

  // ================= AUTH =================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // ================= REALTIME POSTS =================
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        setPosts(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) || []
        );
      },
      (err) => console.error("Firestore error:", err)
    );

    return () => unsub();
  }, []);

  // ================= CREATE POST =================
  const createPost = async () => {
    if (!authReady) return;
    if (!user) return alert("Bạn cần đăng nhập");

    if (!title.trim() || !content.trim() || !tag.trim()) {
      return alert("Thiếu dữ liệu");
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        tag: tag.toLowerCase(),

        uid: user.uid,
        authorName: user.displayName || "Guest",

        likes: [],
        comments: [],

        createdAt: serverTimestamp(),
      });

      setTitle("");
      setContent("");
      setTag("");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 1500);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi đăng bài");
    }

    setLoading(false);
  };

  // ================= LIKE =================
  const toggleLike = async (post) => {
    if (!user) return alert("Cần đăng nhập");

    const postRef = doc(db, "posts", post.id);

    const likes = post.likes || [];
    const liked = likes.includes(user.uid);

    await updateDoc(postRef, {
      likes: liked
        ? likes.filter((id) => id !== user.uid)
        : [...likes, user.uid],
    });
  };

  // ================= COMMENT =================
  const addComment = async (post) => {
    if (!user) return alert("Cần đăng nhập");

    const text = commentInput[post.id];
    if (!text?.trim()) return;

    const postRef = doc(db, "posts", post.id);

    await updateDoc(postRef, {
      comments: [
        ...(post.comments || []),
        {
          uid: user.uid,
          text,
          name: user.displayName || "User",
          time: Date.now(),
        },
      ],
    });

    setCommentInput((prev) => ({
      ...prev,
      [post.id]: "",
    }));
  };

  // ================= FILTER =================
  const filteredPosts = useMemo(() => {
    const k = search.toLowerCase();

    return (posts || []).filter(
      (p) =>
        (p.title || "").toLowerCase().includes(k) ||
        (p.content || "").toLowerCase().includes(k) ||
        (p.tag || "").toLowerCase().includes(k)
    );
  }, [search, posts]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-black dark:text-white">

      {/* SEARCH */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur p-4 border-b">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Tìm bài viết..."
          className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 p-6 max-w-6xl mx-auto">

        {/* CREATE POST */}
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
            placeholder="tag"
            className="w-full p-3 rounded-xl bg-white dark:bg-slate-800"
          />

          <button
            onClick={createPost}
            disabled={loading}
            className="w-full p-3 rounded-xl bg-violet-600 text-white"
          >
            {loading ? "Đang đăng..." : success ? "OK ✅" : "Đăng bài"}
          </button>
        </div>

        {/* FEED */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">🔥 Feed</h2>

          {filteredPosts.length === 0 ? (
            <p className="text-slate-500">Chưa có bài viết</p>
          ) : (
            filteredPosts.map((p) => (
              <div key={p.id} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900">

                <h3 className="font-bold">{p.title}</h3>
                <p className="text-sm mt-1 opacity-80">{p.content}</p>

                {/* LIKE */}
                <div className="mt-3 flex gap-3 items-center">
                  <button
                    onClick={() => toggleLike(p)}
                    className="text-sm px-3 py-1 rounded-full bg-pink-500 text-white"
                  >
                    ❤️ {p.likes?.length || 0}
                  </button>

                  <span className="text-xs opacity-60">
                    👤 {p.authorName}
                  </span>
                </div>

                {/* COMMENTS */}
                <div className="mt-3 space-y-2">

                  {(p.comments || []).slice(-3).map((c, i) => (
                    <div key={i} className="text-xs bg-white/20 p-2 rounded">
                      <b>{c.name}:</b> {c.text}
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <input
                      value={commentInput[p.id] || ""}
                      onChange={(e) =>
                        setCommentInput((prev) => ({
                          ...prev,
                          [p.id]: e.target.value,
                        }))
                      }
                      placeholder="comment..."
                      className="flex-1 p-2 rounded bg-white dark:bg-slate-800 text-sm"
                    />

                    <button
                      onClick={() => addComment(p)}
                      className="px-3 bg-violet-600 text-white rounded"
                    >
                      Gửi
                    </button>
                  </div>

                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}