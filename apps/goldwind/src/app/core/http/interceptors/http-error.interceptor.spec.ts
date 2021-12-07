import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
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
      HttpClientTestingModule,
      NoopAnimationsModule,
      MatSnackBarModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
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

    test(
      'should do nothing when no error occurs',
      waitForAsync(() => {
        service.getPosts().subscribe((response) => {
          expect(response).toBeTruthy();
          expect(response).toEqual('data');
        });
        const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);
        expect(httpRequest.request.method).toEqual('GET');
        httpRequest.flush('data');
      })
    );

    test(
      'should show error on client error',
      waitForAsync(() => {
        service.getPosts().subscribe(
          () => {
            expect(true).toEqual(false);
          },
          (response) => {
            expect(response).toBeTruthy();
            expect(response).toEqual(
              'An error occurred. Please try again later.'
            );
          }
        );

        const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);

        expect(httpRequest.request.method).toEqual('GET');

        httpRequest.error(error);
      })
    );

    test(
      'should show error on server error',
      waitForAsync(() => {
        service.getPosts().subscribe(
          () => {
            expect(true).toEqual(false);
          },
          (response) => {
            expect(response).toBeTruthy();
            expect(response).toEqual('Service Unavailable - Damn monkey');
          }
        );

        const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);

        expect(httpRequest.request.method).toEqual('GET');

        httpRequest.error({
          status: 0,
          message: 'error',
          title: 'Service Unavailable',
          detail: 'Damn monkey',
        } as unknown as ErrorEvent);
      })
    );

    test('should toast error message in error case', () => {
      service.getPosts().subscribe(
        () => {
          expect(true).toEqual(false);
        },
        (_response) => {
          expect(snackBar.open).toHaveBeenCalled();
        }
      );

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

    test('should not show toast error message in login case', () => {
      service.getPosts().subscribe(
        () => {
          expect(true).toEqual(false);
        },
        (_response) => {
          expect(snackBar.open).toHaveBeenCalledTimes(0);
        }
      );

      const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);

      expect(httpRequest.request.method).toEqual('GET');

      httpRequest.error({
        status: 400,
        error: {
          url: 'https://login.microsoftonline',
          message: 'error',
          title: 'Service Unavailable',
          detail: 'Damn monkey',
        },
      } as unknown as ErrorEvent);
    });
  });
});
