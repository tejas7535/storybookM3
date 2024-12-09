import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BomExportPath, ProductDetailPath } from '@cdba/shared/constants/api';
import { AUTH_URLS } from '@cdba/shared/constants/urls';
import { Interaction } from '@cdba/shared/services/user-interaction/interaction-type.model';
import { UserInteractionService } from '@cdba/shared/services/user-interaction/user-interaction.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  public constructor(
    private readonly userInteractionService: UserInteractionService
  ) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (
          errorResponse.url.includes(BomExportPath) &&
          errorResponse.status === HttpStatusCode.BadRequest
        ) {
          this.userInteractionService.interact(
            Interaction.HTTP_GENERAL_VALIDATION_ERROR
          );
        }
        // don't use the interceptor for detail paths
        else if (
          Object.values<string>(ProductDetailPath).some(
            (path) =>
              errorResponse.url.includes(`/${path}`) &&
              !errorResponse.url.includes(BomExportPath)
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
          this.userInteractionService.interact(Interaction.HTTP_GENERAL_ERROR);
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
