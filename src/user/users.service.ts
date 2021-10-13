import { IUserService } from "./users.interface";
import { User } from "./users.model";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, BadRequestException, Inject, Scope } from "@nestjs/common";
import { Model } from "mongoose";
import { Users } from "./users.interface";
import { ID } from "./users.interface";
import { SearchUserParams } from "./users.interface";
import * as bcrypt from 'bcrypt';

import { REQUEST } from '@nestjs/core';
import { Request } from '@nestjs/common';

//@Injectable()
@Injectable({ scope: Scope.REQUEST })
export class UserService implements IUserService {
    constructor(
        @InjectModel('User') private userModel: Model<User>,
        @Inject(REQUEST) private readonly req: Request,
    ) {};

    async create(create_user : Partial<Users>): Promise<Users> {
        let {email, passwordHash, name, contactPhone, role} = create_user;
        const hashPassword = await bcrypt.hash(passwordHash, 10);

        const user = new this.userModel({email, passwordHash:hashPassword, name, contactPhone, role});

        try {
            return await user.save();
        } catch(error) {
            if (error.code === 11000) {
                throw new BadRequestException('User already exists');   
            }
            throw error;
        }
    }

    async findById(id : ID) : Promise<User> {
        return this.userModel.findById({_id:id}).exec();
    }

    async findByEmail(email : string) : Promise<User> {
        return this.userModel
        .findOne({email:email})
        .select({'_id':1, 'email':1, 'name':1, 'contactPhone':1, 'role':1})
        .exec();
    }

    async findAll(params: SearchUserParams): Promise<Users[]> {
        let options = {};
        let arr = [];
        arr.push({email: new RegExp(params.email, 'i')});
        arr.push({name: new RegExp(params.name, 'i')});
        if (this.req.url.indexOf('admin') === -1) arr.push({role: {$ne: 'admin'}});
        if (params.contactPhone) arr.push({contactPhone: new RegExp(params.contactPhone, 'i')});

        options = {
/*
            $and: [
                {email: new RegExp(params.email, 'i')},
                {name: new RegExp(params.name, 'i')},
            ]
            */
           $and: arr
        }
        console.log("options",options)
        console.log("req--->",this.req.url)

        return this.userModel
        .find(options)
        .select({'_id':1, 'email':1, 'name':1, 'contactPhone':1})
        .limit(Number(params.limit) || 0)
        .skip(Number(params.offset)|| 0)
        .exec();
    }
}