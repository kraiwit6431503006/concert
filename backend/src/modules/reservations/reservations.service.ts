import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import {
  ReservationHistory,
  ReservationHistoryDocument,
} from './schemas/reservation-history.schema';
import { Concert, ConcertDocument } from '../concerts/schemas/concert.schema';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
    @InjectModel(ReservationHistory.name)
    private historyModel: Model<ReservationHistoryDocument>,
    @InjectModel(Concert.name)
    private concertModel: Model<ConcertDocument>,
  ) {}

  async findAll(): Promise<Reservation[]> {
    return this.reservationModel
      .find()
      .populate('concertId', 'name capacity')
      .sort({ createdAt: -1 })
      .exec();
  }

  async create(concertId: string, userId: string): Promise<Reservation> {
    const concert = await this.concertModel.findById(concertId);
    if (!concert) throw new NotFoundException('Concert not found.');

    const existing = await this.reservationModel.findOne({
      concertId,
      userId,
      status: 'reserved',
    });
    if (existing)
      throw new BadRequestException('You already reserved this concert.');

    const reservedCount = await this.reservationModel.countDocuments({
      concertId,
      status: 'reserved',
    });

    if (reservedCount >= concert.capacity) {
      throw new BadRequestException('This concert is fully booked.');
    }

    const reservation = await this.reservationModel.create({
      concertId: new Types.ObjectId(concertId),
      userId: new Types.ObjectId(userId),
    });

    await this.historyModel.create({
      reservationId: reservation._id,
      concertId,
      userId,
      action: 'reserved',
    });

    return reservation;
  }

  async findByUser(userId: string): Promise<Reservation[]> {
    return this.reservationModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('concertId', 'name capacity')
      .exec();
  }

  async cancel(reservationId: string, userId: string): Promise<Reservation> {
    const reservation = await this.reservationModel.findOne({
      _id: new Types.ObjectId(reservationId),
      userId: new Types.ObjectId(userId),
    });
    if (!reservation) throw new NotFoundException('Reservation not found.');
    if (reservation.status === 'canceled')
      throw new BadRequestException('Reservation already canceled.');

    reservation.status = 'canceled';
    reservation.canceledAt = new Date();
    await reservation.save();

    await this.historyModel.create({
      reservationId,
      concertId: reservation.concertId,
      userId,
      action: 'canceled',
    });

    return reservation;
  }

  async getHistory(userId: string): Promise<ReservationHistory[]> {
    return this.historyModel
      .find({ userId })
      .populate('concertId', 'name')
      .populate('userId', 'username')
      .sort({ timestamp: -1 })
      .exec();
  }

  async getStats() {
    const reservedCount = await this.reservationModel.countDocuments({
      status: 'reserved',
    });

    const canceledCount = await this.reservationModel.countDocuments({
      status: 'canceled',
    });

    const concerts = await this.concertModel.find().select('capacity').exec();
    const totalCapacity = concerts.reduce((sum, c) => sum + c.capacity, 0);

    return {
      reservedCount,
      canceledCount,
      totalCapacity,
    };
  }
}
