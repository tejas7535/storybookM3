import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Observable } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { HttpErrorInterceptor } from './http-error.interceptor';

const environment = {
  baseUrl: 'localhost:8000/api/v1',
};

const CUSTOM_TIMEOUT = 10_000;

@Injectable()
class ExampleService {
  private readonly apiUrl = environment.baseUrl;

  public constructor(private readonly http: HttpClient) {}

  public getPosts(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/test`);
  }
}

describe(`HttpErrorInterceptor`, () => {
  let service: ExampleService;
  let spectator: SpectatorService<ExampleService>;
  let httpMock: HttpTestingController;
  let snackBar: MatSnackBar;

  const createService = createServiceFactory({
    service: ExampleService,
    imports: [
      NoopAnimationsModule,
      MatSnackBarModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      provideHttpClientTesting(),
      ExampleService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpErrorInterceptor,
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
    let dummyOpts: any;

    beforeEach(() => {
      dummyOpts = {
        status: 503,
        statusText: 'Service Unavailable',
      };
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should do nothing when no error occurs', waitForAsync(() => {
      service.getPosts().subscribe({
        next: (response) => {
          expect(response).toBeTruthy();
          expect(response).toEqual('data');
        },
      });
      const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);

      expect(httpRequest.request.method).toEqual('GET');

      httpRequest.flush('data');
    }));

    it(
      'should show error on client error',
      waitForAsync(() => {
        service.getPosts().subscribe({
          next: () => {
            expect(true).toEqual(false);
          },
          error: (response) => {
            expect(response).toBeTruthy();
            expect(response).toEqual(
              new Error('An error occurred. Please try again later.')
            );
          },
        });

        const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);

        expect(httpRequest.request.method).toEqual('GET');

        // ProgressEvents are used to simulate client errors
        httpRequest.error(new ProgressEvent('error'));
      }),
      CUSTOM_TIMEOUT
    );

    it(
      'should show error on server error',
      waitForAsync(() => {
        service.getPosts().subscribe({
          next: () => {
            expect(true).toEqual(false);
          },
          error: (response) => {
            expect(response).toBeTruthy();
            expect(response).toEqual(
              new Error('503 - Service Unavailable: Damn monkey')
            );
          },
        });

        const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);

        expect(httpRequest.request.method).toEqual('GET');

        // ErrorEvents are used to simulate server errors
        httpRequest.flush('Damn monkey', dummyOpts);
      }),
      CUSTOM_TIMEOUT
    );

    it('should show snackbar error message in error case', () => {
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

      httpRequest.flush(
        {
          statusText: 'Service Unavailable',
          message: 'Damn monkey',
        } as HttpErrorResponse,
        dummyOpts
      );
    });

    it('should not show snackbar error message in login case', () => {
      service.getPosts().subscribe({
        next: () => {
          expect(true).toEqual(false);
        },
        error: (_response) => {
          expect(snackBar.open).toHaveBeenCalledTimes(0);
        },
      });

      const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);

      expect(httpRequest.request.method).toEqual('GET');

      httpRequest.flush(
        {
          statusText: 'Service Unavailable',
          message: 'Damn monkey',
          url: 'https://login.microsoftonline',
        } as HttpErrorResponse,
        { status: 400, statusText: 'Bad Request' }
      );
    });
  });
});
