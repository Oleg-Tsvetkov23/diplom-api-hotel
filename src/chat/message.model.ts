import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user/users.model';
import { Type } from 'class-transformer';
import * as mongoose from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name})
    @Type(() => User)
    author : User;

    @Prop( {default: () => Date.now()})
    sentAt: Date;

    @Prop()
    text: string;

    @Prop()
    readAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);