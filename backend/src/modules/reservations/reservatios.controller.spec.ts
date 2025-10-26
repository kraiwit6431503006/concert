import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservatios.controller';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let service: ReservationsService;

  const mockService = {
    findAll: jest.fn().mockResolvedValue(['all reservations']),
    create: jest.fn().mockResolvedValue('created reservation'),
    findByUser: jest.fn().mockResolvedValue(['my reservations']),
    cancel: jest.fn().mockResolvedValue('canceled reservation'),
    getHistory: jest.fn().mockResolvedValue(['history']),
    getStats: jest.fn().mockResolvedValue({ reservedCount: 1, canceledCount: 0 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [{ provide: ReservationsService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ReservationsController>(ReservationsController);
    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll', async () => {
    const result = await controller.findAll();
    expect(result).toEqual(['all reservations']);
  });

  it('should create reservation', async () => {
    const req = { user: { userId: '123' } } as any;
    const result = await controller.create('abc', req);
    expect(result).toBe('created reservation');
  });

  it('should get user reservations', async () => {
    const req = { user: { userId: '123' } } as any;
    const result = await controller.getMyReservations(req);
    expect(result).toEqual(['my reservations']);
  });

  it('should cancel reservation', async () => {
    const req = { user: { userId: '123' } } as any;
    const result = await controller.cancel('id', req);
    expect(result).toBe('canceled reservation');
  });

  it('should get history', async () => {
    const req = { user: { userId: '123' } } as any;
    const result = await controller.getHistory(req);
    expect(result).toEqual(['history']);
  });

  it('should get stats', async () => {
    const result = await controller.getStates();
    expect(result).toEqual({ reservedCount: 1, canceledCount: 0 });
  });
});
