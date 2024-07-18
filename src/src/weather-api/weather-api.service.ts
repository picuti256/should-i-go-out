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
    return `The weather is pleasant today for a walk! We have a temperature of ${weatherData.temperature}°C, with a humidity level of ${weatherData.humidity}%, no chance of rain, and winds at ${weatherData.wind}m/s`;
  }

  stayIn(weatherData: any) {
    return `It might be better to stay home today. The temperature today is ${
      weatherData.temperature
    }°C, with a humidity level of ${weatherData.humidity}%, ${
      weatherData.rain
        ? `With the problably the ${weatherData.rain}%`
        : 'With no rain today'
    } and winds at ${weatherData.wind}m/s`;
  }
}
