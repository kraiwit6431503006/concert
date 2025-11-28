"use client";
import { useEffect, useState } from "react";
import { useAuth } from "./stores/useAuth";
import useMovie from "./stores/useMovie";
import { Movie } from "./types/movie";
import { Play, Star } from "lucide-react";
import MovieModal from "./components/movie/MovieModal";
import ReviewModal from "./components/movie/ReviewModal";
import useRecommendation from "./stores/useRecommendation";
import MovieCard from "./components/movie/MovieCard";
import MovieBanner from "./components/movie/MovieBanner";

export default function Home() {
  const { fetchUser, user } = useAuth();
  const { fetchMovies, movies, createRating } = useMovie();
  const {
    recommended,
    loading: recLoading,
    fetchRecommended,
  } = useRecommendation(user?._id || null);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [reviewMovie, setReviewMovie] = useState<Movie | null>(null);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const init = async () => {
      await fetchUser();
      await fetchMovies();
    };
    init();
  }, []);

  const categories = ["Popular", "Action", "Comedy", "Sci-fi"];
  const getMoviesByCategory = (category: string) =>
    movies.filter((m) => m.genres.includes(category));

  const handleReviewSubmit = async (rating: number) => {
    if (!reviewMovie) return;
    try {
      const userId = user?._id ? user._id : "s";
      await createRating({
        userId,
        movieId: reviewMovie._id,
        rating,
      });
      alert(`You rated ${reviewMovie.title} ${rating} stars`);
      fetchRecommended();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-4 space-y-8">
      {/* Banner */}
      <MovieBanner
        selectedMovie={setSelectedMovie}
        item={movies[0]}
        showReview={() => {
          setReviewMovie(movies[0]);
          setShowReview(true);
        }}
      />

      {/* Recommended */}
      {recommended.length !== 0 && (
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold">
            Recommended for you
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {recommended.map((movie) => (
              <MovieCard
                key={movie._id}
                item={movie}
                selectedMovie={setSelectedMovie}
                showReview={() => {
                  setReviewMovie(movie);
                  setShowReview(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {categories.map((cat) => {
        const catMovies = getMoviesByCategory(cat);
        if (!catMovies.length) return null;

        return (
          <div key={cat} className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold">{cat}</h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {catMovies.map((movie) => (
                <MovieCard
                  key={movie._id}
                  item={movie}
                  selectedMovie={setSelectedMovie}
                  showReview={() => {
                    setReviewMovie(movie);
                    setShowReview(true);
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Movie Modal */}
      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onReview={() => {
    if (selectedMovie) {
      setReviewMovie(selectedMovie);
      setShowReview(true);
    }
  }}
      />
      {/* Review Modal */}
      {showReview && reviewMovie && (
        <ReviewModal
          movieTitle={reviewMovie.title}
          onClose={() => setShowReview(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
}
