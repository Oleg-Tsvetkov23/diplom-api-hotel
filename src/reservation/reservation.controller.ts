import { Body, Controller, Get, Post, BadRequestException, UsePipes, UseGuards, Request, Delete, Param, Query, ForbiddenException } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Reservation } from "./reservation.model";
import { HotelRoomService } from 'src/hotel/hotelroom.service';
import { JoiValidationPipe } from 'src/pipe/book.joi-pipe';
import { joiAddReservationRoom, joiGetReservationRoomList } from './joi/joi.reservation';
import { AuthenticatedGuard } from '../auth/guards/autentificate.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { SetMetadata } from '@nestjs/common';
import { ParseMongoIDPipe } from '../pipe/mongoID.pipe';


@Controller()
export class ReservationController {
    constructor(
        private readonly reservationService : ReservationService,
        private readonly hotelRoomService: HotelRoomService,
    ) {}

    @UseGuards(AuthenticatedGuard, RoleGuard)
    @SetMetadata('roles', ['client'])
    @UsePipes(new JoiValidationPipe(joiAddReservationRoom))
    @Post('/api/client/reservations')
    async addClientReservation(@Body() data: any, @Request() req) : Promise<Reservation> {
        const room = await this.hotelRoomService.findById(data.hotelRoom,true);
        if (!room) {
            throw new BadRequestException(`The room with the specified id=${data.hotelRoom} does not exist or is turned off`);
        }

        let toSave = {
            user : req.user.id,
            hotel : room.hotelId['id'],
            room : room.id,
            dateStart : data.startDate,
            dateEnd : data.endDate
        }
        const rez = await this.reservationService.addReservation(toSave);
        return await this.reservationService.getReservationById(rez.id);
    }

    @UseGuards(AuthenticatedGuard, RoleGuard)
    @SetMetadata('roles', ['client'])
    @UsePipes(new JoiValidationPipe(joiGetReservationRoomList))
    @Get('/api/client/reservations')
    async getClientReservations(@Query() data, @Request() req) : Promise<Reservation[]> {
        if (data.startDate && data.endDate) {
            if (new Date(data.startDate) >= new Date(data.endDate)) {
                throw new BadRequestException('dataStart is greater than or equal to dataEnd');
            }
        }
        let obj = {
            user : req.user.id,
            dateStart : null,
            dateEnd : null,
        }
        if (data.startDate) obj.dateStart = data.startDate;
        if (data.endDate) obj.dateEnd = data.endDate;
        console.log(data,"data", new Date(data.startDate));
        return await this.reservationService.getReservations(obj)  //req.user.id
    }

    @UseGuards(AuthenticatedGuard, RoleGuard)
    @SetMetadata('roles', ['client'])
    @Delete('/api/client/reservations/:id')
    async deleteReservationCurrentUser(@Param('id', new ParseMongoIDPipe) id : string) : Promise<void> {
        await this.reservationService.removeReservation(id);
        return null;
    }

    @UseGuards(AuthenticatedGuard, RoleGuard)
    @SetMetadata('roles', ['manager'])
    @UsePipes(new JoiValidationPipe(joiGetReservationRoomList))
    @Get('/api/manager/reservations/:userId')
    async getManagerReservations(@Param('userId', new ParseMongoIDPipe) id : string, @Query() data) : Promise<Reservation[]> {
        let obj = {
            user : id,
            dateStart : null,
            dateEnd : null,
        }
        console.log("obj",obj)
        return await this.reservationService.getReservations(obj);
    }

    @UseGuards(AuthenticatedGuard, RoleGuard)
    @SetMetadata('roles', ['manager'])
    @Delete('/api/manager/reservations/:userId/:reservationId')
    async deleteReservationManager(@Param('userId', new ParseMongoIDPipe) userId : string, 
        @Param('reservationId', new ParseMongoIDPipe) reservationId : string) : Promise<void> {
            console.log("u",userId);
            console.log("r",reservationId);
            const reserv = await this.reservationService.getReservationByIdAllFields(reservationId);
            if (!reserv) {
                throw new BadRequestException(`There is no booking ID=${reservationId} record`)
            }
            if (reserv.userId.toString() !== userId) {
                throw new ForbiddenException('The id of the current user does not match the id of the user in the reservation')
            }
            console.log("reserv",reserv);
            await this.reservationService.removeReservation(reservationId);
        return null;
    }
}