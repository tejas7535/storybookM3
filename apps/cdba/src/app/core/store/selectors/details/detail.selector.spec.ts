import { REFRENCE_TYPE_MOCK } from '../../../../../testing/mocks';
import { SALES_DETAILS_MOCK } from '../../../../../testing/mocks/sales-details.mock';
import { initialState } from '../../reducers/detail/detail.reducer';
import { getReferenceType, getSalesDetails } from './detail.selector';

describe('Detail Selector', () => {
  const fakeState = {
    detail: {
      ...initialState,
      detail: {
        ...initialState.detail,
        loading: false,
        referenceType: REFRENCE_TYPE_MOCK,
      },
    },
  };

  describe('getReferenceType', () => {
    test('should return referenceType', () => {
      expect(getReferenceType(fakeState)).toEqual(
        fakeState.detail.detail.referenceType
      );
    });
  });

  describe('getSalesDetails', () => {
    test('should return sales details', () => {
      const expected = SALES_DETAILS_MOCK;
      expect(getSalesDetails(fakeState)).toEqual(expected);
    });
  });
});
