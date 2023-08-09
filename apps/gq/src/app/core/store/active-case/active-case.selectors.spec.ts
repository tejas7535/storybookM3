import { AppRoutePath } from '@gq/app-route-path.enum';
import { ProcessCaseRoutePath } from '@gq/process-case-view/process-case-route-path.enum';
import {
  Quotation,
  QuotationDetail,
  QuotationStatus,
  SAP_SYNC_STATUS,
} from '@gq/shared/models';
import * as pricingUtils from '@gq/shared/utils/pricing.utils';

import {
  CUSTOMER_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
  SIMULATED_QUOTATION_MOCK,
} from '../../../../testing/mocks';
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
          quotation: { ...QUOTATION_MOCK, sapSyncStatus: 1 },
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
          quotation: { ...QUOTATION_MOCK, sapSyncStatus: 2 },
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
          sapSyncStatus: 0,
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

  describe('getPriceUnitOfSelectedQuotationDetail', () => {
    test('should return price unit', () => {
      expect(
        activeCaseSelectors.getPriceUnitOfSelectedQuotationDetail(fakeState)
      ).toEqual(QUOTATION_DETAIL_MOCK.material.priceUnit);
    });
  });

  describe('getPriceUnitsForQuotationItemIds', () => {
    test('should return a list of PriceUnitsForQuotationItemId', () => {
      expect(
        activeCaseSelectors.getPriceUnitsForQuotationItemIds(fakeState)
      ).toEqual([
        {
          priceUnit: QUOTATION_DETAIL_MOCK.material.priceUnit,
          quotationItemId: QUOTATION_DETAIL_MOCK.quotationItemId,
        },
      ]);
    });
  });

  describe('getDetailViewQueryParams', () => {
    test('should return queryParams and id', () => {
      expect(activeCaseSelectors.getDetailViewQueryParams(fakeState)).toEqual({
        id: 1234,
        queryParams: {
          customer_number: CUSTOMER_MOCK.identifier.customerId,
          sales_org: CUSTOMER_MOCK.identifier.salesOrg,
          quotation_number: QUOTATION_MOCK.gqId,
          gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
        },
      });
    });
  });

  describe('getQuotationOverviewInformation', () => {
    test('should return the calculated pricing information of all quotation details', () => {
      jest.spyOn(pricingUtils, 'calculateStatusBarValues').mockReturnValue({
        gpi: 10,
        gpm: 10,
        netValue: 100,
        priceDiff: 0,
        rows: 0,
      });
      expect(
        activeCaseSelectors.getQuotationOverviewInformation(fakeState)
      ).toEqual({
        gpi: { value: 10 },
        gpm: { value: 10 },
        netValue: { value: 100 },
        avgGqRating: { value: 2 },
      });
      expect(true).toBeTruthy();
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

  describe('getSelectedQuotationDetail', () => {
    test('should return quotation detail', () => {
      expect(
        activeCaseSelectors.getSelectedQuotationDetail.projector(
          fakeState.activeCase.quotation,
          '5694232'
        )
      ).toEqual(fakeState.activeCase.quotation.quotationDetails[0]);
    });
    test('should return undefined', () => {
      expect(
        activeCaseSelectors.getSelectedQuotationDetail.projector(
          undefined,
          '5694232'
        )
      ).toEqual(undefined);
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

  describe('getIsQuotationActive', () => {
    [
      { status: QuotationStatus.ACTIVE, expectedResult: true },
      { status: QuotationStatus.ARCHIVED, expectedResult: false },
      { status: QuotationStatus.DELETED, expectedResult: false },
    ].forEach((testCase) => {
      test(`should return ${testCase.expectedResult} if Quotation has status ${testCase.status}`, () => {
        const activeState = {
          ...fakeState,
          activeCase: {
            ...fakeState.activeCase,
            quotation: {
              ...QUOTATION_MOCK,
              status: testCase.status,
            },
          },
        };

        expect(activeCaseSelectors.getIsQuotationActive(activeState)).toEqual(
          testCase.expectedResult
        );
      });
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
        },
        {
          label: 'processCaseView.tabs.singleQuotes.title',
          link: ProcessCaseRoutePath.SingleQuotesPath,
          parentPath: AppRoutePath.ProcessCaseViewPath,
        },
        {
          label: 'processCaseView.tabs.customerDetails.title',
          link: ProcessCaseRoutePath.CustomerDetailsPath,
          parentPath: AppRoutePath.ProcessCaseViewPath,
        },
      ];
      expect(
        activeCaseSelectors.getTabsForProcessCaseView(true)(fakeState)
      ).toEqual(expected);
    });

    test('should not return overViewPath', () => {
      const expected = [
        {
          label: 'processCaseView.tabs.singleQuotes.title',
          link: ProcessCaseRoutePath.SingleQuotesPath,
          parentPath: AppRoutePath.ProcessCaseViewPath,
        },
        {
          label: 'processCaseView.tabs.customerDetails.title',
          link: ProcessCaseRoutePath.CustomerDetailsPath,
          parentPath: AppRoutePath.ProcessCaseViewPath,
        },
      ];
      fakeState.activeCase.customer.enabledForApprovalWorkflow = false;
      expect(
        activeCaseSelectors.getTabsForProcessCaseView(true)(fakeState)
      ).toEqual(expected);
    });
    test('should not return overViewPath for disabled feature', () => {
      const expected = [
        {
          label: 'processCaseView.tabs.singleQuotes.title',
          link: ProcessCaseRoutePath.SingleQuotesPath,
          parentPath: AppRoutePath.ProcessCaseViewPath,
        },
        {
          label: 'processCaseView.tabs.customerDetails.title',
          link: ProcessCaseRoutePath.CustomerDetailsPath,
          parentPath: AppRoutePath.ProcessCaseViewPath,
        },
      ];
      expect(
        activeCaseSelectors.getTabsForProcessCaseView(false)(fakeState)
      ).toEqual(expected);
    });
  });
});
