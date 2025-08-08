import { provideRouter } from '@angular/router';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import {
  ROLES_STATE_ERROR_MOCK,
  ROLES_STATE_SUCCESS_MOCK,
} from '@cdba/testing/mocks';

import { DescriptiveRoleGuard } from './descriptive-role.guard';

describe('DescriptiveRoleGuard', () => {
  let spectator: SpectatorService<DescriptiveRoleGuard>;
  let guard: DescriptiveRoleGuard;
  let store: MockStore;

  const createService = createServiceFactory({
    service: DescriptiveRoleGuard,
    providers: [provideMockStore({}), provideRouter([])],
  });

  beforeEach(() => {
    spectator = createService();
    guard = spectator.inject(DescriptiveRoleGuard);
    store = spectator.inject(MockStore);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('activate methods', () => {
    it('should grant access', () => {
      store.setState(ROLES_STATE_SUCCESS_MOCK);

      guard.canActivate().subscribe((granted) => expect(granted).toBeTruthy());

      guard
        .canActivateChild()
        .subscribe((granted) => expect(granted).toBeTruthy());
    });

    it('should not grant access and redirect to missing-roles path', () => {
      store.setState(ROLES_STATE_ERROR_MOCK);
      guard['router'].navigate = jest.fn().mockImplementation();

      guard.canActivate().subscribe((granted) => {
        expect(granted).toBeFalsy();
        expect(guard['router'].navigate).toHaveBeenCalledWith([
          'missing-roles',
        ]);
      });

      guard.canActivateChild().subscribe((granted) => {
        expect(granted).toBeFalsy();
        expect(guard['router'].navigate).toHaveBeenCalledWith([
          'missing-roles',
        ]);
      });
    });
  });
});
