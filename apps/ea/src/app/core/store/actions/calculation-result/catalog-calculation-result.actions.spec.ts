import {
  downloadBasicFrequencies,
  fetchBasicFrequencies,
  resetCalculationResult,
  setBasicFrequenciesResult,
  setCalculationFailure,
} from './catalog-calculation-result.actions';

describe('Catalog Calculation Result Actions', () => {
  describe('Set calculation failure', () => {
    it('setCalculationFailure', () => {
      const action = setCalculationFailure({ error: 'abc' });

      expect(action).toEqual({
        type: '[Catalog Calculation Result] Set Calculation Failure',
        error: 'abc',
      });
    });
  });

  describe('Fetch Basic Frequencies', () => {
    it('fetchBasicFrequencies', () => {
      const action = fetchBasicFrequencies();

      expect(action).toEqual({
        type: '[Catalog Calculation Result] Fetch Basic Frequencies',
      });
    });
  });

  describe('Set Basic Frequencies Result', () => {
    it('setBasicFrequenciesResult', () => {
      const action = setBasicFrequenciesResult({
        basicFrequenciesResult: {
          rows: [],
          title: 'abc',
        },
      });

      expect(action).toEqual({
        type: '[Catalog Calculation Result] Set Basic Frequencies Result',
        basicFrequenciesResult: {
          rows: [],
          title: 'abc',
        },
      });
    });
  });

  describe('Download Basic Frequencies', () => {
    it('downloadBasicFrequencies', () => {
      const action = downloadBasicFrequencies();

      expect(action).toEqual({
        type: '[Catalog Calculation Result] Download Basic Frequencies',
      });
    });
  });

  describe('Reset calculation Result', () => {
    it('reset calculation result', () => {
      const action = resetCalculationResult();

      expect(action).toEqual({
        type: '[Catalog Calculation Result] Reset Calculation Result',
      });
    });
  });
});
