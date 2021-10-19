import { Body, Controller, Post, UseGuards, Request, Get, UsePipes, Query, Param, BadRequestException } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { UserService } from "src/user/users.service";
import { AuthenticatedGuard } from '../auth/guards/autentificate.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { SetMetadata } from '@nestjs/common';
import { JoiValidationPipe } from '../pipe/book.joi-pipe';
import { joiCreateChat, joiListRequestChat } from './joi/joi.chat';
import { ParseMongoIDPipe } from 'src/pipe/mongoID.pipe';

@Controller()
export class ChatController {
    constructor (
        private readonly chatService : ChatService,
        private readonly userService : UserService,
    ){}

    @UseGuards(AuthenticatedGuard, RoleGuard)
    @SetMetadata('roles', ['client'])   
    @UsePipes(new JoiValidationPipe(joiCreateChat)) 
    @Post('/api/client/support-requests')
    async clientSupportRequest(@Body() data: any, @Request() req) : Promise<any> {
        data.user = req.user.id;
        return this.chatService.createSupportRequest(data);
    }

    @UseGuards(AuthenticatedGuard, RoleGuard)
    @SetMetadata('roles', ['client'])   
    @UsePipes(new JoiValidationPipe(joiListRequestChat)) 
    @Get('/api/client/support-requests')
    async getClientSupportRequest(@Query() data, @Request() req) : Promise<any> {
        data.user = req.user.id;
        data.isActive = data.isActive ? data.isActive : true;
        return this.chatService.findSupportRequests(data);
    }

    @UseGuards(AuthenticatedGuard, RoleGuard)
    @SetMetadata('roles', ['manager'])   
    @UsePipes(new JoiValidationPipe(joiListRequestChat)) 
    @Get('/api/manager/support-requests')
    async getManagerSupportRequest(@Query() data, @Request() req) : Promise<any> {
        data.user = null;
        data.isActive = data.isActive ? data.isActive : true;
        console.log("data",data)
        return this.chatService.findSupportRequests(data);
    }

    @UseGuards(AuthenticatedGuard, RoleGuard)
    @SetMetadata('roles', ['manager','client']) 
    @Get('/api/common/support-requests/:id/messages')
    async getHistory(@Param('id', new ParseMongoIDPipe) id : string) : Promise<any> {
        return this.chatService.getMessages(id);
    }

    @UseGuards(AuthenticatedGuard, RoleGuard)
    @SetMetadata('roles', ['manager','client']) 
//    @UsePipes(new JoiValidationPipe(joiCreateChat)) 
    @Post('/api/common/support-requests/:id/messages')
    async sendMessage(@Body() data: any, @Param('id', new ParseMongoIDPipe) id : string,  @Request() req) : Promise<any> {
        // Валидация полей запроса
        let value = joiCreateChat.validate(req.body);
        if (value.error) {
            throw new BadRequestException(value.error.message);
        }
        data.author = req.user.id;
        data.supportRequest = id;
        return this.chatService.sendMessage(data);
    }

    @Get('/api/test/:id')
    async getCount(@Param('id', new ParseMongoIDPipe) id : string) : Promise<any> {
        return this.chatService.getUnreadCount(id);
    }
}