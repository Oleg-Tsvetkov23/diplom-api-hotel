import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book extends Document {
  @Prop({ required:true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  authors: string;

  @Prop()
  favorite: string;

  @Prop()
  fileCover: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
