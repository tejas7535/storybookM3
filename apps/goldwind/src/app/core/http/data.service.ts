import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ENV_CONFIG, EnvironmentConfig } from './environment-config.interface';

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

  public getIotThings<T>(path: string, params?: HttpParams): Observable<T> {
    const options = params ? { params } : {};

    return this.http.get<T>(`${this.apiUrl}/iot/things/${path}`, options);
  }
}
