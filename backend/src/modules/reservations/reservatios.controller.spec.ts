import { Test, TestingModule } from '@nestjs/testing';
import { ReservatiosController } from './reservatios.controller';


describe('ReservatiosController', () => {
  let controller: ReservatiosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservatiosController],
    }).compile();

    controller = module.get<ReservatiosController>(ReservatiosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
