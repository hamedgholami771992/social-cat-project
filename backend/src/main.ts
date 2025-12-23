import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { EnvironmentVarTypes } from './config/env.types';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './common/logger/logger.service';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService: ConfigService<EnvironmentVarTypes> = await appContext.get(ConfigService);
  const loggerService = appContext.get(LoggerService);

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
  });

  app.useLogger(loggerService);
  app.useGlobalFilters(new AllExceptionsFilter(loggerService));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT);
}
bootstrap();
