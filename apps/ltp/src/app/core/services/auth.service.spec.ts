import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Route, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { NEVER, of } from 'rxjs';

import { OAuthService } from 'angular-oauth2-oidc';
import { configureTestSuite } from 'ng-bullet';

import { AuthService } from '../services';
import { initializer } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let oAuthService: OAuthService;
  let initConfigSpy: jest.SpyInstance<any, unknown[]>;

  const routes: Route[] = [
    {
      path: '**',
      loadChildren: () =>
        import('@schaeffler/empty-states').then((m) => m.PageNotFoundModule),
    },
  ];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      providers: [
        AuthService,
        {
          provide: OAuthService,
          useValue: {
            tryLogin: jest.fn().mockImplementation(() => true),
            logOut: jest.fn(),
            hasValidAccessToken: jest.fn().mockImplementation(() => true),
            events: of({ type: 'token_received' }),
            setupAutomaticSilentRefresh: jest.fn(),
            loadDiscoveryDocument: jest
              .fn()
              .mockImplementation(() => Promise.resolve()),
            initImplicitFlow: jest.fn(),
            state: 'state/link',
            loadDiscoveryDocumentAndTryLogin: jest
              .fn()
              .mockImplementation(() => Promise.resolve(true)),
            silentRefresh: jest
              .fn()
              .mockImplementation(() => Promise.resolve(true)),
          },
        },
        Injector,
      ],
    });
  });

  beforeEach(() => {
    initConfigSpy = jest.spyOn<AuthService, any>(
      AuthService.prototype,
      'initConfig'
    );
    service = TestBed.inject(AuthService);
    oAuthService = TestBed.inject(OAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    test('should call silentRefresh and navigateToState', async () => {
      service.silentRefresh = jest
        .fn()
        .mockImplementation(() => Promise.resolve(undefined));
      service['navigateToState'] = jest.fn();
      const target = 'target';

      await service.login(target);

      expect(oAuthService.hasValidAccessToken).toHaveBeenCalled();
      expect(service.silentRefresh).toHaveBeenCalledTimes(1);
      expect(service['navigateToState']).toHaveBeenCalledTimes(1);
    });

    test('should set authenticated to true when access token valid', async () => {
      oAuthService.hasValidAccessToken = jest
        .fn()
        .mockImplementation(() => true);
      service.silentRefresh = jest.fn(() => Promise.resolve(undefined));
      service['navigateToState'] = jest.fn();
      const target = 'target';

      await service.login(target);

      expect(service.silentRefresh).toHaveBeenCalledTimes(1);
      expect(service['navigateToState']).toHaveBeenCalledTimes(1);
      service.isAuthenticated$.subscribe((val) => {
        expect(val).toBeTruthy();
      });
    });
  });

  describe('hasValidAccessToken', () => {
    test('should call hasValidAccessToken of oauthService', () => {
      // the provided/mocked oAuthService returns true by default

      const hasValidAccessToken = service.hasValidAccessToken();

      expect(hasValidAccessToken).toBeTruthy();
    });
  });

  describe('accessToken', () => {
    test('should use authService to return access token', () => {
      oAuthService.getAccessToken = jest.fn().mockImplementation(() => 'token');

      const res = service.accessToken;

      expect(res).toEqual('token');
      expect(oAuthService.getAccessToken).toHaveBeenCalled();
    });
  });

  describe('initConfig', () => {
    let authenticated: boolean;

    beforeEach(() => {
      initConfigSpy.mockRestore();
      oAuthService.hasValidAccessToken = jest
        .fn()
        .mockImplementation(() => false);
      service.isAuthenticated$.subscribe((a) => (authenticated = a));
    });

    test('should navigate to state on token_received', () => {
      service['injector'].get<Router>(Router).navigateByUrl = jest.fn();
      service['initConfig']();

      expect(
        service['injector'].get<Router>(Router).navigateByUrl
      ).toHaveBeenLastCalledWith('state/link');
    });

    test('should do nothing when storage events on certain keys', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();
      oAuthService.events = NEVER;
      service['initConfig']();

      window.dispatchEvent(
        new StorageEvent('storage', { key: 'test_key', newValue: 'test_value' })
      );

      expect(spy).not.toHaveBeenCalled();
    });

    test('should set isAuthenticatedSubject on access_token event', () => {
      service[
        'oauthService'
      ].hasValidAccessToken = jest.fn().mockImplementation(() => true);
      oAuthService.events = NEVER;
      service['login'] = jest.fn();

      expect(authenticated).toBeFalsy();

      service['initConfig']();

      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'access_token',
          newValue: 'test_value',
        })
      );

      expect(authenticated).toBeTruthy();
      expect(service['login']).not.toHaveBeenCalled();
    });

    test('should call login if token not valid and access_token event received', () => {
      oAuthService.hasValidAccessToken = jest
        .fn()
        .mockImplementation(() => false);
      oAuthService.events = NEVER;
      service.login = jest.fn();

      service['initConfig']();

      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'access_token',
          newValue: 'test_value',
        })
      );

      expect(authenticated).toBeFalsy();
      expect(service['login']).toHaveBeenCalled();
    });
  });

  describe('navigateToState', () => {
    beforeEach(() => {
      service['injector'].get<Router>(Router).navigateByUrl = jest.fn();
    });

    test('should navigateByUrl with state val', () => {
      service['navigateToState']();
      expect(
        service['injector'].get<Router>(Router).navigateByUrl
      ).toHaveBeenCalledWith('state/link');
    });

    test('should call initial Navigation when state is not set', () => {
      oAuthService.state = undefined;
      service['injector'].get<Router>(Router).initialNavigation = jest.fn();

      service['navigateToState']();

      expect(
        service['injector'].get<Router>(Router).initialNavigation
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('silentRefresh', () => {
    beforeEach(() => {
      oAuthService.silentRefresh = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
    });

    test('should resolve after refresh', async () => {
      expect.assertions(0);

      return service['silentRefresh']();
    });

    test('should call initImplicitFlow on reject and resolve afterwards', async () => {
      oAuthService.silentRefresh = jest
        .fn()
        .mockImplementation(() =>
          Promise.reject({ reason: { error: 'login_required' } })
        );

      oAuthService['initImplicitFlow'] = jest.fn();

      expect.assertions(1);

      return service['silentRefresh']().then((_) => {
        expect(oAuthService['initImplicitFlow']).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('configureImplicitFlow', () => {
    let isDoneLoading: boolean;

    beforeEach(() => {
      oAuthService.setStorage = jest.fn();
      oAuthService.setupAutomaticSilentRefresh = jest.fn();
      oAuthService.loadDiscoveryDocumentAndTryLogin = jest
        .fn()
        .mockImplementation(() => Promise.resolve(true));
      oAuthService.hasValidAccessToken = jest
        .fn()
        .mockImplementation(() => false);
      service['navigateToState'] = jest.fn();
      service['isAuthenticatedSubject$'].next(false);
      service.isDoneLoading$.subscribe((val) => (isDoneLoading = val));
    });

    test('should set isDoneLoading and automatic silent refresh', async () => {
      await service.configureImplicitFlow();

      expect(oAuthService.hasValidAccessToken).toHaveBeenCalledTimes(1);
      expect(oAuthService.setStorage).toHaveBeenCalledTimes(1);
      expect(
        oAuthService.loadDiscoveryDocumentAndTryLogin
      ).toHaveBeenCalledTimes(1);
      expect(oAuthService.setupAutomaticSilentRefresh).toHaveBeenCalledTimes(1);
      expect(service['navigateToState']).not.toHaveBeenCalled();

      expect(isDoneLoading).toBeTruthy();
    });

    test('should set isDoneLoading on errors', async () => {
      oAuthService.loadDiscoveryDocumentAndTryLogin = jest
        .fn()
        .mockImplementation(() => Promise.reject(false));

      await service.configureImplicitFlow();

      expect(oAuthService.hasValidAccessToken).not.toHaveBeenCalled();
      expect(oAuthService.setStorage).toHaveBeenCalledTimes(1);
      expect(
        oAuthService.loadDiscoveryDocumentAndTryLogin
      ).toHaveBeenCalledTimes(1);
      expect(service['navigateToState']).not.toHaveBeenCalled();

      expect(isDoneLoading).toBeTruthy();
    });

    test('should call navigateToState on valid access token', async () => {
      oAuthService.hasValidAccessToken = jest
        .fn()
        .mockImplementation(() => true);

      await service.configureImplicitFlow();

      expect(oAuthService.setStorage).toHaveBeenCalledTimes(1);
      expect(
        oAuthService.loadDiscoveryDocumentAndTryLogin
      ).toHaveBeenCalledTimes(1);
      expect(oAuthService.setupAutomaticSilentRefresh).toHaveBeenCalledTimes(1);
      expect(service['navigateToState']).toHaveBeenCalledTimes(1);

      expect(isDoneLoading).toBeTruthy();
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
    test('should return undefined when not authenticated', (done) => {
      service['isAuthenticatedSubject$'].next(false);

      service.getUserName().subscribe((username) => {
        expect(username).toBeUndefined();
        done();
      });
    });

    test('should return undefined when decoding access token fails', (done) => {
      service['isAuthenticatedSubject$'].next(true);

      AuthService['getDecodedAccessToken'] = jest
        .fn()
        .mockImplementation(() => undefined);

      service.getUserName().subscribe((username) => {
        expect(username).toBeUndefined();
        expect(AuthService['getDecodedAccessToken']).toHaveBeenCalled();
        done();
      });
    });

    test('should return username', (done) => {
      service['isAuthenticatedSubject$'].next(true);

      AuthService['getDecodedAccessToken'] = jest
        .fn()
        .mockImplementation(() => ({
          given_name: 'given name',
          family_name: 'family name',
        }));

      service.getUserName().subscribe((username) => {
        expect(username).toBeDefined();
        expect(AuthService['getDecodedAccessToken']).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('logout', () => {
    test('should call logout of oauthservice', () => {
      service.logout();

      expect(service['oauthService'].logOut).toHaveBeenCalledWith(true);
    });
  });

  describe('getAppRoles', () => {
    test('should return roles from token', () => {
      const mockRoles = ['theySeeMeRolling'];
      service.hasValidAccessToken = jest.fn().mockImplementation(() => true);
      AuthService['getDecodedAccessToken'] = jest
        .fn()
        .mockImplementation(() => {
          return { roles: mockRoles };
        });

      const roles = service.getAppRoles();

      expect(roles).toEqual(mockRoles);
    });

    test('should return empty array if user is not authenticated', () => {
      service.hasValidAccessToken = jest.fn().mockImplementation(() => false);

      const roles = service.getAppRoles();

      expect(roles).toEqual([]);
    });
  });

  describe('initializer', () => {
    test('should call configureImplicitFlow', async () => {
      service.configureImplicitFlow = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      service.hasValidAccessToken = jest.fn().mockImplementation(() => true);

      await initializer(service)();

      expect(service.configureImplicitFlow).toHaveBeenCalled();
    });

    test('should call login if user is not authenticated', async () => {
      service.configureImplicitFlow = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      service.hasValidAccessToken = jest.fn().mockImplementation(() => false);
      service.login = jest.fn().mockImplementation(() => Promise.resolve());

      await initializer(service)();

      expect(service.login).toHaveBeenCalled();
    });
  });
  // tslint:disable-next-line: max-file-line-count
});
