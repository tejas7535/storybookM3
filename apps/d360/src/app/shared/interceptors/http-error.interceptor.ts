import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { isProblemDetail } from '../utils/errors';
import { HttpError } from '../utils/http-client';
import {
  messageFromSAP,
  SapErrorMessageHeader,
} from '../utils/sap-localisation';
import { SnackbarService } from '../utils/service/snackbar.service';

const NO_ERROR_URLS = [
  'https://login.microsoftonline',
  'https://login.partner.microsoftonline',
  'https://graph.microsoft.com',
];

export const USE_DEFAULT_HTTP_ERROR_INTERCEPTOR = new HttpContextToken(
  () => true
);

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private readonly snackbarService: SnackbarService = inject(SnackbarService);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(async (error: HttpErrorResponse) => {
        const contentType = error.headers.get('Content-Type');

        let errorDetails = error.error;

        if (
          contentType === 'application/problem+json' ||
          contentType === 'application/json'
        ) {
          try {
            // When using Angular's HttpClient with a responseType != json, even error responses
            // will be parsed in the desired format (e.g. Blob).
            // Unfortunately the issue is known but there's no progress on the framework,
            // see https://github.com/angular/angular/issues/19888
            if (error.error instanceof Blob) {
              errorDetails = JSON.parse(await error.error.text());
            }
          } catch {
            errorDetails = { message: 'Failed to parse error response' };
          }
        }

        if (
          request.context.get(USE_DEFAULT_HTTP_ERROR_INTERCEPTOR) &&
          // only show toasts for errors not triggered by photo API
          !NO_ERROR_URLS.some((url) => error.url.startsWith(url))
        ) {
          let messageToDisplay = error.message as string;

          if (isProblemDetail(errorDetails)) {
            const values = errorDetails.values;

            if (values && values[SapErrorMessageHeader.MessageId]) {
              messageToDisplay = messageFromSAP(
                values[SapErrorMessageHeader.FallbackMessage],
                values[SapErrorMessageHeader.MessageNumber],
                values[SapErrorMessageHeader.MessageId],
                values[SapErrorMessageHeader.MessageV1],
                values[SapErrorMessageHeader.MessageV2],
                values[SapErrorMessageHeader.MessageV3],
                values[SapErrorMessageHeader.MessageV4]
              );
            }
          }

          this.snackbarService.openSnackBar(messageToDisplay);
        }

        throw new HttpError(error.status, errorDetails);
      })
    );
  }
}
