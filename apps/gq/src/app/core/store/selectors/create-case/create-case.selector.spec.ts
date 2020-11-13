import { CreateCase, IdValue, ValidationDescription } from '../../models';
import { initialState } from '../../reducers/create-case/create-case.reducer';
import * as createSelectors from './create-case.selector';

describe('Create Case Selector', () => {
  const fakeState = {
    case: {
      ...initialState,
      createCase: {
        ...initialState.createCase,
        autocompleteLoading: 'customer',
        autocompleteItems: [
          { filter: 'customer', options: [new IdValue('1', '1', true)] },
          { filter: 'quotation', options: [new IdValue('1', '1', true)] },
        ],
        rowData: [
          {
            materialNumber: '1234',
            quantity: 20,
            info: {
              valid: true,
              description: ValidationDescription.Valid,
            },
          },
        ],
      },
    },
  };

  describe('getCaseQuotation', () => {
    test('should return quotation', () => {
      expect(
        createSelectors.getCaseQuotation.projector(fakeState.case)
      ).toEqual(
        fakeState.case.createCase.autocompleteItems.find(
          (elm) => elm.filter === 'quotation'
        )
      );
    });
  });
  describe('getSelectedQuotation', () => {
    test('should return quotation number', () => {
      expect(
        createSelectors.getSelectedQuotation.projector(fakeState.case)
      ).toBeTruthy();
    });
  });
  describe('getCustomer', () => {
    test('should return customer', () => {
      expect(createSelectors.getCaseCustomer.projector(fakeState.case)).toEqual(
        fakeState.case.createCase.autocompleteItems.find(
          (elm) => elm.filter === 'customer'
        )
      );
    });
  });
  describe('getmaterialNumber', () => {
    test('should return material number', () => {
      expect(
        createSelectors.getCaseMaterialnumber.projector(fakeState.case)
      ).toEqual(
        fakeState.case.createCase.autocompleteItems.find(
          (elm) => elm.filter === 'materialNumber'
        )
      );
    });
  });

  describe('getRowData', () => {
    test('should return row data', () => {
      expect(createSelectors.getCaseRowData.projector(fakeState.case)).toEqual(
        fakeState.case.createCase.rowData
      );
    });
  });

  describe('getAutocompleteLoading', () => {
    test('should return true if autocomplete is currently loading', () => {
      expect(
        createSelectors.getCaseAutocompleteLoading.projector(
          fakeState.case,
          'customer'
        )
      ).toBeTruthy();
    });
  });
  describe('getCustomerConditionsValid', () => {
    test('should return true if row Data Valid', () => {
      expect(
        createSelectors.getCustomerConditionsValid.projector(fakeState.case)
      ).toBeTruthy();
    });
  });
  describe('getCustomerConditionsValid', () => {
    test('should return data to create a case', () => {
      expect(
        createSelectors.getCreateCaseData.projector(fakeState.case)
      ).toBeTruthy();
    });
  });
  describe('getCreatedCase', () => {
    const createdCase: CreateCase = {
      customerId: fakeState.case.createCase.autocompleteItems[0].options[0].id,
      materialQuantities: [
        {
          materialId: fakeState.case.createCase.rowData[0].materialNumber,
          quantity: fakeState.case.createCase.rowData[0].quantity,
        },
      ],
    };
    test('should return createdCase', () => {
      expect(
        createSelectors.getCreateCaseData.projector(fakeState.case)
      ).toEqual(createdCase);
    });
  });
});
