import { RouterTestingModule } from '@angular/router/testing';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { marbles } from 'rxjs-marbles/jest';

import { RoleFacade } from '../role.facade';
import { PricingRoleGuard } from './pricing-role.guard';

describe('PricingRoleGuard', () => {
  let spectator: SpectatorService<PricingRoleGuard>;
  let guard: PricingRoleGuard;
  let roleFacade: RoleFacade;

  const createService = createServiceFactory({
    service: PricingRoleGuard,
    imports: [RouterTestingModule],
    providers: [mockProvider(RoleFacade)],
  });

  beforeEach(() => {
    spectator = createService();
    guard = spectator.inject(PricingRoleGuard);
    roleFacade = spectator.inject(RoleFacade);
  });

  test('should create', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivateChild', () => {
    test(
      'should grant access, if user has pricing role',
      marbles((m) => {
        roleFacade.hasAnyPricingRole$ = m.cold('a', { a: true });
        roleFacade.isLoggedIn$ = m.cold('a', { a: true });
        guard
          .canActivateChild()
          .subscribe((granted) => expect(granted).toBeTruthy());
      })
    );

    test(
      'should not grant access if user is lacking pricing role',
      marbles((m) => {
        roleFacade.hasAnyPricingRole$ = m.cold('a', { a: false });
        roleFacade.isLoggedIn$ = m.cold('a', { a: true });
        guard['router'].navigate = jest.fn().mockImplementation();

        guard
          .canActivateChild()
          .subscribe((granted) => expect(granted).toBeFalsy());
      })
    );

    test(
      'should redirect to forbidden page if user is not authorized',
      marbles((m) => {
        roleFacade.hasAnyPricingRole$ = m.cold('a', { a: false });
        roleFacade.isLoggedIn$ = m.cold('a', { a: true });
        guard['router'].navigate = jest.fn().mockImplementation();

        guard.canActivateChild().subscribe((granted) => {
          expect(granted).toBeFalsy();
          expect(guard['router'].navigate).toHaveBeenCalledWith([
            'empty-states',
            'forbidden',
          ]);
        });
      })
    );
  });
});
