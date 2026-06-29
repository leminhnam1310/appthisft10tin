"use client";

import ChatBot from "@/components/ChatBot";

export default function ChatPage() {
  return (
    <main
      className="
        min-h-screen
        bg-slate-100
        dark:bg-slate-950
        text-slate-900
        dark:text-white
      "
    >
      <div className="max-w-5xl mx-auto p-6">
        <ChatBot />
      </div>
    </main>
  );
}