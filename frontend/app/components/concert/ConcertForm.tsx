"use client";

import { useState } from "react";
import { Save, User, X } from "lucide-react";
import { Concert } from "@/app/types/concert";

type ToastType = "success" | "error";
interface CreateConcertData {
  name: string;
  capacity: number;
  description: string;
}
interface Props {
   onCreate: (data: CreateConcertData) => Promise<Concert | undefined>;
  loading?: boolean;
  toastHandler: (message: string, type: ToastType) => void;
}

export default function ConcertForm({ onCreate, loading = false, toastHandler }: Props) {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSubmit = async () => {
    if (!name || !capacity) {
      toastHandler("Name and Capacity are required!", "error");
      setConfirmOpen(false);
      return;
    }

    setConfirmOpen(false);
    try {
      await onCreate({ name, capacity: Number(capacity), description });
      setName("");
      setCapacity("");
      setDescription("");
      toastHandler("Concert created successfully!", "success");
    } catch (err: any) {
      toastHandler(err.message || "Failed to create concert", "error");
    }
  };

  return (
    <div className="bg-white border border-neutral-300 rounded-lg p-6 space-y-6 shadow-sm relative">
      <h1 className="text-blue-500 font-bold text-2xl">Create Concert</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setConfirmOpen(true);
        }}
        className="grid grid-cols-12 gap-4"
      >
        {/* Concert Name */}
        <div className="col-span-12 md:col-span-6">
          <label className="block mb-2 font-medium text-gray-700">
            Concert Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Please input concert name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>

        {/* Total Seats */}
        <div className="col-span-12 md:col-span-6 relative">
          <label className="block mb-2 font-medium text-gray-700">
            Total Seats
          </label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            placeholder="500"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
          <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        {/* Description */}
        <div className="col-span-12">
          <label className="block mb-2 font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please input description"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none"
            rows={4}
          />
        </div>

        <div className="col-span-12 flex justify-end">
          <button
            type="submit"
            className="px-4 flex py-2 bg-blue-400 rounded-md text-white"
            disabled={loading}
          >
            <Save className="mr-2" />
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

      {/* Confirm Dialog */}
      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Confirm Create</h2>
            <p>Are you sure you want to create this concert?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded-md border"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-md bg-blue-400 text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
