import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '@mac/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InternalUserCheckService {
  private readonly STORAGE_ENDPOINT = environment.internalUserCheckURL;

  public constructor(private readonly httpClient: HttpClient) {}

  public isInternalUser() {
    return this.httpClient.get<any>(this.STORAGE_ENDPOINT).pipe(
      catchError(() => of(false)),
      map(() => true)
    );
  }
}
