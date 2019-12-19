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
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  SnackBarComponent,
  SnackBarMessageType
} from '@schaeffler/shared/ui-components';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private readonly snackBar: MatSnackBar) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
          errorMessage = error.error.message;
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${error.status}, ` +
              `body was: ${error.error}`
          );

          errorMessage = `${error.status}: ${error.message}`;
        }

        this.showError(errorMessage);

        return throwError(errorMessage);
      })
    );
  }

  /**
   * Show notification on error
   */
  public showError(message: string): void {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      panelClass: 'error-message',
      data: {
        message,
        type: SnackBarMessageType.ERROR
      }
    });
    snackBarRef.instance.snackBarRef = snackBarRef;
  }
}
