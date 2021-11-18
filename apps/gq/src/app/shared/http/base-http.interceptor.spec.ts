import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Observable, of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BaseHttpInterceptor } from './base-http.interceptor';

const environment = {
  baseUrl: 'localhost:8000/api/v1',
};

Object.defineProperty(window, 'open', {
  value: jest.fn(() => ({ focus: jest.fn() })),
});

@Injectable()
class ExampleService {
  private readonly apiUrl = environment.baseUrl;

  public constructor(private readonly http: HttpClient) {}

  public getPosts(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/test`);
  }
}

class MatSnackBarStub {
  public open(): any {
    return {
      onAction: () => of({}),
    };
  }
}

describe(`BaseHttpInterceptor`, () => {
  let service: ExampleService;
  let spectator: SpectatorService<ExampleService>;
  let httpMock: HttpTestingController;
  let snackBar: MatSnackBar;

  const createService = createServiceFactory({
    service: ExampleService,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      HttpClientTestingModule,
      NoopAnimationsModule,
    ],
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
      { provide: MatSnackBar, useClass: MatSnackBarStub },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
    snackBar = spectator.inject(MatSnackBar);
    console.error = jest.fn();
  });

  test('should be truthy', () => {
    expect(service).toBeTruthy();
  });

  describe('intercept', () => {
    beforeEach(() => {
      jest.spyOn(snackBar, 'open');
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
      'should toast error message in error case',
      waitForAsync(() => {
        service.getPosts().subscribe({
          next: () => {
            expect(true).toEqual(false);
          },
          error: (response) => {
            expect(snackBar.open).toHaveBeenCalledWith(
              'translate it',
              'translate it',
              { duration: 2000 }
            );
            expect(response).toBeTruthy();
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
      })
    );
    test(
      'should show default error message in error case',
      waitForAsync(() => {
        service.getPosts().subscribe({
          next: () => {
            expect(true).toEqual(false);
          },
          error: (_response) => {
            expect(snackBar.open).toHaveBeenCalledWith(
              'translate it',
              'translate it',
              { duration: 2000 }
            );
          },
        });

        const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);

        expect(httpRequest.request.method).toEqual('GET');

        httpRequest.error(undefined as unknown as ErrorEvent);
      })
    );
    test(
      'should toast sap error message in error case',
      waitForAsync(() => {
        service.getPosts().subscribe({
          next: () => {
            expect(true).toEqual(false);
          },
          error: (_response) => {
            expect(snackBar.open).toHaveBeenCalledWith(
              'V102: test sap error message',
              'translate it',
              { duration: 5000 }
            );
          },
        });

        const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);

        expect(httpRequest.request.method).toEqual('GET');

        httpRequest.error({
          status: 403,
          parameters: {
            V102: 'test sap error message',
          },
        } as unknown as ErrorEvent);
      })
    );
  });
});
