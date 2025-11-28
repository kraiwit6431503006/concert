"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/stores/useAuth";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (auth.isAuthenticated()) {
      router.push("/");
    }
  }, [auth, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await auth.login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center text-red-700">Sign in</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-white">Email</label>
          <input
            type="email"
            className="w-full bg-neutral-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-0 focus:ring-neutral-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <label className="block mb-1 text-white">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full bg-neutral-800 text-white rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-0 focus:ring-neutral-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-red-700 text-white py-2 rounded-lg hover:bg-red-800"
        >
          Sign in
        </button>

        <p className="text-center text-neutral-400">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-red-700 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </>
  );
}
