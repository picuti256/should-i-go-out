import { Module } from '@nestjs/common';
import { OpenAiModule } from './src/open-ai/open-ai.module';
import { WeatherApiModule } from './src/weather-api/weather-api.module';

@Module({
  imports: [OpenAiModule, WeatherApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
