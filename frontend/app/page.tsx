"use client";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useAuth } from "./stores/useAuth.ts";
import { useReservation } from "./stores/useReservation";

interface Toast {
  message: string;
  type: "success" | "error";
}

export default function Home() {
  const { fetchUser, user } = useAuth();
  const {
    concerts,
    error,
    loading,
    fetchConcerts,
    fetchReservations,
    fetchAllReservations,
    handleReserve: reserveFn,
    handleCancel: cancelFn,
    isReserved,
    reservedCount,
  } = useReservation();

  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    const init = async () => {
      await fetchUser();
    };
    init();
  }, []);

  useEffect(() => {
    if (user?._id) {
      fetchConcerts();
      fetchReservations();
      fetchAllReservations();
    }
  }, [user]);

  const handleReserve = async (concertId: string) => {
    try {
      await reserveFn(concertId);
      setToast({ message: "Reservation successful!", type: "success" });
    } catch (err: any) {
      setToast({ message: err.message || "Failed to reserve", type: "error" });
    } finally {
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleCancel = async (concertId: string) => {
    try {
      await cancelFn(concertId);
      setToast({ message: "Reservation canceled!", type: "success" });
    } catch (err: any) {
      setToast({ message: err.message || "Failed to cancel", type: "error" });
    } finally {
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="space-y-4 p-2 md:p-6">
      {error && <p className="text-red-500">{error}</p>}

      {concerts.map((concert) => {
        const reserved = isReserved(concert._id);
        const full = reservedCount(concert._id) >= concert.capacity;

        return (
          <div
            key={concert._id}
            className="bg-white border border-neutral-300 rounded-lg p-4 space-y-4"
          >
            <h1 className="text-blue-400 font-bold text-2xl">{concert.name}</h1>
            <p>{concert.description}</p>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <User className="mr-2" /> {concert.capacity}
              </div>

              {reserved ? (
                <button
                  onClick={() => handleCancel(concert._id)}
                  disabled={loading === concert._id}
                  className="px-4 py-2 bg-red-400 rounded-md text-white"
                >
                  {loading === concert._id ? "Canceling..." : "Cancel"}
                </button>
              ) : full ? (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-400 rounded-md text-white"
                >
                  Full
                </button>
              ) : (
                <button
                  onClick={() => handleReserve(concert._id)}
                  disabled={loading === concert._id}
                  className="px-4 py-2 bg-blue-400 rounded-md text-white"
                >
                  {loading === concert._id ? "Reserving..." : "Reserve"}
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 px-4 py-2 rounded shadow-md text-white z-50 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
