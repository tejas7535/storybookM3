import { of } from 'rxjs';

import { ShipToPartyFacade } from '@gq/core/store/ship-to-party/ship-to-party.facade';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
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
  navigateToCaseOverView,
  resetAllAutocompleteOptions,
  setRowDataCurrency,
  updateCurrencyOfPositionItems,
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
      MockProvider(QuotationService),
      MockProvider(ShipToPartyFacade, {
        resetAllShipToParties: jest.fn(),
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

      expect(mockStore.dispatch).toHaveBeenCalledWith(navigateToCaseOverView());
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        resetAllAutocompleteOptions()
      );
      expect(mockStore.dispatch).toHaveBeenCalledWith(clearCustomer());
      expect(mockStore.dispatch).toHaveBeenCalledWith(clearShipToParty());
      expect(mockStore.dispatch).toHaveBeenCalledWith(clearSectorGpsd());
      expect(mockStore.dispatch).toHaveBeenCalledWith(clearOfferType());
      expect(mockStore.dispatch).toHaveBeenCalledWith(clearPurchaseOrderType());
      expect(facade['sectorGpsdFacade'].resetAllSectorGpsds).toHaveBeenCalled();
      expect(
        facade['shipToPartyFacade'].resetAllShipToParties
      ).toHaveBeenCalled();
    });

    describe('updateCurrencyOfPositionItems', () => {
      test('should dispatch setRowDataCurrency and updateCurrencyOfPositionItems actions', () => {
        mockStore.dispatch = jest.fn();
        facade.updateCurrencyOfPositionItems('currency');

        expect(mockStore.dispatch).toHaveBeenCalledWith(
          setRowDataCurrency({ currency: 'currency' })
        );
        expect(mockStore.dispatch).toHaveBeenCalledWith(
          updateCurrencyOfPositionItems()
        );
      });
    });

    describe('getQuotationToDate', () => {
      test(
        'request the service to get the quotation to date',
        marbles((m) => {
          const date = '2024-10-10T15:12:14.215Z';
          const customerId = { customerId: 'customerId', salesOrg: 'salesOrg' };
          facade['quotationService'].getQuotationToDateForCaseCreation = jest
            .fn()
            .mockReturnValue(of(date));
          facade.getQuotationToDate(customerId);
          m.expect(facade.getQuotationToDate(customerId)).toBeObservable(
            m.cold('(a|)', { a: date })
          );
        })
      );
    });
  });
});
