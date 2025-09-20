import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });

  // catch shutdown signals
  app.enableShutdownHooks();

  app.use(helmet());

  app.use(cookieParser());

  app.use(csurf({
    cookie: true
  }));

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.PORT || 5000);
}
bootstrap();
