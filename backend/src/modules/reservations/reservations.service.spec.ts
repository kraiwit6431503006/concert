import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Reservation } from './schemas/reservation.schema';
import { ReservationHistory } from './schemas/reservation-history.schema';
import { Concert } from '../concerts/schemas/concert.schema';

describe('ReservationsService', () => {
  let service: ReservationsService;
  const mockReservationId = new Types.ObjectId().toHexString();
  const mockUserId = new Types.ObjectId().toHexString();

  const mockReservation = {
    _id: new Types.ObjectId(),
    concertId: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    status: 'reserved',
    save: jest.fn(),
  };

  const mockConcert = {
    _id: new Types.ObjectId(),
    name: 'Coldplay',
    capacity: 2,
  };

  const mockReservationModel = {
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn(),
    findById: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
    sort: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockHistoryModel = {
    create: jest.fn(),
    find: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  const mockConcertModel = {
    findById: jest.fn(),
    find: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getModelToken(Reservation.name),
          useValue: mockReservationModel,
        },
        {
          provide: getModelToken(ReservationHistory.name),
          useValue: mockHistoryModel,
        },
        { provide: getModelToken(Concert.name), useValue: mockConcertModel },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new reservation successfully', async () => {
      mockConcertModel.findById.mockResolvedValue(mockConcert);
      mockReservationModel.findOne.mockResolvedValue(null);
      mockReservationModel.countDocuments.mockResolvedValue(0);
      mockReservationModel.create.mockResolvedValue(mockReservation);

      const result = await service.create(
        mockConcert._id.toString(),
        mockReservation.userId.toString(),
      );
      expect(result).toEqual(mockReservation);
      expect(mockHistoryModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'reserved' }),
      );
    });

    it('should throw if concert not found', async () => {
      mockConcertModel.findById.mockResolvedValue(null);
      await expect(service.create('fakeId', 'userId')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw if already reserved', async () => {
      mockConcertModel.findById.mockResolvedValue(mockConcert);
      mockReservationModel.findOne.mockResolvedValue(mockReservation);

      await expect(
        service.create(
          mockConcert._id.toString(),
          mockReservation.userId.toString(),
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if concert full', async () => {
      mockConcertModel.findById.mockResolvedValue(mockConcert);
      mockReservationModel.findOne.mockResolvedValue(null);
      mockReservationModel.countDocuments.mockResolvedValue(2);

      await expect(
        service.create(
          mockConcert._id.toString(),
          mockReservation.userId.toString(),
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('cancel', () => {
    it('should cancel reservation successfully', async () => {
      mockReservationModel.findOne.mockResolvedValue(mockReservation);

      const result = await service.cancel(
        mockReservation._id.toString(),
        mockReservation.userId.toString(),
      );
      expect(result.status).toBe('canceled');
      expect(mockHistoryModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'canceled' }),
      );
    });

    it('should throw if reservation not found', async () => {
      const reservationModel = (service as any).reservationModel;
      reservationModel.findOne.mockResolvedValue(null);

      await expect(
        service.cancel(mockReservationId, mockUserId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
