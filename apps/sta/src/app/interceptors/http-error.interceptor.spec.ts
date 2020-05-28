import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Observable } from 'rxjs';

import * as transloco from '@ngneat/transloco';
import { configureTestSuite } from 'ng-bullet';

import { SnackBarModule, SnackBarService } from '@schaeffler/snackbar';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import * as en from '../../assets/i18n/en.json';
import { environment } from '../../environments/environment';
import { HttpErrorInterceptor } from './http-error.interceptor';

@Injectable()
export class ExampleService {
  private readonly apiUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  public getPosts(): Observable<String> {
    return this.http.get<String>(`${this.apiUrl}/test`);
  }
}

describe(`HttpErrorInterceptor`, () => {
  let service: ExampleService;
  let httpMock: HttpTestingController;
  let snackBarService: SnackBarService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        provideTranslocoTestingModule({ en }),
        HttpClientTestingModule,
        NoopAnimationsModule,
        SnackBarModule,
      ],
      providers: [
        ExampleService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptor,
          multi: true,
        },
      ],
    });
  });

  beforeEach(() => {
    Object.defineProperty(transloco, 'translate', {
      value: jest.fn().mockImplementation(() => 'test'),
    });
    service = TestBed.inject(ExampleService);
    httpMock = TestBed.inject(HttpTestingController);
    snackBarService = TestBed.inject(SnackBarService);
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
        },
        message: 'A monkey is throwing bananas at me!',
        lineno: 402,
        filename: 'closet.html',
      });

      jest.spyOn(console, 'log');
      snackBarService.showErrorMessage = jest.fn();
    });

    afterEach(() => {
      httpMock.verify();
    });

    test('should do nothing when no error occurs', async(() => {
      service.getPosts().subscribe((response) => {
        expect(response).toBeTruthy();
        expect(response).toEqual('data');
      });
      const httpRequest = httpMock.expectOne(`${environment.apiBaseUrl}/test`);
      expect(httpRequest.request.method).toEqual('GET');
      httpRequest.flush('data');
    }));

    test('should show error on client error', async(() => {
      service.getPosts().subscribe(
        () => {
          expect(true).toEqual(false);
        },
        (response) => {
          expect(response).toBeTruthy();
          expect(transloco.translate).toHaveBeenCalledWith(
            '0',
            {},
            'errorMessages'
          );
          expect(response).toEqual('test');
        }
      );

      const httpRequest = httpMock.expectOne(`${environment.apiBaseUrl}/test`);

      expect(httpRequest.request.method).toEqual('GET');

      httpRequest.error(error);
    }));

    test('should show error on server error', async(() => {
      service.getPosts().subscribe(
        () => {
          expect(true).toEqual(false);
        },
        (response) => {
          expect(response).toBeTruthy();
          expect(transloco.translate).toHaveBeenCalledWith(
            '10',
            {},
            'errorMessages'
          );
          expect(response).toEqual('test');
        }
      );

      const httpRequest = httpMock.expectOne(`${environment.apiBaseUrl}/test`);

      expect(httpRequest.request.method).toEqual('GET');

      httpRequest.error(({
        status: 0,
        errorId: 10,
      } as unknown) as ErrorEvent);
    }));

    test('should toast error message in error case', () => {
      service.getPosts().subscribe(
        () => {
          expect(true).toEqual(false);
        },
        (_response) => {
          expect(snackBarService.showErrorMessage).toHaveBeenCalled();
        }
      );

      const httpRequest = httpMock.expectOne(`${environment.apiBaseUrl}/test`);

      expect(httpRequest.request.method).toEqual('GET');

      httpRequest.error(({
        status: 403,
        errorId: 99,
      } as unknown) as ErrorEvent);
    });

    test('should not show toast on error when errorId part of NO_TOASTS', () => {
      service.getPosts().subscribe(
        () => {
          expect(true).toEqual(false);
        },
        (_response) => {
          expect(snackBarService.showErrorMessage).not.toHaveBeenCalled();
        }
      );

      const httpRequest = httpMock.expectOne(`${environment.apiBaseUrl}/test`);

      expect(httpRequest.request.method).toEqual('GET');

      httpRequest.error(({
        status: 403,
        errorId: 19,
      } as unknown) as ErrorEvent);
    });
  });
});
