import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpContext,
  HttpStatusCode,
} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { translate } from '@ngneat/transloco';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ApiVersion } from '../models';
import { QuotationPaths } from '../services/rest-services/quotation-service/models/quotation-paths.enum';
import {
  BYPASS_DEFAULT_ERROR_HANDLING,
  HttpErrorInterceptor,
} from './http-error.interceptor';

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

  public getCustomers(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/testcustomer`, {
      context: new HttpContext().set(BYPASS_DEFAULT_ERROR_HANDLING, true),
    });
  }

  public getQuotation(): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}/${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/`
    );
  }
}

class MatSnackBarStub {
  public open(): any {
    return {
      onAction: () => of({}),
    };
  }
}

describe(`HttpHeaderInterceptor`, () => {
  let service: ExampleService;
  let spectator: SpectatorService<ExampleService>;
  let httpMock: HttpTestingController;
  let snackBar: MatSnackBar;
  let router: Router;

  const createService = createServiceFactory({
    service: ExampleService,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      HttpClientTestingModule,
      NoopAnimationsModule,
      RouterTestingModule,
    ],
    providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpErrorInterceptor,
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
    router = spectator.inject(Router);
  });

  test('should be truthy', () => {
    expect(service).toBeTruthy();
  });

  describe('intercept', () => {
    beforeEach(() => {
      jest.spyOn(snackBar, 'open');
      router.navigate = jest.fn();
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
      expect(router.navigate).toHaveBeenCalledTimes(0);

      httpRequest.flush('data');
    }));
    test('should toast error message in error case', waitForAsync(() => {
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
      expect(router.navigate).toHaveBeenCalledTimes(0);

      expect(httpRequest.request.method).toEqual('GET');

      httpRequest.error(
        {
          error: {
            message: 'error',
            title: 'Service Unavailable',
            detail: 'Damn monkey',
          },
        } as unknown as ErrorEvent,
        { status: 400 }
      );
    }));
    test('should show default error message in error case', waitForAsync(() => {
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
      expect(router.navigate).toHaveBeenCalledTimes(0);

      httpRequest.error(undefined as unknown as ErrorEvent);
    }));

    test('should toast sap error message in error case', waitForAsync(() => {
      service.getPosts().subscribe({
        next: () => {
          expect(true).toEqual(false);
        },
        error: (_response) => {
          expect(snackBar.open).toHaveBeenCalledTimes(1);
          expect(snackBar.open).toHaveBeenCalledWith(
            'V102: test sap error message',
            'translate it',
            { duration: 5000 }
          );
        },
      });

      const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);

      expect(httpRequest.request.method).toEqual('GET');
      expect(router.navigate).toHaveBeenCalledTimes(0);

      httpRequest.error(
        {
          parameters: {
            V102: 'test sap error message',
          },
        } as unknown as ErrorEvent,
        { status: 400 }
      );
    }));

    test('should show errorInterceptorForbidden on 403 status code', waitForAsync(() => {
      service.getPosts().subscribe({
        next: () => {
          expect(true).toEqual(false);
        },
        error: (_response) => {
          expect(snackBar.open).toHaveBeenCalledTimes(1);
          expect(snackBar.open).toHaveBeenCalledWith(
            'translate it',
            'translate it',
            { duration: 5000 }
          );
          expect(translate).toHaveBeenCalledWith('errorInterceptorForbidden');
          expect(router.navigate).toHaveBeenCalledTimes(0);
        },
      });

      const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);

      expect(httpRequest.request.method).toEqual('GET');

      httpRequest.error(
        {
          error: {
            message: 'error',
            title: 'Service Unavailable',
            detail: 'Damn monkey',
          },
        } as unknown as ErrorEvent,
        { status: HttpStatusCode.Forbidden }
      );
    }));
    test('should show errorInterceptorForbidden and navigate on 403 status code and quotation request', waitForAsync(() => {
      service.getQuotation().subscribe({
        next: () => {
          expect(true).toEqual(false);
        },
        error: (_response) => {
          expect(snackBar.open).toHaveBeenCalledTimes(1);
          expect(snackBar.open).toHaveBeenCalledWith(
            'translate it',
            'translate it',
            { duration: 5000 }
          );
          expect(translate).toHaveBeenCalledWith('errorInterceptorForbidden');
          expect(router.navigate).toHaveBeenCalledTimes(1);
        },
      });

      const httpRequest = httpMock.expectOne(
        `${environment.baseUrl}/${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/`
      );

      expect(httpRequest.request.method).toEqual('GET');

      httpRequest.error(
        {
          error: {
            message: 'error',
            title: 'Service Unavailable',
            detail: 'Damn monkey',
          },
        } as unknown as ErrorEvent,
        { status: HttpStatusCode.Forbidden }
      );
    }));
    test('should show no error on auth error', () => {
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

    test('should not intercept calls with BYPASS_DEFAULT_ERROR_HANDLING', () => {
      service.getCustomers().subscribe({
        next: () => {
          expect(true).toEqual(false);
        },
        error: (_response) => {
          expect(snackBar.open).not.toHaveBeenCalled();
        },
      });

      const httpRequest = httpMock.expectOne(
        `${environment.baseUrl}/testcustomer`
      );

      expect(httpRequest.request.method).toEqual('GET');

      httpRequest.error(undefined as unknown as ErrorEvent);
    });
  });
});
