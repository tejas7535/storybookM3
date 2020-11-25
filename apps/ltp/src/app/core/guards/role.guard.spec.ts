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
import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  let guard: RoleGuard;

  // tslint:disable-next-line: no-object-literal-type-assertion
  const goodRoute: ActivatedRoute = {
    snapshot: {
      paramMap: convertToParamMap({
        id: 'one-id',
      }),
    },
  } as ActivatedRoute;

  // tslint:disable-next-line: no-object-literal-type-assertion
  const badRoute: ActivatedRoute = {
    snapshot: {
      paramMap: convertToParamMap({
        id: 'one-id',
      }),
    },
  } as ActivatedRoute;

  const goodData: any = {
    roles: ['good_role'],
    unauthorized: {
      redirect: '/nonono',
    },
  };

  const badData: any = {
    roles: ['bad_role'],
    unauthorized: {
      redirect: '/nonono',
    },
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],

      providers: [
        RoleGuard,
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
    guard = TestBed.inject(RoleGuard);
  });

  beforeAll(() => {
    guard['authService'].getAppRoles = jest
      .fn()
      .mockImplementation(() => ['good_role']);
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
      guard['denyAccess'] = jest.fn();
      guard['isAuthenticated'] = jest.fn().mockImplementation(() => false);

      goodRoute.snapshot.data = goodData;

      const result = guard.canActivate(goodRoute.snapshot, ({
        url: 'hello',
      } as unknown) as RouterStateSnapshot);

      expect(guard['denyAccess']).toHaveBeenCalledWith(goodRoute.snapshot);
      expect(result).toBeFalsy();
    });

    test('should return false when role is missing', () => {
      guard['denyAccess'] = jest.fn();
      guard['isAuthenticated'] = jest.fn().mockImplementation(() => true);

      badRoute.snapshot.data = badData;

      const result = guard.canActivate(badRoute.snapshot, ({
        url: 'hello',
      } as unknown) as RouterStateSnapshot);

      expect(guard['denyAccess']).toHaveBeenCalledWith(badRoute.snapshot);
      expect(result).toBeFalsy();
    });

    test('should return true when authenticated and the required roles are present', () => {
      guard['isAuthenticated'] = jest.fn().mockImplementation(() => true);

      goodRoute.snapshot.data = goodData;

      const result = guard.canActivate(goodRoute.snapshot, ({
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

    test('should return true when authenticated', () => {
      guard['isAuthenticated'] = jest.fn().mockImplementation(() => true);

      const result = guard.canLoad(undefined, []);

      expect(result).toBeTruthy();
    });
  });

  describe('denyAccess', () => {
    test('should navigate if route has redirect url', () => {
      guard = TestBed.inject(RoleGuard);
      guard['router'].navigate = jest.fn();

      goodRoute.snapshot.data = goodData;

      guard['denyAccess'](goodRoute.snapshot);

      expect(guard['router'].navigate).toHaveBeenCalledWith(
        goodRoute.snapshot.data.unauthorized.redirect
      );
    });
  });
});
