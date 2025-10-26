import { create } from "zustand";
import { useAuth } from "./useAuth.ts";
import { Concert } from "../types/concert.js";
import { Reservation, ReservationStats , ReservationHistory} from "../types/reservation.js";

interface ReservationState {
  concerts: Concert[];
  reservations: Reservation[];
  allReservations: Reservation[];
  history: ReservationHistory[];
  stats: ReservationStats;
  loading: string | null;
  error: string | null;

  fetchConcerts: () => Promise<void>;
  fetchReservations: () => Promise<void>;
  fetchAllReservations: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  handleReserve: (concertId: string) => Promise<void>;
  handleCancel: (concertId: string) => Promise<void>;
  isReserved: (concertId: string) => boolean;
  reservedCount: (concertId: string) => number;
}

export const useReservation = create<ReservationState>((set, get) => ({
  concerts: [],
  reservations: [],
  allReservations: [],
  history:[],
  loading: null,
  error: null,
  stats: { reservedCount: 0, canceledCount: 0, totalCapacity: 0 },

  fetchConcerts: async () => {
    try {
      const res = await fetch("http://localhost:5001/concerts");
      if (!res.ok) throw new Error("Failed to fetch concerts");
      const data = await res.json();
      set({ concerts: data });
    } catch (err: any) {
      set({ error: err.message || "Unknown error" });
    }
  },

  fetchReservations: async () => {
    const { user } = useAuth.getState();
    const userId = user?._id;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!userId || !token) return;

    try {
      const res = await fetch("http://localhost:5001/reservations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch reservations");
      const data = await res.json();
      set({ reservations: data });
    } catch (err: any) {
      console.error(err);
    }
  },

  fetchAllReservations: async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5001/reservations/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch all reservations");
      const data = await res.json();
      set({ allReservations: data });
    } catch (err: any) {
      console.error(err);
    }
  },

  handleReserve: async (concertId) => {
    const { user } = useAuth.getState();
    const userId = user?._id;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!userId || !token) return;

    set({ loading: concertId });
    try {
      const res = await fetch(
        `http://localhost:5001/reservations/${concertId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ concertId, userId }),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to reserve concert");
      }

      await get().fetchReservations();
    } catch (err: any) {
      alert(err.message || "Unknown error");
    } finally {
      set({ loading: null });
    }
  },

  handleCancel: async (concertId) => {
    const { user } = useAuth.getState();
    const userId = user?._id;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const { reservations } = get();
    if (!userId || !token) return;

    set({ loading: concertId });
    try {
      const reservation = reservations.find(
        (r) =>
          (typeof r.concertId === "string" ? r.concertId : r.concertId._id) ===
            concertId &&
          r.status === "reserved" &&
          r.userId === userId
      );
      if (!reservation) return;

      const res = await fetch(
        `http://localhost:5001/reservations/cancel/${reservation._id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to cancel reservation");
      }

      await get().fetchReservations();
    } catch (err: any) {
      alert(err.message || "Unknown error");
    } finally {
      set({ loading: null });
    }
  },

  isReserved: (concertId) => {
    const { reservations } = get();
    const { user } = useAuth.getState();
    const userId = user?._id;
    return reservations.some(
      (r) =>
        r.status === "reserved" &&
        (typeof r.concertId === "string" ? r.concertId : r.concertId._id) ===
          concertId &&
        r.userId === userId
    );
  },

  reservedCount: (concertId) => {
    const { allReservations } = get();
    return allReservations.filter(
      (r) =>
        (typeof r.concertId === "string" ? r.concertId : r.concertId._id) ===
          concertId && r.status === "reserved"
    ).length;
  },

  fetchStats: async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/reservations/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      set({ stats: data });
    } catch (err: any) {
      console.error(err);
    }
  },

  fetchHistory: async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/reservations/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      set({ history: data });
    } catch (err: any) {
      console.error(err);
    }
  },
}));
