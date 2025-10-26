"use client";

import Link from "next/link";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Navigation } from "../types/navigation";
import { Home, RefreshCcw, Inbox, LogOut, X } from "lucide-react";
import { useAuth } from "../stores/useAuth.ts";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<"admin" | "user">(
    pathname?.startsWith("/admin") ? "admin" : "user"
  );
  const auth = useAuth();

  useEffect(() => {
    if (pathname?.startsWith("/admin")) setRole("admin");
    else setRole("user");
  }, [pathname]);

  const switchRole = (newRole: "admin" | "user") => {
    setRole(newRole);
    if (newRole === "admin") router.push("/admin");
    else router.push("/");
    setSidebarOpen(false);
  };

  const confirmLogout = () => {
    auth.logout();
    setLogoutDialogOpen(false);
    setSidebarOpen(false);
    router.push("/auth/login");
  };

  const menus: Navigation = {
    admin: [
      { name: "Home", href: "/admin", icon: Home },
      { name: "History", href: "/admin/history", icon: Inbox },
      {
        name: "Switch to User",
        action: () => switchRole("user"),
        icon: RefreshCcw,
      },
    ],
    user: [
      {
        name: "Switch to Admin",
        action: () => switchRole("admin"),
        icon: RefreshCcw,
      },
    ],
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside
        className={`flex flex-col justify-between w-64 bg-white border-r border-gray-200 h-screen fixed z-50 transition-transform
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static`}
      >
        <div>
          <div className="flex justify-between md:hidden ">
            <h2 className="text-2xl font-bold mb-6 mt-7 px-4">
            {role.toUpperCase()}
          </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded hover:bg-gray-100 focus:outline-none m-4"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

         <h2 className="text-2xl font-bold mb-6 mt-7 px-4 hidden md:block">
  {role.toUpperCase()}
</h2>

          <ul>
            {menus[role].map((menu, idx) => {
              const Icon = menu.icon;
              const isActive = menu.href ? pathname === menu.href : false;

              return (
                <li key={idx} className="mb-2">
                  {menu.href ? (
                    <Link
                      href={menu.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-2 py-3 px-4 rounded w-full transition-colors ${
                        isActive
                          ? "bg-blue-50"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                      {menu.name}
                    </Link>
                  ) : (
                    <button
                      onClick={menu.action}
                      className="flex items-center gap-2 py-3 px-4 rounded w-full hover:bg-gray-100 focus:outline-none transition-colors"
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                      {menu.name}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Logout button */}
        <div className="mb-4 px-4">
          <button
            onClick={() => setLogoutDialogOpen(true)}
            className="flex items-center gap-2 py-3 px-4 rounded w-full  hover:bg-red-50 transition-colors focus:outline-none"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      {logoutDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setLogoutDialogOpen(false)}
          ></div>

          <div className="bg-white rounded-lg shadow-lg z-50 p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setLogoutDialogOpen(false)}
                className="px-4 py-2 rounded hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
