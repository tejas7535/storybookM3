import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CustomerService } from '@gq/shared/services/rest/customer/customer.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { initialState } from '../process-case';
import { SectorGpsdActions } from './sector-gpsd.actions';
import { SectorGpsdEffects } from './sector-gpsd.effects';

describe('SectorGpsdEffects', () => {
  let action: any;
  let actions$: Actions;
  let effects: SectorGpsdEffects;
  let spectator: SpectatorService<SectorGpsdEffects>;
  let customerService: CustomerService;

  const createService = createServiceFactory({
    service: SectorGpsdEffects,
    imports: [HttpClientTestingModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({ initialState: { purchaseOrderType: initialState } }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(SectorGpsdEffects);

    customerService = spectator.inject(CustomerService);
  });

  test('should be created', () => {
    expect(effects).toBeTruthy();
    expect(customerService).toBeTruthy();
  });

  describe('getAllSectorGpsdByCustomerAndSalesOrg$', () => {
    action = SectorGpsdActions.getAllSectorGpsds({
      customerId: '1',
      salesOrg: '2',
    });
    test(
      'Should dispatch success action',
      marbles((m) => {
        const result = SectorGpsdActions.getAllSectorGpsdsSuccess({
          sectorGpsds: [{ id: '1', name: 'Sector 1' }],
        });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: [{ id: '1', name: 'Sector 1' }] });
        customerService.getSectorGpsdsByCustomerAndSalesOrg = jest.fn(
          () => response
        );

        const expected = m.cold('--b', { b: result });
        m.expect(effects.getAllSectorGpsdByCustomerAndSalesOrg$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          customerService.getSectorGpsdsByCustomerAndSalesOrg
        ).toHaveBeenCalledWith('1', '2');
      })
    );
    test(
      'Should dispatch error action',
      marbles((m) => {
        const errorMessage = 'error';
        const result = SectorGpsdActions.getAllSectorGpsdsFailure({
          errorMessage,
        });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-#|', {}, errorMessage);
        customerService.getSectorGpsdsByCustomerAndSalesOrg = jest.fn(
          () => response
        );

        const expected = m.cold('--b', { b: result });
        m.expect(effects.getAllSectorGpsdByCustomerAndSalesOrg$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          customerService.getSectorGpsdsByCustomerAndSalesOrg
        ).toHaveBeenCalledWith('1', '2');
      })
    );
  });
});
