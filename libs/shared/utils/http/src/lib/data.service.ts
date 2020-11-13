import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ENV_CONFIG, EnvironmentConfig } from './environment-config.interface';
import { GetOptions } from './get-options.model';

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

  public getAll<T>(path: string, options?: GetOptions): Observable<T> {
    const providedOptions = options ? options : {};

    return this.http.get<T>(
      `${this.apiUrl}/${path}`,
      providedOptions as unknown
    );
  }

  public post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${path}`, body);
  }

  public put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${path}`, body);
  }
}
