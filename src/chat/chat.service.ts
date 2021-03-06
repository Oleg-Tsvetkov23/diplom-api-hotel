import { Inject, Injectable, BadRequestException, Scope, BadGatewayException  } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SupportRequest } from "./supportrequest.model";
import { Model } from "mongoose";
import { Message } from "./message.model";
import { ISupportRequestClientService,
         ISupportRequestService,
         ISupportRequestEmployeeService,
         CreateSupportRequestDto,
         GetChatListParams,
         SendMessageDto,
         MarkMessagesAsReadDto} from "./chai.interface";
import { ID } from "../user/users.interface";
import { REQUEST } from '@nestjs/core';
import { Request } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';


@Injectable({ scope: Scope.REQUEST })
export class ChatService implements  ISupportRequestClientService, ISupportRequestService, ISupportRequestEmployeeService {
    constructor(
        @InjectModel('SupportRequest') private supportRequestModel: Model<SupportRequest>,
        @InjectModel('Message') private messageModel: Model<Message>,
        @Inject(REQUEST) private readonly req: Request,
        private eventEmitter: EventEmitter2,
    ){}

    async createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest[]> {     
        const { user, text} = data;
        // Есть ли активный чат
        let params = {
            user: user,
            isActive: true            
        }
        const isActiveChat = await this.findSupportRequests(params);
        if (isActiveChat.length !== 0) {
            // Есть активный чат, ошибка!
            throw new BadRequestException('An active chat for the client already exists');
        } 
        const message = new this.messageModel({author : user, text : text, readAt : null});
        let chatMessage;
        try {
            chatMessage = await message.save();
        } catch(err) {
            throw err;           
        }
        const chatNew = new this.supportRequestModel({user : user, isActive: true, messages : chatMessage._id, hasNewMessages: true})
        let b1: any, b2 : any;
        try {
            b1 = await chatNew.save()
        } catch  (err) {
            throw err;
        }
        // Отправить сообщение в чат!!!
        return await this.findSupportRequests(params);
    }

    async getMessages(supportRequest: ID): Promise<Message[]> {
        let arr;
        const {role, id} = this.req['user'];
        if (role == 'client') {
            arr = await this.supportRequestModel
            .find({_id:supportRequest})
            .populate('user')
            .where({user:this.req['user'].id})
            .select({messages:1})
            .exec();
        } else {
            arr = await this.supportRequestModel.find({_id:supportRequest}).select({messages:1}).exec();
        }
        if (arr.length === 0) return null;
        return await this.messageModel
        .find({_id:{$in: arr[0].messages}})
        .populate('author',{id:1,name:1})
        .exec();
    }

