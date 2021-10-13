import { Injectable, Scope, Inject, BadRequestException } from '@nestjs/common';
import { IHotelService } from './hotel.interface'
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Hotel } from './hotel.model';
import { ID } from 'src/user/users.interface';
import { REQUEST } from '@nestjs/core';
import { Request } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class HotelService implements IHotelService {
    constructor(
        @InjectModel('Hotel') private hotelModel: Model<Hotel>,
        @Inject(REQUEST) private readonly req: Request,
    ){}

    async create(data: any): Promise<Hotel> {
        const { title, description } = data;
        const hotel = new this.hotelModel({title, description});

        try {
            return await hotel.save();
            } catch(error) {
                throw error;
            } 
        
    }

    async findById(id : ID): Promise<Hotel> {
        return await this.hotelModel.findById(id).exec();
    }

    async search(params: Pick<Hotel, "title">): Promise<Hotel[]> {
        const {limit,offset} = this.req ['query'];
        return this.hotelModel
        .find({title: new RegExp(params.title, 'i')})
        .select({id:1,title:1,description:1})
        .limit(Number(limit) || 0)
        .skip(Number(offset) || 0)
        .exec();
    }

    async update(id: string, data : any): Promise<Hotel> {
        return this.hotelModel.findOneAndUpdate({ _id:id },data).exec();
    }
}
