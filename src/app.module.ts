import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { HotelModule } from './hotel/hotel.module';
import { HotelRoomModule } from './hotel/hotelroom.module';
import { ReservationModule } from './reservation/reservation.module';
import "dotenv/config";
import { ChatGateway } from './chat/chat.gateway';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChatModule } from './chat/chat.module';


@Module({
  imports: [MongooseModule.forRoot(`${process.env.MONGODB_CONNECTION_STRING}`, { useFindAndModify: false }),
    AuthModule,
    UserModule,
    HotelModule,
    HotelRoomModule,
    ReservationModule,
    EventEmitterModule.forRoot(),
    ChatModule
  ],
  controllers: [AppController ],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
