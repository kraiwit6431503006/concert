import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rating } from './schemas/ratings.schema';

@Injectable()
export class RatingsService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<Rating>,
  ) {}

  async create(data: any) {
    return this.ratingModel.create(data);
  }

  async findUserRatings(userId: string) {
    return this.ratingModel.find({ userId });
  }

  async findAll() {
    return this.ratingModel.find();
  }
}
