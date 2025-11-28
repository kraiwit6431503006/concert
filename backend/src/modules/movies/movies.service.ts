import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from './schemas/movies.schema';

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}

  async create(data: any) {
    return this.movieModel.create(data);
  }

  async findAll() {
    return this.movieModel.find();
  }

  async findOne(id: string) {
    return this.movieModel.findById(id);
  }

  async update(id: string, data: any) {
    return this.movieModel.findByIdAndUpdate(id, data, { new: true });
  }
}
