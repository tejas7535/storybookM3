import {
  CALCULATIONS_MOCK,
  EXCLUDED_CALCULATIONS_MOCK,
} from '@cdba/testing/mocks';

import {
  CalculationsActions,
  loadCalculationHistory,
  loadCalculationHistoryFailure,
  loadCalculationHistorySuccess,
  loadCalculations,
  selectCalculation,
} from './calculations.actions';

describe('Calculations Actions', () => {
  let action: CalculationsActions;
  let expectedType: string;

  const materialNumber = 'Material-12345';
  const plant = '0061';
  const index = 1;
  const errorMessage = 'Please Help';
  const statusCode = 418;
  const calculationItems = CALCULATIONS_MOCK;
  const excludedCalculationItems = EXCLUDED_CALCULATIONS_MOCK;
  const calculation = CALCULATIONS_MOCK[3];
  const nodeId = '4';

  afterEach(() => {
    action = undefined;
    expectedType = undefined;
  });

  describe('loadCalculations Actions', () => {
    test('loadCalculations', () => {
      action = loadCalculations();
      expectedType = '[Compare] Load Calculations';

      expect(action.type).toEqual(expectedType);
    });

    test('loadCalculationHistory', () => {
      action = loadCalculationHistory({ materialNumber, plant, index });
      expectedType = '[Compare] Load Calculation History';

      expect(action).toEqual({
        materialNumber,
        plant,
        index,
        type: expectedType,
      });
    });

    test('loadCalculationHistorySuccess', () => {
      action = loadCalculationHistorySuccess({
        index,
        plant,
        items: calculationItems,
        excludedItems: excludedCalculationItems,
      });
      expectedType = '[Compare] Load Calculation History Success';

      expect(action).toEqual({
        index,
        plant,
        items: calculationItems,
        excludedItems: excludedCalculationItems,
        type: expectedType,
      });
    });

    test('loadCalculationHistoryFailure', () => {
      action = loadCalculationHistoryFailure({
        index,
        errorMessage,
        statusCode,
      });
      expectedType = '[Compare] Load Calculation History Failure';

      expect(action).toEqual({
        errorMessage,
        statusCode,
        index,
        type: expectedType,
      });
    });

    test('selectCalculation', () => {
      action = selectCalculation({ nodeId, calculation, index });
      expectedType = '[Compare] Select Calculation';

      expect(action).toEqual({
        nodeId,
        calculation,
        index,
        type: expectedType,
      });
    });
  });
});
