"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../stores/useAuth.ts";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // หน้า /auth/* ไม่ต้อง redirect
    if (pathname.startsWith("/auth")) return;

    if (!auth.isAuthenticated()) {
      router.push("/auth/login");
    }
  }, [auth, router, pathname]);

  if (!auth.isAuthenticated() && !pathname.startsWith("/auth")) return null;

  return <>{children}</>;
}
