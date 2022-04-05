import {
  CUSTOMER_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
  SIMULATED_QUOTATION_MOCK,
} from '../../../../../testing/mocks';
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
        quotationSelectors.isCustomerLoading.projector(fakeState.processCase)
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

  describe('getTableContextQuotation', () => {
    test('should get table context', () => {
      expect(
        quotationSelectors.getTableContextQuotation.projector(
          fakeState.processCase
        )
      ).toEqual({ quotation: fakeState.processCase.quotation.item });
    });
  });

  describe('getQuotationLoading', () => {
    test('should return true if quotation is currently loading', () => {
      expect(
        quotationSelectors.isQuotationLoading.projector(fakeState.processCase)
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
});
