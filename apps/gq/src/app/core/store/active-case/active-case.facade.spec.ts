import { of } from 'rxjs';

import { ShipToPartyFacade } from '@gq/core/store/ship-to-party/ship-to-party.facade';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import {
  DetailViewQueryParams,
  Quotation,
  QuotationAttachment,
  QuotationDetail,
  QuotationStatus,
  SAP_SYNC_STATUS,
  TagType,
} from '@gq/shared/models';
import { UpdateQuotationRequest } from '@gq/shared/services/rest/quotation/models/update-quotation-request.model';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { createSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import {
  clearOfferType,
  clearPurchaseOrderType,
  clearSectorGpsd,
  clearShipToParty,
  resetAllAutocompleteOptions,
} from '../actions';
import { MaterialCostDetailsFacade } from '../facades';
import { MaterialComparableCostsFacade } from '../facades/material-comparable-costs.facade';
import { MaterialSalesOrgFacade } from '../facades/material-sales-org.facade';
import { MaterialStockFacade } from '../facades/material-stock.facade';
import { PlantMaterialDetailsFacade } from '../facades/plant-material-details.facade';
import { SapPriceDetailsFacade } from '../facades/sap-price-details.facade';
import { SectorGpsdFacade } from '../sector-gpsd/sector-gpsd.facade';
import { getSalesOrgsOfShipToParty } from '../selectors/create-case/create-case.selector';
import { TransactionsFacade } from '../transactions/transactions.facade';
import { ActiveCaseActions } from './active-case.action';
import { ActiveCaseFacade } from './active-case.facade';
import { activeCaseFeature } from './active-case.reducer';
import * as fromActiveCaseSelectors from './active-case.selectors';
import {
  getCoefficients,
  getIsQuotationStatusActive,
  getQuotationCurrency,
  getQuotationDetailIsFNumber,
  getQuotationHasFNumberMaterials,
  getQuotationHasRfqMaterials,
  getQuotationSapSyncStatus,
  getQuotationStatus,
  getSapId,
  getSimulationModeEnabled,
} from './active-case.selectors';
import { QuotationIdentifier, UpdateQuotationDetail } from './models';

describe('ActiveCaseFacade', () => {
  let facade: ActiveCaseFacade;
  let spectator: SpectatorService<ActiveCaseFacade>;
  let mockStore: MockStore;
  let actions$: Actions;

  const createService = createServiceFactory({
    service: ActiveCaseFacade,
    providers: [
      provideMockStore({}),
      provideMockActions(() => actions$),
      MockProvider(MaterialComparableCostsFacade, {
        materialComparableCostsLoading$: of(false),
        materialComparableCosts$: of([]),
      }),
      MockProvider(MaterialSalesOrgFacade, {
        materialSalesOrgLoading$: of(false),
        materialSalesOrg$: of({} as any),
        materialSalesOrgDataAvailable$: of(false),
      }),
      MockProvider(PlantMaterialDetailsFacade, {
        plantMaterialDetailsLoading$: of(false),
        plantMaterialDetails$: of([]),
      }),
      MockProvider(MaterialCostDetailsFacade, {
        materialCostUpdateAvl$: of(true),
      }),
      MockProvider(MaterialStockFacade, {
        materialStockLoading$: of(false),
        materialStock$: of({} as any),
      }),
      MockProvider(SapPriceDetailsFacade, {
        sapPriceDetailsLoading$: of(false),
        sapPriceDetails$: of([]),
      }),
      MockProvider(TransactionsFacade, {
        transactionsLoading$: of(false),
        transactions$: of([]),
        graphTransactions$: of([]),
      }),
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

  test('should be created', () => {
    expect(facade).toBeTruthy();
  });
  describe('quotation$', () => {
    test(
      'should select the quotation',
      marbles((m) => {
        const quotation = {} as any;
        mockStore.overrideSelector(
          activeCaseFeature.selectQuotation,
          quotation
        );

        m.expect(facade.quotation$).toBeObservable(
          m.cold('a', { a: quotation })
        );
      })
    );
  });

  describe('quotationIdentifier$', () => {
    test(
      'should select the quotation identifier',
      marbles((m) => {
        const quotationIdentifier = {
          gqId: 123,
          sapId: '456',
          customerNumber: '1245',
          salesOrg: '0815',
        } as QuotationIdentifier;
        mockStore.overrideSelector(
          activeCaseFeature.selectQuotationIdentifier,
          quotationIdentifier
        );

        m.expect(facade.quotationIdentifier$).toBeObservable(
          m.cold('a', { a: quotationIdentifier })
        );
      })
    );
  });

  describe('quotationCalculationInProgress$', () => {
    test(
      'should select the quotation calculationInProgress',
      marbles((m) => {
        const quotation = {
          calculationInProgress: true,
        } as Quotation;
        mockStore.overrideSelector(
          activeCaseFeature.selectQuotation,
          quotation
        );

        m.expect(facade.quotationCalculationInProgress$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });

  describe('quotationCustomer$', () => {
    test(
      'should select the quotation customer',
      marbles((m) => {
        const customer = {} as any;
        mockStore.overrideSelector(activeCaseFeature.selectCustomer, customer);

        m.expect(facade.quotationCustomer$).toBeObservable(
          m.cold('a', { a: customer })
        );
      })
    );
  });
  describe('selectedQuotationDetail$', () => {
    test(
      'should select the selected quotation detail',
      marbles((m) => {
        const quotationDetail = {} as any;
        mockStore.overrideSelector(
          activeCaseFeature.getSelectedQuotationDetail,
          quotationDetail
        );

        m.expect(facade.selectedQuotationDetail$).toBeObservable(
          m.cold('a', { a: quotationDetail })
        );
      })
    );
  });

  describe('selectedQuotationDetailIds$', () => {
    test(
      'should select the selected quotation detail ids',
      marbles((m) => {
        const quotationDetailIds = ['123'];
        mockStore.overrideSelector(
          activeCaseFeature.selectSelectedQuotationDetails,
          quotationDetailIds
        );

        m.expect(facade.selectedQuotationDetailIds$).toBeObservable(
          m.cold('a', { a: quotationDetailIds })
        );
      })
    );
  });
  describe('quotationSapId$', () => {
    test(
      'should select the sapId of the quotation',
      marbles((m) => {
        const sapId = '123';
        mockStore.overrideSelector(getSapId, sapId);

        m.expect(facade.quotationSapId$).toBeObservable(
          m.cold('a', { a: sapId })
        );
      })
    );
  });

  describe('isQuotationStatusActive$', () => {
    test(
      'should select if the quotation status is active',
      marbles((m) => {
        mockStore.overrideSelector(getIsQuotationStatusActive, true);

        m.expect(facade.isQuotationStatusActive$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });

  describe('simulationModeEnabled$', () => {
    test(
      'should select if the simulation mode is enabled',
      marbles((m) => {
        mockStore.overrideSelector(getSimulationModeEnabled, true);

        m.expect(facade.simulationModeEnabled$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });

  describe('getSimulatedQuotationDetailByItemId$', () => {
    test(
      'should select the simulated quotation detail by item id',
      marbles((m) => {
        const itemId = 123;
        const quotationDetail = { quotationItemId: 123 } as QuotationDetail;
        jest
          .spyOn(fromActiveCaseSelectors, 'getSimulatedQuotationDetailByItemId')
          .mockReturnValue(
            createSelector(
              (some) => some,
              () => quotationDetail
            )
          );
        m.expect(
          facade.getSimulatedQuotationDetailByItemId$(itemId)
        ).toBeObservable(m.cold('a', { a: quotationDetail }));
      })
    );
  });
  describe('detailViewQueryParams$', () => {
    test(
      'should select the detail view query params',
      marbles((m) => {
        const queryParams = {
          id: 1,
          queryParams: {
            customer_number: '12345',
            gqPositionId: '987654321',
            quotation_number: 12_345,
            sales_org: '0815',
          } as DetailViewQueryParams,
        };
        mockStore.overrideSelector(
          activeCaseFeature.getDetailViewQueryParams,
          queryParams
        );

        m.expect(facade.detailViewQueryParams$).toBeObservable(
          m.cold('a', { a: queryParams })
        );
      })
    );
  });
  describe('quotationCurrency$', () => {
    test(
      'shall select the currency of the quotation',
      marbles((m) => {
        const currency = 'EUR';
        mockStore.overrideSelector(getQuotationCurrency, currency);

        m.expect(facade.quotationCurrency$).toBeObservable(
          m.cold('a', { a: currency })
        );
      })
    );
  });

  describe('quotationDetailUpdating$', () => {
    test(
      'should select update loading',
      marbles((m) => {
        mockStore.overrideSelector(activeCaseFeature.selectUpdateLoading, true);
        m.expect(facade.quotationDetailUpdating$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });

  describe('updateQuotationDetailsSuccess$', () => {
    test(
      'should dispatch update quotation details success',
      marbles((m) => {
        const action = ActiveCaseActions.updateQuotationDetailsSuccess(
          {} as any
        );
        const expected = m.cold('b', {
          b: action,
        });

        actions$ = m.hot('a', { a: action });

        m.expect(facade.quotationDetailUpdateSuccess$).toBeObservable(
          expected as any
        );
      })
    );
  });

  describe('costsUpdating$', () => {
    test(
      'should select update costs loading',
      marbles((m) => {
        mockStore.overrideSelector(
          activeCaseFeature.selectUpdateCostsLoading,
          true
        );
        m.expect(facade.costsUpdating$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });

  describe('updateCostsSuccess$', () => {
    test(
      'should dispatch update costs success',
      marbles((m) => {
        const action = ActiveCaseActions.updateCostsSuccess({} as any);
        const expected = m.cold('b', {
          b: action,
        });

        actions$ = m.hot('a', { a: action });

        m.expect(facade.updateCostsSuccess$).toBeObservable(expected as any);
      })
    );
  });

  describe('rfqInformationUpdating$', () => {
    test(
      'should select update rfq information loading',
      marbles((m) => {
        mockStore.overrideSelector(
          activeCaseFeature.selectUpdateRfqInformationLoading,
          true
        );
        m.expect(facade.rfqInformationUpdating$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });

  describe('updateRfqInformationSuccess$', () => {
    test(
      'should dispatch update rfq information success',
      marbles((m) => {
        const action = ActiveCaseActions.updateRFQInformationSuccess({} as any);
        const expected = m.cold('b', {
          b: action,
        });

        actions$ = m.hot('a', { a: action });

        m.expect(facade.updateRfqInformationSuccess$).toBeObservable(
          expected as any
        );
      })
    );
  });

  describe('attachmentsUploading$', () => {
    test(
      'should select attachments uploading',
      marbles((m) => {
        mockStore.overrideSelector(
          activeCaseFeature.selectAttachmentsUploading,
          true
        );
        m.expect(facade.attachmentsUploading$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });

  describe('uploadAttachmentsSuccess$', () => {
    test(
      'should dispatch upload attachments success',
      marbles((m) => {
        const attachments: QuotationAttachment[] = [];
        const action = ActiveCaseActions.uploadAttachmentsSuccess({
          attachments,
        });
        const expected = m.cold('b', {
          b: action,
        });

        actions$ = m.hot('a', { a: action });

        m.expect(facade.uploadAttachmentsSuccess$).toBeObservable(
          expected as any
        );
      })
    );
  });

  describe('quotationAttachments$', () => {
    test('should select quotation attachments', () => {
      const attachments: QuotationAttachment[] = [
        { filename: 'test' } as unknown as QuotationAttachment,
      ];
      mockStore.overrideSelector(
        activeCaseFeature.selectAttachments,
        attachments
      );

      facade.quotationAttachments$.subscribe((result) => {
        expect(result).toBe(attachments);
      });
    });
  });

  describe('attachmentsLoading$', () => {
    test(
      'should select attachments loading',
      marbles((m) => {
        mockStore.overrideSelector(
          activeCaseFeature.selectAttachmentsLoading,
          true
        );
        m.expect(facade.attachmentsLoading$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });

  describe('attachmentsGettingSuccess$', () => {
    test(
      'should dispatch get all attachments success',
      marbles((m) => {
        const attachments: QuotationAttachment[] = [];
        const action = ActiveCaseActions.getAllAttachmentsSuccess({
          attachments,
        });
        const expected = m.cold('b', {
          b: action,
        });

        actions$ = m.hot('a', { a: action });

        m.expect(facade.attachmentsGettingSuccess$).toBeObservable(
          expected as any
        );
      })
    );
  });

  describe('quotationHasFNumberMaterials$', () => {
    test(
      'should select quotationHasF-numbers',
      marbles((m) => {
        mockStore.overrideSelector(getQuotationHasFNumberMaterials, true);
        m.expect(facade.quotationHasFNumberMaterials$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });

  describe('quotationHasRFQMaterials$', () => {
    test(
      'should select quotationHasF-numbers',
      marbles((m) => {
        mockStore.overrideSelector(getQuotationHasRfqMaterials, true);
        m.expect(facade.quotationHasFNumberMaterials$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });

  describe('quotationDetailIsFNumber$', () => {
    test(
      'should getQuotationDetailIsFNumber',
      marbles((m) => {
        mockStore.overrideSelector(getQuotationDetailIsFNumber, true);
        m.expect(facade.quotationDetailIsFNumber$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });

  describe('loadingErrorMessage$', () => {
    test(
      'should select loading error message',
      marbles((m) => {
        const errorMessage = 'error';
        mockStore.overrideSelector(
          activeCaseFeature.selectQuotationLoadingErrorMessage,
          errorMessage
        );

        m.expect(facade.loadingErrorMessage$).toBeObservable(
          m.cold('a', { a: errorMessage })
        );
      })
    );
  });

  describe('quotationLoading$', () => {
    test(
      'should select quotation loading',
      marbles((m) => {
        mockStore.overrideSelector(
          activeCaseFeature.selectQuotationLoading,
          true
        );

        m.expect(facade.quotationLoading$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });

  describe('customerLoading$', () => {
    test(
      'should select customer loading',
      marbles((m) => {
        mockStore.overrideSelector(
          activeCaseFeature.selectCustomerLoading,
          true
        );

        m.expect(facade.customerLoading$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });
  describe('quotationStatus$', () => {
    test(
      'should select quotation status',
      marbles((m) => {
        mockStore.overrideSelector(getQuotationStatus, QuotationStatus.ACTIVE);

        m.expect(facade.quotationStatus$).toBeObservable(
          m.cold('a', { a: QuotationStatus.ACTIVE })
        );
      })
    );
  });

  describe('quotationSapSyncStatus$', () => {
    test(
      'should select quotation SAP sync status',
      marbles((m) => {
        mockStore.overrideSelector(
          getQuotationSapSyncStatus,
          SAP_SYNC_STATUS.SYNCED
        );

        m.expect(facade.quotationSapSyncStatus$).toBeObservable(
          m.cold('a', { a: SAP_SYNC_STATUS.SYNCED })
        );
      })
    );
  });

  describe('canEditQuotation$', () => {
    test(
      'should select if quotation can be edited and return false',
      marbles((m) => {
        mockStore.overrideSelector(getQuotationStatus, QuotationStatus.ACTIVE);
        mockStore.overrideSelector(
          getQuotationSapSyncStatus,
          SAP_SYNC_STATUS.SYNC_PENDING
        );

        m.expect(facade.canEditQuotation$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );
    test(
      'should select if quotation can be edited and return true',
      marbles((m) => {
        mockStore.overrideSelector(getQuotationStatus, QuotationStatus.ACTIVE);
        mockStore.overrideSelector(
          getQuotationSapSyncStatus,
          SAP_SYNC_STATUS.SYNCED
        );

        m.expect(facade.canEditQuotation$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });

  describe('isSapSyncPending$', () => {
    test(
      'should select if SAP sync is pending',
      marbles((m) => {
        mockStore.overrideSelector(
          getQuotationSapSyncStatus,
          SAP_SYNC_STATUS.SYNC_PENDING
        );
        m.expect(facade.isSapSyncPending$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });

  describe('coefficients$', () => {
    test(
      'should select coefficients',
      marbles((m) => {
        const coefficients = {} as any;
        mockStore.overrideSelector(getCoefficients, coefficients);

        m.expect(facade.coefficients$).toBeObservable(
          m.cold('a', { a: coefficients })
        );
      })
    );
  });

  describe('shipToPartySalesOrgs$', () => {
    test(
      'should select ship to party sales orgs',
      marbles((m) => {
        const salesOrgs = [] as any;
        mockStore.overrideSelector(getSalesOrgsOfShipToParty, salesOrgs);

        m.expect(facade.shipToPartySalesOrgs$).toBeObservable(
          m.cold('a', { a: salesOrgs })
        );
      })
    );
  });

  // TODO: use tests again when GQUOTE-5888 is done
  // describe('tabsForProcessCaseView$', () => {
  //   test(
  //     'should select tabs for process case view',
  //     marbles((m) => {
  //       jest.resetAllMocks();
  //       const tabs = [
  //         {
  //           label: 'processCaseView.tabs.singleQuotes.title',
  //           link: 'single-quotes',
  //           parentPath: 'process-case',
  //           sortOrder: 2,
  //         },
  //         {
  //           label: 'processCaseView.tabs.customerDetails.title',
  //           link: 'customer-details',
  //           parentPath: 'process-case',
  //           sortOrder: 4,
  //         },
  //       ] as any;
  //       mockStore.overrideSelector(activeCaseFeature.hasOpenItems, false);
  //       mockStore.overrideSelector(getTabsForProcessCaseView(), tabs);

  //       m.expect(facade.tabsForProcessCaseView$).toBeObservable(
  //         m.cold('a', { a: tabs })
  //       );
  //     })
  //   );
  // });

  describe('tagType$', () => {
    test(
      'should select tag type',
      marbles((m) => {
        const tagType = TagType.INFO;
        const quotation: Quotation = {
          status: QuotationStatus.ACTIVE,
        } as Quotation;
        const sapSyncStatus = SAP_SYNC_STATUS.SYNCED;
        mockStore.overrideSelector(
          activeCaseFeature.selectQuotation,
          quotation
        );
        mockStore.overrideSelector(getQuotationSapSyncStatus, sapSyncStatus);

        m.expect(facade.tagType$).toBeObservable(m.cold('a', { a: tagType }));
      })
    );
  });

  describe('should provide from MaterialStockFacade', () => {
    test(
      'should provide materialStockLoading$',
      marbles((m) => {
        m.expect(facade.materialStockLoading$).toBeObservable(
          m.cold('(a|)', { a: false })
        );
      })
    );
    test(
      'should provide materialStock$',
      marbles((m) => {
        m.expect(facade.materialStock$).toBeObservable(
          m.cold('(a|)', { a: {} as any })
        );
      })
    );
  });

  describe('provide from MaterialCostDetailsFacade', () => {
    test(
      'should provide materialCostUpdateAvl$',
      marbles((m) => {
        m.expect(facade.materialCostUpdateAvl$).toBeObservable(
          m.cold('(a|)', { a: true })
        );
      })
    );
  });
  describe('provide from MaterialComparableCostsFacade', () => {
    test(
      'should provide materialComparableCostsLoading$',
      marbles((m) => {
        m.expect(facade.materialComparableCostsLoading$).toBeObservable(
          m.cold('(a|)', { a: false })
        );
      })
    );
    test(
      'should provide materialComparableCosts$',
      marbles((m) => {
        m.expect(facade.materialComparableCosts$).toBeObservable(
          m.cold('(a|)', { a: [] })
        );
      })
    );
  });

  describe('provide from MaterialSalesOrgFacade', () => {
    test(
      'should provide materialSalesOrgLoading$',
      marbles((m) => {
        m.expect(facade.materialSalesOrgLoading$).toBeObservable(
          m.cold('(a|)', { a: false })
        );
      })
    );
    test(
      'should provide materialSalesOrg$',
      marbles((m) => {
        m.expect(facade.materialSalesOrg$).toBeObservable(
          m.cold('(a|)', { a: {} as any })
        );
      })
    );
    test(
      'should provide materialSalesOrgDataAvailable$',
      marbles((m) => {
        m.expect(facade.materialSalesOrgDataAvailable$).toBeObservable(
          m.cold('(a|)', { a: false })
        );
      })
    );
  });

  describe('provide from PlantMaterialDetailsFacade', () => {
    test(
      'should provide plantMaterialDetailsLoading$',
      marbles((m) => {
        m.expect(facade.plantMaterialDetailsLoading$).toBeObservable(
          m.cold('(a|)', { a: false })
        );
      })
    );
    test(
      'should provide plantMaterialDetails$',
      marbles((m) => {
        m.expect(facade.plantMaterialDetails$).toBeObservable(
          m.cold('(a|)', { a: [] })
        );
      })
    );
  });

  describe('provide from SapPriceDetailsFacade', () => {
    test(
      'should provide sapPriceDetailsLoading$',
      marbles((m) => {
        m.expect(facade.sapPriceDetailsLoading$).toBeObservable(
          m.cold('(a|)', { a: false })
        );
      })
    );
    test(
      'should provide sapPriceDetails$',
      marbles((m) => {
        m.expect(facade.sapPriceDetails$).toBeObservable(
          m.cold('(a|)', { a: [] })
        );
      })
    );
  });

  // ############################# methods testing ##############################
  describe('selectQuotationDetail', () => {
    test('should dispatch select quotation detail', () => {
      const gqPositionId = '132';
      const action = ActiveCaseActions.selectQuotationDetail({ gqPositionId });
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.selectQuotationDetail(gqPositionId);

      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('deselectQuotationDetail', () => {
    test('should dispatch deselect quotation detail', () => {
      const gqPositionId = '132';
      const action = ActiveCaseActions.deselectQuotationDetail({
        gqPositionId,
      });
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.deselectQuotationDetail(gqPositionId);

      expect(spy).toHaveBeenCalledWith(action);
    });
  });
  describe('updateCosts', () => {
    test('should dispatch update costs', () => {
      const gqPosId = '123';
      const action = ActiveCaseActions.updateCosts({ gqPosId });
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.updateCosts(gqPosId);

      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('uploadAttachments', () => {
    test('should dispatch upload attachments', () => {
      const files = [new File([], 'file')];
      const action = ActiveCaseActions.uploadAttachments({ files });
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.uploadAttachments(files);

      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('updateRfqInformation', () => {
    test('should dispatch updateRFQInformation', () => {
      const gqPosId = '123';
      const action = ActiveCaseActions.updateRFQInformation({ gqPosId });
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.updateRfqInformation(gqPosId);

      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('resetSimulatedQuotation', () => {
    test('should dispatch resetSimulatedQuotation', () => {
      const action = ActiveCaseActions.resetSimulatedQuotation();
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.resetSimulatedQuotation();

      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('calculateSimulatedQuotation', () => {
    test('should dispatch calculateSimulatedQuotation', () => {
      const gqId = 123;
      const quotationDetails: QuotationDetail[] = [];
      const simulatedField = {} as ColumnFields;

      const action = ActiveCaseActions.calculateSimulatedQuotation({
        gqId,
        simulatedQuotationDetails: quotationDetails,
        simulatedField,
        selectedQuotationDetails: [],
      });
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.addSimulatedQuotation(gqId, quotationDetails, simulatedField, []);

      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('getAllAttachments', () => {
    test('should dispatch get all attachments', () => {
      const action = ActiveCaseActions.getAllAttachments();
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.getAllAttachments();

      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('downloadAttachment', () => {
    test('should dispatch download attachment', () => {
      const attachment: QuotationAttachment = {
        gqId: 123,
        sapId: '456',
        folderName: 'folder',
        uploadedAt: '2020-01-01',
        uploadedBy: 'user',
        fileName: 'test.jpg',
      };
      const action = ActiveCaseActions.downloadAttachment({ attachment });
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.downloadAttachment(attachment);

      expect(spy).toHaveBeenCalledWith(action);
    });
  });
  describe('deleteAttachment', () => {
    test('should dispatch delete attachment', () => {
      const attachment: QuotationAttachment = {
        gqId: 123,
        sapId: '456',
        folderName: 'folder',
        uploadedAt: '2020-01-01',
        uploadedBy: 'user',
        fileName: 'test.jpg',
      };
      const action = ActiveCaseActions.deleteAttachment({ attachment });
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.deleteAttachment(attachment);

      expect(spy).toHaveBeenCalledWith(action);
    });
  });
  describe('updateQuotation', () => {
    test('should dispatch update quotation', () => {
      const updateQuotationRequest = {
        gqId: 123,
        quotation: {},
      } as UpdateQuotationRequest;
      const action = ActiveCaseActions.updateQuotation(updateQuotationRequest);
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.updateQuotation(updateQuotationRequest);

      expect(spy).toHaveBeenCalledWith(action);
    });
  });
  describe('updateQuotationDetails', () => {
    test('should dispatch update quotation details', () => {
      const updateQuotationDetailList = [
        {
          gqPositionId: '123',
          priceSource: 'GQ',
          price: 100,
        } as UpdateQuotationDetail,
      ];
      const action = ActiveCaseActions.updateQuotationDetails({
        updateQuotationDetailList,
      });
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.updateQuotationDetails(updateQuotationDetailList);

      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('uploadSelectionToSap', () => {
    test('should dispatch upload selection to SAP', () => {
      const gqPositionIds = ['123'];
      const action = ActiveCaseActions.uploadSelectionToSap({ gqPositionIds });
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.uploadSelectionToSap(gqPositionIds);

      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('removePositionsFromQuotation', () => {
    test('should dispatch remove positions from quotation', () => {
      const gqPositionIds = ['123'];
      const action = ActiveCaseActions.removePositionsFromQuotation({
        gqPositionIds,
      });
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.removePositionsFromQuotation(gqPositionIds);

      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('refreshSapPricing', () => {
    test('should dispatch refresh SAP pricing', () => {
      const action = ActiveCaseActions.refreshSapPricing();
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.refreshSapPricing();

      expect(spy).toHaveBeenCalledWith(action);
    });
  });
  describe('confirmSimulatedQuotation', () => {
    test('should dispatch confirm simulated quotation', () => {
      const action = ActiveCaseActions.confirmSimulatedQuotation();
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.confirmSimulatedQuotation();

      expect(spy).toHaveBeenCalledWith(action);
    });
  });
  describe('resetEditCaseSettings', () => {
    test('should dispatch all actions to reset edit case settings', () => {
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.resetEditCaseSettings();

      expect(spy).toHaveBeenCalledWith(resetAllAutocompleteOptions());
      expect(spy).toHaveBeenCalledWith(clearShipToParty());
      expect(spy).toHaveBeenCalledWith(clearSectorGpsd());
      expect(spy).toHaveBeenCalledWith(clearPurchaseOrderType());
      expect(spy).toHaveBeenCalledWith(clearOfferType());
      expect(facade['sectorGpsdFacade'].resetAllSectorGpsds).toHaveBeenCalled();
      expect(
        facade['shipToPartyFacade'].resetAllShipToParties
      ).toHaveBeenCalled();
    });
  });
});
