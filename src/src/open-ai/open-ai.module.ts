import { Module } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { OpenAiController } from './open-ai.controller';
import { WeatherApiModule } from '../weather-api/weather-api.module';

@Module({
  providers: [OpenAiService],
  controllers: [OpenAiController],
  imports: [WeatherApiModule],
})
export class OpenAiModule {}
