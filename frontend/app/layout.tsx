"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
import { Menu } from "lucide-react";
import "./globals.css";
import ProtectedLayout from "./components/ProtectedLayout";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthPage = pathname?.startsWith("/auth");

  if (isAuthPage) {
    return (
      <html lang="en">
        <title>Movie Time</title>
        <link rel="icon" type="image/svg" href="/logo.svg" />
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ProtectedLayout>
            <div className="min-h-screen flex items-center justify-center bg-black">
              <div className="w-full max-w-md bg-neutral-900 p-8 rounded-lg shadow-lg">
                {children}
              </div>
            </div>
          </ProtectedLayout>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <title>Movie Time</title>
      <link rel="icon" type="image/svg" href="/logo.svg" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProtectedLayout>
          <div className="flex h-screen">
            {/* Desktop Sidebar */}
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />

            <div className="flex-1 flex flex-col">
              {/* Mobile Header */}
              <header className="md:hidden flex items-center justify-start bg-black p-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded hover:bg-gray-100 focus:outline-none"
                >
                  <Menu className="w-6 h-6 text-white" />
                </button>
                <div className="flex items-center space-x-1">
                  <div className="bg-red-700 text-white font-extrabold text-xl md:text-2xl w-8 h-8 flex items-center justify-center rounded-sm">
                    M
                  </div>
                  {/* Title */}
                  <h1 className="text-xl md:text-2xl font-bold text-white drop-shadow-md">
                    ovie Time
                  </h1>
                </div>
              </header>

              {/* Main scrollable */}
              <main className="flex-1 bg-black overflow-auto p-2 md:p-4">
                {children}
              </main>
            </div>
          </div>
        </ProtectedLayout>
      </body>
    </html>
  );
}
