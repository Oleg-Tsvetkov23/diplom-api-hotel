import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session'
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import 'dotenv/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule)//, { cors: true, bodyParser: true });
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(cookieParser());
  app.use(
    session({
      secret : process.env.SESSION_SECRET,
      resave : false,
      saveUninitialized : false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const port = process.env.HTTP_PORT || 3000;
  await app.listen(port);
}
bootstrap();
