import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GreetingService {
  baseUrl: string = environment.apiBaseUrl;

  constructor(private readonly httpClient: HttpClient) {}

  public greet(): Observable<string> {
    const language = navigator.language;

    const params = new HttpParams().set('language', language);

    return this.httpClient
      .get<{ greeting: string }>(`${this.baseUrl}/api/hello`, { params })
      .pipe(
        map(response => response.greeting),
        catchError(() => of('Server is currently unavailable'))
      );
  }
}
