import { QUOTATION_MOCK } from '../../../../../testing/mocks';
import { initialState } from '../../reducers/view-cases/view-cases.reducer';
import * as viewCasesSelectors from './view-cases.selector';

describe('View Cases Selector', () => {
  const fakeState = {
    viewCases: {
      ...initialState,
      quotationsLoading: false,
      quotations: [QUOTATION_MOCK],
      deleteLoading: false,
    },
  };

  describe('getQuotations', () => {
    test('should return quotations', () => {
      expect(
        viewCasesSelectors.getQuotations.projector(fakeState.viewCases)
      ).toEqual(fakeState.viewCases.quotations);
    });
  });

  describe('isQuotationsLoading', () => {
    test('should return false', () => {
      expect(
        viewCasesSelectors.isQuotationsLoading.projector(fakeState)
      ).toBeFalsy();
    });
  });

  describe('isDeleteLoading', () => {
    test('should return false', () => {
      expect(
        viewCasesSelectors.isDeleteLoading.projector(fakeState)
      ).toBeFalsy();
    });
  });
});
