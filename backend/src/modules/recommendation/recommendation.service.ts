import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rating } from '../ratings/schemas/ratings.schema';
import { Movie } from '../movies/schemas/movies.schema';
import { cosineSimilarity } from './similarity.util';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<Rating>,
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
  ) {}

  // build user rating map
  private async buildUserRatingMap() {
    const ratings = await this.ratingModel.find();
    const userMap: Record<string, any> = {};

    ratings.forEach((r) => {
      if (!userMap[r.userId]) userMap[r.userId] = {};
      userMap[r.userId][r.movieId] = r.rating;
    });

    return userMap;
  }

  //  Predict rating 
  private predictRating(targetUser, targetMovie, userMap) {
    let numerator = 0;
    let denominator = 0;

    for (const otherUser in userMap) {
      if (otherUser === targetUser) continue;

      if (userMap[otherUser][targetMovie] !== undefined) {
        const sim = cosineSimilarity(userMap[targetUser], userMap[otherUser]);
        numerator += sim * userMap[otherUser][targetMovie];
        denominator += Math.abs(sim);
      }
    }

    return denominator === 0 ? 0 : numerator / denominator;
  }

  // Recommend movies
  async recommendForUser(userId: string) {
    const userMap = await this.buildUserRatingMap();

    const allMovies = await this.movieModel.find();
    const watchedMovies = Object.keys(userMap[userId] || {});

    const candidates = allMovies.filter(
      (m) => !watchedMovies.includes(String(m._id)),
    );

    const predictions = candidates.map((movie) => ({
      movie,
      predicted: this.predictRating(userId, String(movie._id), userMap),
    }));

    return predictions.sort((a, b) => b.predicted - a.predicted);
  }
}
