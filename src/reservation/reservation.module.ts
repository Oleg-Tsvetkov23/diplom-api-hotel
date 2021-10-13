import { Module } from '@nestjs/common';
import { Reservation,ReservationSchema } from './reservation.model';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { PassportModule } from '@nestjs/passport';
import { HotelRoomModule } from 'src/hotel/hotelroom.module';
import { UserModule } from 'src/user/user.module';
import { HotelModule } from 'src/hotel/hotel.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name:Reservation.name, schema:ReservationSchema }]),
        PassportModule,
        HotelRoomModule,
        UserModule,
        HotelModule
    ],
    controllers: [ReservationController],
    providers: [ReservationService],
    exports: [ReservationService]    
})
export class ReservationModule {}