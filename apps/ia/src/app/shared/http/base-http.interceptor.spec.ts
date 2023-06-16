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
import { waitForAsync } from '@angular/core/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import {
  MatLegacySnackBar as MatSnackBar,
  MatLegacySnackBarModule as MatSnackBarModule,
} from '@angular/material/legacy-snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Observable } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { BaseHttpInterceptor } from './base-http.interceptor';

const environment = {
  baseUrl: 'localhost:8000/api/v1',
};

jest.mock('../utils/utilities', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
  ...jest.requireActual<any>('../utils/utilities'),
  convertTimeRangeToUTC: jest.fn((val) => `${val}000`),
}));

@Injectable()
class ExampleService {
  private readonly apiUrl = environment.baseUrl;

  public constructor(private readonly http: HttpClient) {}

  public getPosts(path?: string, params?: HttpParams): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${path ?? 'test'}`, {
      params,
    });
  }
}

describe(`BaseHttpInterceptor`, () => {
  let service: ExampleService;
  let spectator: SpectatorService<ExampleService>;
  let httpMock: HttpTestingController;
  let snackBar: MatSnackBar;

  const createService = createServiceFactory({
    service: ExampleService,
    imports: [HttpClientTestingModule, NoopAnimationsModule, MatSnackBarModule],
    providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: BaseHttpInterceptor,
        multi: true,
      },
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
    snackBar = spectator.inject(MatSnackBar);
    console.error = jest.fn();
  });

  it('should be truthy', () => {
    expect(service).toBeTruthy();
  });

  describe('intercept', () => {
    let error: ErrorEvent;

    beforeEach(() => {
      error = new ErrorEvent('error', {
        error: {
          message: 'error',
          title: 'Service Unavailable',
          detail: 'Damn monkey',
        },
        message: 'A monkey is throwing bananas at me!',
        lineno: 402,
        filename: 'closet.html',
      });
    });

    afterEach(() => {
      httpMock.verify();
    });

    test('should do nothing when no error occurs', waitForAsync(() => {
      service.getPosts().subscribe((response) => {
        expect(response).toBeTruthy();
        expect(response).toEqual('data');
      });
      const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);
      expect(httpRequest.request.method).toEqual('GET');
      httpRequest.flush('data');
    }));

    test('should show error on client error', waitForAsync(() => {
      service.getPosts().subscribe({
        next: () => {
          expect(true).toEqual(false);
        },
        error: (response) => {
          expect(response).toBeTruthy();
          expect(response.message).toEqual(
            'An error occurred. Please try again later.'
          );
        },
      });

      const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);

      expect(httpRequest.request.method).toEqual('GET');

      httpRequest.error(error);
    }));

    test('should show error on server error', waitForAsync(() => {
      service.getPosts().subscribe({
        next: () => {
          expect(true).toEqual(false);
        },
        error: (response) => {
          expect(response).toBeTruthy();
          expect(response.message).toEqual('Service Unavailable - Damn monkey');
        },
      });

      const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);

      expect(httpRequest.request.method).toEqual('GET');

      httpRequest.error({
        status: 0,
        message: 'error',
        title: 'Service Unavailable',
        detail: 'Damn monkey',
      } as unknown as ErrorEvent);
    }));

    test('should toast error message in error case', () => {
      service.getPosts().subscribe({
        next: () => {
          expect(true).toEqual(false);
        },
        error: (_response) => {
          expect(snackBar.open).toHaveBeenCalled();
        },
      });

      const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);

      expect(httpRequest.request.method).toEqual('GET');

      httpRequest.error({
        status: 403,
        error: {
          message: 'error',
          title: 'Service Unavailable',
          detail: 'Damn monkey',
        },
      } as unknown as ErrorEvent);
    });

    test('should do nothing when error is part of IGNORE_HTTP_CALLS', () => {
      service.getPosts('user-settings').subscribe({
        next: () => {
          expect(true).toEqual(false);
        },
        error: (_response) => {
          expect(snackBar.open).not.toHaveBeenCalled();
        },
      });

      const httpRequest = httpMock.expectOne(
        `${environment.baseUrl}/user-settings`
      );

      expect(httpRequest.request.method).toEqual('GET');

      httpRequest.error({
        status: 404,
        error: {
          message: 'error',
          title: 'Service Unavailable',
          detail: 'Damn monkey',
        },
      } as unknown as ErrorEvent);
    });

    test('should convert to utc timestamps', () => {
      const params = new HttpParams().set('time_range', '123|456');
      service.getPosts('test', params).subscribe((response) => {
        expect(response).toBeTruthy();
        expect(response).toEqual('data');
      });
      const httpRequest = httpMock.expectOne(
        `${environment.baseUrl}/test?time_range=123%7C456000`
      );
      expect(httpRequest.request.method).toEqual('GET');
      httpRequest.flush('data');
    });
  });
});
