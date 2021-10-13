import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './book.model'
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private BookModel: Model<BookDocument>,
//        @InjectConnection() privateconnection: Connection,
      ) {}

    async create(create_book:CreateBookDto): Promise<BookDocument> {
        const book = new this.BookModel(create_book);
        return book.save();
    }

    async findAll() : Promise<BookDocument[]> {
        return this.BookModel.find().exec()
    }

    async getBook(id:string) : Promise<BookDocument> {
        return this.BookModel.findById({_id:id}).exec();
    }

    async deleteBook(id:string) : Promise<BookDocument> {
        return this.BookModel.findOneAndRemove({_id:id}).exec();
    }

    async updateBook(id:string, data:CreateBookDto) : Promise<BookDocument> {
        return this.BookModel.findOneAndUpdate({ _id:id },data).exec();
    }
}
