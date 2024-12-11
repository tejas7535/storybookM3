import { of } from 'rxjs';

import { ShipToPartyActions } from '@gq/core/store/ship-to-party/ship-to-party.actions';
import { ShipToPartyFacade } from '@gq/core/store/ship-to-party/ship-to-party.facade';
import { shipToPartyFeature } from '@gq/core/store/ship-to-party/ship-to-party.reducer';
import { ShipToParty } from '@gq/shared/models/ship-to-party.model';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

describe('ShipToPartyFacade', () => {
  let service: ShipToPartyFacade;
  let spectator: SpectatorService<ShipToPartyFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: ShipToPartyFacade,
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockStore = spectator.inject(MockStore);

    jest.resetAllMocks();
  });

  describe('Observables', () => {
    test(
      'should provide shipToParties$',
      marbles((m) => {
        mockStore.overrideSelector(shipToPartyFeature.selectShipToParties, []);
        m.expect(service.shipToParties$).toBeObservable(m.cold('a', { a: [] }));
      })
    );
  });

  describe('methods', () => {
    test('should dispatch getAllShipToParties', () => {
      mockStore.dispatch = jest.fn();
      const customerId = '12345';
      const salesOrg = '98765';

      service.loadShipToPartyByCustomerAndSalesOrg(customerId, salesOrg);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        ShipToPartyActions.getAllShipToParties({ customerId, salesOrg })
      );
    });

    test('should dispatch selectShipToParty', () => {
      mockStore.dispatch = jest.fn();
      const shipToParty: ShipToParty = {
        customerId: '120030412',
        salesOrg: '2015',
        customerName: 'Ford Motor Company',
        countryName: 'USA',
        defaultCustomer: false,
      };

      service.shipToParties$ = of([
        shipToParty,
        {
          customerId: '120036792',
          salesOrg: '2015',
          customerName: 'PT Astra Honda Motor',
          countryName: 'Indonesia',
          defaultCustomer: false,
        },
      ]);

      service.selectShipToParty(shipToParty);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        ShipToPartyActions.selectShipToParty({ shipToParty })
      );
    });

    test(
      'should return sip to party as selectable values',
      marbles((m) => {
        mockStore.overrideSelector(shipToPartyFeature.selectShipToParties, [
          {
            customerId: '120036792',
            salesOrg: '2015',
            customerName: 'PT Astra Honda Motor',
            countryName: 'Indonesia',
            defaultCustomer: true,
          },
        ]);

        m.expect(service.shipToPartiesAsSelectableValues$).toBeObservable(
          m.cold('a', {
            a: [
              {
                id: '120036792',
                value: 'PT Astra Honda Motor',
                value2: 'Indonesia',
                defaultSelection: true,
              },
            ],
          })
        );
      })
    );

    test(
      'should return shipToPartiesLoading$',
      marbles((m) => {
        mockStore.overrideSelector(
          shipToPartyFeature.selectShipToPartyLoading,
          true
        );
        m.expect(service.shipToPartiesLoading$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    test('should dispatch resetAllShipToParties', () => {
      mockStore.dispatch = jest.fn();
      service.resetAllShipToParties();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        ShipToPartyActions.resetAllShipToParties()
      );
    });
  });
});
