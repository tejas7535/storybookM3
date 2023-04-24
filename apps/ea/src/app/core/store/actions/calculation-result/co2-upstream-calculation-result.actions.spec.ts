import {
  fetchResult,
  setCalculationFailure,
  setCalculationResult,
} from './co2-upstream-calculation-result.actions';

describe('CO2 Upstream Calculation Result Actions', () => {
  describe('Set calculation failure', () => {
    it('setCalculationFailure', () => {
      const action = setCalculationFailure({ error: 'abc' });

      expect(action).toEqual({
        type: '[CO2 Upstream Calculation Result] Set Calculation Failure',
        error: 'abc',
      });
    });
  });

  describe('Fetch Result', () => {
    it('fetchResult', () => {
      const action = fetchResult();

      expect(action).toEqual({
        type: '[CO2 Upstream Calculation Result] Fetch Result',
      });
    });
  });

  describe('Set Calculation Result', () => {
    it('setCalculationResult', () => {
      const action = setCalculationResult({
        calculationResult: {
          unit: 'kg',
          upstreamEmissionFactor: 1,
          upstreamEmissionTotal: 2,
          weight: 3,
        },
      });

      expect(action).toEqual({
        type: '[CO2 Upstream Calculation Result] Set Calculation Result',
        calculationResult: {
          unit: 'kg',
          upstreamEmissionFactor: 1,
          upstreamEmissionTotal: 2,
          weight: 3,
        },
      });
    });
  });
});
