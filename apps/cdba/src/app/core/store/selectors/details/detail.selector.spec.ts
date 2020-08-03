import {
  CALCULATIONS_TYPE_MOCK,
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
  getBomItems,
  getBomLoading,
  getCalculations,
  getCalculationsLoading,
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
      calculations: {
        ...initialState.calculations,
        loading: true,
        items: CALCULATIONS_TYPE_MOCK,
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
    test('should return customer details', () => {
      expect(getCustomerDetails(fakeState)).toEqual(CUSTOMER_DETAILS_MOCK);
    });

    test('should return undefined', () => {
      expect(getCustomerDetails(initialDetailState)).toBeUndefined();
    });
  });

  describe('getQuantitiesDetails', () => {
    test('should return quantities details', () => {
      expect(getQuantitiesDetails(fakeState)).toEqual(QUANTITIES_DETAILS_MOCK);
    });

    test('should return undefined', () => {
      expect(getQuantitiesDetails(initialDetailState)).toBeUndefined();
    });
  });

  describe('getProductionDetails', () => {
    test('should return production details', () => {
      expect(getProductionDetails(fakeState)).toEqual(PRODUCTION_DETAILS_MOCK);
    });

    test('should return undefined', () => {
      expect(getProductionDetails(initialDetailState)).toBeUndefined();
    });
  });

  describe('getCalculations', () => {
    test('should return calculations', () => {
      expect(getCalculations(fakeState)).toEqual(CALCULATIONS_TYPE_MOCK);
    });

    test('should return undefined', () => {
      expect(getCalculations(initialDetailState)).toBeUndefined();
    });
  });

  describe('getProductionDetails', () => {
    test('should return production details', () => {
      expect(getCalculationsLoading(fakeState)).toBeTruthy();
    });

    test('should return undefined', () => {
      expect(getCalculationsLoading(initialDetailState)).toBeFalsy();
    });
  });

  describe('getBomItems', () => {
    test('should return bom entries', () => {
      expect(getBomItems(initialDetailState)).toBeUndefined();
    });
  });

  describe('getBomLoading', () => {
    test('should return bom loading status', () => {
      expect(getBomLoading(initialDetailState)).toBeFalsy();
    });
  });
});
