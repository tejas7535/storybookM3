import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, map, Observable, of } from 'rxjs';

import { environment } from '@ga/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InternalDetectionService {
  public constructor(private readonly httpClient: HttpClient) {}

  public getInternalHelloEndpoint(): Observable<boolean> {
    return this.httpClient.get(environment.internalDetectionUrl).pipe(
      map(Boolean),
      catchError(() => of(false))
    );
  }
}
