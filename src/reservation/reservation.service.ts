import { IReservation } from "./reservation.interface";
import { Reservation } from "./reservation.model";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, Inject, Scope, BadRequestException, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { Model } from "mongoose";
import { ID } from "../user/users.interface";
import { ReservationDto, ReservationSearchOptions } from "./reservation.interface";


import { REQUEST } from '@nestjs/core';
import { Request } from '@nestjs/common';
import { ObjectUnsubscribedError } from "rxjs";

//@Injectable()
@Injectable({ scope: Scope.REQUEST })
export class ReservationService implements IReservation {
    constructor(
        @InjectModel('Reservation') private reservationModel: Model<Reservation>,
        @Inject(REQUEST) private readonly req: Request,
    ) {};

    async addReservation(data: ReservationDto): Promise<Reservation> {
        let {user, hotel, room, dateStart, dateEnd} = data;
        
        let options = {
            $or : [ 
                {$and:[{ dateStart : {$lte : dateStart}}, {dateEnd : {$gte  : dateEnd}}]},
                {$and:[{ dateStart : {$lte : dateStart}}, {dateEnd : {$gte  : dateStart}}]},
                {$and:[{ dateStart : {$lte : dateEnd}}, {dateEnd : {$gte  : dateEnd}}]},
                {$and:[{ dateStart : {$gte : dateStart}}, {dateEnd : {$lte  : dateEnd}}]},
         ]        
        }

        const isRoom = await this.reservationModel.find(options)
        .populate({path:'roomId', _id:{$eq : room}})
        .exec();

        if (isRoom.length > 0) {
            throw new BadRequestException('Room already reserved');
        }

        const reserv = new this.reservationModel({userId:user, hotelId:hotel, roomId:room, dateStart:dateStart, dateEnd: dateEnd});
        return await reserv.save();
    }

    async getReservationById(id : ID) : Promise<Reservation> {
        return this.reservationModel.findById(id)
        .select({dateStart:1, dateEnd:1})
        .populate('hotelId', {title:1,description:1})
        .populate('roomId', {title:1,description:1,images:1})
//        .populate('hotelRoom', {title:1,description:1})
        .exec();
    }

    async getReservationByIdAllFields(id : ID) : Promise<Reservation> {
        return this.reservationModel.findById(id)
        .exec();
    }

    async getReservations(filter: ReservationSearchOptions): Promise<Array<Reservation>> {
        let options;
        if (filter.dateEnd && filter.dateStart) {
            options = {
                $and : [{dateEnd : {$lte : filter.dateEnd}},{ dateStart : {$gte : filter.dateStart}}] 
            }
        } else {
            if (filter.dateStart) options  = {dateStart : {$gte : filter.dateStart}};
            if (filter.dateEnd) options = {dateEnd : {$lte : filter.dateEnd}};
        }
        return this.reservationModel.find(options)
        .select({dateStart:1, dateEnd:1})
        .populate({path :'userId', _id:filter.user})
        .populate('hotelId', {title:1,description:1})
        .populate('roomId', {title:1,description:1,images:1})
        .sort({dateStart:1})
        .exec();
    }

    async  removeReservation(id: ID): Promise<void> {
        if (this.req.url.indexOf('/api/client/reservations') !== -1) {
            let user = this.req['user'].id;
            if (!user) {
                throw new UnauthorizedException();
            }
                const isReserv = await this.reservationModel.findById(id).exec();
 
            if (!isReserv) {
                throw new BadRequestException('There is no booking ID record')
            }
            if (isReserv.userId.toString() !== user) {
                throw new ForbiddenException('The id of the current user does not match the id of the user in the reservation')
            }
        } 
        this.reservationModel.findByIdAndDelete(id).exec();
        return null;
    }

}