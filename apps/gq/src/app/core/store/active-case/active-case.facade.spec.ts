import { of } from 'rxjs';

import {
  DetailViewQueryParams,
  QuotationAttachment,
  QuotationDetail,
  QuotationStatus,
  SAP_SYNC_STATUS,
} from '@gq/shared/models';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { createSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { MaterialCostDetailsFacade } from '../facades';
import { MaterialComparableCostsFacade } from '../facades/material-comparable-costs.facade';
import { MaterialSalesOrgFacade } from '../facades/material-sales-org.facade';
import { MaterialStockFacade } from '../facades/material-stock.facade';
import { PlantMaterialDetailsFacade } from '../facades/plant-material-details.facade';
import { SapPriceDetailsFacade } from '../facades/sap-price-details.facade';
import { TransactionsFacade } from '../facades/transactions.facade';
import { ActiveCaseActions } from './active-case.action';
import { ActiveCaseFacade } from './active-case.facade';
import { activeCaseFeature } from './active-case.reducer';
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
import * as fromActiveCaseSelectors from './active-case.selectors';
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

  describe('attachmentsGetting$', () => {
    test(
      'should select attachments getting',
      marbles((m) => {
        mockStore.overrideSelector(
          activeCaseFeature.selectAttachmentsGetting,
          true
        );
        m.expect(facade.attachmentsGetting$).toBeObservable(
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

  describe('provide from TransactionsFacade', () => {
    test(
      'should provide transactionsLoading$',
      marbles((m) => {
        m.expect(facade.transactionsLoading$).toBeObservable(
          m.cold('(a|)', { a: false })
        );
      })
    );
    test(
      'should provide transactions$',
      marbles((m) => {
        m.expect(facade.transactions$).toBeObservable(
          m.cold('(a|)', { a: [] })
        );
      })
    );
    test(
      'should provide graphTransactions$',
      marbles((m) => {
        m.expect(facade.graphTransactions$).toBeObservable(
          m.cold('(a|)', { a: [] })
        );
      })
    );
  });

  // ############################# methods testing ##############################
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
});
