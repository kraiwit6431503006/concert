import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop([String])
  genres: string[];

  @Prop({ required: false })
  image: string;

  @Prop({ required: false })
  description: string; 
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
