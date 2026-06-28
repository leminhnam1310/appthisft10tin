"use client";

import { useState, useEffect } from "react";

export default function AchievementsPage() {
  const [selected, setSelected] = useState(null);
  const [moods, setMoods] = useState([]);
  useEffect(() => {
  const data =
    JSON.parse(
      localStorage.getItem("moods")
    ) || [];

  setMoods(data);
}, []);
 const achievements = [
{
id: 1,
icon: "🌱",
title: "Khởi đầu mới",
description: "Ghi cảm xúc lần đầu",
target: 1,
reward: "50 XP",
rewardXP: 50,
rarity: "common",
},

{
id: 2,
icon: "🔥",
title: "Bền bỉ",
description: "Ghi cảm xúc 7 ngày",
target: 7,
reward: "100 XP",
rewardXP: 100,
rarity: "rare",
},

{
id: 3,
icon: "📖",
title: "Người tâm sự",
description: "Ghi cảm xúc 10 lần",
target: 10,
reward: "50 XP",
rewardXP: 50,
rarity: "common",
},

{
id: 4,
icon: "😊",
title: "Tích cực",
description: "Vui vẻ 1 lần",
target: 1,
mood: "😊",
reward: "50 XP",
rewardXP: 50,
rarity: "common",
},

{
id: 5,
icon: "😴",
title: "Gấu ngủ",
description: "Buồn ngủ 7 lần",
target: 7,
mood: "😴",
reward: "100 XP",
rewardXP: 100,
rarity: "rare",
},

{
id: 6,
icon: "🌞",
title: "Tràn năng lượng",
description: "Vui vẻ 10 lần",
target: 10,
mood: "😊",
reward: "100 XP",
rewardXP: 100,
rarity: "epic",
},

{
id: 7,
icon: "💪",
title: "Không bỏ cuộc",
description: "Check-in 20 lần",
target: 20,
reward: "100 XP",
rewardXP: 100,
rarity: "rare",
},

{
id: 8,
icon: "📅",
title: "Một tháng",
description: "Check-in 30 lần",
target: 30,
reward: "100 XP",
rewardXP: 100,
rarity: "rare",
},

{
id: 9,
icon: "📝",
title: "Nhà ghi chép",
description: "Check-in 50 lần",
target: 50,
reward: "100 XP",
rewardXP: 100,
rarity: "epic",
},

{
id: 10,
icon: "🏅",
title: "Chuyên gia cảm xúc",
description: "Check-in 100 lần",
target: 100,
reward: "100 XP",
rewardXP: 100,
rarity: "epic",
},

{
id: 11,
icon: "🌈",
title: "Lạc quan",
description: "Vui vẻ 25 lần",
target: 25,
mood: "😊",
reward: "100 XP",
rewardXP: 100,
rarity: "epic",
},

{
id: 12,
icon: "☁️",
title: "Tâm trạng",
description: "Buồn 10 lần",
target: 10,
mood: "😔",
reward: "50 XP",
rewardXP: 50,
rarity: "rare",
},

{
id: 13,
icon: "😫",
title: "Chiến binh",
description: "Mệt mỏi 10 lần",
target: 10,
mood: "😫",
reward: "50 XP",
rewardXP: 50,
rarity: "rare",
},

{
id: 14,
icon: "🌙",
title: "Cú đêm",
description: "Buồn ngủ 20 lần",
target: 20,
mood: "😴",
reward: "100 XP",
rewardXP: 100,
rarity: "epic",
},

{
id: 15,
icon: "👑",
title: "Huyền thoại",
description: "Check-in 200 lần",
target: 200,
reward: "150 XP",
rewardXP: 150,
rarity: "legendary",
},

{
id: 16,
icon: "👻",
title: "Bí mật",
description: "Đạt 365 check-in",
target: 365,
reward: "300 XP",
rewardXP: 300,
rarity: "legendary",
hidden: true,
},
];


 return (
  <main
    className="
      min-h-screen
      p-8

      bg-slate-100
      text-slate-900

      dark:bg-slate-950
      dark:text-white
    "
  >
    {/* HEADER */}

    <div className="mb-10">
      <h1 className="text-5xl font-bold">
        🏆 Thành tựu
      </h1>

      <p className="mt-2 text-slate-500">
        Mở khóa thành tựu để nhận XP và lên cấp
      </p>

      <div className="mt-6 flex gap-4 flex-wrap">
        <div className="px-4 py-3 rounded-2xl bg-violet-500 text-white">
          🎯 Tổng:
          {" "}
          {achievements.length}
        </div>

        <div className="px-4 py-3 rounded-2xl bg-green-500 text-white">
          ✅ Hoàn thành:
          {" "}
          {
            achievements.filter((a) => {
              let progress = a.mood
                ? moods.filter(
                    (m) =>
                      m.mood === a.mood
                  ).length
                : moods.length;

              return progress >= a.target;
            }).length
          }
        </div>

        <div className="px-4 py-3 rounded-2xl bg-yellow-500 text-white">
          📖 Check-in:
          {" "}
          {moods.length}
        </div>
      </div>
    </div>

    {/* GRID */}

    <div
      className="
        grid
        md:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        gap-6
      "
    >
      {achievements.map((a) => {

        let progress = 0;

        if (a.id === 2) {
          progress = [
            ...new Set(
              moods.map((m) =>
                new Date(
                  m.date
                ).toDateString()
              )
            ),
          ].length;
        }
        else if (a.mood) {
          progress = moods.filter(
            (m) =>
              m.mood === a.mood
          ).length;
        }
        else {
          progress = moods.length;
        }

        const unlocked =
          progress >= a.target;

        const percent =
          Math.min(
            (progress /
              a.target) *
              100,
            100
          );

        return (
          <button
            key={a.id}
            onClick={() =>
              setSelected({
                ...a,
                progress,
                unlocked,
              })
            }
            className={`
              relative
              rounded-3xl
              p-6

              border

              transition-all
              duration-300

              hover:scale-105

              ${
                unlocked
                  ? `
                    bg-gradient-to-br
                    from-yellow-500
                    to-orange-500

                    text-white

                    border-yellow-300

                    shadow-[0_0_30px_rgba(255,200,0,0.6)]
                  `
                  : `
                    bg-white
                    dark:bg-slate-900

                    border-slate-200
                    dark:border-slate-700
                  `
              }
            `}
          >
            <div className="text-5xl mb-4">
              {
                a.title.split(" ")[0]
              }
            </div>

            <h3 className="font-bold text-lg">
              {a.title}
            </h3>

            <p
              className="
                mt-2
                text-sm
                opacity-80
              "
            >
              {a.description}
            </p>

            <div className="mt-4">
              <div
                className="
                  h-3
                  rounded-full
                  bg-black/10
                  overflow-hidden
                "
              >
                <div
                  className="
                    h-full
                    bg-violet-500
                  "
                  style={{
                    width:
                      `${percent}%`,
                  }}
                />
              </div>

              <div className="mt-2 text-sm">
                {Math.min(
                  progress,
                  a.target
                )}
                /
                {a.target}
              </div>
            </div>

            <div className="mt-4">
              {unlocked ? (
                <span className="font-bold">
                  ✨ Đã mở khóa
                </span>
              ) : (
                <span className="opacity-70">
                  🔒 Chưa hoàn thành
                </span>
              )}
            </div>

            <div
              className="
                absolute
                top-4
                right-4
                text-xs
                px-2
                py-1
                rounded-full
                bg-black/20
              "
            >
              +{a.rewardXP} XP
            </div>
          </button>
        );
      })}
    </div>

    {/* POPUP CHI TIẾT */}

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

            rounded-3xl
            p-8

            w-[650px]
            max-w-[95vw]

            shadow-2xl
          "
          onClick={(e) =>
            e.stopPropagation()
          }
        >
          <div className="text-6xl">
            {
              selected.title.split(
                " "
              )[0]
            }
          </div>

          <h2 className="text-3xl font-bold mt-4">
            {selected.title}
          </h2>

          <p className="mt-3 text-slate-500">
            {
              selected.description
            }
          </p>

          <div
            className="
              mt-6
              p-4

              rounded-2xl

              bg-violet-500/10
              border
              border-violet-500/20
            "
          >
            🎁 Phần thưởng

            <div className="font-bold mt-2">
              +{selected.rewardXP} XP
            </div>
          </div>

          <div className="mt-6">
            <div className="font-semibold">
              Tiến độ
            </div>

            <div
              className="
                h-4
                rounded-full
                bg-slate-300
                dark:bg-slate-700
                mt-3
              "
            >
              <div
                className="
                  h-full
                  rounded-full
                  bg-violet-500
                "
                style={{
                  width: `${Math.min(
                    (selected.progress /
                      selected.target) *
                      100,
                    100
                  )}%`,
                }}
              />
            </div>

            <p className="mt-3">
              {
                selected.progress
              }
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
              mt-8

              px-6
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
  </main>
);
}