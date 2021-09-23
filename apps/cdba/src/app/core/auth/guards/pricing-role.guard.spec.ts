import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { hasIdTokenRole } from '@schaeffler/azure-auth';

import { PricingRoleGuard } from './pricing-role.guard';

describe('PricingRoleGuard', () => {
  let spectator: SpectatorService<PricingRoleGuard>;
  let guard: PricingRoleGuard;
  let store: MockStore;

  const createService = createServiceFactory({
    service: PricingRoleGuard,
    imports: [RouterTestingModule],
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    guard = spectator.inject(PricingRoleGuard);
    store = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivateChild', () => {
    test('should grant access, if user has base role', () => {
      store.overrideSelector(
        hasIdTokenRole('CDBA_FUNC_SALES_AUTOMOTIVE'),
        true
      );

      guard
        .canActivateChild()
        .subscribe((granted) => expect(granted).toBeTruthy());
    });

    test('should not grant access if user is lacking base role', () => {
      store.overrideSelector(
        hasIdTokenRole('CDBA_FUNC_SALES_AUTOMOTIVE'),
        false
      );
      guard['router'].navigate = jest.fn().mockImplementation();

      guard
        .canActivateChild()
        .subscribe((granted) => expect(granted).toBeFalsy());
    });

    test('should redirect to forbidden page if user is not authorized', () => {
      store.overrideSelector(
        hasIdTokenRole('CDBA_FUNC_SALES_AUTOMOTIVE'),
        false
      );
      guard['router'].navigate = jest.fn().mockImplementation();

      guard.canActivateChild().subscribe((granted) => {
        expect(granted).toBeFalsy();
        expect(guard['router'].navigate).toHaveBeenCalledWith(['no-access']);
      });
    });
  });
});
