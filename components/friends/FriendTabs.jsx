"use client";

import {
  UserPlus,
  UserCheck,
  Clock3,
  Send,
  ShieldBan,
} from "lucide-react";

const tabs = [
  {
    id: "suggestions",
    label: "Gợi ý",
    icon: UserPlus,
  },
  {
    id: "requests",
    label: "Lời mời",
    icon: Clock3,
  },
  {
    id: "friends",
    label: "Bạn bè",
    icon: UserCheck,
  },
  {
    id: "sent",
    label: "Đã gửi",
    icon: Send,
  },
  {
    id: "blocked",
    label: "Đã chặn",
    icon: ShieldBan,
  },
];

export default function FriendTabs({
  activeTab,
  setActiveTab,
  counts = {},
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-2 overflow-x-auto">
      <div className="flex gap-2 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative
                flex
                items-center
                gap-2
                px-5
                py-3
                rounded-xl
                transition-all
                duration-300
                whitespace-nowrap

                ${
                  active
                    ? "bg-blue-600 text-white shadow-lg"
                    : "hover:bg-gray-100 text-gray-700"
                }
              `}
            >
              <Icon size={18} />

              <span className="font-medium">
                {tab.label}
              </span>

              {counts[tab.id] > 0 && (
                <span
                  className={`
                    ml-1
                    min-w-[22px]
                    h-[22px]
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-xs
                    font-bold

                    ${
                      active
                        ? "bg-white text-blue-600"
                        : "bg-red-500 text-white"
                    }
                  `}
                >
                  {counts[tab.id]}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}