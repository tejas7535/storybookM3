import { CALCULATION_RESULT_STATE_MOCK } from '@ea/testing/mocks';

import {
  getCalculationId,
  getCalculationResult,
  getCalculationResultPreviewData,
  getModelId,
  isCalculationImpossible,
  isCalculationLoading,
  isCalculationResultAvailable,
} from './calculation-result.selector';

describe('Calculation Result Selector', () => {
  const mockState = {
    calculationResult: {
      ...CALCULATION_RESULT_STATE_MOCK,
    },
  };

  describe('getCalculationResult', () => {
    it('should return the calculation result state', () => {
      expect(getCalculationResult(mockState)).toEqual(
        CALCULATION_RESULT_STATE_MOCK.calculationResult
      );
    });
  });

  describe('isCalculationResultAvailable', () => {
    it('should return true if we have a result', () => {
      expect(isCalculationResultAvailable(mockState)).toEqual(
        !!CALCULATION_RESULT_STATE_MOCK.calculationResult
      );
    });
  });

  describe('isCalculationImpossible', () => {
    it('should return true if calculation is not possible', () => {
      expect(
        isCalculationImpossible({
          ...mockState,
          calculationResult: {
            ...mockState.calculationResult,
            isCalculationImpossible: true,
          },
        })
      ).toEqual(true);
    });
  });

  describe('isCalculationLoading', () => {
    it('should return true if loading is in progress', () => {
      expect(
        isCalculationLoading({
          ...mockState,
          calculationResult: {
            ...mockState.calculationResult,
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
          calculationResult: {
            ...mockState.calculationResult,
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
          calculationResult: {
            ...mockState.calculationResult,
            calculationId: 'calc-id',
          },
        })
      ).toEqual('calc-id');
    });
  });

  describe('getCalculationResultPreviewData', () => {
    it('should return the result preview data', () => {
      expect(getCalculationResultPreviewData(mockState)).toMatchSnapshot();
    });
  });
});
