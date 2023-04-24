import {
  APP_STATE_MOCK,
  FRICTION_CALCULATION_RESULT_STATE_MOCK,
} from '@ea/testing/mocks';

import {
  getCalculationId,
  getCalculationResult,
  getModelId,
  isCalculationImpossible,
  isCalculationResultAvailable,
  isLoading,
} from './friction-calculation-result.selector';

describe('Friction Calculation Result Selector', () => {
  const mockState = {
    ...APP_STATE_MOCK,
  };

  describe('getCalculationResult', () => {
    it('should return the calculation result state', () => {
      expect(getCalculationResult(mockState)).toEqual(
        FRICTION_CALCULATION_RESULT_STATE_MOCK.calculationResult
      );
    });
  });

  describe('isCalculationResultAvailable', () => {
    it('should return true if we have a result', () => {
      expect(isCalculationResultAvailable(mockState)).toEqual(
        !!FRICTION_CALCULATION_RESULT_STATE_MOCK.calculationResult
      );
    });
  });

  describe('isCalculationImpossible', () => {
    it('should return true if calculation is not possible', () => {
      expect(
        isCalculationImpossible({
          ...mockState,
          frictionCalculationResult: {
            ...mockState.frictionCalculationResult,
            isCalculationImpossible: true,
          },
        })
      ).toEqual(true);
    });
  });

  describe('isLoading', () => {
    it('should return true if loading is in progress', () => {
      expect(
        isLoading({
          ...mockState,
          frictionCalculationResult: {
            ...mockState.frictionCalculationResult,
            isLoading: true,
          },
        })
      ).toEqual(true);
    });
  });

  describe('getModelId', () => {
    it('should return the model id', () => {
      expect(
        getModelId({
          ...mockState,
          frictionCalculationResult: {
            ...mockState.frictionCalculationResult,
            modelId: 'model-id',
          },
        })
      ).toEqual('model-id');
    });
  });

  describe('getCalculationId', () => {
    it('should return the calculation id', () => {
      expect(
        getCalculationId({
          ...mockState,
          frictionCalculationResult: {
            ...mockState.frictionCalculationResult,
            calculationId: 'calc-id',
          },
        })
      ).toEqual('calc-id');
    });
  });
});
