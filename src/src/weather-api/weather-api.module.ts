import { Module } from '@nestjs/common';
import { WeatherApiController } from './weather-api.controller';
import { WeatherApiService } from './weather-api.service';

@Module({
  controllers: [WeatherApiController],
  providers: [WeatherApiService],
  exports: [WeatherApiService],
})
export class WeatherApiModule {}
