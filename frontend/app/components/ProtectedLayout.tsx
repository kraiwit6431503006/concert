"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../stores/useAuth";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (pathname.startsWith("/auth") && auth.token) {
        router.replace("/");
        return;
      }

      if (pathname.startsWith("/auth")) {
        setLoading(false);
        return;
      }

      if (auth.token && !auth.user) {
        try {
          await auth.fetchUser();
        } catch {
          auth.logout();
          router.replace("/auth/login");
          return;
        }
      }

      if (!auth.token) {
        router.replace("/auth/login");
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [auth, router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!auth.user && !pathname.startsWith("/auth")) {
    return null;
  }

  return <>{children}</>;
}
