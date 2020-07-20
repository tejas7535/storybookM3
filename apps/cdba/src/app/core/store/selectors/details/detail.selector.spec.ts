import {
  CUSTOMER_DETAILS_MOCK,
  DIMENSION_AND_WEIGHT_DETAILS_MOCK,
  PRICE_DETAILS_MOCK,
  PRODUCTION_DETAILS_MOCK,
  QUANTITIES_DETAILS_MOCK,
  REFRENCE_TYPE_MOCK,
  SALES_DETAILS_MOCK,
} from '../../../../../testing/mocks';
import {
  DetailState,
  initialState,
} from '../../reducers/detail/detail.reducer';
import {
  getCustomerDetails,
  getDimensionAndWeightDetails,
  getPriceDetails,
  getProductionDetails,
  getQuantitiesDetails,
  getReferenceType,
  getReferenceTypeLoading,
  getSalesDetails,
} from './detail.selector';

describe('Detail Selector', () => {
  const fakeState: { detail: DetailState } = {
    detail: {
      ...initialState,
      detail: {
        ...initialState.detail,
        loading: true,
        referenceType: REFRENCE_TYPE_MOCK,
      },
    },
  };

  const initialDetailState: { detail: DetailState } = {
    detail: initialState,
  };

  describe('getReferenceType', () => {
    test('should return referenceType', () => {
      expect(getReferenceType(fakeState)).toEqual(
        fakeState.detail.detail.referenceType
      );
    });

    test('should return undefined', () => {
      expect(getReferenceType(initialDetailState)).toBeUndefined();
    });
  });

  describe('getReferenceTypeLoading', () => {
    test('should return true', () => {
      expect(getReferenceTypeLoading(fakeState)).toBeTruthy();
    });

    test('should return false', () => {
      expect(getReferenceTypeLoading(initialDetailState)).toBeFalsy();
    });
  });

  describe('getSalesDetails', () => {
    test('should return sales details', () => {
      expect(getSalesDetails(fakeState)).toEqual(SALES_DETAILS_MOCK);
    });

    test('should return undefined', () => {
      expect(getSalesDetails(initialDetailState)).toBeUndefined();
    });
  });

  describe('getPriceDetails', () => {
    test('should return price details', () => {
      expect(getPriceDetails(fakeState)).toEqual(PRICE_DETAILS_MOCK);
    });

    test('should return undefined', () => {
      expect(getPriceDetails(initialDetailState)).toBeUndefined();
    });
  });

  describe('getDimensionAndWeightDetails', () => {
    test('should return dimension and weight details', () => {
      expect(getDimensionAndWeightDetails(fakeState)).toEqual(
        DIMENSION_AND_WEIGHT_DETAILS_MOCK
      );
    });

    test('should return undefined', () => {
      expect(getDimensionAndWeightDetails(initialDetailState)).toBeUndefined();
    });
  });

  describe('getCustomerDetails', () => {
    test('should return dimension and weight details', () => {
      expect(getCustomerDetails(fakeState)).toEqual(CUSTOMER_DETAILS_MOCK);
    });

    test('should return undefined', () => {
      expect(getCustomerDetails(initialDetailState)).toBeUndefined();
    });
  });

  describe('getQuantitiesDetails', () => {
    test('should return dimension and weight details', () => {
      expect(getQuantitiesDetails(fakeState)).toEqual(QUANTITIES_DETAILS_MOCK);
    });

    test('should return undefined', () => {
      expect(getQuantitiesDetails(initialDetailState)).toBeUndefined();
    });
  });

  describe('getQuantitiesDetails', () => {
    test('should return dimension and weight details', () => {
      expect(getProductionDetails(fakeState)).toEqual(PRODUCTION_DETAILS_MOCK);
    });

    test('should return undefined', () => {
      expect(getProductionDetails(initialDetailState)).toBeUndefined();
    });
  });
});
