import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Concert, ConcertSchema } from './schemas/concert.schema';
import { ConcertsService } from './concerts.service';
import { ConcertsController } from './concerts.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Concert.name, schema: ConcertSchema }]),
  ],
  providers: [ConcertsService],
  controllers: [ConcertsController],
})
export class ConcertsModule {}
