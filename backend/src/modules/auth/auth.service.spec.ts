import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    create: jest.fn(),
    validateUser: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked_jwt_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register new user', async () => {
      const mockUser = { username: 'John', email: 'john@test.com', password: '123' };
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await service.register('John', 'john@test.com', '123');
      expect(result).toEqual({
        message: 'User registered successfully',
        user: mockUser,
      });
    });
  });

  describe('login', () => {
    it('should return jwt token when credentials valid', async () => {
      const mockUser = { _id: '1', email: 'test@test.com' };
      mockUsersService.validateUser.mockResolvedValue(mockUser);

      const result = await service.login('test@test.com', 'password');
      expect(result).toEqual({ access_token: 'mocked_jwt_token' });
    });

    it('should throw UnauthorizedException when invalid credentials', async () => {
      mockUsersService.validateUser.mockResolvedValue(null);

      await expect(service.login('a@a.com', 'wrong')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getMe', () => {
    it('should return user data if found', async () => {
      const mockUser = { _id: '123', email: 'john@test.com' };
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await service.getMe('123');
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findById.mockResolvedValue(null);
      await expect(service.getMe('123')).rejects.toThrow(UnauthorizedException);
    });
  });
});
