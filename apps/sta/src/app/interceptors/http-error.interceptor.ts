import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';

import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { translate } from '@ngneat/transloco';
import { SnackBarService } from '@schaeffler/shared/ui-components';

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
          errorMessage = translate('0', {}, 'errorMessages');
        } else {
          // Backend Response
          console.error(
            `Backend returned code ${error.status}, ` +
              `body was: ${JSON.stringify(error.error)}`
          );

          errorMessage = translate(
            error.error.errorId.toString(),
            {},
            'errorMessages'
          );
        }

        this.snackBarService.showErrorMessage(errorMessage);

        return throwError(errorMessage);
      })
    );
  }
}
