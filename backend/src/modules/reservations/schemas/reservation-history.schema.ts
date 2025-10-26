import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReservationHistoryDocument = ReservationHistory & Document;

@Schema({ timestamps: true })
export class ReservationHistory {
  @Prop({ type: Types.ObjectId, ref: 'Reservation', required: true })
  reservationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Concert', required: true })
  concertId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: ['reserved', 'canceled'], required: true })
  action: string;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const ReservationHistorySchema = SchemaFactory.createForClass(ReservationHistory);
