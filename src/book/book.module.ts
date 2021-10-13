import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './book.model'
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { PassportModule } from '@nestjs/passport';
//import { JwtModule } from '@nestjs/jwt';
import "dotenv/config";
//import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
    imports: [
        MongooseModule.forFeature([{ name:Book.name, schema:BookSchema }]),
        PassportModule,
  /*
        JwtModule.register({
            secret : process.env.JWT_TOKEN_SECRET
        })
        */
    ],
    controllers: [BookController],
    providers: [BookService,/* JwtStrategy*/],
    exports: [BookService]    
})
export class BookModule {}
