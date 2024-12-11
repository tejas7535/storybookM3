import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ShipToPartyActions } from '@gq/core/store/ship-to-party/ship-to-party.actions';
import { ShipToPartyEffects } from '@gq/core/store/ship-to-party/ship-to-party.effects';
import { ShipToParty } from '@gq/shared/models/ship-to-party.model';
import { ShipToPartyService } from '@gq/shared/services/rest/ship-to-party/ship-to-party.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { initialState } from './ship-to-party.reducer';

describe('ShipToPartyEffects', () => {
  let action: any;
  let actions$: Actions;
  let effects: ShipToPartyEffects;
  let spectator: SpectatorService<ShipToPartyEffects>;
  let shipToPartyService: ShipToPartyService;

  const createService = createServiceFactory({
    service: ShipToPartyEffects,
    imports: [HttpClientTestingModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({ initialState: { shipToParty: initialState } }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(ShipToPartyEffects);

    shipToPartyService = spectator.inject(ShipToPartyService);
  });

  test('should be created', () => {
    expect(effects).toBeTruthy();
    expect(shipToPartyService).toBeTruthy();
  });

  describe('getAllShipToPartyForGivenCustomerAndSalesOrg$', () => {
    action = ShipToPartyActions.getAllShipToParties({
      customerId: '1',
      salesOrg: '2',
    });
    test(
      'Should dispatch success action',
      marbles((m) => {
        const shipToParty: ShipToParty = {
          customerId: '120030412',
          salesOrg: '2015',
          customerName: 'Ford Motor Company',
          countryName: 'USA',
          defaultCustomer: false,
        };
        const result = ShipToPartyActions.getAllShipToPartiesSuccess({
          shipToParties: [shipToParty],
        });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: { results: [shipToParty] } });
        shipToPartyService.getShipToParties = jest.fn(() => response);

        const expected = m.cold('--b', { b: result });
        m.expect(
          effects.getAllShipToPartyForGivenCustomerAndSalesOrg$
        ).toBeObservable(expected);
        m.flush();
        expect(shipToPartyService.getShipToParties).toHaveBeenCalledWith(
          '1',
          '2'
        );
      })
    );
    test(
      'should dispatch error action',
      marbles((m) => {
        const errorMessage = 'error';
        const result = ShipToPartyActions.getAllShipToPartiesFailure({
          errorMessage,
        });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-#|', {}, errorMessage);
        shipToPartyService.getShipToParties = jest.fn(() => response);

        const expected = m.cold('--b', { b: result });
        m.expect(
          effects.getAllShipToPartyForGivenCustomerAndSalesOrg$
        ).toBeObservable(expected);
        m.flush();
        expect(shipToPartyService.getShipToParties).toHaveBeenCalledWith(
          '1',
          '2'
        );
      })
    );
  });
});
