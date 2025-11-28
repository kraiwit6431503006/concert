"use client";

import { X, Star } from "lucide-react";
import { useState } from "react";

interface Props {
  movieTitle: string;
  onClose: () => void;
  onSubmit: (rating: number) => void;
}

export default function ReviewModal({ movieTitle, onClose, onSubmit }: Props) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  const stars = [1, 2, 3, 4, 5];

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>

      {/* Modal content */}
      <div className="relative z-10 bg-black text-white w-full max-w-md rounded-xl p-6 flex flex-col items-center space-y-4 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/20 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl md:text-2xl font-bold text-center">
          Review "{movieTitle}"
        </h2>

        {/* Star rating */}
        <div className="flex gap-2">
          {stars.map((star) => (
            <Star
              key={star}
              className={`w-10 h-10 cursor-pointer transition ${
                (hovered || rating) >= star ? "text-yellow-400" : "text-gray-500"
              }`}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className="mt-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition disabled:bg-gray-600"
          disabled={rating === 0}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
