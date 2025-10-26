"use client";

import { create } from "zustand";
import { useAuth } from "./useAuth.ts";
import { Concert } from "../types/concert";
import { Reservation, ReservationStats, ReservationHistory } from "../types/reservation";
import * as api from "@/app/lib/api";

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
  history: [],
  loading: null,
  error: null,
  stats: { reservedCount: 0, canceledCount: 0, totalCapacity: 0 },

  fetchConcerts: async () => {
    try {
      const data = await api.get<Concert[]>("/concerts");
      set({ concerts: data });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch concerts" });
    }
  },

  fetchReservations: async () => {
    try {
      const data = await api.get<Reservation[]>("/reservations", true);
      set({ reservations: data });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch reservations" });
    }
  },

  fetchAllReservations: async () => {
    try {
      const data = await api.get<Reservation[]>("/reservations/all", true);
      set({ allReservations: data });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch all reservations" });
    }
  },

  fetchStats: async () => {
    try {
      const data = await api.get<ReservationStats>("/reservations/stats", true);
      set({ stats: data });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch stats" });
    }
  },

  fetchHistory: async () => {
    try {
      const data = await api.get<ReservationHistory[]>("/reservations/history", true);
      set({ history: data });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch history" });
    }
  },

  handleReserve: async (concertId) => {
    const { user } = useAuth.getState();
    if (!user) return;

    set({ loading: concertId });
    try {
      await api.post(`/reservations/${concertId}`, { concertId, userId: user._id }, true);
      await get().fetchReservations();
    } catch (err: any) {
      alert(err.message || "Failed to reserve concert");
    } finally {
      set({ loading: null });
    }
  },

  handleCancel: async (concertId) => {
    const { reservations } = get();
    const { user: currentUser } = useAuth.getState();
    if (!currentUser || !reservations) return;

    set({ loading: concertId });

    try {
      const reservation = reservations.find(
        (r) =>
          (typeof r.concertId === "string" ? r.concertId : r.concertId._id) === concertId &&
          r.status === "reserved" &&
          r.userId === currentUser._id
      );
      if (!reservation) return;

      await api.post(`/reservations/cancel/${reservation._id}`, {}, true);
      await get().fetchReservations();
    } catch (err: any) {
      alert(err.message || "Failed to cancel reservation");
    } finally {
      set({ loading: null });
    }
  },

  isReserved: (concertId) => {
    const { reservations } = get();
    const { user } = useAuth.getState();
    return reservations.some(
      (r) =>
        r.status === "reserved" &&
        (typeof r.concertId === "string" ? r.concertId : r.concertId._id) === concertId &&
        r.userId === user?._id
    );
  },

  reservedCount: (concertId) => {
    const { allReservations } = get();
    return allReservations.filter(
      (r) =>
        (typeof r.concertId === "string" ? r.concertId : r.concertId._id) === concertId &&
        r.status === "reserved"
    ).length;
  },
}));
