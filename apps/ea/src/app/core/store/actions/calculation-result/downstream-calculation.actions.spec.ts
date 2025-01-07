import {
  DownstreamApiInputs,
  DownstreamAPIResponse,
} from '@ea/core/services/downstream-calculation.service.interface';

import {
  fetchDownstreamCalculation,
  resetDownstreamCalculation,
  setCalculationFailure,
  setDownstreamCalculationResult,
} from './downnstream-calculation.actions';

describe('Downstream Calculation Actions', () => {
  describe('fetchDownstreamCalculation', () => {
    it('should create the fetchDownstreamCalculation action', () => {
      const action = fetchDownstreamCalculation();

      expect(action).toEqual({
        type: '[Downstream Calculation] Fetch calculation results',
      });
    });
  });

  describe('resetDownstreamCalculation', () => {
    it('should create the resetDownstreamCalculation action', () => {
      const action = resetDownstreamCalculation();

      expect(action).toEqual({
        type: '[Downstream Calculation] Reset calculation results',
      });
    });
  });

  describe('setDownstreamCalculationResult', () => {
    it('should create the setDownstreamCalculationResult action', () => {
      const result: DownstreamAPIResponse = {} as DownstreamAPIResponse;
      const inputs: DownstreamApiInputs = {} as DownstreamApiInputs;
      const action = setDownstreamCalculationResult({
        result,
        inputs,
      });

      expect(action).toEqual({
        type: '[Downstream Calculation] Set results',
        result,
        inputs,
      });
    });
  });

  describe('setCalculationFailure', () => {
    it('should create the setCalculationFailure action', () => {
      const errors = ['error1', 'error2'];
      const action = setCalculationFailure({
        errors,
      });

      expect(action).toEqual({
        type: '[Downstream Calculation] Set calculation error',
        errors,
      });
    });
  });
});
