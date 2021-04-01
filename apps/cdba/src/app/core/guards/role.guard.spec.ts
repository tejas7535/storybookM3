import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { getRoles } from '@schaeffler/auth';

import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  let spectator: SpectatorService<RoleGuard>;
  let guard: RoleGuard;
  let store: MockStore;

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
    test('should grant access, if user has base role', () => {
      store.overrideSelector(getRoles, ['CDBA_BASIC']);

      guard
        .canActivateChild(undefined, undefined)
        .subscribe((granted) => expect(granted).toBeTruthy());
    });

    test('should not grant access if user is lacking base role', () => {
      store.overrideSelector(getRoles, []);
      guard['router'].navigate = jest.fn().mockImplementation();

      guard
        .canActivateChild(undefined, undefined)
        .subscribe((granted) => expect(granted).toBeFalsy());
    });

    test('should redirect to forbidden page if user is not authorized', () => {
      store.overrideSelector(getRoles, []);
      guard['router'].navigate = jest.fn().mockImplementation();

      guard.canActivateChild(undefined, undefined).subscribe();

      expect(guard['router'].navigate).toHaveBeenCalledWith(['forbidden']);
    });
  });
});