    async findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]> {
        const {limit, offset} = this.req ['query'];
        if (params.user === null) {
            let a = await this.supportRequestModel.find({isActive : params.isActive})
            .skip(Number(offset)  || 0)
            .limit(Number(limit) || 0)
            .select({isActive : 1, hasNewMessages: 1, _id : 1, createAt : 1})
            .populate('user',{id:1,name:1,email:1,contactPhone:1})
            .exec();
        } else {
            return this.supportRequestModel.find({isActive : params.isActive})
            .skip(Number(offset)  || 0)
            .limit(Number(limit) || 0)
            .select({isActive : 1, hasNewMessages: 1, _id : 1, createAt : 1})
            .populate('user')
            .where({user:params.user})
            .select({user:0})
            .exec();
    
        }
    }

    async sendMessage(data: SendMessageDto): Promise<Message> {      
        const {role, id} = this.req['user'];
        if (id.toString() !== data.author.toString()) {
            throw new BadRequestException('The ID of the current user is not equal to the value author');
        }
        if (role == 'client') {
            const isRecord = await this.supportRequestModel
            .findById(data.supportRequest)
            .populate('user')
            .where({user:data.author})
            if (!isRecord) {
                throw new BadRequestException('A user with the client role is not connected to a chat room with the value supportRequest');
            }
        } else {
            const isRecord = await this.supportRequestModel
            .findById(data.supportRequest)
            if (!isRecord) {
                throw new BadRequestException(`Chat doesn't exist`);
            }
        }       
        const message = new this.messageModel({author : data.author, text : data.text, readAt : null});
        let chatMessage;
        try {
            chatMessage = await message.save();
        } catch(err) {
            throw err;           
        }
        const upd = await this.supportRequestModel.findOneAndUpdate(
            { _id: data.supportRequest }, 
            { $push: { messages: chatMessage.id  } }).exec();
        this.eventEmitter.emit('newMessage', data);            
        // Сообщение в чат!!!
        return await this.messageModel.findById(chatMessage.id).populate('author', {id:1,name:1});
    }

    async getUnreadCountClient(supportRequest: ID): Promise<Message[]> {
       const isRecord = await this.supportRequestModel
        .find({_id: supportRequest, isActive : true})
        .select({messages:1, user:1})
        if (!isRecord) {
            throw new BadRequestException(`Chat doesn't exist`);
        }
        if (isRecord.length == 0) return [];
        const userID = isRecord[0].user;
        return await this.messageModel
        .find({_id:{$in: isRecord[0].messages}, readAt: {$eq : null}, author: {$ne : userID}})
        .populate('author',{id:1,name:1})
        .exec();
    }

    async getUnreadCount(supportRequest: ID): Promise<Message[]> {
        const isRecord = await this.supportRequestModel
         .find({_id: supportRequest, isActive : true})
         .select({messages:1, user:1})
         if (!isRecord) {
             throw new BadRequestException(`Chat doesn't exist`);
         }
         if (isRecord.length == 0) return [];
         const userID = isRecord[0].user;
         return await this.messageModel
         .find({_id:{$in: isRecord[0].messages}, readAt: {$eq : null}, author: {$eq : userID}})
         .populate('author',{id:1,name:1})
         .exec();
    }

    async markMessagesAsReadClient(params: MarkMessagesAsReadDto) {
        const isRecord = await this.supportRequestModel
        .find({_id: params.supportRequest, isActive : true})
        .select({messages:1, user:1})
        if (!isRecord) {
            throw new BadRequestException(`Chat doesn't exist`);
        }
        if (isRecord.length == 0) return [];
        const userID = isRecord[0].user;
        const result = await this.messageModel
        .updateMany({_id:{$in: isRecord[0].messages}, readAt: {$eq : null}, author: {$ne : userID}}, {$set : {readAt:new Date()/*params.createdBefore*/}});
        return;
    }

    async markMessagesAsRead(params: MarkMessagesAsReadDto) {
        const isRecord = await this.supportRequestModel
        .find({_id: params.supportRequest, isActive : true})
        .select({messages:1, user:1})
        if (!isRecord) {
            throw new BadRequestException(`Chat doesn't exist`);
        }
        if (isRecord.length == 0) return [];
        const userID = isRecord[0].user;
        const result = await this.messageModel
        .updateMany({_id:{$in: isRecord[0].messages}, readAt: {$eq : null}, author: {$eq : userID}}, {$set : {readAt:new Date()/*params.createdBefore*/}});
        return;
    }

    async closeRequest(supportRequest: ID): Promise<void> {
        await this.supportRequestModel.findByIdAndUpdate(supportRequest,{$set : {isActive : false}}).exec();
        return;
    }

    async markHasNewMessages(params: MarkMessagesAsReadDto): Promise<void> {
        const r1 = await this.getUnreadCount(params.supportRequest);
        const r2 = await this.getUnreadCountClient(params.supportRequest);
        if (r1.length === 0 && r2.length === 0) {
            const result = await this.supportRequestModel.findByIdAndUpdate(params.supportRequest,{$set : {hasNewMessages : false}}).exec()
        }
        return;
    }
}