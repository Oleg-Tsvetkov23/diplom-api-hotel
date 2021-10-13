import { Body, Controller, Post, UsePipes, Get, UseGuards, Request, Res, Req } from '@nestjs/common';
import { Response } from 'express';
import { joiUserSchema } from 'src/joi/user.joischema';
import { JoiValidationPipe } from 'src/pipe/book.joi-pipe';
import { AuthService } from './auth.service';
import { UserCreateDto } from './dto/create-user-dto';
import { LocalAuthGuard } from './guards/local.guard';
import { User } from '../user/users.model';
import {AuthenticatedGuard} from './guards/autentificate.guard'
import { NoneGuard } from './guards/none.guard';

@Controller('api')
export class AuthController {
    constructor(private readonly authService : AuthService) {}

    @UseGuards(NoneGuard)
    @Post('/client/register')
    @UsePipes(new JoiValidationPipe(joiUserSchema))
    async signUp(@Body() data : UserCreateDto) : Promise<any> {
        console.log(data)
        const rez = await this.authService.signUp(data);
        return {"id": rez._id, "email" : rez.email, "name"  : rez.name};
    }
/*
    @Get('users')
    async findAll(): Promise<User[]> {   
        return this.authService.findAll();
    }
*/
    @UseGuards(LocalAuthGuard)
    @Post('/auth/login')
    async login(@Request() req) {
        req.session.visits = req.session.visits ? req.session.visits + 1 : 1;
        console.log("session",req.session)
        return this.authService.login(req.user);
    }

    @UseGuards(AuthenticatedGuard)
    @Post('/auth/logout')
    logout(@Req() req, @Res() res: Response) {
        console.log("session",req.session)
        req.logout();
        res.clearCookie('connect.sid');
        return res.sendStatus(200);
    }
  

}
