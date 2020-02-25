import { NEVER, of } from 'rxjs';

import { async, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { OAuthService } from 'angular-oauth2-oidc';

import { configureTestSuite } from 'ng-bullet';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let initConfigSpy: jest.SpyInstance;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
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
    initConfigSpy = jest.spyOn<AuthService, any>(
      AuthService.prototype,
      'initConfig'
    );
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initAuth', () => {
    let done: boolean;

    beforeEach(() => {
      service['isDoneLoadingSubject$'].next(false);

      service.isDoneLoading$.subscribe(d => (done = d));

      service['silentRefresh'] = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

      service['navigateToState'] = jest.fn();
      service['oauthService'].tryLogin = jest.fn();
    });

    test('should resolve when login succeeds', async () => {
      service[
        'oauthService'
      ].hasValidAccessToken = jest.fn().mockImplementation(() => true);

      await service.initAuth();

      expect(done).toBeTruthy();
      expect(service['silentRefresh']).not.toHaveBeenCalled();
      expect(service['oauthService'].tryLogin).toHaveBeenCalledTimes(1);
      expect(service['oauthService'].hasValidAccessToken).toHaveBeenCalledTimes(
        1
      );
      expect(service['navigateToState']).toHaveBeenCalled();
    });

    test('should silent refresh when token invalid', async () => {
      service[
        'oauthService'
      ].hasValidAccessToken = jest.fn().mockImplementation(() => false);

      await service.initAuth();

      expect(done).toBeTruthy();
      expect(service['silentRefresh']).toHaveBeenCalled();
      expect(service['oauthService'].tryLogin).toHaveBeenCalledTimes(1);
      expect(service['oauthService'].hasValidAccessToken).toHaveBeenCalledTimes(
        1
      );
      expect(service['navigateToState']).toHaveBeenCalled();
    });

    test('should set isDoneLoadingSubject also on errors', async () => {
      service[
        'oauthService'
      ].loadDiscoveryDocument = jest
        .fn()
        .mockImplementation(() => Promise.reject());
      service['oauthService'].hasValidAccessToken = jest.fn();

      await service.initAuth();

      expect(done).toBeTruthy();
      expect(service['silentRefresh']).not.toHaveBeenCalled();
      expect(service['oauthService'].tryLogin).not.toHaveBeenCalled();
      expect(
        service['oauthService'].hasValidAccessToken
      ).not.toHaveBeenCalled();
      expect(service['navigateToState']).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    test('should call initImplicitFlow with provided targetUrl', () => {
      const target = 'hallejulia';

      service.login(target);

      expect(service['oauthService'].initImplicitFlow).toHaveBeenCalledWith(
        encodeURIComponent(target)
      );
    });

    test('should call initImplicitFlow with curent router url if no target provided', () => {
      service.login();

      expect(service['oauthService'].initImplicitFlow).toHaveBeenCalledWith(
        encodeURIComponent('test')
      );
    });
  });

  describe('accessToken', () => {
    test('should use authService to return access token', () => {
      service['oauthService'].getAccessToken = jest
        .fn()
        .mockImplementation(() => 'token');

      const res = service.accessToken;

      expect(res).toEqual('token');
      expect(service['oauthService'].getAccessToken).toHaveBeenCalled();
    });
  });

  describe('initConfig', () => {
    let authenticated: boolean;

    beforeEach(() => {
      initConfigSpy.mockRestore();
      service['oauthService'].setupAutomaticSilentRefresh = jest.fn();
      service[
        'oauthService'
      ].hasValidAccessToken = jest.fn().mockImplementation(() => false);
      service.isAuthenticated$.subscribe(a => (authenticated = a));
    });

    test('should set setupAutomaticSilentRefresh', () => {
      service['initConfig']();

      expect(
        service['oauthService'].setupAutomaticSilentRefresh
      ).toHaveBeenCalledTimes(1);
    });

    test('should navigate to state on token_received', async(() => {
      service['router'].navigateByUrl = jest.fn();
      service['initConfig']();

      expect(service['router'].navigateByUrl).toHaveBeenLastCalledWith(
        'state/link'
      );
    }));

    test('should do nothing when storage events on certain keys', async(() => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();
      service['oauthService'].events = NEVER;
      service['initConfig']();

      window.dispatchEvent(
        new StorageEvent('storage', { key: 'test_key', newValue: 'test_value' })
      );

      expect(spy).not.toHaveBeenCalled();
    }));

    test('should set isAuthenticatedSubject on access_token event', async(() => {
      service[
        'oauthService'
      ].hasValidAccessToken = jest.fn().mockImplementation(() => true);
      service['oauthService'].events = NEVER;
      service['login'] = jest.fn();

      expect(authenticated).toBeFalsy();

      service['initConfig']();

      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'access_token',
          newValue: 'test_value'
        })
      );

      expect(authenticated).toBeTruthy();
      expect(service['login']).not.toHaveBeenCalled();
    }));

    test('should call login if token not valid and access_token event received', async(() => {
      service[
        'oauthService'
      ].hasValidAccessToken = jest.fn().mockImplementation(() => false);
      service['oauthService'].events = NEVER;
      service['login'] = jest.fn();

      service['initConfig']();

      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'access_token',
          newValue: 'test_value'
        })
      );

      expect(authenticated).toBeFalsy();
      expect(service['login']).toHaveBeenCalled();
    }));
  });

  describe('navigateToState', () => {
    beforeEach(() => {
      service['router'].navigateByUrl = jest.fn();
    });

    test('should navigateByUrl with state val', () => {
      service['navigateToState']();
      expect(service['router'].navigateByUrl).toHaveBeenCalledWith(
        'state/link'
      );
    });

    test('should do nothing when state not set', () => {
      service['oauthService'].state = undefined;

      service['navigateToState']();

      expect(service['router'].navigateByUrl).not.toHaveBeenCalled();
    });
  });

  describe('silentRefresh', () => {
    beforeEach(() => {
      service['oauthService'].silentRefresh = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
    });

    test('should resolve after refresh', async () => {
      expect.assertions(0);

      return service['silentRefresh']();
    });

    test('should call login on certain reject reasons and resolve', async () => {
      service['oauthService'].silentRefresh = jest
        .fn()
        .mockImplementation(() =>
          Promise.reject({ reason: { error: 'login_required' } })
        );

      service['login'] = jest.fn();

      expect.assertions(1);

      return service['silentRefresh']().then(_ => {
        expect(service['login']).toHaveBeenCalledTimes(1);
      });
    });

    test('should reject if wrong result', async () => {
      service['oauthService'].silentRefresh = jest
        .fn()
        .mockImplementation(() =>
          Promise.reject({ reason: { error: 'rejectme' } })
        );

      service['login'] = jest.fn();

      return service['silentRefresh']().catch(_ => {
        expect(service['login']).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('getDecodedAccessToken', () => {
    test('should return decoded token when valid token provided', () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      const result = AuthService['getDecodedAccessToken'](token);

      expect(result).toBeDefined();
    });

    test('should return undefined when token is invalid', () => {
      const result = AuthService['getDecodedAccessToken']('123');

      expect(result).toBeUndefined();
    });
  });

  describe('getUserName', () => {
    test('should return undefined when not authenticated', done => {
      service['isAuthenticatedSubject$'].next(false);

      service.getUserName().subscribe(username => {
        expect(username).toBeUndefined();
        done();
      });
    });

    test('should return undefined when decoding access token fails', done => {
      service['isAuthenticatedSubject$'].next(true);

      AuthService['getDecodedAccessToken'] = jest
        .fn()
        .mockImplementation(() => undefined);

      service.getUserName().subscribe(username => {
        expect(username).toBeUndefined();
        expect(AuthService['getDecodedAccessToken']).toHaveBeenCalled();
        done();
      });
    });

    test('should return username', done => {
      service['isAuthenticatedSubject$'].next(true);

      AuthService['getDecodedAccessToken'] = jest
        .fn()
        .mockImplementation(() => ({
          given_name: 'given name',
          family_name: 'family name'
        }));

      service.getUserName().subscribe(username => {
        expect(username).toBeDefined();
        expect(AuthService['getDecodedAccessToken']).toHaveBeenCalled();
        done();
      });
    });
  });
});
