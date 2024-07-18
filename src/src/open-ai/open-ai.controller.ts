import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { WeatherApiService } from '../weather-api/weather-api.service';
import { OpenAiService } from './open-ai.service';
import logger from '../utils/logger.util';
import { Response } from 'express';

@Controller('/chat')
export class OpenAiController {
  constructor(
    private readonly weatherService: WeatherApiService,
    private readonly openAiService: OpenAiService,
  ) {}

  @Post()
  async getChatResponse(@Body() body: { city: string }, @Res() res: Response) {
    try {
      const { city } = body;
      const weather = await this.weatherService.getWeather(city);

      const prompt = `You will look at this WeatherAPI json response and based on the information received in it you will respond to the user if he can leave based on the rules:
The temperature must be less than 25 degrees Celsius
Air humidity must be less than 80%
Rain has to be 0
And the wind is less than 5

Here are the json from the weatherAPI: ${weather}

If you meet all the requirements, you should say to the user: It's a nice day today for a walk! We have a temperature of {tempeture}, with air humidity of {humidity}, no probability of rain and winds of {wind}
If you do not meet the requirements, you must inform the user: It may be best to stay at home today. Today's temperature is {tempeture}, with air humidity of {humidity}, (if there is a probability of rain, inform: With a probability of rain of {rain}, if not, no probability of rain) and with winds of {wind}`;

      const response = await this.openAiService.createChatCompletion(prompt);
      res.status(HttpStatus.CREATED).json({ response });
    } catch (err) {
      const { city } = body;
      const planB = await this.weatherService.checkWeatherConditions(city);
      res.status(HttpStatus.ACCEPTED).json({ planB });
      logger.error(err);
    }
  }
}
