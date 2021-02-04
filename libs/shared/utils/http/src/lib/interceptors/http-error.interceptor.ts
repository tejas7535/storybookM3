import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SnackBarService } from '@schaeffler/snackbar';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private readonly snackBarService: SnackBarService) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {
          // a client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);

          // show default error message
          errorMessage = 'An error occurred. Please try again later.';
        } else {
          // Backend Response
          console.error(
            `Backend returned code ${error.status}, ` +
              `body was: ${JSON.stringify(error.error)}`
          );

          errorMessage = `${error.error.title} - ${error.error.detail}`;
        }

        // errors that are not triggered by login should show a toast
        const loginUrls = [
          'https://login.microsoftonline',
          'https://login.partner.microsoftonline',
        ];
        if (!loginUrls.some((loginUrl) => error.url.startsWith(loginUrl))) {
          this.snackBarService.showErrorMessage(errorMessage);
        }

        return throwError(errorMessage);
      })
    );
  }
}
