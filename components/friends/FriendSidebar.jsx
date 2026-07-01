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
  {
    name: "Gợi ý",
    href: "/friends",
    icon: UserPlus,
  },
  {
    name: "Lời mời",
    href: "/friends/requests",
    icon: Clock3,
  },
  {
    name: "Bạn bè",
    href: "/friends/list",
    icon: UserCheck,
  },
  {
    name: "Đã gửi",
    href: "/friends/sent",
    icon: Users,
  },
  {
    name: "Yêu thích",
    href: "/friends/favorites",
    icon: Star,
  },
  {
    name: "Đã chặn",
    href: "/friends/blocked",
    icon: ShieldBan,
  },
];

export default function FriendSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-72 shrink-0 border-r bg-white h-screen sticky top-0">
      <div className="w-full flex flex-col">

        {/* Header */}
        <div className="px-6 py-6 border-b">
          <h1 className="text-2xl font-bold">
            Friends
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Kết nối và quản lý bạn bè
          </p>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-4">

          {menus.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mx-3 mb-2 flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200
                  ${
                    active
                      ? "bg-blue-600 text-white shadow-lg"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
              >
                <Icon size={22} />

                <span className="font-medium">
                  {item.name}
                </span>
              </Link>
            );
          })}

        </div>

        {/* Footer */}
        <div className="border-t p-5">

          <div className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 p-4 text-white">

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