import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';

describe('ConcertsController', () => {
  let controller: ConcertsController;
  let service: ConcertsService;

  const mockConcert = {
    _id: '1',
    name: 'Coldplay',
    capacity: 10000,
    description: 'Awesome concert',
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockConcert),
    findAll: jest.fn().mockResolvedValue([mockConcert]),
    findOne: jest.fn().mockResolvedValue(mockConcert),
    update: jest.fn().mockResolvedValue({ ...mockConcert, name: 'Updated Concert' }),
    delete: jest.fn().mockResolvedValue(mockConcert),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertsController],
      providers: [
        {
          provide: ConcertsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ConcertsController>(ConcertsController);
    service = module.get<ConcertsService>(ConcertsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a concert', async () => {
    const result = await controller.create(mockConcert);
    expect(result).toEqual(mockConcert);
    expect(service.create).toHaveBeenCalledWith(mockConcert);
  });

  it('should return all concerts', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockConcert]);
  });

  it('should return one concert', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual(mockConcert);
  });

  it('should update a concert', async () => {
    const result = await controller.update('1', { name: 'Updated Concert' });
    expect(result.name).toBe('Updated Concert');
  });

  it('should delete a concert', async () => {
    const result = await controller.delete('1');
    expect(result).toEqual(mockConcert);
  });
});
