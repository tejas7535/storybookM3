import {
  BOM_IDENTIFIER_MOCK,
  CALCULATIONS_MOCK,
  COMPARE_STATE_MOCK,
} from '@cdba/testing/mocks';

import { CompareState } from '../../reducers/compare.reducer';
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
      result = getBomIdentifierForSelectedCalculation({ index: 99 })(fakeState);

      expect(result).toBeUndefined();
    });

    it('should return undefined if calculation for provided index is not defined', () => {
      result = getBomIdentifierForSelectedCalculation({ index: 3 })(fakeState);

      expect(result).toBeUndefined();
    });

    it('should return undefined if selected calculation of index is not defined', () => {
      result = getBomIdentifierForSelectedCalculation({ index: 1 })(fakeState);

      expect(result).toBeUndefined();
    });

    it('should return bomIdentifier for provided index', () => {
      expected = BOM_IDENTIFIER_MOCK;

      result = getBomIdentifierForSelectedCalculation({ index: 0 })(fakeState);

      expect(result).toEqual(expected);
    });
  });

  describe('getCalculations', () => {
    it('should return undefined for non existing index', () => {
      result = getCalculations({ index: 99 })(fakeState);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing calculation for provided index', () => {
      result = getCalculations({ index: 3 })(fakeState);

      expect(result).toBeUndefined();
    });

    it('should return calc history for provided index', () => {
      expected = CALCULATIONS_MOCK;
      result = getCalculations({ index: 0 })(fakeState);

      expect(result).toEqual(expected);
    });
  });

  describe('getCalculationsLoading', () => {
    it('should return undefined for non existing index', () => {
      result = getCalculationsLoading({ index: 99 })(fakeState);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing calculation for provided index', () => {
      result = getCalculationsLoading({ index: 3 })(fakeState);

      expect(result).toBeUndefined();
    });

    it('should return boolean for provided index', () => {
      result = getCalculationsLoading({ index: 1 })(fakeState);

      expect(result).toBeTruthy();
    });
  });

  describe('getCalculationsError', () => {
    it('should return undefined for non existing index', () => {
      result = getCalculationsError({ index: 99 })(fakeState);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing calculation for provided index', () => {
      result = getCalculationsError({ index: 3 })(fakeState);

      expect(result).toBeUndefined();
    });

    it('should return error message for provided index', () => {
      expected = '404 - Not Found';
      result = getCalculationsError({ index: 1 })(fakeState);

      expect(result).toEqual(expected);
    });
  });

  describe('getSelectedCalculationNodeId', () => {
    it('should return undefined for non existing index', () => {
      result = getSelectedCalculationNodeId({ index: 99 })(fakeState);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing calculation for provided index', () => {
      result = getSelectedCalculationNodeId({ index: 3 })(fakeState);

      expect(result).toBeUndefined();
    });

    it('should return node id of selected calculation for provided index', () => {
      expected = ['3'];
      result = getSelectedCalculationNodeId({ index: 0 })(fakeState);

      expect(result).toEqual(expected);
    });
  });

  describe('getSelectedCalculation', () => {
    it('should return undefined for non existing index', () => {
      result = getSelectedCalculation({ index: 99 })(fakeState);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing calculation for provided index', () => {
      result = getSelectedCalculation({ index: 3 })(fakeState);

      expect(result).toBeUndefined();
    });

    it('should return calculation for provided index', () => {
      expected = CALCULATIONS_MOCK[2];
      result = getSelectedCalculation({ index: 0 })(fakeState);

      expect(result).toEqual(expected);
    });
  });
});
