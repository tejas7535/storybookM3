import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpParams,
} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { HttpHeaderInterceptor } from './http-header.interceptor';

const environment = {
  baseUrl: 'localhost:8000/api/v1',
};

const differentUrl = 'localhost:8000/no-api';

@Injectable()
class ExampleService {
  readonly apiUrl = environment.baseUrl;

  constructor(private readonly http: HttpClient) {}

  getPosts(path?: string, params?: HttpParams): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${path ?? 'posts'}`, {
      params,
    });
  }

  getApplicationInsights(
    path?: string,
    params?: HttpParams
  ): Observable<string> {
    return this.http.get<string>(
      `${differentUrl}/${path ?? 'application-insights'}`,
      {
        params,
      }
    );
  }
}

describe('HttpHeaderInterceptor', () => {
  let service: ExampleService;
  let spectator: SpectatorService<ExampleService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: ExampleService,
    imports: [HttpClientTestingModule],
    providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpHeaderInterceptor,
        multi: true,
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should add content-type header when request to api', () => {
    service.getPosts().subscribe((res) => {
      expect(res).toBeTruthy();
    });
    const httpRequest = httpMock.expectOne(`${environment.baseUrl}/posts`);
    expect(httpRequest.request.method).toEqual('GET');

    expect(
      httpRequest.request.headers.keys().includes('Content-Type')
    ).toBeTruthy();
    expect(httpRequest.request.headers.get('Content-Type')).toEqual(
      'application/json'
    );
  });

  test('should add content-type header when request outside api', () => {
    service.getApplicationInsights().subscribe((res) => {
      expect(res).toBeTruthy();
    });
    const httpRequest = httpMock.expectOne(
      `${differentUrl}/application-insights`
    );
    expect(httpRequest.request.method).toEqual('GET');

    expect(
      httpRequest.request.headers.keys().includes('Content-Type')
    ).toBeTruthy();
    expect(httpRequest.request.headers.get('Content-Type')).toEqual(
      'application/json'
    );
  });
});
