"use client";

import { Movie } from "@/app/types/movie";

interface Props {
  item: Movie;
  selectedMovie: (movie: Movie) => void;
  showReview?: () => void;
}

export default function MovieCard({ item, selectedMovie }: Props) {
  return (
    <div
      className="flex-none cursor-pointer snap-start transform transition hover:scale-105"
      onClick={() => selectedMovie(item)}
    >
      <div className="aspect-2/3 rounded-xl overflow-hidden shadow-md mb-2">
        <img
          src={item.image || "/movie-placeholder.jpg"}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-sm md:text-base font-medium truncate">
        {item.title}
      </h3>
    </div>
  );
}
