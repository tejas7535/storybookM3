import {
  HttpContextToken,
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

import { translate, TranslocoService } from '@jsverse/transloco';

import deJson from '../../../assets/i18n/http/de.json';
import enJson from '../../../assets/i18n/http/en.json';
import { AUTH_URLS, URL_SUPPORT } from './constants/urls';

export const SHOW_DEFAULT_SNACKBAR_ACTION = new HttpContextToken(() => true);
const ERROR_ID = 'errorId';
const ADDITIONAL_ERROR_PARAM = 'additionalErrorParam';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
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
        const showSnackBarAction = request.context.get(
          SHOW_DEFAULT_SNACKBAR_ACTION
        );
        let errorMessage = '';
        let duration = 5000;
        let errorId = '?';

        if (
          error.error?.parameters &&
          Object.keys(error.error.parameters).length > 0
        ) {
          const indexOfParameterKey = Object.prototype.hasOwnProperty.call(
            error.error.parameters,
            ERROR_ID
          )
            ? Object.keys(error.error.parameters).indexOf(ERROR_ID)
            : 0;

          const parameterKey = Object.keys(error.error.parameters)[
            indexOfParameterKey
          ];

          if (parameterKey === ERROR_ID) {
            errorId = error.error.parameters[parameterKey];
            errorMessage = translate(`${ERROR_ID}.${errorId}`, {
              additionalErrorParam:
                error.error.parameters[ADDITIONAL_ERROR_PARAM],
              fallback: `${error.error.localizedMessage}`,
            });
          } else {
            // sap error message
            errorMessage += `${parameterKey}: `;
            errorMessage += `${error.error.parameters[parameterKey]}`;
          }
        } else {
          // default error message
          duration = 2000;
          errorMessage += translate('errorInterceptorMessageDefault');
        }

        // only show toasts for errors not triggered by auth lib
        if (!AUTH_URLS.some((authUrl) => error.url.startsWith(authUrl))) {
          this.snackbar
            .open(
              errorMessage,
              showSnackBarAction
                ? translate('errorInterceptorActionDefault')
                : '',
              {
                duration,
              }
            )
            .onAction()
            .subscribe(() => {
              window.open(URL_SUPPORT, '_blank').focus();
            });
        }

        return throwError(() => ({ errorMessage, errorId }));
      })
    );
  }
}
