import { Body, Controller, Get, Post, Param, Delete, Put, UseInterceptors, UsePipes, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { BookDocument } from './book.model'
import { CreateBookDto } from './dto/create-book.dto';
//import { TransformInterceptor } from '../interceptors/transfrom.interceptor'
//import { MyInterceptor } from '../interceptors/my.interceptor'
import { ParseMongoIDPipe } from '../pipe/mongoID.pipe'
import { JoiValidationPipe } from '../pipe/book.joi-pipe'
import { dataBookSchema } from '../joi/book.joischema'
//import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('api/book')
//@UseGuards(JwtAuthGuard)
export class BookController {
    constructor(private readonly bookService : BookService) {}

    @Post()
    @UsePipes(new JoiValidationPipe(dataBookSchema))
    create(@Body() data : CreateBookDto) : Promise<BookDocument> {
        return this.bookService.create(data);
    }

    @Get()
//    @UseInterceptors(MyInterceptor)
    async findAll(): Promise<BookDocument[]> {
        return this.bookService.findAll();
    }

    @Get(':id')
//    @UseInterceptors(TransformInterceptor)
//    @UseInterceptors(MyInterceptor)
    @UsePipes()
    findOne(@Param('id', new ParseMongoIDPipe) id: string) : Promise<BookDocument> {
        return this.bookService.getBook(id);
    }

    @Delete(':id')
    @UsePipes()
    deleteOne(@Param('id', new ParseMongoIDPipe) id: string) : Promise<BookDocument> {
        return this.bookService.deleteBook(id);
    }

    @Put(':id')
    @UsePipes()
    updateOne(@Param('id', new ParseMongoIDPipe) id: string, @Body(new JoiValidationPipe(dataBookSchema)) data: CreateBookDto){
        return this.bookService.updateBook(id, data);
    }
}
