import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './schemas/reservation.schema';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservatios.controller';
import {
  ReservationHistory,
  ReservationHistorySchema,
} from './schemas/reservation-history.schema';
import { Concert, ConcertSchema } from '../concerts/schemas/concert.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
      { name: ReservationHistory.name, schema: ReservationHistorySchema },
       { name: Concert.name, schema: ConcertSchema }
    ]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
