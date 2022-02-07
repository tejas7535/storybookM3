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

import deJson from '../../../assets/i18n/http/de.json';
import enJson from '../../../assets/i18n/http/en.json';
import { AUTH_URLS, URL_SUPPORT } from './constants/urls';

@Injectable()
export class BaseHttpInterceptor implements HttpInterceptor {
  public constructor(
    private readonly snackbar: MatSnackBar,
    private readonly translocoService: TranslocoService
  ) {
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(deJson, 'de');
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        let duration = 2000;

        if (
          error.error?.parameters &&
          Object.keys(error.error.parameters).length > 0
        ) {
          // sap error message
          const parameterKey = Object.keys(error.error.parameters)[0];

          errorMessage += `${parameterKey}: `;
          errorMessage += `${error.error.parameters[parameterKey]}`;
          duration = 5000;
        } else {
          // default error message
          errorMessage += translate('errorInterceptorMessageDefault');
        }
        // only show toasts for errors not triggered by auth lib
        if (!AUTH_URLS.some((authUrl) => error.url.startsWith(authUrl))) {
          this.snackbar
            .open(errorMessage, translate('errorInterceptorActionDefault'), {
              duration,
            })
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
