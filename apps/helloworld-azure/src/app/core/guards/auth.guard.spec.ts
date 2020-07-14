import { TestBed } from '@angular/core/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { getIsLoggedIn } from '@schaeffler/shared/auth';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let store: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],

      providers: [AuthGuard, provideMockStore()],
    });

    guard = TestBed.inject(AuthGuard);
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    store.overrideSelector(getIsLoggedIn, true);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    test('should return true when user is logged in', (done) => {
      guard.canActivate(undefined, undefined).subscribe((res) => {
        expect(res).toBeTruthy();
        done();
      });
    });
  });
});
