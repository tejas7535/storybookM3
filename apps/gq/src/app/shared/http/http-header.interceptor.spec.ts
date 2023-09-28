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

  public postAttachments(): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}/quotations/12345/attachments`,
      {}
    );
  }

  public getAttachments(): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}/quotations/12345/attachments/download`,
      {}
    );
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
    test('should not add header-content to quotations/{gqId}/attachments when post', () => {
      translocoService.getActiveLang = jest.fn(() => 'en');
      service.postAttachments().subscribe((res) => {
        expect(res).toBeTruthy();
      });
      const httpRequest = httpMock.expectOne(
        `${environment.baseUrl}/quotations/12345/attachments`
      );
      expect(httpRequest.request.method).toEqual('POST');

      expect(
        httpRequest.request.headers.keys().includes('language')
      ).toBeFalsy();
      expect(
        httpRequest.request.headers.keys().includes('content-type')
      ).toBeFalsy();
    });
    test('should not add header-content to quotations/{gqId}/attachments/download when get', () => {
      translocoService.getActiveLang = jest.fn(() => 'en');
      service.getAttachments().subscribe((res) => {
        expect(res).toBeTruthy();
      });
      const httpRequest = httpMock.expectOne(
        `${environment.baseUrl}/quotations/12345/attachments/download`
      );
      expect(httpRequest.request.method).toEqual('GET');

      expect(
        httpRequest.request.headers.keys().includes('language')
      ).toBeFalsy();
      expect(
        httpRequest.request.headers.keys().includes('content-type')
      ).toBeFalsy();
    });
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
