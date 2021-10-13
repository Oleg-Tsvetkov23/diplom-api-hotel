import { Inject, Injectable, BadGatewayException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SupportRequest } from "./supportrequest.model";
import { Model, now } from "mongoose";
import { Message } from "./message.model";
import { ISupportRequestClientService, ISupportRequestService, ISupportRequestEmployeeService, CreateSupportRequestDto} from "./chai.interface";
import { userInfo } from "os";

@Injectable()
export class ChatService implements  ISupportRequestClientService, ISupportRequestService, ISupportRequestEmployeeService {
    constructor(
        @InjectModel('SupportRequest') private supportRequestModel: Model<SupportRequest>,
        @InjectModel('Message') private messageModel: Model<Message>,
    ){}

    async createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest> {
        const { user, text} = data;
        const message = new this.messageModel({author : user, text : text});
        try {
            const chatMessage = await message.save();
        } catch(err) {
            throw err;           
        }
        const chatNew = new this.supportRequestModel({user : user, isActive: true})
        try {
            const dataChatNew = await chatNew.save()
        } catch  (err) {
            throw err;
        }
        // поиск по supportRequestModel by ID
        return null;
    }
}