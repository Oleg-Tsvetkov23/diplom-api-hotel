import { Module } from '@nestjs/common';
import { User, UsersSchema } from './users.model';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './users.service';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        MongooseModule.forFeature([{ name:User.name, schema:UsersSchema }]),
        PassportModule,
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]    
})
export class UserModule {}
