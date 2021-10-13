import { ConflictException, Injectable,BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { compile } from 'joi';
import { Model } from 'mongoose';
import { User } from '../user/users.model';
import { UserCreateDto } from './dto/create-user-dto';

@Injectable()
export class AuthService {
    readonly session_array : string[]=[];
    constructor(
        @InjectModel('User') private userModel: Model<User>,
    ) {}

    async signUp(data : UserCreateDto) : Promise<any> {
        const {email, passwordHash, name, contactPhone} = data;
        const hashPassword = await bcrypt.hash(passwordHash, 10);

        const user = new this.userModel({email, passwordHash:hashPassword, name, contactPhone, role:'client'});

        try {
            return await user.save();
        } catch(error) {
            if (error.code === 11000) {
                throw new BadRequestException('User already exists');   
            }
            throw error;
        }
    }
//-----------------------------> Удалить
/*
    async findAll() : Promise<User[]> {
        return this.userModel.find().exec()
    }
*/
    async login(user: User) {
        const payload = { id: user._id, email: user.email, name: user.name, contactPhone:user.contactPhone, role: user.role};

        return {
            email: user.email, name: user.name, contactPhone:user.contactPhone ? user.contactPhone : ''
        };
    }

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.userModel.findOne({ email:email }).exec();
    
        if (!user) {
            return null;
        }
    
        const valid = await bcrypt.compare(password, user.passwordHash);
    
        if (valid) {
            this.session_array.push(user.id);
            console.log("111",this.session_array.length)
            return user;
        } else {
            return null;
        }    
    }
}
