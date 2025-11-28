"use client";

import { useEffect, useState } from "react";
import { X, Edit, Trash2 } from "lucide-react";
import useMovie from "../stores/useMovie";
import { Movie } from "../types/movie";
import MovieForm from "../components/movie/MovieForm";
import MovieAction from "../components/movie/MovieAction";

type ToastType = "success" | "error";

export default function AdminHome() {
  const { fetchMovies, movies, deleteMovie, createMovie, editMovie } =
    useMovie();
  const [deleteTarget, setDeleteTarget] = useState<Movie | null>(null);
  const [editTarget, setEditTarget] = useState<Movie | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMovie(deleteTarget._id as string);
      showToast("Movie deleted successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to delete movie", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const openCreateModal = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEditModal = (movie: Movie) => {
    setEditTarget(movie);
    setModalOpen(true);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 relative bg-neutral-900 rounded-xl min-h-screen">
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

      {/* Add Movie Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-white font-bold text-2xl">Movie Management</h2>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-red-700 text-white rounded-md"
        >
          Add Movie
        </button>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {movies.map((movie) => (
          <MovieAction
            item={movie}
            openEditModal={openEditModal}
            setDeleteTarget={setDeleteTarget}
          />
        ))}
      </div>

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-neutral-900 rounded-lg p-6 w-96 space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full p-2 w-fit bg-red-700">
                <X className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">Are you sure to delete?</p>
              <p className="font-semibold mt-1 text-white
              ">"{deleteTarget.title}"</p>
            </div>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-md border w-full text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-700 text-white w-full"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <MovieForm
            initialData={editTarget || undefined}
            onSubmit={async (data) => {
              if (editTarget) {
                await editMovie(editTarget._id as string, data);
                showToast("Movie updated successfully!", "success");
              } else {
                await createMovie(data);
                showToast("Movie created successfully!", "success");
              }
              setModalOpen(false);
            }}
            onClose={() => setModalOpen(false)}
            toastHandler={showToast}
          />
        </div>
      )}
    </div>
  );
}
