import { AppRoutePath } from '@gq/app-route-path.enum';
import { ProcessCaseRoutePath } from '@gq/process-case-view/process-case-route-path.enum';
import { Quotation, QuotationDetail, SAP_SYNC_STATUS } from '@gq/shared/models';
import { ProductType } from '@gq/shared/models/quotation-detail/material/';
import { QuotationRfqData } from '@gq/shared/models/quotation-detail/rfq-data';
import { RecalculationReasons } from '@gq/shared/models/quotation-detail/sqv-check/recalculation-reasons.enum';

import { CUSTOMER_MOCK } from '../../../../testing/mocks';
import { QUOTATION_MOCK } from '../../../../testing/mocks/models/quotation';
import {
  QUOTATION_DETAIL_MOCK,
  SIMULATED_QUOTATION_MOCK,
} from '../../../../testing/mocks/models/quotation-detail/quotation-details.mock';
import { ActiveCaseState, initialState } from './active-case.reducer';
import * as activeCaseSelectors from './active-case.selectors';

describe('Active Case Selectors', () => {
  let fakeState: { activeCase: ActiveCaseState };

  beforeEach(() => {
    fakeState = {
      activeCase: {
        ...initialState,
        customer: CUSTOMER_MOCK,
        customerLoading: true,
        quotation: QUOTATION_MOCK,
        simulatedItem: SIMULATED_QUOTATION_MOCK,
        selectedQuotationDetail: QUOTATION_DETAIL_MOCK.gqPositionId,
        quotationLoading: true,
        selectedQuotationDetails: [] as string[],
        quotationIdentifier: {
          gqId: 123,
          customerNumber: '12345',
          salesOrg: '0267',
        },
      },
    };
  });

  describe('getSimulationModeEnabled', () => {
    test('should return true on existing simulatedQuotation', () => {
      expect(
        activeCaseSelectors.getSimulationModeEnabled(fakeState)
      ).toBeTruthy();
    });
    test('should return false on not existing simulatedQuotation', () => {
      expect(
        activeCaseSelectors.getSimulationModeEnabled({
          ...fakeState,
          activeCase: {
            simulatedItem: undefined,
          },
        })
      ).toBeFalsy();
    });
    test('should return false on empty simulatedDetails', () => {
      expect(
        activeCaseSelectors.getSimulationModeEnabled({
          ...fakeState,
          activeCase: {
            simulatedItem: { quotationDetails: [] },
          },
        })
      ).toBeFalsy();
    });
  });

  describe('getQuotationSapSyncStatus', () => {
    test('should return SYNCED', () => {
      const syncedState = {
        ...fakeState,
        activeCase: {
          ...fakeState.activeCase,
          quotation: {
            ...QUOTATION_MOCK,
            sapSyncStatus: SAP_SYNC_STATUS.SYNCED,
          },
        },
      };

      expect(
        activeCaseSelectors.getQuotationSapSyncStatus(syncedState)
      ).toEqual(SAP_SYNC_STATUS.SYNCED);
    });

    test('should return PARTIALLY_SYNCED', () => {
      const syncedState = {
        ...fakeState,
        activeCase: {
          ...fakeState.activeCase,
          quotation: {
            ...QUOTATION_MOCK,
            sapSyncStatus: SAP_SYNC_STATUS.PARTIALLY_SYNCED,
          },
        },
      };

      expect(
        activeCaseSelectors.getQuotationSapSyncStatus(syncedState)
      ).toEqual(SAP_SYNC_STATUS.PARTIALLY_SYNCED);
    });

    test('should return NOT_SYNCED', () => {
      const syncedState = {
        ...fakeState,
        activeCase: {
          ...fakeState.activeCase,
          quotation: { ...QUOTATION_MOCK },
        },
      };

      expect(
        activeCaseSelectors.getQuotationSapSyncStatus(syncedState)
      ).toEqual(SAP_SYNC_STATUS.NOT_SYNCED);
    });

    test('should return NOT_SYNCED if status is undefined', () => {
      const syncedState = {
        ...fakeState,
        activeCase: {
          ...fakeState.activeCase,
          quotation: { ...QUOTATION_MOCK },
          sapSyncStatus: undefined as unknown,
        },
      };

      expect(
        activeCaseSelectors.getQuotationSapSyncStatus(syncedState)
      ).toEqual(SAP_SYNC_STATUS.NOT_SYNCED);
    });
  });

  describe('getQuotationDetails', () => {
    test('should return quotation details', () => {
      expect(
        activeCaseSelectors.getQuotationDetails.projector(
          fakeState.activeCase.quotation
        )
      ).toEqual(fakeState.activeCase.quotation.quotationDetails);
    });

    test('should return undefined', () => {
      expect(
        activeCaseSelectors.getQuotationDetails.projector(
          {} as unknown as Quotation
        )
      ).toEqual(undefined);
    });
  });

  describe('getQuotationCurrency', () => {
    test('should return quotation currency', () => {
      expect(
        activeCaseSelectors.getQuotationCurrency.projector(
          fakeState.activeCase.quotation
        )
      ).toEqual(fakeState.activeCase.quotation.currency);
    });
  });

  describe('getQuotationStatus', () => {
    test('should return quotation status', () => {
      expect(
        activeCaseSelectors.getQuotationStatus.projector(
          fakeState.activeCase.quotation
        )
      ).toEqual(fakeState.activeCase.quotation.status);
    });
  });

  describe('getIsQuotationStatusActive', () => {
    test('should return if quotation status is active', () => {
      expect(
        activeCaseSelectors.getIsQuotationStatusActive.projector(
          fakeState.activeCase.quotation
        )
      ).toBeTruthy();
    });
  });

  describe('getGqId', () => {
    test('should return gqId', () => {
      expect(
        activeCaseSelectors.getGqId.projector(
          fakeState.activeCase.quotationIdentifier
        )
      ).toEqual(fakeState.activeCase.quotationIdentifier.gqId);
    });
  });
  describe('isManualCase', () => {
    test('should return if manual case', () => {
      expect(
        activeCaseSelectors.isManualCase.projector(
          fakeState.activeCase.quotation
        )
      ).toEqual(false);
    });
  });

  describe('getCoefficients', () => {
    test('should return coefficients', () => {
      expect(activeCaseSelectors.getCoefficients(fakeState)).toEqual({
        coefficient1: QUOTATION_DETAIL_MOCK.coefficient1,
        coefficient2: QUOTATION_DETAIL_MOCK.coefficient2,
      });
    });
  });

  describe('getSimulatedQuotationDetailByItemId', () => {
    test('should get simulated quotationby itemId', () => {
      expect(
        activeCaseSelectors.getSimulatedQuotationDetailByItemId(
          SIMULATED_QUOTATION_MOCK.gqId
        )(fakeState)
      ).toEqual(SIMULATED_QUOTATION_MOCK.quotationDetails[0]);
    });

    test('should return undefined if the quotation doesnt exist', () => {
      expect(
        activeCaseSelectors.getSimulatedQuotationDetailByItemId(1111)(fakeState)
      ).toEqual(undefined);
    });
  });

  describe('Grouped QuotationDetails', () => {
    const state = {
      ...fakeState,
      activeCase: {
        quotation: {
          quotationDetails: [
            {
              material: {
                gpsdGroupId: 'f01',
                productLineId: '11',
              },
            },
            {
              material: {
                gpsdGroupId: 'f02',
                productLineId: '11',
              },
            },
          ] as QuotationDetail[],
        },
      },
    };

    describe('getQuotationDetailsByGPSD', () => {
      test('Should return the grouped quotationDetails', () => {
        const expected = new Map([
          [
            'f01',
            [
              {
                material: {
                  gpsdGroupId: 'f01',
                  productLineId: '11',
                },
              },
            ],
          ],
          [
            'f02',
            [
              {
                material: {
                  gpsdGroupId: 'f02',
                  productLineId: '11',
                },
              },
            ],
          ],
        ]);
        expect(activeCaseSelectors.getQuotationDetailsByGPSD(state)).toEqual(
          expected
        );
      });
    });

    describe('getQuotationDetailsByPL', () => {
      test('Should return the grouped quotationDetails', () => {
        const expected = new Map([
          [
            '11',
            [
              {
                material: {
                  gpsdGroupId: 'f01',
                  productLineId: '11',
                },
              },
              {
                material: {
                  gpsdGroupId: 'f02',
                  productLineId: '11',
                },
              },
            ],
          ],
        ]);
        expect(activeCaseSelectors.getQuotationDetailsByPL(state)).toEqual(
          expected
        );
      });
    });
  });

  describe('getSapId', () => {
    test('should return a sap id', () => {
      expect(
        activeCaseSelectors.getSapId.projector(fakeState.activeCase.quotation)
      ).toEqual(fakeState.activeCase.quotation.sapId);
    });
    test('should return undefined', () => {
      const processCase = {
        quotation: {},
      };
      expect(
        activeCaseSelectors.getSapId.projector(
          processCase.quotation as unknown as Quotation
        )
      ).toEqual(undefined);
    });
  });

  describe('getTabsForProcessCaseView', () => {
    test('should return overViewPath', () => {
      const expected = [
        {
          label: 'processCaseView.tabs.overview.title',
          link: ProcessCaseRoutePath.OverviewPath,
          parentPath: AppRoutePath.ProcessCaseViewPath,
          sortOrder: 1,
        },
        {
          label: 'processCaseView.tabs.singleQuotes.title',
          link: ProcessCaseRoutePath.SingleQuotesPath,
          parentPath: AppRoutePath.ProcessCaseViewPath,
          sortOrder: 2,
        },
        {
          label: 'processCaseView.tabs.customerDetails.title',
          link: ProcessCaseRoutePath.CustomerDetailsPath,
          parentPath: AppRoutePath.ProcessCaseViewPath,
          sortOrder: 4,
        },
      ];
      expect(
        activeCaseSelectors.getTabsForProcessCaseView()(fakeState)
      ).toEqual(expected);
    });

    test('should not return overViewPath', () => {
      const expected = [
        {
          label: 'processCaseView.tabs.singleQuotes.title',
          link: ProcessCaseRoutePath.SingleQuotesPath,
          parentPath: AppRoutePath.ProcessCaseViewPath,
          sortOrder: 2,
        },
        {
          label: 'processCaseView.tabs.customerDetails.title',
          link: ProcessCaseRoutePath.CustomerDetailsPath,
          parentPath: AppRoutePath.ProcessCaseViewPath,
          sortOrder: 4,
        },
      ];
      fakeState.activeCase.customer.enabledForApprovalWorkflow = false;
      expect(
        activeCaseSelectors.getTabsForProcessCaseView()(fakeState)
      ).toEqual(expected);
    });
    test('should not return overViewPath for disabled feature', () => {
      const expected = [
        {
          label: 'processCaseView.tabs.singleQuotes.title',
          link: ProcessCaseRoutePath.SingleQuotesPath,
          parentPath: AppRoutePath.ProcessCaseViewPath,
          sortOrder: 2,
        },
        {
          label: 'processCaseView.tabs.customerDetails.title',
          link: ProcessCaseRoutePath.CustomerDetailsPath,
          parentPath: AppRoutePath.ProcessCaseViewPath,
          sortOrder: 4,
        },
      ];
      expect(
        activeCaseSelectors.getTabsForProcessCaseView()(fakeState)
      ).toEqual(expected);
    });

    test('should return the openItems Tab', () => {
      const state: { activeCase: ActiveCaseState } = {
        activeCase: {
          quotation: {
            quotationDetails: [
              {
                sqvCheck: {
                  status: RecalculationReasons.INVALID,
                },
              } as QuotationDetail,
            ],
          } as Quotation,
        } as ActiveCaseState,
      };

      const expected = [
        {
          label: 'processCaseView.tabs.singleQuotes.title',
          link: ProcessCaseRoutePath.SingleQuotesPath,
          parentPath: AppRoutePath.ProcessCaseViewPath,
          sortOrder: 2,
        },
        {
          label: 'processCaseView.tabs.openItems.title',
          link: ProcessCaseRoutePath.OpenItemsPath,
          parentPath: AppRoutePath.ProcessCaseViewPath,
          sortOrder: 3,
        },
        {
          label: 'processCaseView.tabs.customerDetails.title',
          link: ProcessCaseRoutePath.CustomerDetailsPath,
          parentPath: AppRoutePath.ProcessCaseViewPath,
          sortOrder: 4,
        },
      ];
      expect(activeCaseSelectors.getTabsForProcessCaseView()(state)).toEqual(
        expected
      );
    });
  });

  describe('getQuotationHasFNumberMaterials', () => {
    test('should return false if quotation has no QuotationDetails', () => {
      expect(
        activeCaseSelectors.getQuotationHasFNumberMaterials.projector([])
      ).toEqual(false);
    });
    test('should return false if quotation has no QuotationDetails with F-Numbers', () => {
      expect(
        activeCaseSelectors.getQuotationHasFNumberMaterials.projector([
          { material: { materialDescription: '1test' } } as QuotationDetail,
          { material: { materialDescription: 'test' } } as QuotationDetail,
        ])
      ).toEqual(false);
    });
    test('should return true if quotation  has f-number materials', () => {
      expect(
        activeCaseSelectors.getQuotationHasFNumberMaterials.projector([
          {
            material: {
              materialDescription: 'F-test',
              productType: ProductType.CRB,
            },
            fPricing: {
              referencePrice: 123,
            },
          } as QuotationDetail,
          { material: { materialDescription: 'test' } } as QuotationDetail,
        ])
      ).toEqual(true);
    });
    test('should return false if quotation  no f-number materials', () => {
      expect(
        activeCaseSelectors.getQuotationHasFNumberMaterials.projector([
          {
            material: {
              materialDescription: 'Z-test',
              productType: ProductType.TRB,
            },
          } as QuotationDetail,
          { material: { materialDescription: 'test' } } as QuotationDetail,
        ])
      ).toEqual(false);
    });
  });

  describe('getQuotationDetailIsFNumber', () => {
    test('should return false when quotationDetail is not F-Number Material', () => {
      expect(
        activeCaseSelectors.getQuotationDetailIsFNumber.projector(
          QUOTATION_DETAIL_MOCK
        )
      ).toEqual(false);
    });

    test('should return true when IS F-Number Material', () => {
      expect(
        activeCaseSelectors.getQuotationDetailIsFNumber.projector({
          ...QUOTATION_DETAIL_MOCK,
          material: {
            ...QUOTATION_DETAIL_MOCK.material,
            materialDescription: 'F-123',
            productType: ProductType.SRB,
          },
          fPricing: {
            referencePrice: 123,
            coefficient1: 1,
            coefficient2: 2,
          },
        })
      ).toEqual(true);
    });
  });

  describe('getQuotationHasRfqMaterials', () => {
    test('should return false if quotation has no QuotationDetails', () => {
      expect(
        activeCaseSelectors.getQuotationHasRfqMaterials.projector([])
      ).toEqual(false);
    });
    test('should return true if quotations has RFQ Materials', () => {
      expect(
        activeCaseSelectors.getQuotationHasRfqMaterials.projector([
          {
            rfqData: { rfqId: 1 } as unknown as QuotationRfqData,
          } as QuotationDetail,
          { material: { materialDescription: 'test' } } as QuotationDetail,
        ])
      ).toEqual(true);
    });

    test('should return false if quotations has no RFQ Materials', () => {
      expect(
        activeCaseSelectors.getQuotationHasRfqMaterials.projector([
          { material: { materialDescription: 'test' } } as QuotationDetail,
          { material: { materialDescription: 'test' } } as QuotationDetail,
        ])
      ).toEqual(false);
    });
  });
});
