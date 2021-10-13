import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'
import { Document } from 'mongoose';
import { Hotel } from './hotel.model';
import { Type } from 'class-transformer';

@Schema()
export class HotelRoom extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Hotel.name})
  @Type(() => Hotel)
  hotelId : Hotel;

  @Prop({ required: true, unique: true})
  title: string;

  @Prop({ required:false, default: '' })
  description : string;

  @Prop({required:false})
  images : string[];

  @Prop({ required:true, default: () => Date.now() })
  createAt: Date;

  @Prop({ required:true, default: () => Date.now() })
  updateAt: Date;

  @Prop({required:true, default: true})
  isEnabled : boolean;
}

const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);

HotelRoomSchema.set('toJSON',{virtuals:true,  versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }});

export {
  HotelRoomSchema
}