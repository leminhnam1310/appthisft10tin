"use client";

import { useEffect, useRef, useState } from "react";

const messages = [
  "🐻 Chúc bạn một ngày tốt lành!",
  "🌸 Hãy nhớ nghỉ ngơi một chút nhé.",
  "💪 Bạn đang làm rất tốt đó.",
  "✨ Đừng quên uống nước nha.",
  "🌙 Làm việc nhiều rồi thì thư giãn một chút nhé.",
  "📖 Viết ra cảm xúc cũng là một cách chữa lành.",
  "🎵 Nghe chút nhạc cho thư thái nào.",
];

export default function BearScene() {
  const [message, setMessage] = useState("");
  const lastTalk = useRef(0);
  const hideTimer = useRef(null);

  const talk = () => {
    const now = Date.now();
    if (now - lastTalk.current < 5000) return;

    lastTalk.current = now;

    const random =
      messages[Math.floor(Math.random() * messages.length)];

    setMessage(random);

    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }

    hideTimer.current = setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  useEffect(() => {
    const handler = (e) => {
      // 🧠 bỏ qua UI quan trọng (robot + sidebar + buttons)
      if (
        e.target.closest("header") ||
        e.target.closest(".robot-ui") ||
        e.target.closest("button")
      )
        return;

      talk();
    };

    document.addEventListener("click", handler, { passive: true });

    return () => {
      document.removeEventListener("click", handler);

      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
    };
  }, []);

  return (
    <>
      {/* 💬 chat bubble */}
      {message && (
        <div
          className="
            bear-chat
            fixed bottom-20 right-6

            z-50

            max-w-[260px]

            px-4 py-3

            rounded-2xl

            bg-white
            text-slate-900

            dark:bg-slate-900
            dark:text-white

            border border-slate-200
            dark:border-white/10

            shadow-xl
          "
        >
          {message}
        </div>
      )}

      {/* 🐻 bear icon */}
      <div
        className="
          fixed bottom-4 right-4

          z-40

          text-7xl

          select-none
          pointer-events-none
        "
      >
        🧸
      </div>
    </>
  );
}