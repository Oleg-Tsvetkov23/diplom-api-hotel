import * as mongoose from 'mongoose';
type ID = string | mongoose.Schema.Types.ObjectId;
import { Reservation } from './reservation.model';

export interface Reservations {
    id? : ID,
    userId : ID,
    hotelId :ID,
    roomId : ID,
    dateStart : Date,
    dateEnd : Date
}

export interface ReservationDto {
    user: ID;
    hotel: ID;
    room: ID;
    dateStart: Date;
    dateEnd: Date;
}
  
export interface ReservationSearchOptions {
    user: ID;
    dateStart: Date;
    dateEnd: Date;
}

export interface IReservation {
    addReservation(data: ReservationDto): Promise<Reservation>;
    removeReservation(id: ID): Promise<void>;
    getReservations(filter: ReservationSearchOptions): Promise<Array<Reservation>>;
}