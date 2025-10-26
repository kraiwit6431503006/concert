"use client";

import { useState, useEffect } from "react";
import { Concert } from "../types/concert";
import * as api from "@/app/lib/api";

interface CreateConcertData {
  name: string;
  capacity: number;
  description: string;
}

export default function useConcert() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConcerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Concert[]>("/concerts");
      setConcerts(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const createConcert = async (concert: CreateConcertData) => {
    try {
      const data = await api.post<Concert>("/concerts", concert);
      setConcerts((prev) => [...prev, data]);
      return data;
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
  };

  const deleteConcert = async (id: string) => {
    try {
      await api.del(`/concerts/${id}`);
      setConcerts((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
  };

  useEffect(() => {
    fetchConcerts();
  }, []);

  return {
    concerts,
    loading,
    error,
    fetchConcerts,
    createConcert,
    deleteConcert,
  };
}
