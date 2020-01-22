import { of } from 'rxjs';

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
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

  describe('canActivate', () => {
    beforeEach(() => {
      guard['authService'].login = jest.fn();
    });

    test('should not proceed when is not done loading', fakeAsync(() => {
      guard['authService']['isDoneLoadingSubject$'].next(false);

      guard.canActivate(undefined, undefined);

      tick(100);

      expect(guard['authService'].login).not.toHaveBeenCalled();
      expect(guard['isAuthenticated']).toBeFalsy();
    }));

    test('should login user when not authenticated', done => {
      guard['authService']['isDoneLoadingSubject$'].next(true);

      guard
        .canActivate(undefined, ({
          url: 'hello'
        } as unknown) as RouterStateSnapshot)
        .subscribe(res => {
          expect(guard['authService'].login).toHaveBeenCalledWith('hello');
          expect(res).toBeFalsy();
          done();
        });
    });

    test('should return auth status', done => {
      guard['authService']['isDoneLoadingSubject$'].next(true);
      guard['isAuthenticated'] = true;

      guard
        .canActivate(undefined, ({
          url: 'hello'
        } as unknown) as RouterStateSnapshot)
        .subscribe(res => {
          expect(res).toBeTruthy();
          done();
        });
    });
  });
});
