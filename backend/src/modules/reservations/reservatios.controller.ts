import { Controller, Post, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async findAll() {
    return this.reservationsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':concertId')
  async create(@Param('concertId') concertId: string, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.reservationsService.create(concertId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyReservations(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.reservationsService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('cancel/:id')
  async cancel(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.reservationsService.cancel(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getHistory(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.reservationsService.getHistory(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
   async getStates() {
    return this.reservationsService.getStats();
  }
}
