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
  ChevronRight,
  ChevronLeft,
  LifeBuoy,
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

  // ✅ SIDEBAR DỌC STATE (NEW)
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <>
      {/* ================= TOPBAR (GIỮ NGUYÊN) ================= */}
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

                  {uid && (
                    <Link
                      href={`/profile/${uid}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/10"
                    >
                      👤 Hồ sơ của tôi
                    </Link>
                  )}

                  <Link href="/statistics" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/10">
                    <BarChart3 size={18} /> Thống kê
                  </Link>

                  <Link href="/friends" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/10">
                    <Users size={18} /> Bạn bè
                  </Link>

                  <Link href="/community" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/10">
                    <Globe size={18} /> Cộng đồng
                  </Link>

                  <Link href="/achievements" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/10">
                    🏆 Thành tựu
                  </Link>

                  <Link href="/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/10">
                    <Settings size={18} /> Cài đặt
                  </Link>

                </div>
              )}
            </div>

            {/* AUTH */}
            <div className="flex items-center gap-3">

              {!user ? (
                <>
                  <button onClick={loginWithGoogle} className="bg-violet-500 px-4 py-2 rounded-xl text-white">
                    <LogIn size={18} /> Đăng nhập
                  </button>

                  <button onClick={loginAsGuest} className="px-4 py-2 rounded-xl border">
                    Guest
                  </button>
                </>
              ) : (
                <>
                  <span className="text-sm text-slate-600 dark:text-white/70">
                    👋 {user.isAnonymous ? "Guest" : user.displayName || "User"}
                  </span>

                  <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-xl">
                    Logout
                  </button>
                </>
              )}

            </div>

          </nav>
        </div>
      </header>

      {/* ================= SIDEBAR DỌC FACEBOOK STYLE ================= */}

      {/* NÚT MỞ (>) */}
      {!sidebarOpen && (
  <button
    onClick={() => setSidebarOpen(true)}
    className="
      fixed left-3 top-1/2 -translate-y-1/2
      z-[60]

      h-14 w-14
      rounded-full

      bg-blue-600
      text-white

      shadow-2xl
      hover:scale-110
      hover:bg-blue-700

      transition-all duration-300

      animate-pulse
    "
  >
    <ChevronRight className="mx-auto" size={24} />
  </button>
)}

      {/* SIDEBAR */}
      <aside
  className={`
    fixed inset-y-0 left-0
    z-[60]
    w-72
    bg-white dark:bg-slate-950
    border-r border-slate-200 dark:border-slate-800
    shadow-2xl
    transform transition-transform duration-300 ease-out
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
  `}
>

        {/* CLOSE */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="
            absolute right-2 top-1/2 -translate-y-1/2
            bg-white dark:bg-slate-900
            border rounded-full p-2
          "
        >
          <ChevronLeft size={18} />
        </button>

        {/* MENU DỌC */}
<div className="mt-10 flex flex-col gap-1 px-3">

  <Link href="/" className={linkClass(isActive("/"))}>
    <Home size={18} /> Trang chủ
  </Link>

  <Link href="/chat" className={linkClass(isActive("/chat"))}>
    <MessageCircle size={18} /> Trò chuyện
  </Link>

  <Link href="/friends" className={linkClass(isActive("/friends"))}>
    <Users size={18} /> Bạn bè
  </Link>

  <Link href="/music" className={linkClass(isActive("/music"))}>
    <Music size={18} /> Thư giãn
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

  {/* ===== NEW SECTION ===== */}
  <div className="my-2 border-t border-slate-200 dark:border-slate-800" />

  <Link href="/terms" className={linkClass(isActive("/terms"))}>
    📄 Điều khoản
  </Link>

  <Link href="/privacy" className={linkClass(isActive("/privacy"))}>
    🔐 Quyền riêng tư
  </Link>

  <Link href="/about" className={linkClass(isActive("/about"))}>
    ℹ️ Thông tin web
  </Link>

  <Link href="/support" className={linkClass(isActive("/support"))}>
    <LifeBuoy size={18} /> Hỗ trợ
  </Link>

        </div>
      </aside>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}
    </>
  );
}