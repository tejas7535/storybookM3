import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { getRoles } from '@schaeffler/auth';

import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let store: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [RoleGuard, provideMockStore({})],
    });
  });

  beforeEach(() => {
    guard = TestBed.inject(RoleGuard);
    store = TestBed.inject(MockStore);
  });

  test('should create', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivateChild', () => {
    test('should grant access, if user has base role', async(() => {
      store.overrideSelector(getRoles, ['User']);

      guard
        .canActivate(undefined, undefined)
        .subscribe((granted) => expect(granted).toBeTruthy());
    }));

    test('should not grant access if user is lacking base role', async(() => {
      store.overrideSelector(getRoles, []);
      guard['router'].navigate = jest.fn().mockImplementation();

      guard
        .canActivate(undefined, undefined)
        .subscribe((granted) => expect(granted).toBeFalsy());
    }));

    test('should redirect to forbidden page if user is not authorized', async(() => {
      store.overrideSelector(getRoles, []);
      guard['router'].navigate = jest.fn().mockImplementation();

      guard.canActivate(undefined, undefined).subscribe();

      expect(guard['router'].navigate).toHaveBeenCalledWith(['forbidden']);
    }));
  });
});
