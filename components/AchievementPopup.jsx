"use client";

import { useEffect, useState } from "react";

export default function AchievementPopup({
  achievement,
}) {
  const [show, setShow] =
    useState(false);

  useEffect(() => {
    if (!achievement) return;

    setShow(true);

    const timer =
      setTimeout(() => {
        setShow(false);
      }, 4000);

    return () =>
      clearTimeout(timer);
  }, [achievement]);

  if (!achievement) return null;

  const rarityConfig = {
    common: {
      color:
        "from-violet-500 to-purple-500",
      label: "Common",
      icon: "🟣",
    },

    rare: {
      color:
        "from-blue-500 to-cyan-500",
      label: "Rare",
      icon: "🔵",
    },

    epic: {
      color:
        "from-pink-500 to-fuchsia-500",
      label: "Epic",
      icon: "🟣",
    },

    legendary: {
      color:
        "from-yellow-400 to-orange-500",
      label: "Legendary",
      icon: "👑",
    },
  };

  const rarity =
    rarityConfig[
      achievement.rarity
    ] ||
    rarityConfig.common;

  return (
    <div
      className={`
        fixed
        bottom-5
        right-5

        z-[9999]

        w-[360px]
        max-w-[90vw]

        overflow-hidden

        rounded-3xl

        bg-gradient-to-r
        ${rarity.color}

        text-white

        shadow-2xl

        backdrop-blur-xl

        transition-all
        duration-500

        ${
          show
            ? `
              translate-x-0
              opacity-100
              scale-100
            `
            : `
              translate-x-[120%]
              opacity-0
              scale-95
            `
        }
      `}
    >
      {/* Thanh thời gian */}
      <div
        className="
          absolute
          bottom-0
          left-0

          h-1
          bg-white/50

          animate-[shrink_4s_linear_forwards]
        "
        style={{
          width: "100%",
        }}
      />

      <button
        onClick={() =>
          setShow(false)
        }
        className="
          absolute
          top-3
          right-3

          text-white/70
          hover:text-white

          text-lg
        "
      >
        ✕
      </button>

      <div className="p-5">
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <div className="text-4xl">
            🏆
          </div>

          <div>
            <h3
              className="
                font-bold
                text-lg
              "
            >
              Thành tựu mới!
            </h3>

            <div
              className="
                text-sm
                opacity-90
              "
            >
              {rarity.icon}
              {" "}
              {rarity.label}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p
            className="
              font-semibold
              text-lg
            "
          >
            {achievement.title}
          </p>

          <p
            className="
              text-white/90
              text-sm
              mt-1
            "
          >
            {
              achievement.description
            }
          </p>
        </div>

        <div
          className="
            mt-4

            flex
            justify-between
            items-center
          "
        >
          <div
            className="
              px-3
              py-1

              rounded-full

              bg-white/20
            "
          >
            ✨ Mở khóa
          </div>

          <div
            className="
              font-bold
              text-yellow-200
              text-lg
            "
          >
            +
            {
              achievement.rewardXP
            }
            XP
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }

          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}