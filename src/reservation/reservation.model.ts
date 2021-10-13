import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'
import { Document } from 'mongoose';
import { Hotel } from '../hotel/hotel.model';
import { HotelRoom } from 'src/hotel/hotelroom.model';
import { User } from 'src/user/users.model';
import { Type } from 'class-transformer';

@Schema()
export class Reservation extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name})
    @Type(() => User)
    userId : User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Hotel.name})
    @Type(() => Hotel)
    hotelId : Hotel;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: HotelRoom.name})
    @Type(() => HotelRoom)
    roomId : HotelRoom;

    @Prop({ required:true })
    dateStart: Date;

    @Prop({ required:true })
    dateEnd: Date;
}

const ReservationSchema = SchemaFactory.createForClass(Reservation);

/*
const virtual = ReservationSchema.virtual('hotelRoom');

virtual.get(function(value, virtual, doc) {
      return this.roomId;
});

ReservationSchema.set('toJSON',{virtuals:true,  versionKey:false,
    transform: function (doc, ret) {   delete ret._id , delete ret.roomId }});
*/


ReservationSchema.virtual('hotelRoom',{
    ref: 'HotelRoom',
    localField: 'roomId',
    foreignField: '_id',
    justOne: true
});

ReservationSchema.virtual('hotel',{
    ref: 'Hotel',
    localField: 'hotelId',
    foreignField: '_id',
    justOne: false
});


const virtual1 = ReservationSchema.virtual('hotelRoom');
virtual1.get(function(value, virtual, doc) {
    return this.roomId;
});

const virtual2 = ReservationSchema.virtual('hotel');
virtual2.get(function(value, virtual, doc) {
    return this.hotelId;
});

const virtual3 = ReservationSchema.virtual('startDate');
virtual3.get(function(value, virtual, doc) {
    return this.dateStart;
});

const virtual4 = ReservationSchema.virtual('endDate');
virtual4.get(function(value, virtual, doc) {
    return this.dateEnd;
});

ReservationSchema.set('toObject', { virtuals: true });
ReservationSchema.set('toJSON',{virtuals:true,  versionKey:false,
    transform: function (doc, ret) {   delete ret._id ,delete ret.hotelRoom.id, delete ret.hotel.id, delete ret.roomId,
         delete ret.hotelId, delete ret.dateStart, delete ret.dateEnd, delete ret.userId }});

export {
    ReservationSchema
}