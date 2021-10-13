import { Module } from '@nestjs/common';
import { Hotel, HotelSchema } from './hotel.model';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { HotelRoomModule } from './hotelroom.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name:Hotel.name, schema:HotelSchema }]),
        PassportModule,
        HotelRoomModule,
    ],
    controllers: [HotelController],
    providers: [HotelService,],
    exports: [HotelService] 
})
export class HotelModule {}
