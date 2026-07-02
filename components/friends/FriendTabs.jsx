"use client";

import {
  UserPlus,
  UserCheck,
  Clock3,
  Send,
  ShieldBan,
} from "lucide-react";

const tabs = [
  { id: "suggestions", label: "Gợi ý", icon: UserPlus },
  { id: "requests", label: "Lời mời", icon: Clock3 },
  { id: "friends", label: "Bạn bè", icon: UserCheck },
  { id: "sent", label: "Đã gửi", icon: Send },
  { id: "blocked", label: "Đã chặn", icon: ShieldBan },
];

export default function FriendTabs({
  activeTab,
  setActiveTab,
  counts = {},
}) {
  return (
    <div className="
      bg-white dark:bg-slate-900
      rounded-2xl shadow-sm border
      border-slate-200 dark:border-slate-800
      p-2 overflow-x-auto
    ">
      <div className="flex gap-2 min-w-max">

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          const count = Number(counts?.[tab.id] || 0);

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex items-center gap-2
                px-4 py-2.5 rounded-xl
                whitespace-nowrap select-none
                transition-all duration-200

                ${
                  active
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }
              `}
            >
              <Icon size={18} />

              <span className="font-medium">
                {tab.label}
              </span>

              {/* BADGE */}
              {count > 0 && (
                <span
                  className={`
                    ml-1 min-w-[20px] h-[20px]
                    px-1 rounded-full
                    flex items-center justify-center
                    text-[11px] font-bold

                    ${
                      active
                        ? "bg-white text-blue-600"
                        : "bg-red-500 text-white"
                    }
                  `}
                >
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>
          );
        })}

      </div>
    </div>
  );
}