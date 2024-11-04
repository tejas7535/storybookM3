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
    return next.handle(request).pipe(
      catchError(async (error: HttpErrorResponse) => {
        // When using Angular's HttpClient with a responseType != json, even error responses
        // will be parsed in the desired format (e.g. Blob).
        // Unfortunately the issue is known but there's no progress on the framework,
        // see https://github.com/angular/angular/issues/19888
        const contentType = error.headers.get('Content-Type');

        let errorDetails = error.error;
        if (
          error.error instanceof Blob &&
          (contentType === 'application/problem+json' ||
            contentType === 'application/json')
        ) {
          try {
            errorDetails = JSON.parse(await error.error.text());
          } catch {
            errorDetails = { message: 'Failed to parse error response' };
          }
        }

        if (request.context.get(USE_DEFAULT_HTTP_ERROR_INTERCEPTOR)) {
          this.snackbarService.openSnackBar(error.message as string);
        }

        throw new HttpError(error.status, errorDetails);
      })
    );
  }
}
