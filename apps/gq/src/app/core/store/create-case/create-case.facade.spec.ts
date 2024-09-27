import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import {
  clearCustomer,
  clearOfferType,
  clearPurchaseOrderType,
  clearSectorGpsd,
  clearShipToParty,
  resetAllAutocompleteOptions,
  updateRowDataItem,
  validateMaterialsOnCustomerAndSalesOrg,
} from '../actions/create-case/create-case.actions';
import { SectorGpsdFacade } from '../sector-gpsd/sector-gpsd.facade';
import {
  getSalesOrgs,
  getSalesOrgsOfShipToParty,
  getSelectedCustomerId,
  getSelectedSalesOrg,
} from '../selectors/create-case/create-case.selector';
import { CreateCaseFacade } from './create-case.facade';

describe('CreateCaseFacade', () => {
  let facade: CreateCaseFacade;
  let spectator: SpectatorService<CreateCaseFacade>;
  let mockStore: MockStore;
  let actions$: Actions;

  const createService = createServiceFactory({
    service: CreateCaseFacade,
    imports: [],
    providers: [
      provideMockStore(),
      provideMockActions(() => actions$),
      MockProvider(SectorGpsdFacade, {
        resetAllSectorGpsds: jest.fn(),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    facade = spectator.service;
    mockStore = spectator.inject(MockStore);
    actions$ = spectator.inject(Actions);
  });

  describe('should provide Observables', () => {
    test(
      'customerIdForCaseCreation$',
      marbles((m) => {
        mockStore.overrideSelector(getSelectedCustomerId, 'customerId');
        m.expect(facade.customerIdForCaseCreation$).toBeObservable(
          m.cold('a', { a: 'customerId' })
        );
      })
    );
    test(
      'customerSalesOrgs$',
      marbles((m) => {
        mockStore.overrideSelector(getSalesOrgs, []);
        m.expect(facade.customerSalesOrgs$).toBeObservable(
          m.cold('a', { a: [] })
        );
      })
    );

    test(
      'selectedCustomerSalesOrg$',
      marbles((m) => {
        mockStore.overrideSelector(getSelectedSalesOrg, {
          id: 'id',
          selected: true,
        });
        m.expect(facade.selectedCustomerSalesOrg$).toBeObservable(
          m.cold('a', { a: { id: 'id', selected: true } })
        );
      })
    );
    test(
      'shipToPartySalesOrgs$',
      marbles((m) => {
        mockStore.overrideSelector(getSalesOrgsOfShipToParty, []);
        m.expect(facade.shipToPartySalesOrgs$).toBeObservable(
          m.cold('a', { a: [] })
        );
      })
    );
    test(
      'customerIdentifier$',
      marbles((m) => {
        mockStore.overrideSelector(getSelectedCustomerId, 'customerId');
        mockStore.overrideSelector(getSelectedSalesOrg, {
          id: 'id',
          selected: true,
        });
        m.expect(facade.customerIdentifier$).toBeObservable(
          m.cold('a', { a: { customerId: 'customerId', salesOrg: 'id' } })
        );
      })
    );
  });

  describe('methods', () => {
    describe('updateRowDataItem', () => {
      test('should dispatch updateRowDataItem action', () => {
        mockStore.dispatch = jest.fn();
        facade.updateRowDataItem({} as any, false);

        expect(mockStore.dispatch).toHaveBeenCalledWith(
          updateRowDataItem({ item: {}, revalidate: false })
        );
      });
    });

    describe('validateMaterialsOnCustomerAndSalesOrg', () => {
      test('should dispatch validateMaterialsOnCustomerAndSalesOrg action', () => {
        mockStore.dispatch = jest.fn();
        facade.validateMaterialsOnCustomerAndSalesOrg();

        expect(mockStore.dispatch).toHaveBeenCalledWith(
          validateMaterialsOnCustomerAndSalesOrg()
        );
      });
    });

    test('resetCaseCreationInformation', () => {
      mockStore.dispatch = jest.fn();
      facade.resetCaseCreationInformation();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        resetAllAutocompleteOptions()
      );
      expect(mockStore.dispatch).toHaveBeenCalledWith(clearCustomer());
      expect(mockStore.dispatch).toHaveBeenCalledWith(clearShipToParty());
      expect(mockStore.dispatch).toHaveBeenCalledWith(clearSectorGpsd());
      expect(mockStore.dispatch).toHaveBeenCalledWith(clearOfferType());
      expect(mockStore.dispatch).toHaveBeenCalledWith(clearPurchaseOrderType());
      expect(facade['sectorGpsdFacade'].resetAllSectorGpsds).toHaveBeenCalled();
    });
  });
});
