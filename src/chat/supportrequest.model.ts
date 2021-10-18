import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User, UsersSchema } from 'src/user/users.model';
import { Message } from './message.model';
import { Type } from 'class-transformer';
import * as mongoose from 'mongoose';
import { Transform } from 'class-transformer';

export type SupportRequestDocument = SupportRequest & Document;

@Schema()
export class SupportRequest extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name})
    @Type(() => User)
    user : User;

    @Prop({default: () => Date.now()})
    createAt: Date;

    @Prop({type : [{ type: mongoose.Schema.Types.ObjectId, ref: Message.name} ]})
//    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Message.name})
    @Type(() => Message)
    messages: Message[];

    @Prop()
    isActive: boolean;

    @Prop()
    hasNewMessages: boolean;
}

const SupportRequestSchema = SchemaFactory.createForClass(SupportRequest);

SupportRequestSchema.set('toJSON',{virtuals:true,  versionKey:false,
    transform: function (doc, ret) {   delete ret._id  }});

const virtual1 = SupportRequestSchema.virtual('client');
virtual1.get(function(value, virtual, doc) {
    return this.user;
});
    
export {
    SupportRequestSchema
}
