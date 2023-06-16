import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { HttpHeaderInterceptor } from './http-header.interceptor';

const environment = {
  baseUrl: 'api/v1',
};

const differentUrl = 'localhost:8000/notapi';

@Injectable()
class ExampleService {
  private readonly apiUrl = environment.baseUrl;

  public constructor(private readonly http: HttpClient) {}

  public getTest(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/test`);
  }
  public getFromDifferentUrl(): Observable<string> {
    return this.http.get<string>(`${differentUrl}/test`);
  }
}

describe(`HttpHeaderInterceptor`, () => {
  let service: ExampleService;
  let spectator: SpectatorService<ExampleService>;
  let httpMock: HttpTestingController;
  let translocoService: TranslocoService;

  const createService = createServiceFactory({
    service: ExampleService,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      HttpClientTestingModule,
    ],
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
    translocoService = spectator.inject(TranslocoService);
  });

  test('should be truthy', () => {
    expect(service).toBeTruthy();
  });

  describe('intercept', () => {
    test('should add http header on calls against /api/v1', () => {
      translocoService.getActiveLang = jest.fn(() => 'en');
      service.getTest().subscribe((res) => {
        expect(res).toBeTruthy();
      });
      const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);
      expect(httpRequest.request.method).toEqual('GET');

      expect(httpRequest.request.headers.get('language')).toEqual('en');
    });
    test('should not add http header on missing language', () => {
      translocoService.getActiveLang = jest.fn(() => undefined as any);
      service.getTest().subscribe((res) => {
        expect(res).toBeTruthy();
      });
      const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);
      expect(httpRequest.request.method).toEqual('GET');

      expect(
        httpRequest.request.headers.keys().includes('language')
      ).toBeFalsy();
    });
    test('should not add http header on call to different urls', () => {
      translocoService.getActiveLang = jest.fn(() => 'en');
      service.getFromDifferentUrl().subscribe((res) => {
        expect(res).toBeTruthy();
      });
      const httpRequest = httpMock.expectOne(`${differentUrl}/test`);
      expect(httpRequest.request.method).toEqual('GET');

      expect(
        httpRequest.request.headers.keys().includes('language')
      ).toBeFalsy();
    });

    test('should add content-type header', () => {
      translocoService.getActiveLang = jest.fn(() => 'en');
      service.getFromDifferentUrl().subscribe((res) => {
        expect(res).toBeTruthy();
      });
      const httpRequest = httpMock.expectOne(`${differentUrl}/test`);
      expect(httpRequest.request.method).toEqual('GET');

      expect(
        httpRequest.request.headers.keys().includes('Content-Type')
      ).toBeTruthy();
      expect(httpRequest.request.headers.get('Content-Type')).toEqual(
        'application/json'
      );
    });
  });
});
