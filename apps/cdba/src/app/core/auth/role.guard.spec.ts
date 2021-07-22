import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { hasIdTokenRole } from '@schaeffler/azure-auth';

import { RoleGuard } from './role.guard';
import { ActivatedRouteSnapshot } from '@angular/router';

describe('RoleGuard', () => {
  let spectator: SpectatorService<RoleGuard>;
  let guard: RoleGuard;
  let store: MockStore;

  const createService = createServiceFactory({
    service: RoleGuard,
    imports: [RouterTestingModule],
    providers: [provideMockStore({})],
  });

  const mockRoute: ActivatedRouteSnapshot = {
    data: {
      rolesWithAccess: [],
    },
  } as unknown as ActivatedRouteSnapshot;

  beforeEach(() => {
    spectator = createService();
    guard = spectator.inject(RoleGuard);
    store = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivateChild', () => {
    test('should grant access, if user has base role', () => {
      store.overrideSelector(hasIdTokenRole('CDBA_BASIC'), true);

      guard
        .canActivateChild(mockRoute)
        .subscribe((granted) => expect(granted).toBeTruthy());
    });

    test('should not grant access if user is lacking base role', () => {
      store.overrideSelector(hasIdTokenRole('CDBA_BASIC'), false);
      guard['router'].navigate = jest.fn().mockImplementation();

      guard
        .canActivateChild(mockRoute)
        .subscribe((granted) => expect(granted).toBeFalsy());
    });

    test('should redirect to forbidden page if user is not authorized', () => {
      store.overrideSelector(hasIdTokenRole('CDBA_BASIC'), false);
      guard['router'].navigate = jest.fn().mockImplementation();

      guard.canActivateChild(mockRoute).subscribe((granted) => {
        expect(granted).toBeFalsy();
        expect(guard['router'].navigate).toHaveBeenCalledWith(['forbidden']);
      });
    });
  });
});
