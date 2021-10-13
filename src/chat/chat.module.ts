import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message, MessageSchema } from './message.model';
import { SupportRequestSchema, SupportRequest } from './supportrequest.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name:Message.name, schema:MessageSchema }, {name:SupportRequest.name, schema:SupportRequestSchema}]),
        UserModule
    ],
    controllers: [ChatController],
    providers: [/*ChatGateway,*/ ChatService],
    exports: [ChatService]    
})
export class ChatModule {}