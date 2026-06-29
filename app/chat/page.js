"use client";

import ChatBot from "@/components/ChatBot";

export default function ChatPage() {
  return (
    <main
      className="
        min-h-screen
        flex flex-col

        bg-gradient-to-br
        from-slate-100
        via-white
        to-slate-200

        dark:from-slate-950
        dark:via-slate-900
        dark:to-black

        text-slate-900
        dark:text-white
      "
    >
      {/* =========================
          TOP NAV BAR
      ========================= */}
      <header
        className="
          sticky top-0 z-50

          backdrop-blur-xl
          bg-white/70
          dark:bg-slate-950/60

          border-b
          border-slate-200
          dark:border-slate-800
        "
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600" />
            <div>
              <h1 className="font-bold text-lg leading-tight">
                TENTIN Chat
              </h1>
              <p className="text-xs opacity-60">
                AI Companion v3
              </p>
            </div>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2">

            {/* Theme button (placeholder hook later) */}
            <button className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-sm hover:scale-105 transition">
              🌙
            </button>

            {/* Settings */}
            <button className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-sm hover:scale-105 transition">
              ⚙️
            </button>

            {/* Clear chat */}
            <button
              onClick={() => {
                localStorage.removeItem("ai_memory_v2");
                window.location.reload();
              }}
              className="px-3 py-1.5 rounded-xl bg-red-500 text-white text-sm hover:scale-105 active:scale-95 transition"
            >
              Clear
            </button>

          </div>
        </div>
      </header>

      {/* =========================
          MAIN CHAT AREA
      ========================= */}
      <section className="flex-1 flex flex-col">
        <div className="max-w-5xl w-full mx-auto flex-1 p-4 md:p-6">

          {/* CHAT CARD */}
          <div
            className="
              h-full

              rounded-3xl

              bg-white/60
              dark:bg-slate-900/40

              backdrop-blur-xl

              border
              border-slate-200
              dark:border-slate-800

              shadow-2xl

              overflow-hidden
            "
          >
            <ChatBot />
          </div>
        </div>
      </section>

      {/* =========================
          FLOATING QUICK ACTION BAR
      ========================= */}
      <div
        className="
          fixed bottom-5 left-1/2 -translate-x-1/2

          flex items-center gap-2

          px-3 py-2

          rounded-2xl

          bg-white/80
          dark:bg-slate-900/80

          backdrop-blur-xl

          border
          border-slate-200
          dark:border-slate-700

          shadow-xl
        "
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="px-3 py-1 rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition"
        >
          ⬆ Top
        </button>

        <button
          onClick={() => document.querySelector("textarea")?.focus()}
          className="px-3 py-1 rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition"
        >
          💬 Chat
        </button>

        <button
          onClick={() => alert("Feature coming soon 🚀")}
          className="px-3 py-1 rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition"
        >
          ⚡ Actions
        </button>
      </div>
    </main>
  );
}