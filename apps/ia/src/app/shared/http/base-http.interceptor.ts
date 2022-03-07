import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IGNORE_HTTP_CALLS } from './constants';

@Injectable()
export class BaseHttpInterceptor implements HttpInterceptor {
  public constructor(private readonly snackbar: MatSnackBar) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        let showError = true;

        if (
          IGNORE_HTTP_CALLS.some(
            (callObj) =>
              error.url.includes(callObj.url) &&
              request.method === callObj.method &&
              error.status === callObj.status
          )
        ) {
          showError = false;
        }

        if (showError) {
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

          // errors that are not triggered by auth lib should show a toast
          this.snackbar.open(errorMessage);
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
