import { Controller, Get, Param } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly service: RecommendationService) {}

  @Get(':userId')
  getRecommendation(@Param('userId') userId: string) {
    return this.service.recommendForUser(userId);
  }
}