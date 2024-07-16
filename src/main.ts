import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Config from './src/configs/config';
import logger from './src/utils/logger.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(Config.port, () => {
    logger.info(`Server runniung on port ${Config.port}`);
  });
}
bootstrap();
