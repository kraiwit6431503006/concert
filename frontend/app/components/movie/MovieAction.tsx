"use client";

import { Movie } from "@/app/types/movie";
import { Edit, Trash2 } from "lucide-react";

interface Props {
  item: Movie;
  openEditModal: (movie: Movie) => void;
  setDeleteTarget: (movie: Movie) => void;
}

export default function MovieAction({
  item,
  openEditModal,
  setDeleteTarget,
}: Props) {
  return (
    <div className="rounded-lg">
      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="w-full aspect-2/3 object-cover rounded-md mb-2"
        />
      )}
      <h2 className="text-lg font-bold text-white line-clamp-1">
        {item.title}
      </h2>

      {/* Actions */}
      <div className="flex justify-end space-x-2 mt-2">
        <button
          onClick={() => openEditModal(item)}
          className="px-3 py-1 rounded-md bg-yellow-400 text-white flex items-center"
        >
          <Edit className="w-4 h-4" />{" "}
          <span className="hidden md:block ml-1">Edit</span>
        </button>
        <button
          onClick={() => setDeleteTarget(item)}
          className="px-3 py-1 rounded-md bg-red-700 text-white flex items-center"
        >
          <Trash2 className="w-4 h-4 " />{" "}
          <span className="hidden md:block ml-1">Delete</span>
        </button>
      </div>
    </div>
  );
}
