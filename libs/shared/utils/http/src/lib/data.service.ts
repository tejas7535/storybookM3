import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ENV_CONFIG, EnvironmentConfig } from './environment-config.interface';
import { DeleteOptions, GetOptions, PostOptions, PutOptions } from './models';

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

  public getAll<T>(path: string, options: GetOptions = {}): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${path}`, options);
  }

  public post<T>(
    path: string,
    body: any,
    options: PostOptions = {}
  ): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${path}`, body, options);
  }

  public put<T>(
    path: string,
    body: any,
    options: PutOptions = {}
  ): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${path}`, body, options);
  }

  public delete<T>(path: string, options: DeleteOptions = {}): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${path}`, options);
  }
}
