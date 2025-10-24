"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Navigation } from "../types/navigation";
import { Home, RefreshCcw, Inbox } from "lucide-react";

export default function Sidebar() {
  const [role, setRole] = useState<"admin" | "user">("user");
  const router = useRouter();
  const pathname = usePathname();

  const switchRole = (newRole: "admin" | "user") => {
    setRole(newRole);
    if (newRole === "admin") router.push("/admin");
    else router.push("/");
  };

  const menus: Navigation = {
    admin: [
      { name: "Home", href: "/admin", icon: Home },
      { name: "History", href: "/admin/history", icon: Inbox },
      { name: "Switch to User", action: () => switchRole("user"), icon: RefreshCcw },
    ],
    user: [
      { name: "Switch to Admin", action: () => switchRole("admin"), icon: RefreshCcw },
    ],
  };

  return (
    <aside className="w-64 bg-white p-4 border-r border-gray-200">
      <h2 className="text-2xl font-bold mb-6 mt-7">{role.toUpperCase()}</h2>
      <ul>
        {menus[role].map((menu, idx) => {
          const Icon = menu.icon;
          const isActive = menu.href ? pathname === menu.href : false;

          return (
            <li key={idx} className="mb-4 flex items-center gap-2">
              {menu.href ? (
                <Link
                  href={menu.href}
                  className={`flex items-center gap-2 py-3 px-2 rounded w-full ${
                    isActive ? "bg-blue-50" : "hover:bg-gray-100"
                  }`}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  {menu.name}
                </Link>
              ) : (
                <button
                  onClick={menu.action}
                  className="hover:bg-gray-100 flex items-center gap-2 py-3 px-2 rounded w-full focus:outline-none"
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  {menu.name}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
