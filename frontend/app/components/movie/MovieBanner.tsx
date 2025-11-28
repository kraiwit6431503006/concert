"use client";

import { Movie } from "@/app/types/movie";
import { Play, Star } from "lucide-react";

interface Props {
  item: Movie;
  selectedMovie: (movie: Movie) => void;
  showReview:() => void;
}

export default function MovieBanner({ item, selectedMovie,showReview }: Props) {
  return (
    <div className="relative w-full h-[450px] rounded-xl overflow-hidden">
      {/* Background image */}
      <img
        src={item?.image}
        alt={item?.title}
        className="w-full h-full object-cover filter md:blur-sm scale-105"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0  from-black/70 via-black/30 to-transparent z-10"></div>

      <div
        className="absolute bottom-0 md:left-12 md:bottom-12 space-y-4 z-20 max-w-lg 
        bg-black/50 w-full md:bg-transparent md:w-auto p-4 md:p-0"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
          {item?.title}
        </h1>
        <p className="text-sm md:text-base text-white drop-shadow hidden md:block">
          {item?.description}
        </p>

        {/* Play Button */}
        <div className="flex items-center">
          <button className="mt-2 flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg  transition"  onClick={() => selectedMovie(item)}>
            <Play />
            Play
          </button>
          <button className="mt-2 ml-2 flex items-center gap-2 px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-lg transition" onClick={showReview}>
            <Star className="w-5 h-5 text-yellow-400" />
            Review
          </button>
        </div>
      </div>

      {/* Extra image on right */}
      {item?.image && (
        <img
          src={item.image}
          alt={item.title}
          className="hidden md:block absolute top-1/2 right-12 h-4/5 w-auto object-cover rounded-xl -translate-y-1/2 shadow-2xl z-30 transition-transform duration-500 hover:scale-105"
        />
      )}
    </div>
  );
}
