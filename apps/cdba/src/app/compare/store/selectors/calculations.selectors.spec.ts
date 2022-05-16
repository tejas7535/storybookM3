import {
  BOM_IDENTIFIER_MOCK,
  CALCULATIONS_MOCK,
  COMPARE_STATE_MOCK,
} from '@cdba/testing/mocks';

import { CompareState } from '../reducers/compare.reducer';
import {
  getBomIdentifierForSelectedCalculation,
  getCalculations,
  getCalculationsError,
  getCalculationsLoading,
  getSelectedCalculation,
  getSelectedCalculationNodeId,
} from './calculations.selectors';

describe('Calculations Selectors', () => {
  const fakeState: { compare: CompareState } = { compare: COMPARE_STATE_MOCK };

  let expected: any;
  let result: any;

  afterEach(() => {
    expected = undefined;
    result = undefined;
  });

  describe('getBomIdentifierForSelectedCalculation', () => {
    it('should return undefined if index is not existing', () => {
      const index = 99;

      result = getBomIdentifierForSelectedCalculation(fakeState, index);

      expect(result).toBeUndefined();
    });

    it('should return undefined if calculation for provided index is not defined', () => {
      const index = 3;

      result = getBomIdentifierForSelectedCalculation(fakeState, index);

      expect(result).toBeUndefined();
    });

    it('should return undefined if selected calculation of index is not defined', () => {
      const index = 1;

      result = getBomIdentifierForSelectedCalculation(fakeState, index);

      expect(result).toBeUndefined();
    });

    it('should return bomIdentifier for provided index', () => {
      const index = 0;
      expected = BOM_IDENTIFIER_MOCK;

      result = getBomIdentifierForSelectedCalculation(fakeState, index);

      expect(result).toEqual(expected);
    });
  });

  describe('getCalculations', () => {
    it('should return undefined for non existing index', () => {
      result = getCalculations(fakeState, 99);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing calculation for provided index', () => {
      result = getCalculations(fakeState, 3);

      expect(result).toBeUndefined();
    });

    it('should return calc history for provided index', () => {
      expected = CALCULATIONS_MOCK;
      result = getCalculations(fakeState, 0);

      expect(result).toEqual(expected);
    });
  });

  describe('getCalculationsLoading', () => {
    it('should return undefined for non existing index', () => {
      result = getCalculationsLoading(fakeState, 99);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing calculation for provided index', () => {
      result = getCalculationsLoading(fakeState, 3);

      expect(result).toBeUndefined();
    });

    it('should return boolean for provided index', () => {
      result = getCalculationsLoading(fakeState, 1);

      expect(result).toBeTruthy();
    });
  });

  describe('getCalculationsError', () => {
    it('should return undefined for non existing index', () => {
      result = getCalculationsError(fakeState, 99);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing calculation for provided index', () => {
      result = getCalculationsError(fakeState, 3);

      expect(result).toBeUndefined();
    });

    it('should return error message for provided index', () => {
      expected = 'Service unavailable';
      result = getCalculationsError(fakeState, 2);

      expect(result).toEqual(expected);
    });
  });

  describe('getSelectedCalculationNodeId', () => {
    it('should return undefined for non existing index', () => {
      result = getSelectedCalculationNodeId(fakeState, 99);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing calculation for provided index', () => {
      result = getSelectedCalculationNodeId(fakeState, 3);

      expect(result).toBeUndefined();
    });

    it('should return node id of selected calculation for provided index', () => {
      expected = ['3'];
      result = getSelectedCalculationNodeId(fakeState, 0);

      expect(result).toEqual(expected);
    });
  });

  describe('getSelectedCalculation', () => {
    it('should return undefined for non existing index', () => {
      result = getSelectedCalculation(fakeState, 99);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing calculation for provided index', () => {
      result = getSelectedCalculation(fakeState, 3);

      expect(result).toBeUndefined();
    });

    it('should return calculation for provided index', () => {
      expected = CALCULATIONS_MOCK[2];
      result = getSelectedCalculation(fakeState, 0);

      expect(result).toEqual(expected);
    });
  });
});
