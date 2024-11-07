import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ProductDetailPath } from '@cdba/shared/constants/api';

import { AUTH_URLS } from '../constants/urls';
import { HttpErrorType } from '../models/http-error-type.model';
import { HttpErrorService } from '../services/http-error.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  public constructor(private readonly httpErrorService: HttpErrorService) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse.url.includes(ProductDetailPath.BomExport)) {
          this.httpErrorService.handleHttpError(HttpErrorType.Validation);

          this.logValidationError(errorResponse);

          return throwError(() => errorResponse);
        }
        // don't use the interceptor for detail paths
        else if (
          Object.values<string>(ProductDetailPath).some((path) =>
            errorResponse.url.includes(`/${path}`)
          )
        ) {
          return throwError(() => errorResponse);
        }

        let errorMessage = '';

        if (errorResponse.error instanceof ProgressEvent) {
          // a client-side or network error occurred. Handle it accordingly.
          console.error(
            'An error occurred:',
            errorResponse.status,
            errorResponse.statusText,
            errorResponse.message
          );

          // show default error message
          errorMessage = 'An error occurred. Please try again later.';
        } else {
          // Backend Response
          console.error(
            `Backend returned code ${errorResponse.status} - ${errorResponse.statusText}, ` +
              `body was: ${errorResponse.message}`
          );

          errorMessage = `${errorResponse.status} - ${errorResponse.statusText}: ${errorResponse.error}`;
        }

        if (
          !AUTH_URLS.some((authUrl) => errorResponse.url.startsWith(authUrl))
        ) {
          this.httpErrorService.handleHttpError(HttpErrorType.Default);
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private async logValidationError(
    errorResponse: HttpErrorResponse
  ): Promise<void> {
    const message = await errorResponse.error.text();

    console.error(JSON.parse(message) as ValidationErrors);
  }
}
