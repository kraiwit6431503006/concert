import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockService = {
    register: jest.fn().mockResolvedValue({ message: 'ok' }),
    login: jest.fn().mockResolvedValue({ access_token: 'mock_token' }),
    getMe: jest.fn().mockResolvedValue({ email: 'test@test.com' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call register()', async () => {
    const body = { username: 'test', email: 'a@a.com', password: '1234' };
    const result = await controller.register(body);
    expect(result).toEqual({ message: 'ok' });
    expect(service.register).toHaveBeenCalledWith('test', 'a@a.com', '1234');
  });

  it('should call login()', async () => {
    const body = { email: 'a@a.com', password: '1234' };
    const result = await controller.login(body);
    expect(result).toEqual({ access_token: 'mock_token' });
  });

  it('should return current user info', async () => {
    const req = { user: { userId: '123' } } as any;
    const result = await controller.getMe(req);
    expect(result).toEqual({ email: 'test@test.com' });
    expect(service.getMe).toHaveBeenCalledWith('123');
  });

  it('should return logout message', async () => {
    const req = { user: { email: 'test@test.com' } } as any;
    const result = await controller.logout(req);
    expect(result).toEqual({ message: 'User test@test.com logged out' });
  });
});
