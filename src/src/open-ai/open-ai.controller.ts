import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  OnModuleInit,
} from '@nestjs/common';
import { WeatherApiService } from '../weather-api/weather-api.service';
import { OpenAiService } from './open-ai.service';
import { Response } from 'express';
import logger from '../utils/logger.util';

@Controller('/chat')
export class OpenAiController implements OnModuleInit {
  constructor(
    private readonly weatherService: WeatherApiService,
    private readonly openAiService: OpenAiService,
  ) {}

  async onModuleInit() {
    try {
      await this.openAiService.createWeatherAssistant();
      logger.info('OpenAiService initialized successfully.');
    } catch (error) {
      logger.error('Failed to initialize OpenAiService:', error);
    }
  }

  @Post()
  async getChatResponse(@Body() body: { city: string }, @Res() res: Response) {
    try {
      const { city } = body;
      const response = await this.weatherService.getWeather(city);

      const formattedWeather = {
        temperature: response.main.temp,
        humidity: response.main.humidity,
        rain: response.weather[0].main === 'Rain' ? 'Yes' : 'No',
        wind: response.wind.speed,
      };

      const chatResponse = await this.openAiService.getChatResponse(
        formattedWeather,
      );

      res.status(HttpStatus.CREATED).json({ response: chatResponse });
    } catch (err) {
      logger.error('Error in getChatResponse:', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'An error occurred while processing your request.',
        error: err.message,
      });
    }
  }
}
