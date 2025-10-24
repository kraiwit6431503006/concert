import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
     MongooseModule.forRoot('mongodb://localhost:27017/concertdb'),
     UsersModule,
     AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
