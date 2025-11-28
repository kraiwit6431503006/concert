"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, LayoutGrid, LogOut, X } from "lucide-react";
import { useAuth } from "../stores/useAuth";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();

  const confirmLogout = () => {
    auth.logout();
    setLogoutDialogOpen(false);
    setSidebarOpen(false);
    router.push("/auth/login");
  };

  const menus = [
    { name: "Home", href: "/", icon: Home },
    { name: "Movie Management", href: "/movie-management", icon: LayoutGrid },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside
        className={`flex flex-col justify-between w-64 bg-neutral-900 h-screen fixed z-50 transition-transform
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static`}
      >
        <div>
          {/* Header */}
          <div className="flex justify-between md:hidden">
            <div className="flex items-center px-4">
              <div className="bg-red-700 text-white mr-1 font-extrabold text-xl md:text-2xl w-8 h-8 flex items-center justify-center rounded-sm">
                M
              </div>
              {/* Title */}
              <h1 className="text-xl md:text-2xl font-bold text-white drop-shadow-md">
                ovie Time
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded hover:bg-gray-100 focus:outline-none m-4"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="hidden md:flex items-center px-4 pt-6 pb-5">
            <div className="bg-red-700 text-white font-extrabold text-xl md:text-2xl w-8 h-8 flex items-center justify-center rounded-sm">
              M
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white drop-shadow-md ml-2">
              ovie Time
            </h1>
          </div>

          {/* เมนู */}
          <ul>
            {menus.map((menu, idx) => {
              const Icon = menu.icon;
              const isActive = menu.href ? pathname === menu.href : false;

              return (
                <li key={idx} className="mb-2">
                  <Link
                    href={menu.href!}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center ml-2 mr-2 gap-2 py-3 px-4 rounded transition-colors ${
                      isActive
                        ? "bg-blue-50 text-black"
                        : "hover:bg-white hover:text-black text-white"
                    }`}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    {menu.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Logout button */}
        <div className="mb-4 px-4">
          <button
            onClick={() => setLogoutDialogOpen(true)}
            className="flex items-center gap-2 py-3 px-4 rounded w-full bg-red-700 text-white transition-colors focus:outline-none"
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
