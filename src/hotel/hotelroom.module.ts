import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelRoomService } from './hotelroom.service';
import { HotelRoom, HotelRoomSchema } from './hotelroom.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name:HotelRoom.name, schema:HotelRoomSchema }]),
    ],
    controllers: [],
    providers: [HotelRoomService,],
    exports: [HotelRoomService] 
})
export class HotelRoomModule {}