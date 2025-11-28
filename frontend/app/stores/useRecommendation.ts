"use client";
import { useState, useEffect } from "react";
import { Movie } from "../types/movie";
import * as api from "@/app/lib/api";

export default function useRecommendation(userId: string | null) {
  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommended = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Movie[]>(`/recommendation/${userId}`);
      setRecommended(data.map((r: any) => r.movie));
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommended();
  }, [userId]);

  return { recommended, loading, error, fetchRecommended };
}
