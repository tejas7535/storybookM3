import { Customer } from '@gq/shared/models';

import {
  CUSTOMER_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../../testing/mocks';
import { ActiveCaseState } from '../active-case';
import { initialState, ProcessCaseState } from './process-case.reducer';
import * as quotationSelectors from './process-case.selectors';

describe('Process Case Selector', () => {
  const fakeState = {
    processCase: {
      ...initialState,
      addMaterialRowData: initialState.addMaterialRowData,
      validationLoading: false,
    },
    activeCase: {
      customer: {} as unknown as Customer,
    },
  };

  describe('getAddMaterialRowData', () => {
    test('should return add addMaterial row data', () => {
      expect(
        quotationSelectors.getAddMaterialRowData.projector(
          fakeState.processCase,
          fakeState.activeCase.customer
        )
      ).toEqual(fakeState.processCase.addMaterialRowData);
    });
  });
  describe('getAddQuotationDetailsRequest', () => {
    test('should return a AddQuotationDetailsRequest', () => {
      const processCaseStateFake = { ...fakeState.processCase };
      const activeCaseStateFake = {
        quotationIdentifier: {
          gqId: 123,
          customerNumber: '12345',
          salesOrg: '0267',
        },
      } as unknown as ActiveCaseState;
      expect(
        quotationSelectors.getAddQuotationDetailsRequest.projector(
          processCaseStateFake,
          activeCaseStateFake
        )
      ).toEqual({
        gqId: activeCaseStateFake.quotationIdentifier.gqId,
        items: [],
      });
    });

    test('should return a AddQuotationDetailsRequest for string quantity', () => {
      const processCaseStateFake = {
        ...initialState,
        addMaterialRowData: [
          {
            materialNumber: '123456',
            quantity: '200',
          },
        ],
      } as unknown as ProcessCaseState;
      const activeCaseStateFake = {
        customer: CUSTOMER_MOCK,
        customerLoading: true,
        quotation: QUOTATION_MOCK,
        quotationLoading: true,
        quotationIdentifier: { gqId: 123 },
      } as unknown as ActiveCaseState;

      expect(
        quotationSelectors.getAddQuotationDetailsRequest.projector(
          processCaseStateFake,
          activeCaseStateFake
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
      };
      expect(
        quotationSelectors.getAddMaterialRowDataValid.projector(
          mockState.processCase as unknown as ProcessCaseState
        )
      ).toBeTruthy();
    });
  });
});
