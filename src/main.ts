import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
    }),
  );

  app.use(
    session({
      secret:
        'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwMzgzNjI3NCwiaWF0IjoxNzAzODM2Mjc0fQ._jk9bDxvcmAjNqzyCyL8dmqOGM5TY3In5WrNKo5PGgI',
    }),
  );

  const limiter = rateLimit.rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: 'Too many requests. Please try again in two minutes',
    statusCode: 400,
  });

  app.use(limiter);

  await app.listen(3000);
}

bootstrap();
