import { Observable, of } from 'rxjs';

import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

import { OAuthService } from 'angular-oauth2-oidc';
import { configureTestSuite } from 'ng-bullet';

import { AuthService } from '../core/auth.service';

import { TokenInterceptor } from './token.interceptor';

import { environment } from '../../environments/environment';

@Injectable()
export class ExampleService {
  private readonly apiUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  public getPosts(): Observable<String> {
    return this.http.get<String>(`${this.apiUrl}/test`);
  }
}

describe(`TokenInterceptor`, () => {
  let service: ExampleService;
  let httpMock: HttpTestingController;
  let mockOAuth2: OAuthService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        ExampleService,
        AuthService,
        TokenInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true
        },
        {
          provide: OAuthService,
          useValue: {
            tryLogin: jest.fn(),
            hasValidAccessToken: jest.fn().mockImplementation(() => true),
            events: of({ type: 'token_received' }),
            setupAutomaticSilentRefresh: jest.fn(),
            loadDiscoveryDocument: jest
              .fn()
              .mockImplementation(() => Promise.resolve()),
            initImplicitFlow: jest.fn(),
            state: 'state/link'
          }
        },
        {
          provide: Router,
          useValue: {
            navigateByUrl: jest.fn(),
            url: 'test'
          }
        }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ExampleService);
    httpMock = TestBed.inject(HttpTestingController);
    mockOAuth2 = TestBed.inject(OAuthService);
  });

  it('should be truthy', () => {
    expect(service).toBeTruthy();
  });

  describe('intercept', () => {
    beforeEach(() => {
      mockOAuth2.getAccessToken = jest.fn().mockImplementation(() => 'token');
    });

    afterEach(() => {
      httpMock.verify();
    });

    test('should add bearer token when possible', () => {
      service.getPosts().subscribe(response => {
        expect(response).toBeTruthy();
        expect(response).toEqual('data');
      });
      const httpRequest = httpMock.expectOne(`${environment.apiBaseUrl}/test`);
      expect(httpRequest.request.method).toEqual('GET');
      expect(httpRequest.request.headers.get('Authorization')).toEqual(
        'Bearer token'
      );
      httpRequest.flush('data');
    });

    test('should not add bearer token if not avl', () => {
      mockOAuth2.getAccessToken = jest.fn().mockImplementation(() => undefined);

      service.getPosts().subscribe(response => {
        expect(response).toBeTruthy();
        expect(response).toEqual('data');
      });
      const httpRequest = httpMock.expectOne(`${environment.apiBaseUrl}/test`);
      expect(httpRequest.request.method).toEqual('GET');
      expect(httpRequest.request.headers.get('Authorization')).toBeNull();
      httpRequest.flush('data');
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
  });
});
