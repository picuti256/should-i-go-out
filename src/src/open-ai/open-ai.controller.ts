import { Controller, Post, Body } from '@nestjs/common';
import { WeatherApiService } from '../weather-api/weather-api.service';
import { OpenAiService } from './open-ai.service';
import logger from '../utils/logger.util';

@Controller('/chat')
export class OpenAiController {
  constructor(
    private readonly weatherService: WeatherApiService,
    private readonly openAiService: OpenAiService,
  ) {}

  @Post()
  async getChatResponse(@Body() body: { city: string }) {
    try {
      const { city } = body;
      const weather = await this.weatherService.getWeather(city);

      const prompt = `You will answer the user to inform them if the day is suitable for leaving home. You will ask the user their country and city, and you will inform them that it is a pleasant day to go out if they follow these rules:
The temperature must be less than 25 degrees Celsius
Air humidity must be less than 80%
Rain has to be 0
And the wind is less than 5

If you meet all the requirements, you should say to the user: It's a nice day today for a walk! We have a temperature of ${weather.main.temp}, with air humidity of ${weather.main.humidity}, no probability of rain and winds of ${weather.main.wind}
If you do not meet the requirements, you must inform the user: It may be best to stay at home today. Today's temperature is ${weather.main.temp}, with air humidity of ${weather.main.humidity}, (if there is a probability of rain, inform: With a probability of rain of ${weather[0].main}, if not, no probability of rain) and with winds of ${weather.main.wind}`;

      const response = await this.openAiService.createChatCompletion(prompt);
      return { response };
    } catch (err) {
      logger.error(err);
    }
  }
}
