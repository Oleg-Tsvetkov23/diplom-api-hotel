import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required:true, unique:true })
  email: string;

  @Prop({ required:true })
  passwordHash: string;

  @Prop({ required:true })
  name: string;

  @Prop({ required:false })
  contactPhone: string;

  @Prop({ required:true, default:'client' })
  role: string;
}

const UsersSchema = SchemaFactory.createForClass(User);

UsersSchema.set('toJSON',{virtuals:true,  versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }});

export {
  UsersSchema
}
