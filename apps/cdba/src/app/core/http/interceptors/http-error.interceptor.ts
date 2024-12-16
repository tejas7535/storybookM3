import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BomExportPath, ProductDetailPath } from '@cdba/shared/constants/api';
import { AUTH_URLS } from '@cdba/shared/constants/urls';
import { InteractionType } from '@cdba/user-interaction/model/interaction-type.enum';
import { UserInteractionService } from '@cdba/user-interaction/service/user-interaction.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        // don't use the interceptor for detail paths or bom export paths
        if (
          errorResponse.url.includes(BomExportPath) ||
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
          this.userInteractionService.interact(
            InteractionType.HTTP_GENERAL_ERROR
          );
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  constructor(
    private readonly userInteractionService: UserInteractionService
  ) {}
}
