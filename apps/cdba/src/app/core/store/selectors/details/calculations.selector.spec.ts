import { CALCULATIONS_MOCK, DETAIL_STATE_MOCK } from '@cdba/testing/mocks';

import {
  DetailState,
  initialState,
} from '../../reducers/detail/detail.reducer';
import { getBomIdentifierForSelectedCalculation } from './bom.selector';
import {
  getCalculations,
  getCalculationsLoading,
  getSelectedCalculation,
  getSelectedCalculationNodeId,
} from './calculations.selector';

describe('Calculations Selector', () => {
  const fakeState: { detail: DetailState } = { detail: DETAIL_STATE_MOCK };

  const initialDetailState: { detail: DetailState } = {
    detail: initialState,
  };

  describe('getCalculations', () => {
    test('should return calculations', () => {
      expect(getCalculations(fakeState)).toEqual(CALCULATIONS_MOCK);
    });

    test('should return undefined', () => {
      expect(getCalculations(initialDetailState)).toBeUndefined();
    });
  });

  describe('getCalculationsLoading', () => {
    test('should return production details', () => {
      expect(getCalculationsLoading(fakeState)).toBeTruthy();
    });

    test('should return undefined', () => {
      expect(getCalculationsLoading(initialDetailState)).toBeFalsy();
    });
  });

  describe('getSelectedCalculationNodeId', () => {
    test('should return undefined if selected is undefined', () => {
      expect(getSelectedCalculationNodeId(initialDetailState)).toBeUndefined();
    });

    test('should return string of the node id', () => {
      expect(getSelectedCalculationNodeId(fakeState)).toEqual(['3']);
    });
  });

  describe('getSelectedCalculation', () => {
    test('should return undefined if selected is undefined', () => {
      expect(getSelectedCalculation(initialDetailState)).toBeUndefined();
    });

    test('should return selected calculation', () => {
      expect(getSelectedCalculation(fakeState)).toEqual(CALCULATIONS_MOCK[2]);
    });
  });

  describe('getBomIdentifierForSelectedCalculation', () => {
    test('should return undefined if selected is undefined', () => {
      expect(
        getBomIdentifierForSelectedCalculation(initialDetailState)
      ).toBeUndefined();
    });

    test('should return the BomIdentifier of the selected calculation', () => {
      const expectedIdentifier = {
        costingDate: '20171101',
        costingNumber: '145760472',
        costingType: 'K1',
        version: '61',
        enteredManually: false,
        referenceObject: '0',
        valuationVariant: 'SQB',
      };
      expect(getBomIdentifierForSelectedCalculation(fakeState)).toEqual(
        expectedIdentifier
      );
    });
  });
});
