import { Injectable, NestInterceptor, ExecutionContext, CallHandler, InternalServerErrorException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface Response<T> {
    status: string,
    data: T;
}

@Injectable()
export class MyInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next
      .handle()
      .pipe(
        map(v => {
            let myData : {status:string; data:any}
            myData = {status:'none',data:v}
            return myData}),
        tap((val) => {
            val.status = 'success'
        }),
        catchError(err => {
            return throwError(err);

        })
      );
  }
}