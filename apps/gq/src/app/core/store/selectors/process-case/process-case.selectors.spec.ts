import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../../../../../testing/mocks';
import { dummyRowData } from '../../reducers/create-case/config/dummy-row-data';
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
        quotationLoading: true,
      },
      addMaterials: {
        ...initialState.addMaterials,
        addMaterialRowData: [dummyRowData],
        validationLoading: false,
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

  describe('getOffer', () => {
    test('should return true if quotation is currently loading', () => {
      expect(
        quotationSelectors.getOffer.projector(fakeState.processCase)
      ).toBeTruthy();
    });
    test('should return empty array if quotation is undefined', () => {
      const mockState = {
        ...fakeState,
        processCase: {
          ...fakeState.processCase,
          quotation: {
            ...fakeState.processCase.quotation,
            item: undefined as any,
          },
        },
      };
      expect(
        quotationSelectors.getOffer.projector(mockState.processCase)
      ).toBeTruthy();
    });
  });

  describe('getSapId ', () => {
    test('should return a sap id', () => {
      expect(
        quotationSelectors.getSapId.projector(fakeState.processCase)
      ).toEqual(fakeState.processCase.quotation.item.sapId);
    });
  });

  describe(' getAddQuotationDetailsRequest', () => {
    test('should return a AddQuotationDetailsRequest', () => {
      expect(
        quotationSelectors.getAddQuotationDetailsRequest.projector(
          fakeState.processCase
        )
      ).toEqual({
        gqId: undefined,
        items: [{ materialId: '0167187...', quantity: 123 }],
      });
    });

    test('should return a AddQuotationDetailsRequest', () => {
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
        items: [{ materialId: '123456', quantity: 200 }],
      });
    });
  });

  describe('getRemoveQuotationDetailsRequest ', () => {
    test('should return a removeQuotationDetailsIds', () => {
      expect(
        quotationSelectors.getRemoveQuotationDetailsRequest.projector(
          fakeState.processCase
        )
      ).toEqual(fakeState.processCase.addMaterials.removeQuotationDetailsIds);
    });
  });

  describe('getAddMaterialRowDataValid ', () => {
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

  describe('getUpdateQuotationDetails ', () => {
    test('should return a updateDetails', () => {
      expect(
        quotationSelectors.getUpdateQuotationDetails.projector(
          fakeState.processCase
        )
      ).toEqual(fakeState.processCase.quotation.updateDetails);
    });
  });
});
