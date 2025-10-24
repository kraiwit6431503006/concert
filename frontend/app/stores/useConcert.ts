"use client";

import { useState, useEffect } from "react";
import { Concert } from "../types/concert";

export default function useConcert() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConcerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5001/concerts");
      if (!res.ok) throw new Error("Failed to fetch concerts");
      const data: Concert[] = await res.json();
      setConcerts(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const createConcert = async (concert: Concert) => {
    try {
      const res = await fetch("http://localhost:5001/concerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(concert),
      });
      if (!res.ok) throw new Error("Failed to create concert");
      const data: Concert = await res.json();
      setConcerts((prev) => [...prev, data]);
      return data;
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
  };

  const deleteConcert = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5001/concerts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete concert");
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
