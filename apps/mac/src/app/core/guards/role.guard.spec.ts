import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { getRoles } from '@schaeffler/azure-auth';

import { AppState } from '../store';
import { RoutePath } from './../../app-routing.enum';
import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let store: MockStore<AppState>;

  const mockBaseRoute: ActivatedRouteSnapshot = {
    path: RoutePath.LifetimePredictorPath,
  } as unknown as ActivatedRouteSnapshot;

  const mockProtectedRoute: ActivatedRouteSnapshot = {
    ...mockBaseRoute,
    data: {
      requiredRoles: ['lifetime-predictor-user'],
    },
  } as unknown as ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [RoleGuard, provideMockStore({})],
    });
    guard = TestBed.inject(RoleGuard);
    store = TestBed.inject(MockStore);
  });

  test('should create', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivateChild', () => {
    test('should grant access, if no roles are required', (done) => {
      store.overrideSelector(getRoles, []);
      store.refreshState();

      guard.canActivateChild(mockBaseRoute, undefined).subscribe((granted) => {
        expect(granted).toBeTruthy();
        done();
      });
    });

    test('should grant access, if user has base role', (done) => {
      store.overrideSelector(getRoles, ['lifetime-predictor-user']);
      store.refreshState();

      guard
        .canActivateChild(mockProtectedRoute, undefined)
        .subscribe((granted) => {
          expect(granted).toBeTruthy();
          done();
        });
    });

    test('should not grant access if user is lacking base role', (done) => {
      store.overrideSelector(getRoles, []);
      store.refreshState();
      guard['router'].navigate = jest.fn().mockImplementation();

      guard
        .canActivateChild(mockProtectedRoute, undefined)
        .subscribe((granted) => {
          expect(guard['router'].navigate).toHaveBeenCalledWith([
            RoutePath.ForbiddenPath,
          ]);
          expect(granted).toBeFalsy();
          done();
        });
    });
  });
});
