import { Injectable } from '@nestjs/common';
import Config from '../configs/config';
import axios from 'axios';
import logger from '../utils/logger.util';

@Injectable()
export class WeatherApiService {
  private readonly apiKey = Config.weatherApiKey;

  async getWeather(city: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}&lang=pt_br`,
      );
      return response;
    } catch (err) {
      logger.error(err);
      throw new Error(err);
    }
  }

  async checkWeatherConditions(city: string) {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}&lang=pt_br`,
    );

    const weatherData = response.data;

    const tempeture = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const wind = weatherData.wind.speed;
    const rain = weatherData.weather[0].rain;

    const goodWeather =
      tempeture < 25 && humidity < 80 && rain === 0 && wind < 5;

    return goodWeather
      ? this.goOut({ tempeture, humidity, wind })
      : this.stayIn({ tempeture, humidity, wind, rain });
  }

  goOut(weatherData: any) {
    return `O dia está agradavel hoje para um passeio! Temos temperatura de ${weatherData.tempeture}°C, com umidade do ar de ${weatherData.humidity}%, sem probabilidade de chuva e ventos de ${weatherData.wind}m/s`;
  }

  stayIn(weatherData: any) {
    return `Talvez seja melhor ficar em casa hoje. A temperatura é de hoje é ${
      weatherData.tempeture
    }°C, com umidade do ar de ${weatherData.humidity}%, ${
      weatherData.rain
        ? `Com probabilidade de chuva de ${weatherData.rain}%`
        : 'sem probabilidade de chuva'
    } e com ventos de ${weatherData.wind}m/s`;
  }
}
