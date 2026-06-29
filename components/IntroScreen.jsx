"use client";

import { useEffect, useState } from "react";

export default function IntroScreen({ onFinish }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 animate-pulse opacity-40 blur-2xl" />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* CONTENT */}
      <div className="relative z-10 text-center px-6">

        {/* TITLE */}
        <h1
          className={`
            text-6xl md:text-7xl font-extrabold tracking-[0.3em]
            transition-all duration-700 ease-out
            ${show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}
          `}
        >
          <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            11TIN
          </span>
        </h1>

        {/* SUBTITLE */}
        <p
          className={`
            mt-4 text-slate-200 text-lg md:text-xl
            transition-all duration-700 delay-150
            ${show ? "opacity-100" : "opacity-0"}
          `}
        >
          Psychological Care System
        </p>

        {/* SINGLE BUTTON (CENTERED) */}
        <div
          className={`
            mt-10 flex justify-center
            transition-all duration-700 delay-300
            ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
          `}
        >
          <button
            onClick={onFinish}
            className="
              px-10 py-3 rounded-2xl font-semibold
              bg-white text-black
              hover:scale-105 active:scale-95
              transition-all duration-200
              shadow-xl
            "
          >
            Khám phá
          </button>
        </div>

        {/* DECOR */}
        <div className="mt-10 text-xs text-white/40 animate-pulse">
          ✦ Healing · Emotion · Memory · AI ✦
        </div>

      </div>
    </div>
  );
}