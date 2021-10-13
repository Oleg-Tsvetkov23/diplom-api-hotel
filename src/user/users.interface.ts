import * as mongoose from 'mongoose';

export type ID = string | mongoose.Schema.Types.ObjectId;

export interface Users {
    _id? : string;
    email : string;
    passwordHash : string;
    name : string;
    contactPhone : string;
    role : string;
}

export interface SearchUserParams {
    limit: number;
    offset: number;
    email: string;
    name: string;
    contactPhone: string;
}

export interface IUserService {
    create(data: Partial<Users>): Promise<Users>;
    findById(id: ID): Promise<Users>;
    findByEmail(email: string): Promise<Users>;
    findAll(params: SearchUserParams): Promise<Users[]>;
}

