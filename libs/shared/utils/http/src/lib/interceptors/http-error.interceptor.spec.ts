import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Observable } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { SnackBarModule, SnackBarService } from '@schaeffler/snackbar';

import { HttpErrorInterceptor } from './http-error.interceptor';

const environment = {
  baseUrl: 'localhost:8000/api/v1',
};

@Injectable()
export class ExampleService {
  private readonly apiUrl = environment.baseUrl;

  constructor(private readonly http: HttpClient) {}

  public getPosts(): Observable<String> {
    return this.http.get<String>(`${this.apiUrl}/test`);
  }
}

describe(`HttpErrorInterceptor`, () => {
  let service: ExampleService;
  let spectator: SpectatorService<ExampleService>;
  let httpMock: HttpTestingController;
  let snackBarService: SnackBarService;

  const createService = createServiceFactory({
    service: ExampleService,
    imports: [HttpClientTestingModule, NoopAnimationsModule, SnackBarModule],
    providers: [
      ExampleService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpErrorInterceptor,
        multi: true,
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
    snackBarService = spectator.inject(SnackBarService);
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

      snackBarService.showErrorMessage = jest.fn();
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

        httpRequest.error(({
          status: 0,
          message: 'error',
          title: 'Service Unavailable',
          detail: 'Damn monkey',
        } as unknown) as ErrorEvent);
      })
    );

    test('should toast error message in error case', () => {
      service.getPosts().subscribe(
        () => {
          expect(true).toEqual(false);
        },
        (_response) => {
          expect(snackBarService.showErrorMessage).toHaveBeenCalled();
        }
      );

      const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);

      expect(httpRequest.request.method).toEqual('GET');

      httpRequest.error(({
        status: 403,
        error: {
          message: 'error',
          title: 'Service Unavailable',
          detail: 'Damn monkey',
        },
      } as unknown) as ErrorEvent);
    });
  });
});
