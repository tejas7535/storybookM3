import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';

import { of } from 'rxjs';

import { environment } from '@hc/environments/environment';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

const RELATIVE_URL = '/testing.json';

const UNPROTECTED_URL = 'https://schaeffler.com';

const PROTECTED_URL = `${environment.baseUrl}/test/protected`;

@Injectable()
class TestService {
  readonly baseurl = environment.baseUrl;

  constructor(private readonly httpClient: HttpClient) {}

  public getProtectedUrl() {
    return this.httpClient.get(PROTECTED_URL);
  }

  public getUnprotectedUrl() {
    return this.httpClient.get(UNPROTECTED_URL);
  }

  public getRelativeUrl() {
    return this.httpClient.get(RELATIVE_URL);
  }
}

const AUTH_SERVICE_MOCK = {
  getAccessToken: jest.fn(() => of('valid access token')),
  isLoggedin: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
};

describe('AuthInterceptor', () => {
  let service: TestService;
  let spectator: SpectatorService<TestService>;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  const createService = createServiceFactory({
    service: TestService,
    imports: [HttpClientTestingModule],
    providers: [
      TestService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
      },
      {
        provide: AuthService,
        useValue: AUTH_SERVICE_MOCK,
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
    authService = spectator.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be truthy', () => {
    expect(service).toBeTruthy();
  });

  describe('should not intercept', () => {
    it('when it is not a protected resource', () => {
      service.getUnprotectedUrl().subscribe((res) => expect(res).toBeTruthy());

      const request = httpMock.expectOne(UNPROTECTED_URL);
      expect(request.request.headers.get('Authorization')).toBeNull();
      expect(authService.getAccessToken).not.toHaveBeenCalled();
    });

    it('when it is a relative URL', () => {
      service.getRelativeUrl().subscribe((res) => expect(res).toBeTruthy());

      const request = httpMock.expectOne(RELATIVE_URL);
      expect(request.request.headers.get('Authorization')).toBeNull();
      expect(authService.getAccessToken).not.toHaveBeenCalled();
    });

    it('when it does not have a token', () => {
      authService.isLoggedin = jest.fn(() => of(true));
      authService.getAccessToken = jest.fn(() => of(undefined));
      service.getProtectedUrl().subscribe((res) => expect(res).toBeTruthy());

      const request = httpMock.expectOne(PROTECTED_URL);
      expect(request.request.headers.get('Authorization')).toBeNull();
      expect(authService.getAccessToken).toHaveBeenCalled();
    });
  });

  it('should intercept when a token is present', () => {
    authService.isLoggedin = jest.fn(() => of(true));
    authService.getAccessToken = jest.fn(() => of('valid access token'));
    service.getProtectedUrl().subscribe((res) => {
      expect(res).toBeTruthy();
    });
    const request = httpMock.expectOne(PROTECTED_URL);
    expect(request.request.headers.get('Authorization')).toBe(
      'Bearer valid access token'
    );
    expect(authService.getAccessToken).toHaveBeenCalled();
  });
});
