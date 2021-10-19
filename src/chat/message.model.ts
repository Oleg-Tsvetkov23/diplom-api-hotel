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

const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.set('toJSON',{virtuals:true,  versionKey:false,
    transform: function (doc, ret) {   delete ret._id, delete ret.sentAt}});

const virtual1 = MessageSchema.virtual('createdAt');
virtual1.get(function(value, virtual, doc) {
    return this.sentAt;
});

export {
    MessageSchema
}