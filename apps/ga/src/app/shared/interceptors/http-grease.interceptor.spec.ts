import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { HttpGreaseInterceptor } from './http-grease.interceptor';

const environment = {
  baseUrl: 'localhost:8000/api/v1',
};

@Injectable()
class ExampleService {
  private readonly apiUrl = environment.baseUrl;

  constructor(private readonly http: HttpClient) {}

  public getPosts(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/test`);
  }
}

describe(`HttpGreaseInterceptor`, () => {
  let service: ExampleService;
  let spectator: SpectatorService<ExampleService>;
  let httpMock: HttpTestingController;
  let translocoService: TranslocoService;

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
        useClass: HttpGreaseInterceptor,
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
    it(
      'should adjust header attributes with default lang',
      waitForAsync(() => {
        translocoService.getActiveLang = jest.fn(() => 'not a language');
        service.getPosts().subscribe((response: any) => {
          expect(response).toBeTruthy();
        });
        const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);
        expect(httpRequest.request.headers.get('x-bearinx-tenantid')).toBe(
          'c6bd4298-997b-4600-a90a-1adb997581b7'
        );
        expect(httpRequest.request.headers.get('x-bearinx-groupId')).toBe(
          '111ab140-8e82-4ac4-a424-81edf0167301'
        );
        expect(httpRequest.request.headers.get('x-bearinx-language')).toBe(
          'LANGUAGE_ENGLISH'
        );
        expect(httpRequest.request.headers.get('x-bearinx-unitset')).toBe(
          'ID_UNIT_SET_SI'
        );
      })
    );
    it(
      'should adjust header attributes with german',
      waitForAsync(() => {
        translocoService.getActiveLang = jest.fn(() => 'de');
        service.getPosts().subscribe((response: any) => {
          expect(response).toBeTruthy();
        });
        const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);
        expect(httpRequest.request.headers.get('x-bearinx-tenantid')).toBe(
          'c6bd4298-997b-4600-a90a-1adb997581b7'
        );
        expect(httpRequest.request.headers.get('x-bearinx-groupId')).toBe(
          '111ab140-8e82-4ac4-a424-81edf0167301'
        );
        expect(httpRequest.request.headers.get('x-bearinx-language')).toBe(
          'LANGUAGE_GERMAN'
        );
        expect(httpRequest.request.headers.get('x-bearinx-unitset')).toBe(
          'ID_UNIT_SET_SI'
        );
      })
    );
    it(
      'should adjust header attributes with english',
      waitForAsync(() => {
        translocoService.getActiveLang = jest.fn(() => 'en');
        service.getPosts().subscribe((response: any) => {
          expect(response).toBeTruthy();
        });
        const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);
        expect(httpRequest.request.headers.get('x-bearinx-tenantid')).toBe(
          'c6bd4298-997b-4600-a90a-1adb997581b7'
        );
        expect(httpRequest.request.headers.get('x-bearinx-groupId')).toBe(
          '111ab140-8e82-4ac4-a424-81edf0167301'
        );
        expect(httpRequest.request.headers.get('x-bearinx-language')).toBe(
          'LANGUAGE_ENGLISH'
        );
        expect(httpRequest.request.headers.get('x-bearinx-unitset')).toBe(
          'ID_UNIT_SET_SI'
        );
      })
    );
  });
});
