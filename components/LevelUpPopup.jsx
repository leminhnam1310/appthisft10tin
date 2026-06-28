"use client";

import { useEffect, useState } from "react";

export default function LevelUpPopup({
  level,
}) {
  const [show, setShow] =
    useState(false);

  useEffect(() => {
    if (!level) return;

    setShow(true);

    const timer =
      setTimeout(() => {
        setShow(false);
      }, 5000);

    return () =>
      clearTimeout(timer);
  }, [level]);

  if (!level) return null;

  let rank =
    "🌱 Người mới";

  if (level >= 5)
    rank = "✨ Tích cực";

  if (level >= 10)
    rank = "🔥 Kiên trì";

  if (level >= 20)
    rank =
      "💎 Bậc thầy cảm xúc";

  if (level >= 30)
    rank = "👑 Huyền thoại";

  return (
    <div
      className={`
        fixed
        inset-0

        z-[9998]

        flex
        items-center
        justify-center

        bg-black/60
        backdrop-blur-sm

        transition-all
        duration-500

        ${
          show
            ? "opacity-100"
            : "opacity-0"
        }
      `}
    >
      <div
        className={`
          relative

          w-[450px]
          max-w-[90vw]

          rounded-3xl

          bg-gradient-to-br
          from-yellow-400
          via-orange-400
          to-pink-500

          text-white

          p-8

          shadow-[0_0_60px_rgba(255,200,0,0.6)]

          transition-all
          duration-500

          ${
            show
              ? `
                scale-100
                rotate-0
              `
              : `
                scale-75
                rotate-6
              `
          }
        `}
      >
        {/* Glow */}
        <div
          className="
            absolute
            inset-0

            rounded-3xl

            bg-white/10
            animate-pulse
          "
        />

        <div
          className="
            relative
            z-10
            text-center
          "
        >
          <div
            className="
              text-7xl
              animate-bounce
            "
          >
            🎉
          </div>

          <h2
            className="
              mt-4
              text-4xl
              font-extrabold
            "
          >
            LÊN CẤP!
          </h2>

          <div
            className="
              mt-6

              text-6xl
              font-black
            "
          >
            ⭐ {level}
          </div>

          <div
            className="
              mt-4

              inline-flex

              px-4
              py-2

              rounded-full

              bg-white/20
              backdrop-blur
            "
          >
            {rank}
          </div>

          <p
            className="
              mt-6
              text-lg
              text-white/90
            "
          >
            Chúc mừng!
            <br />
            Bạn đã đạt cấp độ mới.
          </p>

          <button
            onClick={() =>
              setShow(false)
            }
            className="
              mt-8

              px-6
              py-3

              rounded-xl

              bg-white
              text-slate-900

              font-bold

              hover:scale-105
              transition
            "
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
}