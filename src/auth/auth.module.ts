import { Module } from '@nestjs/common';
import { User, UsersSchema } from '../user/users.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import "dotenv/config";
import { SessionSerializer } from './session.serialized';

@Module({
    imports: [
        MongooseModule.forFeature([{ name:User.name, schema:UsersSchema }]),
        PassportModule.register({session:true})
       // PassportModule.register({session:true}),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, SessionSerializer],
    exports: [AuthService]    
})
export class AuthModule {}
