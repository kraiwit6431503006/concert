"use client";

import { useState, useEffect } from "react";
import { Save, X, ImageIcon, List } from "lucide-react";
import { Movie } from "@/app/types/movie";

type ToastType = "success" | "error";

interface CreateMovieData {
  title: string;
  genres: string[];
  image: string;
  description: string;
}

interface Props {
  initialData?: Movie;
  onSubmit: (data: CreateMovieData) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
  toastHandler: (message: string, type: ToastType) => void;
}

export default function MovieForm({ initialData, onSubmit, onClose, loading = false, toastHandler }: Props) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [genres, setGenres] = useState(initialData?.genres.join(", ") || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [description, setDescription] = useState(initialData?.description || "");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setGenres(initialData.genres.join(", "));
      setImage(initialData.image || "");
      setDescription(initialData.description || "");
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!title || !genres) {
      toastHandler("Title and Genres are required!", "error");
      return;
    }

    await onSubmit({
      title,
      genres: genres.split(",").map((g) => g.trim()),
      image,
      description,
    });

    setTitle("");
    setGenres("");
    setImage("");
    setDescription("");
    onClose();
  };

  return (
    <div className="bg-neutral-900 border rounded-lg p-6 space-y-6 shadow-lg w-full max-w-lg relative">
      <h1 className="text-white font-bold text-2xl">{initialData ? "Edit Movie" : "Add Movie"}</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="grid grid-cols-12 gap-4"
      >
        {/* Title */}
        <div className="col-span-12 md:col-span-6">
          <label className="block mb-2 font-medium text-white">Movie Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Inception"
            className="w-full bg-neutral-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-0 focus:ring-neutral-800"
          />
        </div>

        {/* Genres */}
        <div className="col-span-12 md:col-span-6 relative">
          <label className="block mb-2 font-medium text-white">Genres (comma separated)</label>
          <input
            type="text"
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
            placeholder="Action, Sci-fi"
            className="w-full bg-neutral-800 text-white rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-0 focus:ring-neutral-800"
          />
        </div>

        {/* Image URL */}
        <div className="col-span-12 relative">
          <label className="block mb-2 font-medium text-white">Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://image-url.jpg"
            className="w-full bg-neutral-800 text-white  rounded-lg px-4 py-2 focus:outline-none focus:ring-0 focus:ring-neutral-800"
          />
        </div>

        {/* Description */}
        <div className="col-span-12">
          <label className="block mb-2 font-medium text-white">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Movie description..."
            rows={4}
            className="w-full bg-neutral-800 text-white rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-0 focus:ring-neutral-800"
          />
        </div>

        {/* Submit */}
        <div className="col-span-12 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-700 text-white rounded-md flex items-center"
            disabled={loading}
          >
            <Save className="mr-2" /> {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
