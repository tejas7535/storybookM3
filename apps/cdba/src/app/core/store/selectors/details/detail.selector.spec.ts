import { REFRENCE_TYPE_MOCK } from '../../../../../testing/mocks';
import { PRICE_DETAILS_MOCK } from '../../../../../testing/mocks/price-details.mock';
import { SALES_DETAILS_MOCK } from '../../../../../testing/mocks/sales-details.mock';
import { initialState } from '../../reducers/detail/detail.reducer';
import {
  getPriceDetails,
  getReferenceType,
  getSalesDetails,
} from './detail.selector';

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

  describe('getPriceDetails', () => {
    test('should return price details', () => {
      const expected = PRICE_DETAILS_MOCK;
      expect(getPriceDetails(fakeState)).toEqual(expected);
    });
  });
});
