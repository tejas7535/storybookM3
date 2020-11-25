import { of } from 'rxjs';

import { TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { OAuthService } from 'angular-oauth2-oidc';
import { configureTestSuite } from 'ng-bullet';

import { AuthService } from '../services';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  // tslint:disable-next-line: no-object-literal-type-assertion
  const goodRoute: ActivatedRoute = {
    snapshot: {
      paramMap: convertToParamMap({
        id: 'one-id',
      }),
    },
  } as ActivatedRoute;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],

      providers: [
        AuthGuard,
        AuthService,
        {
          provide: Router,
          useValue: {
            navigateByUrl: () => jest.fn(),
          },
        },
        {
          provide: OAuthService,
          useValue: {
            tryLogin: jest.fn(),
            hasValidAccessToken: jest.fn().mockImplementation(() => false),
            events: of({ type: 'token_received' }),
            setupAutomaticSilentRefresh: jest.fn(),
            loadDiscoveryDocument: jest
              .fn()
              .mockImplementation(() => Promise.resolve()),
            initImplicitFlow: jest.fn(),
            state: 'state/link',
          },
        },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('isAuthenticated', () => {
    test('should call hasValidAcessToken', () => {
      guard['authService'].hasValidAccessToken = jest.fn();
      guard['isAuthenticated']();

      expect(guard['authService'].hasValidAccessToken).toHaveBeenCalledTimes(1);
    });
  });

  describe('canActivate', () => {
    test('should return false when not authenticated', () => {
      guard['isAuthenticated'] = jest.fn().mockImplementation(() => false);

      goodRoute.snapshot.data = {
        roles: ['good_role'],
      };

      const result = guard.canActivate(goodRoute.snapshot, ({
        url: 'hello',
      } as unknown) as RouterStateSnapshot);

      expect(result).toBeFalsy();
    });

    test('should return true when authenticated', () => {
      guard['isAuthenticated'] = jest.fn().mockImplementation(() => true);

      const result = guard.canActivate(undefined, ({
        url: 'hello',
      } as unknown) as RouterStateSnapshot);

      expect(result).toBeTruthy();
    });
  });

  describe('canLoad', () => {
    test('should return false when not authenticated', () => {
      guard['isAuthenticated'] = jest.fn().mockImplementation(() => false);

      const result = guard.canLoad(undefined, []);

      expect(result).toBeFalsy();
    });

    test('should return true when  authenticated', () => {
      guard['isAuthenticated'] = jest.fn().mockImplementation(() => true);

      const result = guard.canLoad(undefined, []);

      expect(result).toBeTruthy();
    });
  });

  describe('denyAccess', () => {
    test('should navigate if route has redirect url', () => {
      guard['router'].navigate = jest.fn();

      goodRoute.snapshot.data = {
        roles: ['good_role'],
        unauthorized: {
          redirect: '/nonono',
        },
      };

      guard['denyAccess'](goodRoute.snapshot);

      expect(guard['router'].navigate).toHaveBeenCalledWith(
        goodRoute.snapshot.data.unauthorized.redirect
      );
    });
  });
});
