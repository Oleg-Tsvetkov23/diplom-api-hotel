import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Hotel extends Document {
  @Prop({ required:true,  })
  title: string;

  @Prop({ required:false })
  description:string;

  @Prop({ required:true, default: () => Date.now() })
  createAt: Date;

  @Prop({ required:true, default: () => Date.now() })
  updateAt: Date;
}

const HotelSchema = SchemaFactory.createForClass(Hotel);

HotelSchema.set('toJSON',{virtuals:true,  versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }});

export {
  HotelSchema
}