import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ type: Types.ObjectId, ref: 'Concert', required: true })
  concertId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: ['reserved', 'canceled'], default: 'reserved' })
  status: string;

  @Prop({ type: Date, default: Date.now })
  reservedAt: Date;

  @Prop({ type: Date, default: null })
  canceledAt?: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
