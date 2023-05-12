import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { translate, TranslocoService } from '@ngneat/transloco';

import deJson from '../../../assets/i18n/http/de.json';
import enJson from '../../../assets/i18n/http/en.json';
import { AppRoutePath } from '../../app-route-path.enum';
import { ApiVersion } from '../models';
import { QuotationPaths } from '../services/rest/quotation/models/quotation-paths.enum';
import { SearchPaths } from '../services/rest/search/models/search-paths.enum';
import { AUTH_URLS, URL_SUPPORT } from './constants/urls';

export const BYPASS_DEFAULT_ERROR_HANDLING = new HttpContextToken(() => false);

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  public constructor(
    private readonly snackbar: MatSnackBar,
    private readonly translocoService: TranslocoService,
    private readonly router: Router
  ) {
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(deJson, 'de');
  }

  private readonly navigateOnForbiddenPaths = [
    `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/`,
    `${ApiVersion.V1}/${SearchPaths.PATH_CUSTOMERS}/`,
  ];

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.context.get(BYPASS_DEFAULT_ERROR_HANDLING)) {
      return next.handle(request);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        let duration = 5000;
        let showSnackBarAction = true;

        if (
          error.error?.parameters &&
          Object.keys(error.error.parameters).length > 0
        ) {
          // sap error message
          const parameterKey = Object.keys(error.error.parameters)[0];

          errorMessage += `${parameterKey}: `;
          errorMessage += `${error.error.parameters[parameterKey]}`;
        } else if (error.status === HttpStatusCode.Forbidden) {
          if (
            this.navigateOnForbiddenPaths.some((path) =>
              request.url.includes(path)
            )
          ) {
            this.router.navigate([AppRoutePath.ForbiddenCustomerPath]);
          }

          errorMessage += translate('errorInterceptorForbidden');
        } else if (
          // handle error message for create case by customer with no valid selection
          // TODO: adjust error handling strategy in the frontend to not overload the interceptor in the future
          request.url.includes(
            `${ApiVersion.V1}/${QuotationPaths.PATH_CUSTOMER_QUOTATION}`
          ) &&
          error.status === HttpStatusCode.BadRequest
        ) {
          errorMessage = translate(
            'errorInterceptorCreateCustomerCaseNoQuotationDetails'
          );
          showSnackBarAction = false;
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

        return throwError(errorMessage);
      })
    );
  }
}
