import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { UserRoles } from '../../shared/constants';
import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let store: MockStore;
  let spectator: SpectatorService<RoleGuard>;

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

  test('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivateChild', () => {
    test('should grant access, if user has base role', () => {
      store.setState({
        'azure-auth': {
          accountInfo: {
            idTokenClaims: {
              roles: [UserRoles.BASIC],
            },
          },
        },
      });

      guard
        .canActivateChild({} as any, {} as any)
        .subscribe((granted) => expect(granted).toBeTruthy());
    });

    test('should not grant access if user is lacking base role', () => {
      store.setState({
        'azure-auth': {
          accountInfo: {
            idTokenClaims: {
              roles: [],
            },
          },
        },
      });
      guard['router'].navigate = jest.fn().mockImplementation();

      guard
        .canActivateChild({} as any, {} as any)
        .subscribe((granted) => expect(granted).toBeFalsy());

      expect(guard['router'].navigate).toHaveBeenCalledWith(['forbidden']);
    });
  });
});
