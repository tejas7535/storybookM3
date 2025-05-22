import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, map, Observable, of } from 'rxjs';

import { environment } from '@ga/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InternalDetectionService {
  private readonly internalUserErrorCode = 409;
  private readonly httpClient: HttpClient = inject(HttpClient);

  public getInternalHelloEndpoint(): Observable<boolean> {
    return this.httpClient.get<unknown>(environment.internalDetectionUrl).pipe(
      map(Boolean),
      catchError((error: HttpErrorResponse) => {
        if (error.status === this.internalUserErrorCode) {
          return of(true);
        }

        return of(false);
      })
    );
  }
}
