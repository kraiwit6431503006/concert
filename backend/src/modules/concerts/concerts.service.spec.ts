import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsService } from './concerts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Concert } from './schemas/concert.schema';

const mockConcert = {
  _id: '1',
  name: 'Coldplay Live',
  capacity: 10000,
  description: 'World tour concert',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ConcertsService', () => {
  let service: ConcertsService;
  let model: Model<Concert>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertsService,
        {
          provide: getModelToken(Concert.name),
          useValue: {
            find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([mockConcert]) }),
            findById: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockConcert) }),
            findByIdAndUpdate: jest
              .fn()
              .mockReturnValue({ exec: jest.fn().mockResolvedValue({ ...mockConcert, name: 'Updated' }) }),
            findByIdAndDelete: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockConcert) }),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ConcertsService>(ConcertsService);
    model = module.get<Model<Concert>>(getModelToken(Concert.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return array of concerts', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockConcert]);
  });

  it('findOne should return a concert', async () => {
    const result = await service.findOne('1');
    expect(result).toEqual(mockConcert);
  });

  it('update should return updated concert', async () => {
    const result = await service.update('1', { name: 'Updated' });
    expect(result.name).toBe('Updated');
  });

  it('delete should return deleted concert', async () => {
    const result = await service.delete('1');
    expect(result).toEqual(mockConcert);
  });
});
