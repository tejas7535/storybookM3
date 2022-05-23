import { HttpStatusCode } from '@angular/common/http';

import {
  CALCULATIONS_MOCK,
  EXCLUDED_CALCULATIONS_MOCK,
} from '@cdba/testing/mocks';

import {
  CalculationsActions,
  loadCalculations,
  loadCalculationsFailure,
  loadCalculationsSuccess,
  selectCalculation,
  selectCalculations,
} from './calculations.actions';

describe('Calculation Actions', () => {
  let action: CalculationsActions;
  const errorMessage = 'An error occured';
  const statusCode = HttpStatusCode.BadRequest;

  beforeEach(() => {
    action = undefined;
  });

  describe('loadCalculations Actions', () => {
    test('loadCalculations', () => {
      action = loadCalculations();

      expect(action).toEqual({
        type: '[Detail] Load Calculations',
      });
    });

    test('loadCalculationsSuccess', () => {
      const calculations = CALCULATIONS_MOCK;
      const excludedCalculations = EXCLUDED_CALCULATIONS_MOCK;
      action = loadCalculationsSuccess({ calculations, excludedCalculations });

      expect(action).toEqual({
        calculations,
        excludedCalculations,
        type: '[Detail] Load Calculations Success',
      });
    });

    test('loadCalculationsFailure', () => {
      action = loadCalculationsFailure({ errorMessage, statusCode });

      expect(action).toEqual({
        errorMessage,
        statusCode,
        type: '[Detail] Load Calculations Failure',
      });
    });
  });

  test('selectCalculation', () => {
    const nodeId = '1';
    const calculation = CALCULATIONS_MOCK[0];
    action = selectCalculation({ nodeId, calculation });

    expect(action).toEqual({
      nodeId,
      calculation,
      type: '[Detail] Select Calculation',
    });
  });

  test('selectCalculations', () => {
    const nodeIds = ['1'];
    action = selectCalculations({ nodeIds });

    expect(action).toEqual({
      nodeIds,
      type: '[Detail] Select Calculations',
    });
  });
});
