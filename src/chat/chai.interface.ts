import { SupportRequest } from "./supportrequest.model";
import { Message } from "./message.model";
import {ID} from '../user/users.interface';

export interface CreateSupportRequestDto {
    user: ID;
    text: string;
}
  
export interface SendMessageDto {
    author: ID;
    supportRequest: ID;
    text: string;
}

export interface MarkMessagesAsReadDto {
    user: ID;
    supportRequest: ID;
    createdBefore: Date;
}
  
export interface GetChatListParams {
    user: ID | null;
    isActive: boolean;
}
  
export interface ISupportRequestService {
    findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;
    sendMessage(data: SendMessageDto): Promise<Message>;
    getMessages(supportRequest: ID): Promise<Message[]>;
//    subscribe(
//      handler: (supportRequest: SupportRequest, message: Message) => void
//    ): () => void;
}
  
export interface ISupportRequestClientService {
    createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest[]>;
    markMessagesAsReadClient(params: MarkMessagesAsReadDto);
//    getUnreadCount(supportRequest: ID): Promise<Message[]>;
}
  
export interface ISupportRequestEmployeeService {
//    markMessagesAsRead(params: MarkMessagesAsReadDto);
//    getUnreadCount(supportRequest: ID): Promise<Message[]>;
//    closeRequest(supportRequest: ID): Promise<void>;
}