import { Inject, Injectable, BadRequestException, Scope  } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SupportRequest } from "./supportrequest.model";
import { Model } from "mongoose";
import { Message } from "./message.model";
import { ISupportRequestClientService, ISupportRequestService, ISupportRequestEmployeeService, CreateSupportRequestDto, GetChatListParams} from "./chai.interface";
import { ID } from "../user/users.interface";
import { REQUEST } from '@nestjs/core';
import { Request } from '@nestjs/common';
import { User } from "src/user/users.model";

@Injectable({ scope: Scope.REQUEST })
export class ChatService implements  ISupportRequestClientService, ISupportRequestService, ISupportRequestEmployeeService {
    constructor(
        @InjectModel('SupportRequest') private supportRequestModel: Model<SupportRequest>,
        @InjectModel('Message') private messageModel: Model<Message>,
        @Inject(REQUEST) private readonly req: Request,
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
        console.log("type",typeof(user))
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
        let mass : any[] = [];
        mass.push(await this.supportRequestModel.findById(supportRequest).populate('messages').exec());
        return mass;
    }

    async findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]> {
        const {limit, offset} = this.req ['query'];
        console.log("params",params)
        if (params.user === null) {
            console.log(1)
            let a = await this.supportRequestModel.find({isActive : params.isActive})
            .skip(Number(offset)  || 0)
            .limit(Number(limit) || 0)
            .select({isActive : 1, hasNewMessages: 1, _id : 1, createAt : 1})
            .populate('user',{id:1,name:1,email:1,contactPhone:1})
            .exec();
            a.forEach(el => {
                console.log("user",el.user)
                console.log("1",el['user'])
                delete el.user;
                console.log("2",el['user'])
                return el;
            })
            return a;
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
}