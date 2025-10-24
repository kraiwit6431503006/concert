import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConcertDocument = Concert & Document;

@Schema({ timestamps: true }) // สร้าง createdAt และ updatedAt อัตโนมัติ
export class Concert {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  capacity: number;

  @Prop()
  description?: string;
}

export const ConcertSchema = SchemaFactory.createForClass(Concert);
