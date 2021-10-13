import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session'
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import 'dotenv/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule)//, { cors: true, bodyParser: true });
/*
  app.enableCors({
    origin: [
      'http://localhost:3000', // react
      'http://localhost:3001', // react
    ],
    credentials: true,
  });
*/
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });


//  const io = require('socket.io')(app, {    cors: {        origin: "http://localhost:8100",        methods: ["GET", "POST"],        transports: ['websocket', 'polling'],        credentials: true    },    allowEIO3: true});

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

      /*/

      resave: true,
      saveUninitialized: true,
      secret: 's_e_c_r_e_t',

      secret : process.env.SESSION_SECRET,
      resave : false,
      saveUninitialized : false,
      cookie: { secure: true }
      */

  await app.listen(3000);
}
bootstrap();
