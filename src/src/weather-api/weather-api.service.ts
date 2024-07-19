import { Injectable } from '@nestjs/common';
import axios from 'axios';
import Config from '../configs/config';
import logger from '../utils/logger.util';

@Injectable()
export class WeatherApiService {
  private readonly apiKey = Config.weatherApiKey;

  async getWeather(city: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}&lang=pt_br`,
      );
      return response.data;
    } catch (err) {
      logger.error('Error fetching weather data:', err);
      throw new Error('Failed to fetch weather data.');
    }
  }

  async getTemperature(city: string): Promise<number> {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}&lang=pt_br`,
      );
      return response.data.main.temp;
    } catch (err) {
      logger.error('Error fetching temperature:', err);
      throw new Error('Failed to fetch temperature.');
    }
  }

  async getRainProbability(city: string): Promise<string> {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}&lang=pt_br`,
      );
      const rain = response.data.weather[0].main === 'Rain' ? 'Yes' : 'No';
      return rain;
    } catch (err) {
      logger.error('Error fetching rain probability:', err);
      throw new Error('Failed to fetch rain probability.');
    }
  }
}
