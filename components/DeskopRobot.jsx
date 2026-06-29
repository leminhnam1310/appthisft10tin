"use client";

import { useEffect, useRef, useState } from "react";

const emotionImages = {
  happy: "/robot/happy.png",
  calm: "/robot/happy.png",
  care: "/robot/care.png",
  sad: "/robot/sad.png",
  thinking: "/robot/thinking.png",
  excited: "/robot/excited.png",
};

export default function DesktopRobot() {
  const [message, setMessage] = useState("Xin chào 🌱");
  const [emotion, setEmotion] = useState("calm");
  const [emoji, setEmoji] = useState("🌱");
  const [typing, setTyping] = useState(false);
  const [visible, setVisible] = useState(true);

  const bubbleTimer = useRef(null);
  const typingTimer = useRef(null);
  const lock = useRef(false);

  useEffect(() => {
    const unsubscribe = window.electron?.receive(
      "robot-update",
      (data) => {
        if (!data || lock.current) return;

        lock.current = true;
        setTyping(true);

        // ❌ clear old timers
        clearTimeout(typingTimer.current);
        clearTimeout(bubbleTimer.current);

        typingTimer.current = setTimeout(() => {
          setTyping(false);

          setMessage(data.reply || data.message || "🌱");
          setEmotion(data.emotion || "calm");
          setEmoji(data.emoji || "🌱");

          setVisible(true);

          bubbleTimer.current = setTimeout(() => {
            setVisible(false);
          }, 7000);

          lock.current = false;
        }, 500); // ⚡ giảm delay cho mượt hơn
      }
    );

    return () => {
      unsubscribe?.();
      clearTimeout(typingTimer.current);
      clearTimeout(bubbleTimer.current);
    };
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-transparent">

      <button
        onClick={() => window.electron?.closeRobot()}
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm"
      >
        ✕
      </button>

      <img
        src={emotionImages[emotion] || emotionImages.calm}
        draggable={false}
        className="w-36 h-36 select-none animate-bounce"
      />

      {typing && (
        <div className="mt-4 text-sm text-gray-500 animate-pulse">
          TENTIN đang suy nghĩ...
        </div>
      )}

      {visible && !typing && (
        <div className="mt-3 max-w-xs px-4 py-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-2xl text-center text-sm text-slate-800 dark:text-white animate-in fade-in zoom-in">

          <div className="text-xl mb-1">
            {emoji}
          </div>

          {message}
        </div>
      )}
    </div>
  );
}