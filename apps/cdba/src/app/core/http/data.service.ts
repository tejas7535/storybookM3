import { Observable } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { EnvironmentConfig, ENV_CONFIG } from './environment-config.interface';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public apiUrl: string;

  public constructor(
    @Inject(ENV_CONFIG) private readonly config: EnvironmentConfig,
    private readonly http: HttpClient
  ) {
    this.apiUrl = `${this.config.environment.baseUrl}`;
  }

  public getAll<T>(path: string, params?: HttpParams): Observable<T> {
    const options = params ? { params } : {};

    return this.http.get<T>(`${this.apiUrl}/${path}`, options);
  }

  public post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${path}`, body);
  }
}
