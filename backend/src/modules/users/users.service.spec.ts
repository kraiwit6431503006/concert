import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let userModelMock: any;

  beforeEach(async () => {
    userModelMock = jest.fn().mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue(data),
    }));

    userModelMock.findOne = jest.fn();
    userModelMock.findById = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: userModelMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user when email does not exist', async () => {
      userModelMock.findOne.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as any);

      const result = await service.create(
        'testuser',
        'test@example.com',
        '123456',
      );

      expect(result.email).toBe('test@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
      expect(userModelMock.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });

    it('should throw ConflictException when email already exists', async () => {
      userModelMock.findOne.mockResolvedValue({ email: 'test@example.com' });

      await expect(
        service.create('testuser', 'test@example.com', '123456'),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      userModelMock.findOne.mockResolvedValue({ email: 'test@example.com' });

      const result = await service.findByEmail('test@example.com');
      expect(result.email).toBe('test@example.com');
      expect(userModelMock.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });
  });

  describe('validateUser', () => {
    it('should return user when password matches', async () => {
      userModelMock.findOne.mockResolvedValue({
        email: 'test@example.com',
        password: 'hashedPass',
      });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as any);

      const result = await service.validateUser('test@example.com', '123456');
      expect(result.email).toBe('test@example.com');
    });

    it('should return null when password does not match', async () => {
      userModelMock.findOne.mockResolvedValue({
        email: 'test@example.com',
        password: 'hashedPass',
      });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as any);

      const result = await service.validateUser(
        'test@example.com',
        'wrongpass',
      );
      expect(result).toBeNull();
    });

    it('should return null when user is not found', async () => {
      userModelMock.findOne.mockResolvedValue(null);

      const result = await service.validateUser(
        'notfound@example.com',
        '123456',
      );
      expect(result).toBeNull();
    });
  });
});
