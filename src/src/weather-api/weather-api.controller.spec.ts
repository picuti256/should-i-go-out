import { Test, TestingModule } from '@nestjs/testing';
import { WeatherApiController } from './weather-api.controller';

describe('WeatherApiController', () => {
  let controller: WeatherApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherApiController],
    }).compile();

    controller = module.get<WeatherApiController>(WeatherApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
