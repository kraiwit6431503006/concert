import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Concert, ConcertDocument } from './schemas/concert.schema';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectModel(Concert.name) private concertModel: Model<ConcertDocument>,
  ) {}

  async create(concert: Partial<Concert>): Promise<Concert> {
    const newConcert = new this.concertModel(concert);
    return newConcert.save();
  }

  async findAll(): Promise<Concert[]> {
    return this.concertModel.find().exec();
  }

  async findOne(id: string): Promise<Concert> {
    return this.concertModel.findById(id).exec();
  }

  async update(id: string, concert: Partial<Concert>): Promise<Concert> {
    return this.concertModel.findByIdAndUpdate(id, concert, { new: true }).exec();
  }

  async delete(id: string): Promise<Concert> {
    return this.concertModel.findByIdAndDelete(id).exec();
  }
}
