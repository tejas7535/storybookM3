import {
  DIMENSION_AND_WEIGHT_DETAILS_MOCK,
  PRICE_DETAILS_MOCK,
  REFRENCE_TYPE_MOCK,
  SALES_DETAILS_MOCK,
} from '../../../../../testing/mocks';
import { initialState } from '../../reducers/detail/detail.reducer';
import {
  getDimensionAndWeightDetails,
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

  describe('getDimensionAndWeightDetails', () => {
    test('should return dimension and weight details', () => {
      const expected = DIMENSION_AND_WEIGHT_DETAILS_MOCK;
      expect(getDimensionAndWeightDetails(fakeState)).toEqual(expected);
    });
  });
});
