import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { RoutePath } from '@mac/app-routing.enum';

import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  let spectator: SpectatorService<RoleGuard>;
  let guard: RoleGuard;
  let store: MockStore;

  const mockBaseRoute: ActivatedRouteSnapshot = {
    path: RoutePath.LifetimePredictorPath,
  } as unknown as ActivatedRouteSnapshot;

  const mockProtectedRoute: ActivatedRouteSnapshot = {
    ...mockBaseRoute,
    data: {
      requiredRoles: ['lifetime-predictor-user'],
    },
  } as unknown as ActivatedRouteSnapshot;

  const createService = createServiceFactory({
    service: RoleGuard,
    imports: [RouterTestingModule],
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    guard = spectator.inject(RoleGuard);
    store = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivateChild', () => {
    test('should grant access, if no roles are required', (done) => {
      guard.canActivateChild(mockBaseRoute).subscribe((granted: boolean) => {
        expect(granted).toBeTruthy();
        done();
      });
    });

    test('should grant access, if user has base role', (done) => {
      store.setState({
        'azure-auth': {
          accountInfo: {
            idTokenClaims: {
              roles: ['lifetime-predictor-user'],
            },
          },
        },
      });

      guard
        .canActivateChild(mockProtectedRoute)
        .subscribe((granted: boolean) => {
          expect(granted).toBeTruthy();
          done();
        });
    });

    test('should not grant access if user is lacking base role', (done) => {
      store.setState({
        'azure-auth': {
          accountInfo: {
            idTokenClaims: {
              roles: ['not-lifetime-predictor-user'],
            },
          },
        },
      });
      guard['router'].navigate = jest.fn().mockImplementation();

      guard
        .canActivateChild(mockProtectedRoute)
        .subscribe((granted: boolean) => {
          expect(guard['router'].navigate).toHaveBeenCalledWith([
            RoutePath.ForbiddenPath,
          ]);
          expect(granted).toBeFalsy();
          done();
        });
    });
  });
});
