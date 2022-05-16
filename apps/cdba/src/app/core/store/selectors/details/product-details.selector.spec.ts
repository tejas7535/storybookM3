import {
  CUSTOMER_DETAILS_MOCK,
  DETAIL_STATE_MISSING_SALES_INFORMATION_MOCK,
  DETAIL_STATE_MOCK,
  DIMENSION_AND_WEIGHT_DETAILS_MOCK,
  PRICE_DETAILS_MOCK,
  PRODUCTION_DETAILS_MOCK,
  QUANTITIES_DETAILS_MOCK,
  REFERENCE_TYPE_IDENTIFIER_MOCK,
  SALES_DETAILS_MOCK,
} from '@cdba/testing/mocks';

import {
  DetailState,
  initialState,
} from '../../reducers/detail/detail.reducer';
import {
  getCustomerDetails,
  getDimensionAndWeightDetails,
  getMaterialDesignation,
  getPriceDetails,
  getProductionDetails,
  getQuantitiesDetails,
  getReferenceType,
  getReferenceTypeError,
  getReferenceTypeLoading,
  getSalesDetails,
  getSelectedReferenceTypeIdentifier,
} from './product-details.selector';

describe('ProductDetails Selector', () => {
  const fakeState: { detail: DetailState } = { detail: DETAIL_STATE_MOCK };
  const fakeStateMissingSalesInformation: { detail: DetailState } = {
    detail: DETAIL_STATE_MISSING_SALES_INFORMATION_MOCK,
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

  describe('getReferenceTypeError', () => {
    test('should return error message', () => {
      expect(getReferenceTypeError(fakeState)).toEqual('Error');
    });

    test('should return undefined', () => {
      expect(getReferenceTypeError(initialDetailState)).toBeUndefined();
    });
  });

  describe('getMaterialDesignation', () => {
    test('should return error message', () => {
      expect(getMaterialDesignation(fakeState)).toEqual('F-446509.SLH');
    });

    test('should return undefined', () => {
      expect(getMaterialDesignation(initialDetailState)).toBeUndefined();
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

    test('should return undefined for average price if user is not allow to see it', () => {
      expect(
        getPriceDetails(fakeStateMissingSalesInformation).averagePrice
      ).toBeUndefined();
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

  describe('getSelectedReferenceTypeIdentifier', () => {
    test('should return currently selected refTypeIdentifier', () => {
      expect(getSelectedReferenceTypeIdentifier(fakeState)).toEqual(
        REFERENCE_TYPE_IDENTIFIER_MOCK
      );
    });
  });
});
