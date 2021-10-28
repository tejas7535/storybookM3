import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TranslocoService } from '@ngneat/transloco';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { URL_SUPPORT } from '../constants/urls';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  public constructor(
    private readonly snackBar: MatSnackBar,
    private readonly translocoService: TranslocoService
  ) {}

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

        // errors that are not triggered by auth lib should show a toast
        const authUrls = [
          'https://login.microsoftonline',
          'https://login.partner.microsoftonline',
          'https://graph.microsoft.com',
        ];
        if (!authUrls.some((authUrl) => error.url.startsWith(authUrl))) {
          this.snackBar
            .open(
              this.translocoService.translate(
                'http.errorInterceptorMessageDefault'
              ),
              this.translocoService.translate(
                'http.errorInterceptorActionDefault'
              ),
              { duration: 5000 }
            )
            .onAction()
            .subscribe(() => {
              window.open(URL_SUPPORT, '_blank').focus();
            });
        }

        return throwError(errorMessage);
      })
    );
  }
}
