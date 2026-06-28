"use client";

import { useEffect, useState } from "react";

export default function StreakCard() {
  const [streak, setStreak] =
    useState(0);

  const [playerData,
    setPlayerData] =
    useState({
      xp: 0,
    });

  useEffect(() => {
    const streakData =
      JSON.parse(
        localStorage.getItem(
          "streakData"
        )
      ) || {
        streak: 0,
      };

    setStreak(
      streakData.streak || 0
    );

    const savedPlayer =
      JSON.parse(
        localStorage.getItem(
          "playerData"
        )
      ) || {
        xp: 0,
      };

    setPlayerData(
      savedPlayer
    );
  }, []);

  const xpPerLevel = 250;

  const totalXP =
    playerData.xp || 0;

  const level =
    Math.floor(
      totalXP /
        xpPerLevel
    ) + 1;

  const currentXP =
    totalXP %
    xpPerLevel;

  const progress =
    (currentXP /
      xpPerLevel) *
    100;

  let rank =
    "🌱 Người mới";

  if (level >= 5)
    rank =
      "✨ Tích cực";

  if (level >= 10)
    rank =
      "🔥 Kiên trì";

  if (level >= 20)
    rank =
      "💎 Bậc thầy cảm xúc";

  if (level >= 30)
    rank =
      "👑 Huyền thoại";

  let streakBonus = 0;

  if (streak >= 7)
    streakBonus = 5;

  if (streak >= 30)
    streakBonus = 10;

  if (streak >= 100)
    streakBonus = 20;

  return (
    <div
      className="
        bg-gradient-to-r
        from-violet-500
        via-purple-500
        to-pink-500

        rounded-3xl
        p-6

        text-white

        shadow-xl

        mb-6
      "
    >
      <div
        className="
          flex
          justify-between
          items-center
        "
      >
        {/* STREAK */}
        <div className="text-center">
          <div className="text-4xl">
            🔥
          </div>

          <div
            className="
              text-4xl
              font-bold
            "
          >
            {streak}
          </div>

          <div
            className="
              text-sm
              opacity-90
            "
          >
            ngày
          </div>
        </div>

        {/* LEVEL */}
        <div className="text-center">
          <div className="text-4xl">
            ⭐
          </div>

          <div
            className="
              text-4xl
              font-bold
            "
          >
            {level}
          </div>

          <div
            className="
              text-sm
              opacity-90
            "
          >
            cấp độ
          </div>
        </div>
      </div>

      {/* RANK */}
      <div
        className="
          mt-5
          text-center
        "
      >
        <div
          className="
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
      </div>

      {/* XP BAR */}
      <div className="mt-6">
        <div
          className="
            flex
            justify-between

            text-sm
            mb-2
          "
        >
          <span>
            XP hiện tại
          </span>

          <span>
            {currentXP}/
            {xpPerLevel}
          </span>
        </div>

        <div
          className="
            h-4
            bg-white/20
            rounded-full
            overflow-hidden
          "
        >
          <div
            className="
              h-full

              bg-yellow-300

              rounded-full

              transition-all
              duration-700
            "
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div
          className="
            mt-3
            text-center
            font-semibold
          "
        >
          💎 Tổng XP:
          {" "}
          {totalXP}
        </div>
      </div>

      {/* STATS */}
      <div
        className="
          mt-6
          grid
          grid-cols-2
          gap-4
        "
      >
        <div
          className="
            bg-white/10
            rounded-2xl
            p-3
            text-center
          "
        >
          <div className="text-2xl">
            🏅
          </div>

          <div className="font-bold">
            {level}
          </div>

          <div
            className="
              text-xs
              opacity-80
            "
          >
            Level
          </div>
        </div>

        <div
          className="
            bg-white/10
            rounded-2xl
            p-3
            text-center
          "
        >
          <div className="text-2xl">
            🚀
          </div>

          <div className="font-bold">
            +{streakBonus}%
          </div>

          <div
            className="
              text-xs
              opacity-80
            "
          >
            Streak Bonus
          </div>
        </div>
      </div>

      {/* NEXT LEVEL */}
      <div
        className="
          mt-5
          text-center
          text-sm
          opacity-90
        "
      >
        Còn{" "}
        {xpPerLevel -
          currentXP}
        {" "}
        XP để lên cấp
        {" "}
        {level + 1}
      </div>
    </div>
  );
}