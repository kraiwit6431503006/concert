"use client";

import { Play, X, Star } from "lucide-react";
import { Movie } from "@/app/types/movie";

interface Props {
  movie: Movie | null;
  onClose: () => void;
  onReview?: () => void;
}

export default function MovieModal({ movie, onClose, onReview }: Props) {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative z-10 w-full h-full md:max-w-4xl md:max-h-[90vh] bg-black text-white flex flex-col md:flex-row rounded-none md:rounded-xl overflow-hidden">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/20 transition z-20"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Movie Image */}
        {movie.image && (
          <div className="w-full md:w-2/3 md:h-auto h-[30vh]">
            <img
              src={movie.image}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Movie Info */}
        <div className="w-full md:w-1/3 flex flex-col h-full min-h-0">
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            <h2 className="text-2xl md:text-4xl font-bold">{movie.title}</h2>
            <p className="text-sm md:text-base text-gray-300">{movie.description}</p>
            <p className="text-sm text-gray-400">Genres: {movie.genres.join(", ")}</p>
          </div>

          {/* Buttons fixed bottom */}
          <div className="flex flex-col gap-3 p-4 md:p-6 bg-black md:bg-transparent">
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition">
              <Play className="w-5 h-5" />
              Play
            </button>
            <button
              onClick={onReview}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-600 transition"
            >
              <Star className="w-5 h-5 text-yellow-400" />
              Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
