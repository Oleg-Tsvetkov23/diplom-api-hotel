import {
    Controller,
    Body,
    Post,
    Get,
    Query,
    Param,
    UsePipes,
    NotFoundException,
    UploadedFiles,
    UseInterceptors,
    Request, 
    BadRequestException,
    UseGuards,
    Put
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { Hotel, HotelRoom } from './hotel.interface';
import { HotelRoomService } from './hotelroom.service';
import { JoiValidationPipe } from 'src/pipe/book.joi-pipe';
import { joiAddHotel, joiAddHotelRoom, joiGetHotelList, joiGetHotelRoomList, joiUpdateHotel, joiUpdateHotelRoom } from './joi/joi.hotel'
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthenticatedGuard } from '../auth/guards/autentificate.guard'
import { RoleGuard } from '../auth/guards/role.guard'
import { SetMetadata } from '@nestjs/common';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { ParseMongoIDPipe } from 'src/pipe/mongoID.pipe';

type hotelTitle = Pick<Hotel, "title">;

import { Observable, of } from 'rxjs';


export const storage = {
    storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {

            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '');// + uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${uuidv4()}#${filename}${extension}`)
        }
    }),
    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            // Allow storage of file
            cb(null, true);
        } else {
            // Reject file
            cb(new BadRequestException(`Unsupported file type ${path.parse(file.originalname).ext}`), false);
        }
    }

}


@Controller()
export class HotelController {
    constructor (
        private readonly hotelService:HotelService, 
        private readonly hotelRoom: HotelRoomService
    ) {} 

    @UseGuards(AuthenticatedGuard, RoleGuard)
    @SetMetadata('roles', ['admin'])
    @UsePipes(new JoiValidationPipe(joiAddHotel))
    @Post('/api/admin/hotels/')
    async create(@Body() data : any) : Promise<Hotel> {
        console.log(data)
        const rez = await this.hotelService.create(data);
        return {"id":rez.id, "title":rez.title, "description":rez.description?rez.description : ""}
    }

    @UseGuards(AuthenticatedGuard, RoleGuard)
    @SetMetadata('roles', ['admin'])
    @UsePipes(new JoiValidationPipe(joiGetHotelList))
    @Get('/api/admin/hotels')
    async find(@Query() data : Pick<Hotel, "title">, )  : Promise<Hotel[]> {
        return this.hotelService.search(data);
    }

    @Get(':id')
    async findById(@Param('id', new ParseMongoIDPipe) id : string)  : Promise<Hotel> {
        return this.hotelService.findById(id);
    }

    @UseGuards(AuthenticatedGuard, RoleGuard)
    @SetMetadata('roles', ['admin'])
    @Post('/api/admin/hotel-rooms/')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'images'}],storage))
    async uploadFile(@UploadedFiles() file : Array<Express.Multer.File>, @Request() req): Promise<any> {
        // Валидация полей запроса
        let value = joiAddHotelRoom.validate(req.body);
        if (value.error) {
            throw new BadRequestException(value.error.message);
        }
        // Проверка на наличие файла(ов)
        if (req.files.images === undefined) {
            throw new BadRequestException('Upload file(s) not exists');
        }

        let images = []
        for (let i = 0; i < req.files.images.length; ++i) {
            images.push(req.files.images[i].filename)
        }

        const hotel = await this.hotelService.findById(req.body.hotelId);
        if (!hotel) {
            throw new NotFoundException(`Record hotelId=${req.body.hotelId} not found`);
        }
        const room = await this.hotelRoom.create({
            "hotelId" : req.body.hotelId,
            "title" : req.body.title,
            "description" : req.body.description ? req.body.description : "",
            "images" :  images
        });
        return this.hotelRoom.findById(room.id);
    }

    @UseGuards(AuthenticatedGuard, RoleGuard)
    @SetMetadata('roles', ['admin'])
    @Put('/api/admin/hotels/:id')
    async updateHotel(@Param('id', new ParseMongoIDPipe) id : string, @Body() data : any) : Promise<Hotel> {
        let validate = joiUpdateHotel.validate(data);
        if (validate.error) {
            throw new BadRequestException(validate.error.message);
        }
        if (!data.title && !data.description) {
            throw new BadRequestException('No data available to edit');            
        }
        data.updateAt = Date.now(); 
        const upd = await this.hotelService.update(id, data);
        if (!upd) {
            throw new NotFoundException(`Record id=${id} not found`);
        }
        const zap = await this.hotelService.findById(id);
        return {"id":zap.id, "title":zap.title, "description":zap.description}
    } 

    @UsePipes(new JoiValidationPipe(joiGetHotelRoomList))
    @Get('/api/common/hotel-rooms')
    async searchHotelRoom(@Query() data, @Request() req) : Promise<HotelRoom[]> {
        return await this.hotelRoom.search(data);
    }

    @Get('/api/common/hotel-rooms/:id')
    async getHotelRoomByID(@Param('id', new ParseMongoIDPipe) id : string): Promise<HotelRoom> {
        return await this.hotelRoom.findById(id, true);
    }

    @UseGuards(AuthenticatedGuard, RoleGuard)
    @SetMetadata('roles', ['admin'])
    @Put('/api/admin/hotel-rooms/:id')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'images'}],storage))
    async updateInfoHotelRoom(@UploadedFiles() file : Array<Express.Multer.File>,@Param('id', new ParseMongoIDPipe) id : string, @Request() req): Promise<HotelRoom> {

        let validate = joiUpdateHotelRoom.validate(req.body);
        if (validate.error) {
            throw new BadRequestException(validate.error.message);
        }
   
        let {title, description, hotelId, images, isEnabled} = req.body;
        let arr = [];
        if (typeof(images) === 'string' && images.length > 0) arr.push(images);
        if (Array.isArray(images)) { //arr = [...images]; 
            images.forEach(el => {if (el.length > 0) arr.push(el);})
        }

        if (req.files.images) {
            for (let i = 0; i < req.files.images.length; ++i) {
                arr.push(req.files.images[i].filename);
            }        
        }
        await this.hotelRoom.update(id,{title:title,description:description, hotelId:hotelId, images:arr, isEnabled:isEnabled});
        return this.hotelRoom.findById(id);
    }
}
