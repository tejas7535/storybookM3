import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpError } from '../utils/http-client';
import { SnackbarService } from '../utils/service/snackbar.service';

export const USE_DEFAULT_HTTP_ERROR_INTERCEPTOR = new HttpContextToken(
  () => true
);

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  public constructor(private readonly snackbarService: SnackbarService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.context.get(USE_DEFAULT_HTTP_ERROR_INTERCEPTOR)) {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          // TODO determine what we need to put as detail instead of error.message in HttpError --> use methods from errors.ts and snackbar to display these errors
          const httpError = new HttpError(error.status, error.message);

          // TODO discuss if it is good to open snackbar here
          this.snackbarService.openSnackBar(httpError.details as string);
          throw httpError;
        })
      );
    }

    return next.handle(request);
  }
}
