import { Body, Controller, Get, Post, Param, Request, UsePipes, UseGuards, Query } from '@nestjs/common';
import { UserService } from './users.service';
import { JoiValidationPipe } from 'src/pipe/book.joi-pipe';
import { joiAddUser, joiCheckListUsers } from 'src/joi/user.joischema';
import { Users } from './users.interface';
import { ParseMongoIDPipe } from 'src/pipe/mongoID.pipe';
import { AuthenticatedGuard } from '../auth/guards/autentificate.guard'
import { RoleGuard } from '../auth/guards/role.guard'
import { SetMetadata } from '@nestjs/common';

@Controller()
//@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService : UserService) {}

    @UseGuards(AuthenticatedGuard, RoleGuard)
    //@UseGuards(AuthenticatedGuard)
    @SetMetadata('roles', ['admin'])
    @Post('/api/admin/users/')
    @UsePipes(new JoiValidationPipe(joiAddUser))
    async create(@Body() data : Partial<Users>) : Promise<any> {
        const rez = await this.userService.create(data);
        return {"id": rez._id, "email" : rez.email, "name"  : rez.name}; 
    }
/*
    @UseGuards(AuthenticatedGuard, RoleGuard)
    @SetMetadata('roles', ['admin','manager'])
    @Get(['/api/admin/users/','/api/manager/users/'])
    @UsePipes(new JoiValidationPipe(joiCheckListUsers))
    async findAll(@Query() data, @Request() req) : Promise <Users[]> {
        if (req.originalUrl.indexOf(req.user.role) === -1) {
            throw new ForbiddenException('User already exists');
        }
        return await this.userService.findAll(data);
    }
  */
    @UseGuards(AuthenticatedGuard, RoleGuard)
    @SetMetadata('roles', ['admin'])
    @Get(['/api/admin/users/'])
    @UsePipes(new JoiValidationPipe(joiCheckListUsers))
    async findAllAdmin(@Query() data, @Request() req) : Promise <Users[]> {
        return await this.userService.findAll(data);
    }

    @UseGuards(AuthenticatedGuard, RoleGuard)
    @SetMetadata('roles', ['manager'])
    @Get('/api/manager/users/')
    @UsePipes(new JoiValidationPipe(joiCheckListUsers))
    async findAllManager(@Query() data) : Promise <Users[]> {
        return await this.userService.findAll(data);
    }

//--------------------------------------------------------->
// Убрать из контроллера
//--------------------------------------------------------->
    @Get('/api/admin/client/:id')   // Убрать из контроллера
    async findById(@Param('id', new ParseMongoIDPipe) id: string) : Promise<Users> {
        return await this.userService.findById(id);
    }

    @Get('/api/admin/email/:id')   // Убрать из контроллера
    async findByEmail(@Param('id') id : string) : Promise<Users> {
        const zap = await this.userService.findByEmail(id);
        if (zap === null) return {"_id": null, ...zap }
        else return zap;

    }

}