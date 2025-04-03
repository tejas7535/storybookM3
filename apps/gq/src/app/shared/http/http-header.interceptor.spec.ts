import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Observable } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

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

  public postUserSettings(): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/user-settings`, {});
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

  public getRfqApprovalAttachments(): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}/rfq4/12345/download-approval`,
      {}
    );
  }

  public postRfqApprovalAttachments(): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}/rfq4/12345/upload-approval`,
      {}
    );
  }
}

describe(`HttpHeaderInterceptor`, () => {
  let service: ExampleService;
  let spectator: SpectatorService<ExampleService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: ExampleService,
    imports: [provideTranslocoTestingModule({ en: {} }), NoopAnimationsModule],
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      provideHttpClientTesting(),
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
  afterEach(() => {
    httpMock.verify();
  });

  test('should be truthy', () => {
    expect(service).toBeTruthy();
  });

  describe('intercept', () => {
    test('should not add header-content to user-settings when post', () => {
      service.postUserSettings().subscribe((res) => {
        expect(res).toBeTruthy();
      });

      const httpRequest = httpMock.expectOne(
        `${environment.baseUrl}/user-settings`
      );
      expect(httpRequest.request.method).toEqual('POST');

      expect(
        httpRequest.request.headers.keys().includes('language')
      ).toBeFalsy();
      expect(
        httpRequest.request.headers.keys().includes('content-type')
      ).toBeFalsy();
    });
    test('should not add header-content to quotations/{gqId}/attachments when post', () => {
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
      service.getTest().subscribe((res) => {
        expect(res).toBeTruthy();
      });
      const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);
      expect(httpRequest.request.method).toEqual('GET');

      expect(httpRequest.request.headers.get('language')).toEqual('en');
    });
    test('should not add http header on call to different urls', () => {
      service.getFromDifferentUrl().subscribe((res) => {
        expect(res).toBeTruthy();
      });
      const httpRequest = httpMock.expectOne(`${differentUrl}/test`);
      expect(httpRequest.request.method).toEqual('GET');

      expect(
        httpRequest.request.headers.keys().includes('language')
      ).toBeFalsy();
    });

    test('should not add header-content to rfq4/{gqPositionId}/upload-approval when post', () => {
      service.postRfqApprovalAttachments().subscribe((res) => {
        expect(res).toBeTruthy();
      });
      const httpRequest = httpMock.expectOne(
        `${environment.baseUrl}/rfq4/12345/upload-approval`
      );
      expect(httpRequest.request.method).toEqual('POST');

      expect(
        httpRequest.request.headers.keys().includes('language')
      ).toBeFalsy();
      expect(
        httpRequest.request.headers.keys().includes('content-type')
      ).toBeFalsy();
    });
    test('should not add header-content to rfq4/{gqPositionId}/download-approval when get', () => {
      service.getRfqApprovalAttachments().subscribe((res) => {
        expect(res).toBeTruthy();
      });
      const httpRequest = httpMock.expectOne(
        `${environment.baseUrl}/rfq4/12345/download-approval`
      );
      expect(httpRequest.request.method).toEqual('GET');

      expect(
        httpRequest.request.headers.keys().includes('language')
      ).toBeFalsy();
      expect(
        httpRequest.request.headers.keys().includes('content-type')
      ).toBeFalsy();
    });

    test('should add content-type header', () => {
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
