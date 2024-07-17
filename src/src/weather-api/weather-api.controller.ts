import { Controller, Get } from '@nestjs/common';
import { WeatherApiService } from './weather-api.service';
import { Query } from '@nestjs/common';

@Controller('weather-api')
export class WeatherApiController {
  constructor(private readonly weatherService: WeatherApiService) {}

  @Get()
  async getWeather(@Query('location') location: string): Promise<any> {
    const response = await this.weatherService.getWeather(location);
    return response;
  }
}
