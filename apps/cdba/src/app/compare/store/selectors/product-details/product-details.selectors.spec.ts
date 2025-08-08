import {
  ADDITIONAL_INFORMATION_DETAILS_MOCK,
  COMPARE_STATE_MOCK,
} from '@cdba/testing/mocks';

import { CompareState, initialState } from '../../reducers/compare.reducer';
import {
  getAdditionalInformation,
  getDimensionAndWeightDetails,
  getMaterialDesignation,
  getObjectsAreEqual,
  getProductError,
  getSelectedReferenceTypeIdentifiers,
} from './product-details.selectors';

describe('Product Details Selectors', () => {
  const fakeState: { compare: CompareState } = { compare: COMPARE_STATE_MOCK };

  const initialCompareState: { compare: CompareState } = {
    compare: initialState,
  };

  let expected: any;
  let result: any;

  afterEach(() => {
    expected = undefined;
    result = undefined;
  });

  describe('getSelectedReferenceTypeIdentifiers', () => {
    it('should return empty array for empty/initial state', () => {
      expected = [];
      result = getSelectedReferenceTypeIdentifiers(initialCompareState);

      expect(result).toEqual(expected);
    });

    it('should return an array of compare indices', () => {
      expected = [
        {
          materialNumber: '0943578620000',
          plant: '0074',
        },
        {
          materialNumber: '0943572680000',
          plant: '0060',
        },
      ];
      result = getSelectedReferenceTypeIdentifiers(fakeState);

      expect(result).toEqual(expected);
    });
  });

  describe('getProductError', () => {
    it('should return undefined for non existing index', () => {
      result = getProductError({ index: 99 })(fakeState);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing product for provided index', () => {
      result = getProductError({ index: 3 })(fakeState);

      expect(result).toBeUndefined();
    });

    it('should return error message for provided index', () => {
      expected = '404 - Not Found';
      result = getProductError({ index: 1 })(fakeState);

      expect(result).toEqual(expected);
    });
  });

  describe('getDimensionAndWeightDetails', () => {
    it('should return undefined for non existing index', () => {
      result = getDimensionAndWeightDetails({ index: 99 })(fakeState);

      expect(result).toBeUndefined();
    });

    it('should return dimension data for provided index', () => {
      result = getDimensionAndWeightDetails({ index: 0 })(fakeState);
      expected = {
        height: 7,
        length: 10,
        unitOfDimension: 'mm',
        volumeCubic: 200,
        volumeUnit: 'mm^3',
        weight: 10,
        weightUnit: 'gramm',
        width: 10,
      };

      expect(result).toEqual(expected);
    });
  });

  describe('getAdditionalInformation', () => {
    it('should return undefined for non existing index', () => {
      result = getAdditionalInformation({ index: 99 })(fakeState);

      expect(result).toBeUndefined();
    });

    it('should return dimension data for provided index', () => {
      result = getAdditionalInformation({ index: 0 })(fakeState);
      expected = ADDITIONAL_INFORMATION_DETAILS_MOCK;

      expect(result).toEqual(expected);
    });
  });

  describe('getMaterialDesignation', () => {
    it('should return undefined for non existing index', () => {
      result = getMaterialDesignation({ index: 99 })(fakeState);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing bom for provided index', () => {
      result = getMaterialDesignation({ index: 3 })(fakeState);

      expect(result).toBeUndefined();
    });

    it('should return material designation of first bom item', () => {
      expected = 'F-446509.SLH';

      result = getMaterialDesignation({ index: 0 })(fakeState);

      expect(result).toEqual(expected);
    });
  });

  describe('getObjectsAreEqual', () => {
    it('should return false when compare items dont exist', () => {
      result = getObjectsAreEqual(initialCompareState);

      expect(result).toBeFalsy();
    });
    it('should return true if compare items have same material number', () => {
      const patchedState = {
        compare: {
          ...COMPARE_STATE_MOCK,
          0: { ...COMPARE_STATE_MOCK[0] },
          1: { ...COMPARE_STATE_MOCK[0] },
        },
      };
      result = getObjectsAreEqual(patchedState);

      expect(result).toBeTruthy();
    });

    it('should return false if compared items are different', () => {
      result = getObjectsAreEqual(fakeState);

      expect(result).toBeFalsy();
    });
  });
});
