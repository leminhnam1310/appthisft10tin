"use client";

import { useEffect, useState } from "react";

import AchievementPopup from "./AchievementPopup";
import XPAnimation from "./XPAnimation";
import LevelUpPopup from "./LevelUpPopup";

export default function AchievementCard() {
  const [moods, setMoods] = useState([]);
  const [selected, setSelected] = useState(null);

  const [newAchievement,
    setNewAchievement] =
    useState(null);

  const [xpReward,
    setXpReward] =
    useState(null);

  const [levelUp,
    setLevelUp] =
    useState(null);

  const achievements = [
    {
      id: 1,
      title: "🌱 Khởi đầu mới",
      description: "Ghi cảm xúc lần đầu",
      target: 1,
      rewardXP: 50,
      rarity: "common",
    },

    {
      id: 2,
      title: "🔥 Bền bỉ",
      description: "Ghi cảm xúc 7 ngày",
      target: 7,
      rewardXP: 100,
      rarity: "rare",
    },

    {
      id: 3,
      title: "📖 Người tâm sự",
      description: "Ghi cảm xúc 10 lần",
      target: 10,
      rewardXP: 50,
      rarity: "common",
    },

    {
      id: 4,
      title: "😊 Tích cực",
      description: "Vui vẻ 1 lần",
      target: 1,
      mood: "😊",
      rewardXP: 50,
      rarity: "common",
    },

    {
      id: 5,
      title: "😴 Gấu ngủ",
      description: "Buồn ngủ 7 lần",
      target: 7,
      mood: "😴",
      rewardXP: 100,
      rarity: "rare",
    },

    {
      id: 6,
      title: "🌞 Tràn năng lượng",
      description: "Vui vẻ 10 lần",
      target: 10,
      mood: "😊",
      rewardXP: 100,
      rarity: "epic",
    },

    {
      id: 7,
      title: "💪 Không bỏ cuộc",
      description: "Check-in 20 lần",
      target: 20,
      rewardXP: 100,
      rarity: "rare",
    },

    {
      id: 8,
      title: "📅 Một tháng",
      description: "Check-in 30 lần",
      target: 30,
      rewardXP: 100,
      rarity: "rare",
    },

    {
      id: 9,
      title: "📝 Nhà ghi chép",
      description: "Check-in 50 lần",
      target: 50,
      rewardXP: 100,
      rarity: "epic",
    },

    {
      id: 10,
      title: "🏅 Chuyên gia cảm xúc",
      description: "Check-in 100 lần",
      target: 100,
      rewardXP: 100,
      rarity: "epic",
    },

    {
      id: 11,
      title: "🌈 Lạc quan",
      description: "Vui vẻ 25 lần",
      target: 25,
      mood: "😊",
      rewardXP: 100,
      rarity: "epic",
    },

    {
      id: 12,
      title: "☁️ Tâm trạng",
      description: "Buồn 10 lần",
      target: 10,
      mood: "😔",
      rewardXP: 50,
      rarity: "rare",
    },

    {
      id: 13,
      title: "😫 Chiến binh",
      description: "Mệt mỏi 10 lần",
      target: 10,
      mood: "😫",
      rewardXP: 50,
      rarity: "rare",
    },

    {
      id: 14,
      title: "🌙 Cú đêm",
      description: "Buồn ngủ 20 lần",
      target: 20,
      mood: "😴",
      rewardXP: 100,
      rarity: "epic",
    },

    {
      id: 15,
      title: "👑 Huyền thoại",
      description: "Check-in 200 lần",
      target: 200,
      rewardXP: 150,
      rarity: "legendary",
    },

    {
      id: 16,
      title: "👻 Bí mật",
      description: "Đạt 365 check-in",
      target: 365,
      rewardXP: 300,
      rarity: "legendary",
      hidden: true,
    },
  ];
    useEffect(() => {
    const data =
      JSON.parse(
        localStorage.getItem("moods")
      ) || [];

    setMoods(data);
  }, []);

  useEffect(() => {
    if (!moods.length) return;

    const unlockedList =
      JSON.parse(
        localStorage.getItem(
          "unlockedAchievements"
        )
      ) || [];

    achievements.forEach(
      (achievement) => {
        let current = 0;

        if (achievement.id === 2) {
          current = [
            ...new Set(
              moods.map((m) =>
                new Date(
                  m.date
                ).toDateString()
              )
            ),
          ].length;
        } else if (
          achievement.mood
        ) {
          current = moods.filter(
            (m) =>
              m.mood ===
              achievement.mood
          ).length;
        } else {
          current = moods.length;
        }

        if (
          current >=
            achievement.target &&
          !unlockedList.includes(
            achievement.id
          )
        ) {
          unlockedList.push(
            achievement.id
          );

          localStorage.setItem(
            "unlockedAchievements",
            JSON.stringify(
              unlockedList
            )
          );

          const playerData =
            JSON.parse(
              localStorage.getItem(
                "playerData"
              )
            ) || {
              xp: 0,
            };

          const oldLevel =
            Math.floor(
              playerData.xp / 250
            ) + 1;

          playerData.xp +=
            achievement.rewardXP;

          const newLevel =
            Math.floor(
              playerData.xp / 250
            ) + 1;

          localStorage.setItem(
            "playerData",
            JSON.stringify(
              playerData
            )
          );

          if (
            newLevel >
            oldLevel
          ) {
            setLevelUp(
              newLevel
            );

            setTimeout(() => {
              setLevelUp(
                null
              );
            }, 4000);
          }

          setXpReward(
            achievement.rewardXP
          );

          setTimeout(() => {
            setXpReward(
              null
            );
          }, 2000);

          setNewAchievement(
            achievement
          );

          setTimeout(() => {
            setNewAchievement(
              null
            );
          }, 4000);
        }
      }
    );
  }, [moods]);
  const unlockedAchievements =
  JSON.parse(
    localStorage.getItem(
      "unlockedAchievements"
    )
  ) || [];

const rarityStyle = {
  common:
    "bg-violet-500",

  rare:
    "bg-blue-500",

  epic:
    "bg-pink-500",

  legendary:
    "bg-yellow-500 text-black",
};

return (
  <div
    className="
      min-h-screen
      bg-slate-100
      dark:bg-slate-950

      text-slate-900
      dark:text-white

      p-6
    "
  >
    <h1 className="text-4xl font-bold mb-8">
      🏆 Thành tựu
    </h1>

    <div
      className="
        grid
        md:grid-cols-2
        lg:grid-cols-3
        gap-6
      "
    >
      {achievements.map(
        (achievement) => {
          let current = 0;

          if (
            achievement.id === 2
          ) {
            current = [
              ...new Set(
                moods.map((m) =>
                  new Date(
                    m.date
                  ).toDateString()
                )
              ),
            ].length;
          } else if (
            achievement.mood
          ) {
            current =
              moods.filter(
                (m) =>
                  m.mood ===
                  achievement.mood
              ).length;
          } else {
            current =
              moods.length;
          }

          const unlocked =
            current >=
            achievement.target;

          const progress =
            Math.min(
              (current /
                achievement.target) *
                100,
              100
            );

          if (
            achievement.hidden &&
            !unlocked
          ) {
            return null;
          }

          return (
            <div
              key={
                achievement.id
              }
              onClick={() =>
                setSelected({
                  ...achievement,
                  current,
                  progress,
                  unlocked,
                })
              }
              className={`
                rounded-3xl
                h-72

                flex
                flex-col
                items-center
                justify-center

                cursor-pointer

                transition-all
                hover:scale-105

                ${
                  unlocked
                    ? rarityStyle[
                        achievement
                          .rarity
                      ]
                    : "bg-slate-900 text-white/70"
                }
              `}
            >
              {achievement.hidden &&
              !unlocked ? (
                <>
                  <div className="text-6xl mb-4">
                    🔒
                  </div>

                  <h2 className="font-bold text-xl">
                    Thành tựu bí mật
                  </h2>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">
                    {achievement.title.split(
                      " "
                    )[0]}
                  </div>

                  <h2
                    className="
                      font-bold
                      text-xl
                      text-center
                    "
                  >
                    {achievement.title.replace(
                      /^[^\s]+\s/,
                      ""
                    )}
                  </h2>
                </>
              )}

              <p className="mt-4">
                {Math.min(
                  current,
                  achievement.target
                )}
                /
                {
                  achievement.target
                }
              </p>

              <div
                className="
                  w-4/5
                  h-2
                  bg-white/20
                  rounded-full
                  mt-3
                "
              >
                <div
                  className="
                    h-full
                    bg-white
                    rounded-full
                  "
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div
                className="
                  mt-3
                  text-xs
                  uppercase
                  opacity-80
                "
              >
                {
                  achievement.rarity
                }
              </div>
            </div>
          );
        }
      )}
    </div>

    {selected && (
      <div
        className="
          fixed
          inset-0
          bg-black/60

          flex
          items-center
          justify-center

          z-50
        "
        onClick={() =>
          setSelected(null)
        }
      >
        <div
          className="
            bg-white
            dark:bg-slate-900

            text-slate-900
            dark:text-white

            rounded-3xl
            p-8

            w-[500px]
            max-w-[90vw]
          "
          onClick={(e) =>
            e.stopPropagation()
          }
        >
          <h2 className="text-3xl font-bold">
            {selected.title}
          </h2>

          <p
            className="
              mt-4
              text-slate-600
              dark:text-slate-300
            "
          >
            {
              selected.description
            }
          </p>

          <div
            className="
              mt-5
              p-4
              rounded-2xl

              bg-violet-500/10
              border
              border-violet-500/30
            "
          >
            🎁 Phần thưởng

            <div className="font-bold mt-2">
              +
              {
                selected.rewardXP
              }
              XP
            </div>
          </div>

          <div className="mt-6">
            <p className="font-semibold">
              Tiến trình
            </p>

            <div
              className="
                h-4
                bg-slate-300
                dark:bg-slate-700
                rounded-full
                mt-3
              "
            >
              <div
                className="
                  h-4
                  bg-violet-500
                  rounded-full
                "
                style={{
                  width: `${selected.progress}%`,
                }}
              />
            </div>

            <p className="mt-3">
              {Math.min(
                selected.current,
                selected.target
              )}
              /
              {
                selected.target
              }
            </p>
          </div>

          <button
            onClick={() =>
              setSelected(null)
            }
            className="
              mt-6
              w-full

              px-5
              py-3

              bg-violet-500
              hover:bg-violet-600

              text-white
              rounded-xl
            "
          >
            Đóng
          </button>
        </div>
      </div>
    )}

    <AchievementPopup
      achievement={
        newAchievement
      }
    />

    <XPAnimation
      amount={xpReward}
    />

    <LevelUpPopup
      level={levelUp}
    />
  </div>
);
}