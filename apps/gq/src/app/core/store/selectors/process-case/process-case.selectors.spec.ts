import { QuotationDetail } from '@gq/shared/models/quotation-detail';
import * as pricingUtils from '@gq/shared/utils/pricing.utils';

import {
  CUSTOMER_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
  SIMULATED_QUOTATION_MOCK,
} from '../../../../../testing/mocks';
import { QuotationStatus } from '../../../../shared/models';
import { SAP_SYNC_STATUS } from '../../../../shared/models/quotation-detail/sap-sync-status.enum';
import { initialState } from '../../reducers/process-case/process-case.reducer';
import * as quotationSelectors from './process-case.selectors';

describe('Process Case Selector', () => {
  const fakeState = {
    processCase: {
      ...initialState,
      customer: {
        ...initialState.customer,
        item: CUSTOMER_MOCK,
        customerLoading: true,
      },
      quotation: {
        ...initialState.quotation,
        item: QUOTATION_MOCK,
        simulatedItem: SIMULATED_QUOTATION_MOCK,
        selectedQuotationDetail: QUOTATION_DETAIL_MOCK.gqPositionId,
        quotationLoading: true,
        selectedQuotationDetails: [] as string[],
      },
      addMaterials: {
        ...initialState.addMaterials,
        addMaterialRowData: initialState.addMaterials.addMaterialRowData,
        validationLoading: false,
      },
      quotationIdentifier: {
        gqId: 123,
        customerNumber: '12345',
        salesOrg: '0267',
      },
    },
  };

  describe('getCustomer', () => {
    test('should return the customer details', () => {
      expect(
        quotationSelectors.getCustomer.projector(fakeState.processCase)
      ).toEqual(fakeState.processCase.customer.item);
    });
  });

  describe('getCustomerLoading', () => {
    test('should return true if customer details is currently loading', () => {
      expect(
        quotationSelectors.getCustomerLoading.projector(fakeState.processCase)
      ).toBeTruthy();
    });
  });

  describe('getQuotation', () => {
    test('should return all quotation details', () => {
      expect(
        quotationSelectors.getQuotation.projector(fakeState.processCase)
      ).toEqual(fakeState.processCase.quotation.item);
    });
  });

  describe('getQuotationCurrency', () => {
    test('should return all quotation details', () => {
      expect(
        quotationSelectors.getQuotationCurrency.projector(fakeState.processCase)
      ).toEqual(fakeState.processCase.quotation.item.currency);
    });
  });

  describe('getQuotationStatus', () => {
    test('should return quotation status', () => {
      expect(
        quotationSelectors.getQuotationStatus.projector(fakeState.processCase)
      ).toEqual(fakeState.processCase.quotation.item.status);
    });
  });

  describe('getIsQuotationStatusActive', () => {
    test('should return if quotation status is active', () => {
      expect(
        quotationSelectors.getIsQuotationStatusActive.projector(
          fakeState.processCase
        )
      ).toBeTruthy();
    });
  });

  describe('getTableContextQuotation', () => {
    test('should get table context', () => {
      expect(
        quotationSelectors.getTableContextQuotationForCustomerCurrency.projector(
          fakeState.processCase
        )
      ).toEqual({
        quotation: fakeState.processCase.quotation.item,
      });
    });
  });

  describe('getQuotationLoading', () => {
    test('should return true if quotation is currently loading', () => {
      expect(
        quotationSelectors.getCustomerLoading.projector(fakeState.processCase)
      ).toBeTruthy();
    });
  });

  describe('getSelectedQuotationIdentifier', () => {
    test('should return a quotation identifier', () => {
      expect(
        quotationSelectors.getSelectedQuotationIdentifier.projector(
          fakeState.processCase
        )
      ).toEqual(fakeState.processCase.quotationIdentifier);
    });
  });

  describe('getSapId', () => {
    test('should return a sap id', () => {
      expect(
        quotationSelectors.getSapId.projector(fakeState.processCase)
      ).toEqual(fakeState.processCase.quotation.item.sapId);
    });
    test('should return undefined', () => {
      const processCase = {
        quotation: {},
      };
      expect(quotationSelectors.getSapId.projector(processCase)).toEqual(
        undefined
      );
    });
  });
  describe('getAddMaterialRowData', () => {
    test('should return add addMaterial row data', () => {
      expect(
        quotationSelectors.getAddMaterialRowData.projector(
          fakeState.processCase
        )
      ).toEqual(fakeState.processCase.addMaterials.addMaterialRowData);
    });
  });
  describe('getAddQuotationDetailsRequest', () => {
    test('should return a AddQuotationDetailsRequest', () => {
      expect(
        quotationSelectors.getAddQuotationDetailsRequest.projector(
          fakeState.processCase
        )
      ).toEqual({
        gqId: fakeState.processCase.quotationIdentifier.gqId,
        items: [],
      });
    });

    test('should return a AddQuotationDetailsRequest for string quantity', () => {
      const mockState = {
        processCase: {
          ...initialState,
          customer: {
            ...initialState.customer,
            item: CUSTOMER_MOCK,
            customerLoading: true,
          },
          quotation: {
            ...initialState.quotation,
            item: QUOTATION_MOCK,
            quotationLoading: true,
          },
          quotationIdentifier: { gqId: 123 },
          addMaterials: {
            ...initialState.addMaterials,
            addMaterialRowData: [
              {
                materialNumber: '123456',
                quantity: '200',
              },
            ],
          },
        },
      };

      expect(
        quotationSelectors.getAddQuotationDetailsRequest.projector(
          mockState.processCase
        )
      ).toEqual({
        gqId: 123,
        items: [
          {
            materialId: '123456',
            quantity: 200,
            quotationItemId: QUOTATION_DETAIL_MOCK.quotationItemId + 10,
          },
        ],
      });
    });
  });

  describe('getRemoveQuotationDetailsRequest', () => {
    test('should return a removeQuotationDetailsIds', () => {
      expect(
        quotationSelectors.getRemoveQuotationDetailsRequest.projector(
          fakeState.processCase
        )
      ).toEqual(fakeState.processCase.addMaterials.removeQuotationDetailsIds);
    });
  });

  describe('getAddMaterialRowDataValid', () => {
    test('should return false', () => {
      expect(
        quotationSelectors.getAddMaterialRowDataValid.projector(
          fakeState.processCase
        )
      ).toBeFalsy();
    });

    test('should return true', () => {
      const mockState = {
        processCase: {
          ...initialState,
          addMaterials: {
            ...initialState.addMaterials,
            addMaterialRowData: [
              {
                materialNumber: '123465',
                quantity: 100,
                info: {
                  description: ['valid'],
                  valid: true,
                },
              },
            ],
          },
        },
      };
      expect(
        quotationSelectors.getAddMaterialRowDataValid.projector(
          mockState.processCase
        )
      ).toBeTruthy();
    });
  });

  describe('getQuotationDetailId', () => {
    test('should return id', () => {
      expect(
        quotationSelectors.getSelectedQuotationDetailId.projector(
          fakeState.processCase
        )
      ).toEqual(fakeState.processCase.quotation.selectedQuotationDetail);
    });
  });

  describe('getSelectedQuotationDetail', () => {
    test('should return quotationd detail', () => {
      expect(
        quotationSelectors.getSelectedQuotationDetail.projector(
          fakeState.processCase
        )
      ).toEqual(fakeState.processCase.quotation.item.quotationDetails[0]);
    });
    test('should return undefined', () => {
      const processCase = {
        quotation: {},
      };
      expect(
        quotationSelectors.getSelectedQuotationDetail.projector(processCase)
      ).toEqual(undefined);
    });
  });

  describe('getQuotationDetails', () => {
    test('should return quotation details', () => {
      expect(
        quotationSelectors.getQuotationDetails.projector(fakeState.processCase)
      ).toEqual(fakeState.processCase.quotation.item.quotationDetails);
    });

    test('should return undefined', () => {
      expect(
        quotationSelectors.getQuotationDetails.projector({
          quotation: {},
        })
      ).toEqual(undefined);
    });
  });

  describe('getCustomerCurrency', () => {
    test('should return customer currency', () => {
      expect(
        quotationSelectors.getCustomerCurrency.projector(fakeState.processCase)
      ).toEqual(fakeState.processCase.customer.item.currency);
    });
  });
  describe('getUpdateLoading', () => {
    test('should return updateLoading', () => {
      expect(
        quotationSelectors.getUpdateLoading.projector(fakeState.processCase)
      ).toEqual(fakeState.processCase.quotation.updateLoading);
    });
  });

  describe('getQuotationErrorMessage', () => {
    test('should return errorMessage', () => {
      expect(
        quotationSelectors.getQuotationErrorMessage.projector(
          fakeState.processCase
        )
      ).toEqual(fakeState.processCase.quotation.errorMessage);
    });
  });
  describe('getGqId', () => {
    test('should return gqId', () => {
      expect(
        quotationSelectors.getGqId.projector(fakeState.processCase)
      ).toEqual(fakeState.processCase.quotationIdentifier.gqId);
    });
  });
  describe('isManualCase', () => {
    test('should return if manual case', () => {
      expect(
        quotationSelectors.isManualCase.projector(fakeState.processCase)
      ).toEqual(false);
    });
  });
  describe('getMaterialOfSelectedQuotationDetail', () => {
    test('should return material', () => {
      expect(
        quotationSelectors.getMaterialOfSelectedQuotationDetail(fakeState)
      ).toEqual({
        materialNumber15: '016718798-0030',
        materialDescription: '6052-M-C3',
        priceUnit: 1,
      });
    });
  });
  describe('getPriceUnitOfSelectedQuotationDetail', () => {
    test('should return price unit', () => {
      expect(
        quotationSelectors.getPriceUnitOfSelectedQuotationDetail(fakeState)
      ).toEqual(QUOTATION_DETAIL_MOCK.material.priceUnit);
    });
  });

  describe('getPriceUnitsForQuotationItemIds', () => {
    test('should return a list of PriceUnitsForQuotationItemId', () => {
      expect(
        quotationSelectors.getPriceUnitsForQuotationItemIds(fakeState)
      ).toEqual([
        {
          priceUnit: QUOTATION_DETAIL_MOCK.material.priceUnit,
          quotationItemId: QUOTATION_DETAIL_MOCK.quotationItemId,
        },
      ]);
    });
  });

  describe('getCoefficients', () => {
    test('should return coefficients', () => {
      expect(quotationSelectors.getCoefficients(fakeState)).toEqual({
        coefficient1: QUOTATION_DETAIL_MOCK.coefficient1,
        coefficient2: QUOTATION_DETAIL_MOCK.coefficient2,
      });
    });
  });

  describe('getDetailViewQueryParams', () => {
    test('should return queryParams and id', () => {
      expect(quotationSelectors.getDetailViewQueryParams(fakeState)).toEqual({
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
  describe('getSelectedQuotationDetailItemId', () => {
    test('should return item id', () => {
      expect(
        quotationSelectors.getSelectedQuotationDetailItemId(fakeState)
      ).toEqual(1234);
    });
  });

  describe('getSimulatedQuotationDetailByItemId', () => {
    test('should get simulated quotationby itemId', () => {
      expect(
        quotationSelectors.getSimulatedQuotationDetailByItemId(
          SIMULATED_QUOTATION_MOCK.gqId
        )(fakeState)
      ).toEqual(SIMULATED_QUOTATION_MOCK.quotationDetails[0]);
    });

    test('should return undefined if the quotation doesnt exist', () => {
      expect(
        quotationSelectors.getSimulatedQuotationDetailByItemId(1111)(fakeState)
      ).toEqual(undefined);
    });
  });

  describe('getSimulatedQuotation', () => {
    test('should return simulatedQuotation', () => {
      expect(quotationSelectors.getSimulatedQuotation(fakeState)).toEqual(
        fakeState.processCase.quotation.simulatedItem
      );
    });
  });
  describe('getSimulationModeEnabled', () => {
    test('should return true on existing simulatedQuotation', () => {
      expect(
        quotationSelectors.getSimulationModeEnabled(fakeState)
      ).toBeTruthy();
    });
    test('should return false on not existing simulatedQuotation', () => {
      expect(
        quotationSelectors.getSimulationModeEnabled({
          ...fakeState,
          processCase: {
            quotation: {
              simulatedItem: undefined,
            },
          },
        })
      ).toBeFalsy();
    });
    test('should return false on empty simulatedDetails', () => {
      expect(
        quotationSelectors.getSimulationModeEnabled({
          ...fakeState,
          processCase: {
            quotation: {
              simulatedItem: { quotationDetails: [] },
            },
          },
        })
      ).toBeFalsy();
    });
  });
  describe('getSelectedQuotationDetailIds', () => {
    test('should return selected quotationDetailIds', () => {
      expect(
        quotationSelectors.getSelectedQuotationDetailIds(fakeState)
      ).toEqual(fakeState.processCase.quotation.selectedQuotationDetails);
    });
  });

  describe('getQuotationSapSyncStatus', () => {
    test('should return SYNCED', () => {
      const syncedState = {
        ...fakeState,
        processCase: {
          ...fakeState.processCase,
          quotation: {
            ...fakeState.processCase.quotation,
            item: { ...QUOTATION_MOCK, sapSyncStatus: 1 },
          },
        },
      };

      expect(quotationSelectors.getQuotationSapSyncStatus(syncedState)).toEqual(
        SAP_SYNC_STATUS.SYNCED
      );
    });

    test('should return PARTIALLY_SYNCED', () => {
      const syncedState = {
        ...fakeState,
        processCase: {
          ...fakeState.processCase,
          quotation: {
            ...fakeState.processCase.quotation,
            item: { ...QUOTATION_MOCK, sapSyncStatus: 2 },
          },
        },
      };

      expect(quotationSelectors.getQuotationSapSyncStatus(syncedState)).toEqual(
        SAP_SYNC_STATUS.PARTIALLY_SYNCED
      );
    });

    test('should return NOT_SYNCED', () => {
      const syncedState = {
        ...fakeState,
        processCase: {
          ...fakeState.processCase,
          quotation: {
            ...fakeState.processCase.quotation,
            item: {
              ...QUOTATION_MOCK,
              sapSyncStatus: 0,
            },
          },
        },
      };

      expect(quotationSelectors.getQuotationSapSyncStatus(syncedState)).toEqual(
        SAP_SYNC_STATUS.NOT_SYNCED
      );
    });

    test('should return NOT_SYNCED if status is undefined', () => {
      const syncedState = {
        ...fakeState,
        processCase: {
          ...fakeState.processCase,
          quotation: {
            ...fakeState.processCase.quotation,
            item: {
              ...QUOTATION_MOCK,
              sapSyncStatus: undefined as unknown,
            },
          },
        },
      };

      expect(quotationSelectors.getQuotationSapSyncStatus(syncedState)).toEqual(
        SAP_SYNC_STATUS.NOT_SYNCED
      );
    });
  });

  describe('getIsQuotationActive', () => {
    [
      { status: QuotationStatus.ACTIVE, expectedResult: true },
      { status: QuotationStatus.INACTIVE, expectedResult: false },
      { status: QuotationStatus.DELETED, expectedResult: false },
    ].forEach((testCase) => {
      test(`should return ${testCase.expectedResult} if Quotation has status ${testCase.status}`, () => {
        const activeState = {
          ...fakeState,
          processCase: {
            ...fakeState.processCase,
            quotation: {
              ...fakeState.processCase.quotation,
              item: {
                ...QUOTATION_MOCK,
                status: testCase.status,
              },
            },
          },
        };

        expect(quotationSelectors.getIsQuotationActive(activeState)).toEqual(
          testCase.expectedResult
        );
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
        quotationSelectors.getQuotationOverviewInformation(fakeState)
      ).toEqual({
        gpi: 10,
        gpm: 10,
        netValue: 100,
        avgGqRating: 2,
      });
      expect(true).toBeTruthy();
    });
  });

  describe('Grouped QuotationDetails', () => {
    const state = {
      ...fakeState,
      processCase: {
        quotation: {
          item: {
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
        expect(quotationSelectors.getQuotationDetailsByGPSD(state)).toEqual(
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
        expect(quotationSelectors.getQuotationDetailsByPL(state)).toEqual(
          expected
        );
      });
    });
  });
});
