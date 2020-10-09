import { initialState } from '../../reducers/create-case/create-case.reducer';
import * as createSelectors from './create-case.selector';

describe('Create Case Selector', () => {
  const fakeState = {
    case: {
      ...initialState,
      createCase: {
        ...initialState.createCase,
        autocompleteLoading: 'customer',
      },
    },
  };

  describe('getQuotation', () => {
    test('should return quotation', () => {
      expect(createSelectors.getQuotation.projector(fakeState.case)).toEqual(
        fakeState.case.createCase.quotation
      );
    });
  });
  describe('getCustomer', () => {
    test('should return customer', () => {
      expect(createSelectors.getCustomer.projector(fakeState.case)).toEqual(
        fakeState.case.createCase.customer
      );
    });
  });
  describe('getAutocompleteLoading', () => {
    test('should return true if autocomplete is currently loading', () => {
      expect(
        createSelectors.getAutocompleteLoading.projector(fakeState.case)
      ).toEqual('customer');
    });
  });
});
