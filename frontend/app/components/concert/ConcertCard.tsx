"use client";

import { Concert } from "@/app/types/concert";
import { Trash2, User } from "lucide-react";

interface Props {
  item: Concert;
  onDelete?: () => void;
}

export default function ConcertCard({ item,onDelete }: Props) {
  return (
    <div className=" bg-white border border-neutral-300 rounded-lg p-4 space-y-4">
      <h1 className="text-blue-400 font-bold text-2xl">{item.name}</h1>
      <div className="border-b border-neutral-300"></div>
      <p>
        {item.description}
      </p>
      <div className="flex justify-between">
        <div className="flex items-center">
          <User className="mr-2" /> {item.capacity}
        </div>
        <button
          type="button"
          className="px-4 flex py-2 bg-red-400 rounded-md text-white"
          onClick={onDelete}
        >
          <Trash2 className="mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
}
