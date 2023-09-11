import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { environment } from '@ea/environments/environment';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { HttpCatalogWebApiInterceptor } from './http-catalog-web-api.interceptor';

@Injectable()
class ExampleService {
  private readonly apiUrl = environment.catalogApiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  public getProducts(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/test`);
  }
}

describe('HttpCatalogWebApiInterceptor', () => {
  let service: ExampleService;
  let spectator: SpectatorService<ExampleService>;
  let httpMock: HttpTestingController;
  let translocoService: TranslocoService;
  const testUrl = `${environment.catalogApiBaseUrl}/test`;

  const createService = createServiceFactory({
    service: ExampleService,
    imports: [
      HttpClientTestingModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      ExampleService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpCatalogWebApiInterceptor,
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

  it('should be truthy', () => {
    expect(service).toBeTruthy();
  });

  describe('intercept', () => {
    it('should adjust header attributes with default lang', waitForAsync(() => {
      translocoService.getActiveLang = jest.fn(() => 'not a language');
      service.getProducts().subscribe((response: any) => {
        expect(response).toBeTruthy();
      });
      const httpRequest = httpMock.expectOne(testUrl);
      expect(httpRequest.request.headers.get('Locale')).toBe('en_US');
    }));

    it('should adjust header attributes with german', waitForAsync(() => {
      translocoService.getActiveLang = jest.fn(() => 'de');
      service.getProducts().subscribe((response: any) => {
        expect(response).toBeTruthy();
      });
      const httpRequest = httpMock.expectOne(testUrl);
      expect(httpRequest.request.headers.get('Locale')).toBe('de_DE');
    }));

    it('should adjust header attributes with english', waitForAsync(() => {
      translocoService.getActiveLang = jest.fn(() => 'en');
      service.getProducts().subscribe((response: any) => {
        expect(response).toBeTruthy();
      });
      const httpRequest = httpMock.expectOne(testUrl);
      expect(httpRequest.request.headers.get('Locale')).toBe('en_US');
    }));

    it('should adjust header attributes with French', waitForAsync(() => {
      translocoService.getActiveLang = jest.fn(() => 'fr');
      service.getProducts().subscribe((response: any) => {
        expect(response).toBeTruthy();
      });
      const httpRequest = httpMock.expectOne(testUrl);
      expect(httpRequest.request.headers.get('Locale')).toBe('fr_FR');
    }));

    it('should adjust header attributes with Italian fallback to english', waitForAsync(() => {
      translocoService.getActiveLang = jest.fn(() => 'it');
      service.getProducts().subscribe((response: any) => {
        expect(response).toBeTruthy();
      });
      const httpRequest = httpMock.expectOne(testUrl);
      expect(httpRequest.request.headers.get('Locale')).toBe('en_US');
    }));

    it('should adjust header attributes with Spanish', waitForAsync(() => {
      translocoService.getActiveLang = jest.fn(() => 'es');
      service.getProducts().subscribe((response: any) => {
        expect(response).toBeTruthy();
      });
      const httpRequest = httpMock.expectOne(testUrl);
      expect(httpRequest.request.headers.get('Locale')).toBe('es_ES');
    }));

    it('should adjust header attributes with Simplified Chinese', waitForAsync(() => {
      translocoService.getActiveLang = jest.fn(() => 'zh');
      service.getProducts().subscribe((response: any) => {
        expect(response).toBeTruthy();
      });
      const httpRequest = httpMock.expectOne(testUrl);
      expect(httpRequest.request.headers.get('Locale')).toBe('cn_CN');
    }));

    it('should adjust header attributes with Traditional Chinese fallback to english', waitForAsync(() => {
      translocoService.getActiveLang = jest.fn(() => 'zh_TW');
      service.getProducts().subscribe((response: any) => {
        expect(response).toBeTruthy();
      });
      const httpRequest = httpMock.expectOne(testUrl);
      expect(httpRequest.request.headers.get('Locale')).toBe('en_US');
    }));
  });
});
