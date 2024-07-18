import { Injectable } from '@nestjs/common';
import Config from '../configs/config';
import axios from 'axios';
import logger from '../utils/logger.util';

@Injectable()
export class WeatherApiService {
  private readonly apiKey = Config.weatherApiKey;

  async getWeather(location: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${this.apiKey}`,
      );

      return response.data;
    } catch (err) {
      logger.error(err);
      throw new Error(err);
    }
  }
}
