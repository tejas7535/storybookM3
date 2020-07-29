import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { getIsLoggedIn } from '@schaeffler/auth';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let store: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard, provideMockStore({})],
    });
  });
  beforeEach(() => {
    guard = TestBed.inject(AuthGuard);
    store = TestBed.inject(MockStore);
  });
  test('should create', () => {
    expect(guard).toBeTruthy();
    expect(store).toBeTruthy();
  });
  describe('canActivate', () => {
    test('should return true when authenticated', () => {
      guard['isAuthenticated'] = jest.fn().mockImplementation(() => true);

      const result = guard.canActivate();

      expect(result).toBeTruthy();
    });
  });

  describe('isAuthenticated', () => {
    test('should return true if authenticated', (done) => {
      store.overrideSelector(getIsLoggedIn, true);

      guard.isAuthenticated().subscribe((isLoggedIn: boolean) => {
        expect(isLoggedIn).toBeTruthy();
        done();
      });
    });
  });
});
