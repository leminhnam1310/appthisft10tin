"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  MessageCircle,
  Music,
  BookOpen,
  Heart,
  Gamepad2,
  LogIn,
  MoreHorizontal,
  BarChart3,
  Users,
  Globe,
  Settings,
  PenSquare,
} from "lucide-react";

import {
  loginWithGoogle,
  loginAsGuest,
  logout,
} from "@/app/lib/auth";

import { auth } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Sidebar() {
  const pathname = usePathname();

  const [openMenu, setOpenMenu] = useState(false);
  const [user, setUser] = useState(null);

  const menuRef = useRef(null);

  const uid = user?.uid || null;

  /* ================= AUTH ================= */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });

    return () => unsubscribe();
  }, []);

  /* ================= CLOSE OUTSIDE ================= */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const isActive = (path) => pathname === path;

  const linkClass = (active) =>
    `flex items-center gap-2 transition px-3 py-2 rounded-xl ${
      active
        ? "bg-violet-500/20 text-violet-500"
        : "hover:text-violet-500"
    }`;

  return (
    <header className="
      sticky top-0 z-50
      bg-white/80 dark:bg-black/70
      backdrop-blur-xl
      border-b border-slate-300 dark:border-white/10
    ">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* LOGO */}
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-black">11TIN</h1>
          <span className="text-slate-500 dark:text-white/60">
            Psychological Care
          </span>
        </div>

        {/* NAV */}
        <nav className="flex items-center gap-6">

          <Link href="/" className={linkClass(isActive("/"))}>
            <Home size={18} /> Trang chủ
          </Link>

          <Link href="/chat" className={linkClass(isActive("/chat"))}>
            <MessageCircle size={18} /> Trò chuyện
          </Link>

          <Link href="/music" className={linkClass(isActive("/music"))}>
            <Music size={18} /> Thư giãn
          </Link>

          <Link href="/entertainment" className={linkClass(isActive("/entertainment"))}>
            <Gamepad2 size={18} /> Giải trí
          </Link>

          <Link href="/journal" className={linkClass(isActive("/journal"))}>
            <BookOpen size={18} /> Nhật ký
          </Link>

          <Link href="/posts" className={linkClass(isActive("/posts"))}>
            <PenSquare size={18} /> Bài viết
          </Link>

          <Link href="/moods" className={linkClass(isActive("/moods"))}>
            <Heart size={18} /> Mood
          </Link>

          {/* MORE MENU */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu((v) => !v);
              }}
              className="hover:text-violet-500 transition"
            >
              <MoreHorizontal size={22} />
            </button>

            {openMenu && (
              <div className="
                absolute right-0 top-12
                w-56
                bg-white dark:bg-slate-900
                border border-slate-200 dark:border-white/10
                rounded-2xl
                shadow-xl
                overflow-hidden
              ">

                {/* PROFILE (FIX SAFE) */}
                {uid && (
                  <Link
                    href={`/profile/${uid}`}
                    onClick={() => setOpenMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/10"
                  >
                    👤 Hồ sơ của tôi
                  </Link>
                )}

                <Link
                  href="/statistics"
                  onClick={() => setOpenMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <BarChart3 size={18} /> Thống kê
                </Link>

                <Link
                  href="/friends"
                  onClick={() => setOpenMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <Users size={18} /> Bạn bè
                </Link>

                <Link
                  href="/community"
                  onClick={() => setOpenMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <Globe size={18} /> Cộng đồng
                </Link>

                <Link
                  href="/achievements"
                  onClick={() => setOpenMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  🏆 Thành tựu
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setOpenMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <Settings size={18} /> Cài đặt
                </Link>

              </div>
            )}
          </div>

          {/* AUTH */}
          <div className="flex items-center gap-3">

            {!user ? (
              <>
                <button
                  onClick={async () => {
                    try {
                      await loginWithGoogle();
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className="
                    bg-violet-500
                    px-4 py-2
                    rounded-xl
                    flex items-center gap-2
                    hover:bg-violet-400
                    transition
                  "
                >
                  <LogIn size={18} />
                  Đăng nhập
                </button>

                <button
                  onClick={async () => {
                    try {
                      await loginAsGuest();
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className="
                    px-4 py-2
                    rounded-xl
                    border border-violet-400
                    hover:bg-violet-50 dark:hover:bg-white/10
                  "
                >
                  Guest
                </button>
              </>
            ) : (
              <>
                <span className="text-sm text-slate-600 dark:text-white/70">
                  👋 {user.isAnonymous ? "Guest" : user.displayName || "User"}
                </span>

                <button
                  onClick={async () => {
                    try {
                      await logout();
                      setUser(null);
                      setOpenMenu(false);
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className="
                    bg-red-500
                    text-white
                    px-4 py-2
                    rounded-xl
                    hover:bg-red-400
                    transition
                  "
                >
                  Logout
                </button>
              </>
            )}

          </div>

        </nav>
      </div>
    </header>
  );
}