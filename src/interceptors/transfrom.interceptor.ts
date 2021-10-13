import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    status: string,
    data: T;
}


@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        const code = context.switchToHttp().getResponse().statusCode;
        let stat = 'fail';
        if (code >=200 && code <= 204) stat = 'success'
        const ret = next.handle().pipe(
                map(data => ({ status:`${stat}`, data })),
        );
        return ret;
  }
}

