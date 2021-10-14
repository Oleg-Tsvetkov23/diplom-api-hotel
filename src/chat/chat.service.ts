import { Inject, Injectable, BadGatewayException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SupportRequest } from "./supportrequest.model";
import { Model } from "mongoose";
import { Message } from "./message.model";
import { ISupportRequestClientService, ISupportRequestService, ISupportRequestEmployeeService, CreateSupportRequestDto} from "./chai.interface";
import { ID } from "../user/users.interface";

@Injectable()
export class ChatService implements  ISupportRequestClientService, ISupportRequestService, ISupportRequestEmployeeService {
    constructor(
        @InjectModel('SupportRequest') private supportRequestModel: Model<SupportRequest>,
        @InjectModel('Message') private messageModel: Model<Message>,
    ){}

    async createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest> {
        const { user, text} = data;
        const message = new this.messageModel({author : user, text : text, readAt : null});
        let chatMessage;
        try {
            chatMessage = await message.save();
        } catch(err) {
            throw err;           
        }
        const chatNew = new this.supportRequestModel({user : user, isActive: true, messages : chatMessage._id})
        let b1: any, b2 : any;
        try {
//            await chatNew.populate('messages').execPopulate();
            b1 = await chatNew.save()
        } catch  (err) {
            throw err;
        }
        // поиск по supportRequestModel by ID
        b2 = this.getMessages(b1.id);
        return b2;
    }

    async getMessages(supportRequest: ID): Promise<Message[]> {
        const a1 = await this.supportRequestModel.findById(supportRequest).populate('messages').exec();
 /*       this.supportRequestModel.aggregate([
            {
                $match : {
                    readAt : { $ne : null }
                }
            }
         ] )*/
        let a2 = [];
        a2.push(a1)
        return a2;
    }

}