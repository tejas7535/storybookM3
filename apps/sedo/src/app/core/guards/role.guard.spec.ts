import { waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { getIsLoggedIn, getRoles } from '@schaeffler/azure-auth';

import { AppRoutePath } from '../../app-route-path.enum';
import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let store: MockStore;
  let spectator: SpectatorService<RoleGuard>;

  const createService = createServiceFactory({
    service: RoleGuard,
    imports: [RouterTestingModule],
    providers: [RoleGuard, provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    guard = spectator.service;
    guard = spectator.inject(RoleGuard);
    store = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivateChild', () => {
    test(
      'should grant access, if user has base role',
      waitForAsync(() => {
        store.overrideSelector(getRoles, ['USER_READ']);
        store.overrideSelector(getIsLoggedIn, true);

        guard
          .canActivateChild(undefined, undefined)
          .subscribe((granted) => expect(granted).toBeTruthy());
      })
    );

    test(
      'should not grant access if user is lacking base role',
      waitForAsync(() => {
        store.overrideSelector(getRoles, []);
        store.overrideSelector(getIsLoggedIn, true);
        guard['router'].navigate = jest.fn().mockImplementation();

        guard
          .canActivateChild(undefined, undefined)
          .subscribe((granted) => expect(granted).toBeFalsy());
      })
    );

    test('should redirect to forbidden page if user is not authorized', () => {
      store.overrideSelector(getRoles, []);
      store.overrideSelector(getIsLoggedIn, true);
      guard['router'].navigate = jest.fn().mockImplementation();

      guard.canActivateChild(undefined, undefined).subscribe();

      expect(guard['router'].navigate).toHaveBeenCalledWith([
        AppRoutePath.Forbidden,
      ]);
    });
  });
});
