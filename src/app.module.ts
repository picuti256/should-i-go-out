import { Module } from '@nestjs/common';
import { OpenAiModule } from './src/open-ai/open-ai.module';
import { WeatherApiModule } from './src/weather-api/weather-api.module';
import { WeatherApiService } from './src/weather-api/weather-api.service';

@Module({
  imports: [OpenAiModule, WeatherApiModule],
  controllers: [],
  providers: [WeatherApiService],
})
export class AppModule {}
