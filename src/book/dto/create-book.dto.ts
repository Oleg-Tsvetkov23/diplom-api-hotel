import { Book } from '../book.interface'

 
export class CreateBookDto {
    title : Book['title'];
    description: Book['description'];
    authors: Book['authors'];
    favorite: Book['favorite'];
    fileCover: Book['fileCover'];
}