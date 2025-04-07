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
import { waitForAsync } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { environment } from '@mm/environments/environment';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { HttpLocaleInterceptor } from './http-locale.interceptor';

@Injectable()
class ExampleService {
  private readonly apiUrl = environment.baseUrl;

  constructor(private readonly http: HttpClient) {}

  public getPosts(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/test`);
  }

  public getMessage(): Observable<string> {
    return this.http.get<string>('someOtherUrl/message');
  }
}

describe(`HttpLocaleInterceptor`, () => {
  let service: ExampleService;
  let spectator: SpectatorService<ExampleService>;
  let httpMock: HttpTestingController;
  let translocoService: TranslocoService;

  const createService = createServiceFactory({
    service: ExampleService,
    imports: [provideTranslocoTestingModule({ en: {}, de: {} })],
    providers: [
      ExampleService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpLocaleInterceptor,
        multi: true,
      },
      provideHttpClient(withInterceptorsFromDi()),
      provideHttpClientTesting(),
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
    it('should not adjust header attributes for non based URLs', waitForAsync(() => {
      service.getMessage().subscribe((response: any) => {
        expect(response).toBeTruthy();
      });

      const httpRequest = httpMock.expectOne('someOtherUrl/message');
      expect(httpRequest.request.headers.get('Locale')).toBeNull();
    }));

    it('should change locale header attribute', waitForAsync(() => {
      service.getPosts().subscribe((response: any) => {
        expect(response).toBeTruthy();
      });
      const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);

      expect(httpRequest.request.headers.get('x-bearinx-unitset')).toBe(
        'ID_UNIT_SET_SI'
      );
      expect(httpRequest.request.headers.get('x-bearinx-language')).toBe(
        'LANGUAGE_ENGLISH'
      );
    }));

    describe('when language is not supported by bearinx API', () => {
      beforeEach(() => {
        translocoService.getActiveLang = jest.fn(() => 'pl');
      });

      it('should have LANGUAGE_ENGLISH as default language', waitForAsync(() => {
        service.getPosts().subscribe((response: any) => {
          expect(response).toBeTruthy();
        });
        const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);

        expect(httpRequest.request.headers.get('x-bearinx-language')).toBe(
          'LANGUAGE_ENGLISH'
        );
      }));
    });
  });
});
