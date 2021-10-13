import { Injectable, BadRequestException, Inject, Scope } from '@nestjs/common';
import { IHotelRoomService } from './hotel.interface'
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { HotelRoom, SearchRoomsParams } from './hotel.interface';
import { REQUEST } from '@nestjs/core';
import { Request } from '@nestjs/common';
import {ID} from '../user/users.interface'

import { Logger } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class HotelRoomService implements IHotelRoomService {

    constructor(
        @InjectModel('HotelRoom') private hotelRoomModel: Model<HotelRoom>,
        @Inject(REQUEST) private readonly req: Request,
    ){}
    private logger: Logger = new Logger('HotelRoom');

    async create(data: Partial<HotelRoom>):Promise<HotelRoom> {
        const hotelRoom = new this.hotelRoomModel(data);

        try {
            return await hotelRoom.save();
        } catch(error) {
            if (error.code === 11000) {
                throw new BadRequestException('Room already exists');   
            }
            throw error;
        }        
        
    }

    async search(params: SearchRoomsParams): Promise<HotelRoom[]> {
        this.logger.log('Search!');
        console.log("title",params.title)
        const {hotel} = this.req ['query'];
        let options = {};
        let arr = [];
//        arr.push({title: new RegExp(params.title, 'i')});
        if (params.title) arr.push({title: params.title});
        if (params.isEnabled) arr.push({isEnabled:true});
        if (hotel) arr.push({hotelId:hotel});

        if (arr.length > 0 ) {
            options = {
                $and: arr
            }
        }
        console.log("opt",options)
        return this.hotelRoomModel
        .find(options)
        .select({id:1,title:1,images:1})
        .populate('hotelId',{id:1,title:1})
        .limit(Number(params.limit) || 0)
        .skip(Number(params.offset))
        .exec();
    }

    async findById(id: ID, isEnabled?: true): Promise<HotelRoom> {
        if (isEnabled) {
            return this.hotelRoomModel
            .findById(id)
            .where('isEnabled').equals(true)
            .select({id:1,title:1, description:1, images:1})
            .populate('hotelId',{id:1,title:1, description:1})
            .exec();   
        } else {
            return this.hotelRoomModel
            .findById(id)
            .select({id:1,title:1, description:1, images:1})
            .populate('hotelId',{id:1,title:1, description:1})
            .exec();
        }
    }

    async update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom> {
        return this.hotelRoomModel.findByIdAndUpdate(id, data).exec();
    }
}
