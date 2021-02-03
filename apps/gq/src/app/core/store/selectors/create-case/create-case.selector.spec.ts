import { FilterNames } from '../../../../shared/autocomplete-input/filter-names.enum';
import { IdValue, ValidationDescription } from '../../models';
import { initialState } from '../../reducers/create-case/create-case.reducer';
import * as createSelectors from './create-case.selector';

describe('Create Case Selector', () => {
  const salesOrgs = ['048', '651', '123'];
  const fakeState = {
    case: {
      ...initialState,
      createCase: {
        ...initialState.createCase,
        autocompleteLoading: FilterNames.CUSTOMER,
        autocompleteItems: [
          {
            filter: FilterNames.CUSTOMER,
            options: [new IdValue('1', '1', true)],
          },
          {
            filter: FilterNames.QUOTATION,
            options: [new IdValue('1', '1', true)],
          },
        ],
        customer: {
          ...initialState.createCase.customer,
          salesOrgs,
        },
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
          (elm) => elm.filter === FilterNames.QUOTATION
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
          (elm) => elm.filter === FilterNames.CUSTOMER
        )
      );
    });
  });
  describe('getmaterialNumber', () => {
    test('should return material number', () => {
      expect(
        createSelectors.getCaseMaterialNumber.projector(fakeState.case)
      ).toEqual(
        fakeState.case.createCase.autocompleteItems.find(
          (elm) => elm.filter === FilterNames.MATERIAL
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
  describe('getCreateCaseData', () => {
    test('should return data to create a case', () => {
      expect(
        createSelectors.getCreateCaseData.projector(fakeState.case)
      ).toBeTruthy();
    });
  });
  describe('getCreatedCase', () => {
    test('should return createdCase', () => {
      expect(createSelectors.getCreatedCase.projector(fakeState.case)).toEqual(
        undefined
      );
    });
  });
  describe('getSalesOrgs', () => {
    expect(createSelectors.getSalesOrgs.projector(fakeState.case)).toEqual(
      salesOrgs
    );
  });
});
