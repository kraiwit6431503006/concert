"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/stores/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const auth = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await auth.register(username, email, password);
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-700">Sign Up</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-white">Username</label>
          <input
            type="text"
            className="w-full rounded-lg px-3 py-2 bg-neutral-800 text-white focus:outline-none focus:ring-0 focus:ring-neutral-800"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-white">Email</label>
          <input
            type="email"
            className="w-full rounded-lg px-3 py-2 bg-neutral-800 text-white focus:outline-none focus:ring-0 focus:ring-neutral-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-white">Password</label>
          <input
            type="password"
            className="w-full rounded-lg px-3 py-2 bg-neutral-800 text-white focus:outline-none focus:ring-0 focus:ring-neutral-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-700 text-white py-2 rounded-lg hover:bg-red-800"
        >
          Sign Up
        </button>
      </form>

      {/* Popup Success */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeInOut">
          Registration successful! Redirecting to login...
        </div>
      )}

      {/* Tailwind animation */}
      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-fadeInOut {
          animation: fadeInOut 2s forwards;
        }
      `}</style>
    </div>
  );
}
