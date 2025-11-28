"use client";

import { useState, useEffect } from "react";
import { Movie } from "../types/movie";
import * as api from "@/app/lib/api";

interface CreateMovieData {
  title: string;
  genres: string[];
  image: string;
  description: string;
}

interface RatingData {
  userId: string;
  movieId: string;
  rating: number;
}

export default function useMovie() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.get<Movie[]>("/movies");
      setMovies(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const createMovie = async (movie: CreateMovieData) => {
    try {
      const data = await api.post<Movie>("/movies", movie);
      setMovies((prev) => [...prev, data]);
      return data;
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
  };

  const deleteMovie = async (id: string) => {
    try {
      await api.del(`/movies/${id}`);
      setMovies((prev) => prev.filter((m) => m._id !== id));
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
  };

  const createRating = async (rating: RatingData) => {
    try {
      const data = await api.post("/ratings", rating);
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to create rating");
      throw err;
    }
  };

  const editMovie = async (id: string, data: CreateMovieData) => {
  try {
    const updated = await api.put<Movie>(`/movies/${id}`, data);
    setMovies((prev) =>
      prev.map((m) => (m._id === id ? { ...m, ...updated } : m))
    );
    return updated;
  } catch (err: any) {
    setError(err.message || "Failed to edit movie");
    throw err;
  }
};

  useEffect(() => {
    fetchMovies();
  }, []);

  return {
    movies,
    loading,
    error,
    fetchMovies,
    createMovie,
    deleteMovie,
    createRating,
    editMovie
  };
}
