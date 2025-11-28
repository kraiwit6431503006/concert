import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Rating {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  movieId: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
