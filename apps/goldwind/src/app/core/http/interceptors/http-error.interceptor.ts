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

import { translate, TranslocoService } from '@ngneat/transloco';

import enJson from '../../../../assets/i18n/en.json';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  public constructor(
    private readonly snackBar: MatSnackBar,
    private readonly translocoService: TranslocoService
  ) {
    this.translocoService.setTranslation(enJson, 'en');
  }

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
              translate('app.errorInterceptorMessageDefault'),
              translate('app.errorInterceptorActionDefault'),
              { duration: 5000 }
            )
            .onAction()
            .subscribe(() => {
              const a = document.createElement('a');
              a.href = `mailto:smartwindsolutions@schaeffler.com?subject=Support%20Request&body=Dear%20Smart%20Wind%20Solutions%20Support%2C%0Ai%20have%20the%20following%20request...%0A%0AAttached%20you%27ll%20find%20a%20screenshot%0A%0AKind%20regards`;
              a.target = '_blank';
              a.click();
            });
        }

        return throwError(errorMessage);
      })
    );
  }
}
