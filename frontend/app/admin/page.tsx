"use client";

import { useState, useEffect } from "react";
import { Save, User, Award, XCircle, X } from "lucide-react";
import useConcert from "../stores/useConcert";
import { Concert } from "../types/concert";
import ConcertCard from "../components/concert/ConcertCard";
import ConcertForm from "../components/concert/ConcertForm";

type ToastType = "success" | "error";

export default function AdminHome() {
  const { concerts, createConcert, deleteConcert } = useConcert();
  const tabs = ["Overview", "Create"];
  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Concert | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteConcert(deleteTarget._id as string);
      showToast("Concert deleted successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to delete concert", "error");
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="p-6 space-y-6 relative">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 px-4 py-2 rounded shadow-md text-white z-50 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[
          { title: "Total Seats", value: 500, icon: User, color: "bg-sky-700" },
          { title: "Reserved", value: 320, icon: Award, color: "bg-teal-500" },
          { title: "Canceled", value: 50, icon: XCircle, color: "bg-red-400" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`rounded-md p-6 flex flex-col items-center justify-center text-white ${stat.color}`}
            >
              <Icon className="w-12 h-12 mb-3" />
              <span className="text-lg font-medium">{stat.title}</span>
              <span className="text-2xl font-bold mt-2">{stat.value}</span>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-2 mr-4 font-medium transition-colors ${
              activeTab === tab
                ? "text-blue-400"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-400" />
            )}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "Overview" &&
        concerts.map((concert: Concert, idx) => (
          <ConcertCard
            key={idx}
            item={concert}
            onDelete={() => {
              setDeleteTarget(concert);
              setDeleteConfirmOpen(true);
            }}
          />
        ))}

      {deleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 w-96  space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full p-2 w-fit bg-red-400">
                <X className="w-7 h-7 text-white" />
              </div>
            </div>

            <div className="text-center">
              <p className="text-xl font-bold">Are you sure to delete?</p>
              <p className="text-xl font-bold">"{deleteTarget?.name}"</p>
            </div>

            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 rounded-md border w-full"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-400 text-white w-full"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create */}

      {activeTab === "Create" && (
        <ConcertForm
          onCreate={async (data) => await createConcert(data)}
          loading={loading}
          toastHandler={showToast}
        />
      )}
    </div>
  );
}
