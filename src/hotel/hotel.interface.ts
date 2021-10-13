import * as mongoose from 'mongoose';
type ID = string | mongoose.Schema.Types.ObjectId;

//export {ID} from '../user/users.interface'

export interface Hotel {
    id? : string;
    title : string;
    description? : string;
    createAt? : Date;
    updateAs? : Date;
}

export interface IHotelService {
    create(data: any): Promise<Hotel>;
    findById(id: ID): Promise<Hotel>;
    search(params: Pick<Hotel, "title">): Promise<Hotel[]>;
}


export interface HotelRoom {
    id? : string;
    hotelId : string;
    title : string;
    description : string;
    images : string[];
    createAt : Date;
    updateAs : Date;
    isEnabled : boolean;
}

export interface SearchRoomsParams {
    limit: number;
    offset: number;
    title: string;
    isEnabled?: true;
}

export interface IHotelRoomService {
    create(data: Partial<HotelRoom>): Promise<HotelRoom>;
    findById(id: ID, isEnabled?: true): Promise<HotelRoom>;
    search(params: SearchRoomsParams): Promise<HotelRoom[]>;
    update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom>;
}
