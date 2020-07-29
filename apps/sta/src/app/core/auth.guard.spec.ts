import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { getIsLoggedIn } from '@schaeffler/auth';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let store: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AuthGuard,
        provideMockStore(),
        {
          provide: Router,
          useValue: {
            navigateByUrl: () => jest.fn(),
          },
        },
      ],
    });
  });
  beforeEach(() => {
    guard = TestBed.inject(AuthGuard);
    store = TestBed.inject(MockStore);
    store.overrideSelector(getIsLoggedIn, true);
  });
  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('isAuthenticated', () => {
    test('should call hasValidAcessToken', (done) => {
      guard['isAuthenticated']().subscribe((isLoggedIn: boolean) => {
        expect(isLoggedIn).toBeTruthy();
        done();
      });
    });
  });

  describe('canActivate', () => {
    test('should return false when not authenticated', () => {
      guard['isAuthenticated'] = jest.fn().mockImplementation(() => false);

      const result = guard.canActivate(undefined, ({
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
});
