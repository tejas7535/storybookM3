import { QuotationToDateActions } from '@gq/core/store/quotation-to-date/quotation-to-date.actions';
import { ShipToPartyFacade } from '@gq/core/store/ship-to-party/ship-to-party.facade';
import { HeaderInformationData } from '@gq/shared/components/case-header-information/models/header-information-data.interface';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import moment from 'moment';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import {
  clearCreateCaseRowData,
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
import { CreateCaseHeaderData } from '../reducers/create-case/models/create-case-header-data.interface';
import { SectorGpsdFacade } from '../sector-gpsd/sector-gpsd.facade';
import {
  getCreateCaseLoading,
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
    test('createCaseLoading$', () => {
      mockStore.overrideSelector(getCreateCaseLoading, true);
      facade.createCaseLoading$.subscribe((loading) => {
        expect(loading).toBe(true);
      });
    });
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
    describe('resetCaseCreationInformation', () => {
      test('resetCaseCreationInformation without navigateToCaseOverview', () => {
        mockStore.dispatch = jest.fn();
        facade.resetCaseCreationInformation();

        expect(mockStore.dispatch).not.toHaveBeenCalledWith(
          navigateToCaseOverView()
        );
        expect(mockStore.dispatch).toHaveBeenCalledWith(
          resetAllAutocompleteOptions()
        );
        expect(mockStore.dispatch).toHaveBeenCalledWith(clearCustomer());
        expect(mockStore.dispatch).toHaveBeenCalledWith(clearShipToParty());
        expect(mockStore.dispatch).toHaveBeenCalledWith(clearSectorGpsd());
        expect(mockStore.dispatch).toHaveBeenCalledWith(clearOfferType());
        expect(mockStore.dispatch).toHaveBeenCalledWith(
          clearPurchaseOrderType()
        );
        expect(
          facade['sectorGpsdFacade'].resetAllSectorGpsds
        ).toHaveBeenCalled();
        expect(
          facade['shipToPartyFacade'].resetAllShipToParties
        ).toHaveBeenCalled();
      });

      test('resetCaseCreationInformation with navigateToCaseOverview', () => {
        mockStore.dispatch = jest.fn();
        facade.resetCaseCreationInformation(true);

        expect(mockStore.dispatch).toHaveBeenCalledWith(
          navigateToCaseOverView()
        );
      });
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

    describe('clearCreateCaseRowData', () => {
      test('should dispatch clearCreateCaseRowData action', () => {
        mockStore.dispatch = jest.fn();
        facade.clearCreateCaseRowData();

        expect(mockStore.dispatch).toHaveBeenCalledWith(
          clearCreateCaseRowData()
        );
      });
    });
    describe('createNewOgpCase', () => {
      test('should dispatch createNewOgpCase action', () => {
        mockStore.dispatch = jest.fn();
        const inputHeaderInformation: HeaderInformationData = {
          bindingPeriodValidityEndDate: moment(new Date('2025-02-17')),
          caseName: 'a caseName',
          currency: 'EUR',
          customerInquiryDate: moment(new Date('2025-02-17')),
          offerType: { id: 1, name: 'offerType' },
          customer: { id: '20014', value: 'customerName', selected: true },
          partnerRoleType: { id: '1', name: 'partnerRoleType' },
          purchaseOrderType: { id: '1', name: 'purchaseOrderType' },
          quotationToDate: moment(new Date('2025-02-17')),
          quotationToManualInput: false,
          requestedDeliveryDate: moment(new Date('2025-02-17')),
          salesOrg: { id: '1', selected: true },
          shipToParty: { id: '1', value: 'shipToParty', selected: true },
        };
        const expectedActionInput: CreateCaseHeaderData = {
          customer: {
            customerId: inputHeaderInformation.customer.id,
            salesOrg: inputHeaderInformation.salesOrg.id,
          },
          bindingPeriodValidityEndDate:
            inputHeaderInformation.bindingPeriodValidityEndDate.toISOString(),
          caseName: inputHeaderInformation.caseName,
          customCurrency: inputHeaderInformation.currency,
          customerInquiryDate:
            inputHeaderInformation.customerInquiryDate.toISOString(),
          offerTypeId: inputHeaderInformation.offerType?.id,
          partnerRoleId: inputHeaderInformation.partnerRoleType?.id,
          purchaseOrderTypeId: inputHeaderInformation.purchaseOrderType?.id,
          quotationToDate: inputHeaderInformation.quotationToDate.toISOString(),
          quotationToManualInput: inputHeaderInformation.quotationToManualInput,
          requestedDeliveryDate:
            inputHeaderInformation.requestedDeliveryDate?.toISOString(),
          shipToParty: {
            customerId: inputHeaderInformation.shipToParty.id,
            salesOrg: inputHeaderInformation.salesOrg.id,
          },
        };
        facade.createNewOgpCase(inputHeaderInformation);

        expect(mockStore.dispatch).toHaveBeenCalledWith({
          createCaseData: expectedActionInput,
          type: '[Create Case] Create OGP Case',
        });
      });
    });

    describe('createNewCustomerOgpCase', () => {
      test('should dispatch createCustomerOgpCase action', () => {
        mockStore.dispatch = jest.fn();
        const inputHeaderInformation: HeaderInformationData = {
          bindingPeriodValidityEndDate: moment(new Date('2025-02-17')),
          caseName: 'a caseName',
          currency: 'EUR',
          customerInquiryDate: moment(new Date('2025-02-17')),
          offerType: { id: 1, name: 'offerType' },
          customer: { id: '20014', value: 'customerName', selected: true },
          partnerRoleType: { id: '1', name: 'partnerRoleType' },
          purchaseOrderType: { id: '1', name: 'purchaseOrderType' },
          quotationToDate: moment(new Date('2025-02-17')),
          quotationToManualInput: false,
          requestedDeliveryDate: moment(new Date('2025-02-17')),
          salesOrg: { id: '1', selected: true },
          shipToParty: { id: '1', value: 'shipToParty', selected: true },
        };
        const expectedActionInput: CreateCaseHeaderData = {
          customer: {
            customerId: inputHeaderInformation.customer.id,
            salesOrg: inputHeaderInformation.salesOrg.id,
          },
          bindingPeriodValidityEndDate:
            inputHeaderInformation.bindingPeriodValidityEndDate.toISOString(),
          caseName: inputHeaderInformation.caseName,
          customCurrency: inputHeaderInformation.currency,
          customerInquiryDate:
            inputHeaderInformation.customerInquiryDate.toISOString(),
          offerTypeId: inputHeaderInformation.offerType?.id,
          partnerRoleId: inputHeaderInformation.partnerRoleType?.id,
          purchaseOrderTypeId: inputHeaderInformation.purchaseOrderType?.id,
          quotationToDate: inputHeaderInformation.quotationToDate.toISOString(),
          quotationToManualInput: inputHeaderInformation.quotationToManualInput,
          requestedDeliveryDate:
            inputHeaderInformation.requestedDeliveryDate?.toISOString(),
          shipToParty: {
            customerId: inputHeaderInformation.shipToParty.id,
            salesOrg: inputHeaderInformation.salesOrg.id,
          },
        };
        facade.createNewCustomerOgpCase(inputHeaderInformation);

        expect(mockStore.dispatch).toHaveBeenCalledWith({
          createCaseData: expectedActionInput,
          type: '[Create Case] Create Customer OGP Case',
        });
      });
    });
  });
  describe('getQuotationToDate', () => {
    test('should dispatch getQuotationToDate action', () => {
      mockStore.dispatch = jest.fn();
      facade.getQuotationToDate({
        customerId: 'customerId',
        salesOrg: 'salesOrg',
      });

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        QuotationToDateActions.getQuotationToDate({
          customerId: { customerId: 'customerId', salesOrg: 'salesOrg' },
        })
      );
    });
  });
});
