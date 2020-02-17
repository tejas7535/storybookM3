import { of } from 'rxjs';

import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot } from '@angular/router';

import { OAuthService } from 'angular-oauth2-oidc';
import { configureTestSuite } from 'ng-bullet';

import { AuthService } from './auth.service';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],

      providers: [
        AuthGuard,
        AuthService,
        {
          provide: Router,
          useValue: {
            navigateByUrl: () => jest.fn()
          }
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
            state: 'state/link'
          }
        }
      ]
    });

    guard = TestBed.get(AuthGuard);
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

      const result = guard.canActivate(undefined, ({
        url: 'hello'
      } as unknown) as RouterStateSnapshot);

      expect(result).toBeFalsy();
    });

    test('should return true when authenticated', () => {
      guard['isAuthenticated'] = jest.fn().mockImplementation(() => true);

      const result = guard.canActivate(undefined, ({
        url: 'hello'
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
});
