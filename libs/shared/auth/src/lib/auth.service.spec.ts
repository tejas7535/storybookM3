import { async, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { of } from 'rxjs';

import { OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { configureTestSuite } from 'ng-bullet';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let oAuthService: OAuthService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: OAuthService,
          useValue: {
            tryLogin: jest.fn(() => true),
            hasValidAccessToken: jest.fn(() => true),
            getAccessToken: jest.fn(() => 'token'),
            events: of({ type: 'token_received' }),
            setupAutomaticSilentRefresh: jest.fn(),
            loadDiscoveryDocument: jest.fn(() => Promise.resolve()),
            initImplicitFlow: jest.fn(),
            state: 'state/link',
            loadDiscoveryDocumentAndTryLogin: jest.fn(() =>
              Promise.resolve(true)
            ),
            silentRefresh: jest.fn(() => Promise.resolve(true)),
            logOut: jest.fn(),
          },
        },
        {
          provide: Router,
          useValue: {
            navigateByUrl: jest.fn(),
            url: 'test',
          },
        },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(AuthService);
    oAuthService = TestBed.inject(OAuthService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    test('should not call silentRefresh when tryLogin succeeds and navigateToState', async () => {
      service['navigateToState'] = jest.fn();
      const target = 'target';

      await service.login(target);

      expect(oAuthService.hasValidAccessToken).toHaveBeenCalled();
      expect(oAuthService.silentRefresh).not.toHaveBeenCalled();
      expect(service['navigateToState']).toHaveBeenCalledTimes(1);
    });

    test('should call initImplicitFlow when access token invalid and silentRefresh fails', async () => {
      oAuthService.hasValidAccessToken = jest.fn(() => false);
      oAuthService.silentRefresh = jest.fn(() => Promise.reject(undefined));
      oAuthService.initImplicitFlow = jest.fn();
      service['navigateToState'] = jest.fn();
      const target = 'target';

      await service.login(target);

      expect(oAuthService.silentRefresh).toHaveBeenCalledTimes(1);
      expect(oAuthService.initImplicitFlow).toHaveBeenCalledTimes(1);
      expect(service['navigateToState']).toHaveBeenCalledTimes(1);
    });

    test('should not call initImplicitFlow when access token invalid and silentRefresh succeeds', async () => {
      oAuthService.hasValidAccessToken = jest.fn(() => false);
      oAuthService.silentRefresh = jest.fn(() =>
        Promise.resolve(({} as unknown) as OAuthEvent)
      );
      oAuthService.initImplicitFlow = jest.fn();
      service['navigateToState'] = jest.fn();
      const target = 'target';

      await service.login(target);

      expect(oAuthService.silentRefresh).toHaveBeenCalledTimes(1);
      expect(oAuthService.initImplicitFlow).not.toHaveBeenCalled();
      expect(service['navigateToState']).toHaveBeenCalledTimes(1);
    });
  });

  describe('hasValidAccessToken', () => {
    test('should call hasValidAccessToken of oauthService', () => {
      oAuthService.hasValidAccessToken = jest
        .fn()
        .mockImplementation(() => true);

      const hasValidAccessToken = service.hasValidAccessToken();

      expect(hasValidAccessToken).toBeTruthy();
      expect(oAuthService.hasValidAccessToken).toHaveBeenCalledTimes(1);
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
    test('should navigate to state on token_received', async(() => {
      service['injector'].get<Router>(Router).navigateByUrl = jest.fn();
      service['initConfig']();

      expect(
        service['injector'].get<Router>(Router).navigateByUrl
      ).toHaveBeenLastCalledWith('state/link');
    }));
  });

  describe('navigateToState', () => {
    beforeEach(() => {
      service['injector'].get<Router>(Router).navigateByUrl = jest.fn();
    });

    test('should navigateByUrl with state val', () => {
      service.navigateToState();
      expect(
        service['injector'].get<Router>(Router).navigateByUrl
      ).toHaveBeenCalledWith('state/link');
    });

    test('should call initial Navigation when state is not set', () => {
      oAuthService.state = undefined;
      service['injector'].get<Router>(Router).initialNavigation = jest.fn();

      service.navigateToState();

      expect(
        service['injector'].get<Router>(Router).initialNavigation
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('tryAutomaticLogin', () => {
    beforeEach(() => {
      oAuthService.setStorage = jest.fn();
      oAuthService.setupAutomaticSilentRefresh = jest.fn();
      oAuthService.loadDiscoveryDocumentAndTryLogin = jest.fn(() =>
        Promise.resolve(true)
      );
      oAuthService.hasValidAccessToken = jest.fn(() => false);
    });

    test('should return false on errors', (done) => {
      oAuthService.loadDiscoveryDocumentAndTryLogin = jest.fn(() =>
        Promise.reject(false)
      );

      service.tryAutomaticLogin().subscribe((result) => {
        expect(oAuthService.hasValidAccessToken).not.toHaveBeenCalled();
        expect(oAuthService.setStorage).toHaveBeenCalledTimes(1);
        expect(
          oAuthService.loadDiscoveryDocumentAndTryLogin
        ).toHaveBeenCalledTimes(1);
        expect(result).toBeFalsy();
        done();
      });
    });

    test('should return true on valid access token', (done) => {
      oAuthService.hasValidAccessToken = jest.fn(() => true);

      service.tryAutomaticLogin().subscribe((result) => {
        expect(oAuthService.setStorage).toHaveBeenCalledTimes(1);
        expect(
          oAuthService.loadDiscoveryDocumentAndTryLogin
        ).toHaveBeenCalledTimes(1);
        expect(oAuthService.setupAutomaticSilentRefresh).toHaveBeenCalledTimes(
          1
        );
        expect(result).toBeTruthy();
        done();
      });
    });

    test('should return false on invalid access token', (done) => {
      oAuthService.hasValidAccessToken = jest.fn(() => false);

      service.tryAutomaticLogin().subscribe((result) => {
        expect(oAuthService.setStorage).toHaveBeenCalledTimes(1);
        expect(
          oAuthService.loadDiscoveryDocumentAndTryLogin
        ).toHaveBeenCalledTimes(1);
        expect(oAuthService.setupAutomaticSilentRefresh).toHaveBeenCalledTimes(
          1
        );
        expect(result).toBeFalsy();
        done();
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

  describe('getUser', () => {
    test('should return undefined when not authenticated', () => {
      oAuthService.hasValidAccessToken = jest.fn(() => false);
      AuthService['getDecodedAccessToken'] = jest
        .fn()
        .mockImplementation(() => undefined);

      const user = service.getUser();

      expect(user).toBeUndefined();
      expect(AuthService['getDecodedAccessToken']).not.toHaveBeenCalled();
    });

    test('should return undefined when decoding access token fails', () => {
      oAuthService.hasValidAccessToken = jest.fn(() => true);

      AuthService['getDecodedAccessToken'] = jest
        .fn()
        .mockImplementation(() => undefined);

      const user = service.getUser();

      expect(user).toBeUndefined();
      expect(AuthService['getDecodedAccessToken']).toHaveBeenCalled();
    });

    test('should return user', () => {
      oAuthService.hasValidAccessToken = jest.fn(() => true);

      AuthService['getDecodedAccessToken'] = jest
        .fn()
        .mockImplementation(() => ({
          given_name: 'given name',
          family_name: 'family name',
        }));

      const user = service.getUser();

      expect(user).toBeDefined();
      expect(AuthService['getDecodedAccessToken']).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    test('should call logout', () => {
      service.logout();

      expect(oAuthService.logOut).toHaveBeenCalledTimes(1);
    });
  });
});
