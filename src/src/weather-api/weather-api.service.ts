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
      return this.checkWeatherConditions(response.data)
        ? this.goOut(response.data)
        : this.stayIn(response.data);
    } catch (err) {
      logger.error(err);
      throw new Error(err);
    }
  }

  checkWeatherConditions(weatherData: any) {
    const tempeture = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const wind = weatherData.wind.speed;
    const rain = weatherData.weather[0].main;

    return tempeture < 25 && humidity < 80 && rain !== 'Rain' && wind < 5;
  }

  goOut(weatherData: any) {
    const tempeture = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const wind = weatherData.wind.speed;
    return `O dia está agradavel hoje para um passeio! Temos temperatura de ${tempeture}°C, com umidade do ar de ${humidity}%, sem probabilidade de chuva e ventos de ${wind}m/s`;
  }

  stayIn(weatherData: any) {
    const tempeture = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const wind = weatherData.wind.speed;
    const rain = weatherData.weather[0].rain;

    return `Talvez seja melhor ficar em casa hoje. A temperatura é de hoje é ${tempeture}°C, com umidade do ar de ${humidity}%, ${
      rain
        ? `Com probabilidade de chuva de ${rain}%`
        : 'sem probabilidade de chuva'
    } e com ventos de ${wind}m/s`;
  }
}
