import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RatingsService } from './ratings.service';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  create(@Body() body: any) {
    return this.ratingsService.create(body);
  }

  @Get('user/:userId')
  getUserRatings(@Param('userId') userId: string) {
    return this.ratingsService.findUserRatings(userId);
  }

  @Get()
  findAll() {
    return this.ratingsService.findAll();
  }
}
