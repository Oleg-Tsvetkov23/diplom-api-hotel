import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
 
@Catch( HttpException) //NotFoundException,
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception.getStatus();
    const data = exception.message;
 
    response
      .json({
            status : 'fail',
            data,
            code: status,
            time: new Date().toISOString(),
      });
  }
}