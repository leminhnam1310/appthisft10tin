"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  UserPlus,
  UserCheck,
  Clock3,
  Star,
  ShieldBan,
} from "lucide-react";

const menus = [
  { name: "Gợi ý", href: "/friends", icon: UserPlus },
  { name: "Lời mời", href: "/friends/requests", icon: Clock3 },
  { name: "Bạn bè", href: "/friends/list", icon: UserCheck },
  { name: "Đã gửi", href: "/friends/sent", icon: Users },
  { name: "Yêu thích", href: "/friends/favorites", icon: Star },
  { name: "Đã chặn", href: "/friends/blocked", icon: ShieldBan },
];

export default function FriendSidebar() {
  const pathname = usePathname();

  return (
    <aside className="
      hidden lg:flex w-72 shrink-0
      border-r border-slate-200 dark:border-slate-800
      bg-white dark:bg-slate-950
      h-screen sticky top-0
    ">
      <div className="w-full flex flex-col">

        {/* HEADER */}
        <div className="px-6 py-6 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Friends
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kết nối và quản lý bạn bè
          </p>
        </div>

        {/* MENU */}
        <div className="flex-1 overflow-y-auto py-4">

          {menus.map((item) => {
            const Icon = item.icon;

            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  mx-3 mb-2 flex items-center gap-4
                  rounded-xl px-4 py-3
                  transition-all duration-200

                  ${
                    active
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }
                `}
              >
                <Icon size={20} />

                <span className="font-medium">
                  {item.name}
                </span>
              </Link>
            );
          })}

        </div>

        {/* FOOTER */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-5">

          <div className="
            rounded-xl
            bg-gradient-to-r from-blue-500 to-indigo-500
            p-4 text-white
          ">

            <p className="font-semibold">
              Kết nối nhiều hơn
            </p>

            <p className="text-sm mt-1 opacity-90">
              Khám phá những người bạn mới phù hợp với bạn.
            </p>

          </div>

        </div>

      </div>
    </aside>
  );
}