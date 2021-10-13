import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from'@nestjs/common';

@Injectable()
export class ParseMongoIDPipe implements PipeTransform<string, string> {
    transform(value: string, metadata: ArgumentMetadata): string {
        if (!/^[0-9a-fA-F]{24}$/.test(value)) {
            throw new BadRequestException('Validation failed');   
        }
        return value; 
    }
}