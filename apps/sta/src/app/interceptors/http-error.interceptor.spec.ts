import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';
import { Observable } from 'rxjs';

import {
  SnackBarModule,
  SnackBarService
} from '@schaeffler/shared/ui-components';

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
  let interceptor: HttpErrorInterceptor;
  let snackBarService: SnackBarService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NoopAnimationsModule, SnackBarModule],
      providers: [
        ExampleService,
        HttpErrorInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptor,
          multi: true
        }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(ExampleService);
    httpMock = TestBed.get(HttpTestingController);
    interceptor = TestBed.get(HttpErrorInterceptor);
    snackBarService = TestBed.get(SnackBarService);
  });

  it('should be truthy', () => {
    expect(service).toBeTruthy();
  });

  describe('intercept', () => {
    let error: ErrorEvent;

    beforeEach(() => {
      error = new ErrorEvent('error', {
        error: new Error('AAAHHHH'),
        message: 'A monkey is throwing bananas at me!',
        lineno: 402,
        filename: 'closet.html'
      });

      jest.spyOn(console, 'log');
      snackBarService.showErrorMessage = jest.fn();
    });

    afterEach(() => {
      httpMock.verify();
    });

    test('should do nothing when no error occurs', async(() => {
      service.getPosts().subscribe(response => {
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
        response => {
          expect(response).toBeTruthy();
          expect(response).toEqual(error.message);
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
        response => {
          expect(response).toBeTruthy();
          expect(response).toEqual(
            '0: Http failure response for https://dev.sta.dp.schaeffler/api/v1/test: 0 '
          );
        }
      );

      const httpRequest = httpMock.expectOne(`${environment.apiBaseUrl}/test`);

      expect(httpRequest.request.method).toEqual('GET');

      httpRequest.error(({ error: 'wow' } as unknown) as ErrorEvent);
    }));

    test('should toast error message in error case', () => {
      service.getPosts().subscribe(
        () => {
          expect(true).toEqual(false);
        },
        response => {
          expect(snackBarService.showErrorMessage).toHaveBeenCalled();
        }
      );

      const httpRequest = httpMock.expectOne(`${environment.apiBaseUrl}/test`);

      expect(httpRequest.request.method).toEqual('GET');

      httpRequest.error(({ error: 'wow' } as unknown) as ErrorEvent);
    });
  });
});
