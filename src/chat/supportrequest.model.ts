import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user/users.model';
import { Message } from './message.model';
import { Type } from 'class-transformer';
import * as mongoose from 'mongoose';

export type SupportRequestDocument = SupportRequest & Document;

@Schema()
export class SupportRequest extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name})
    @Type(() => User)
    user : User;

    @Prop({default: () => Date.now()})
    createAt: Date;

    @Prop({type : [{ type: mongoose.Schema.Types.ObjectId, ref: Message.name} ]})
    @Type(() => Message)
    messages : Message;

    @Prop()
    isActive: boolean;
}

export const SupportRequestSchema = SchemaFactory.createForClass(SupportRequest);