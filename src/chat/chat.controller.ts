import { Body, Controller, Post, UseGuards, Request } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { UserService } from "src/user/users.service";
import { AuthenticatedGuard } from '../auth/guards/autentificate.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { SetMetadata } from '@nestjs/common';

@Controller()
export class ChatController {
    constructor (
        private readonly chatService : ChatService,
        private readonly userService : UserService,
    ){}

    @UseGuards(AuthenticatedGuard, RoleGuard)
    @SetMetadata('roles', ['client'])    
    @Post('/api/client/support-requests')
    async clientSupportRequest(@Body() data: any, @Request() req) : Promise<any> {
        console.log("user",req.user.id);
        return this.chatService.createSupportRequest(data);
    }
}