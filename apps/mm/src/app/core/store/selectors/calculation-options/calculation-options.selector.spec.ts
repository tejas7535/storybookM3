import {
  getCalculationPerformed,
  getOptions,
} from './calculation-options.selector';

describe('Calculation Options Selectors', () => {
  const initialState = {
    options: { option1: 'value1', option2: 'value2' },
  };

  const state = {
    calculationOptions: initialState,
  };

  it('should select the options', () => {
    const result = getOptions(state);
    expect(result).toEqual(initialState.options);
  });

  it('should return undefined if state is undefined', () => {
    const mockState: { calculationOptions: any } = {
      calculationOptions: undefined,
    };

    const result = getOptions(mockState);
    expect(result).toBeUndefined();
  });

  describe('getCalculationPerformed selector', () => {
    it('should select the calculationPerformed flag', () => {
      const testState = {
        calculationOptions: {
          options: { option1: 'value1', option2: 'value2' },
          calculationPerformed: true,
        },
      };

      const result = getCalculationPerformed(testState);
      expect(result).toBe(true);
    });

    it('should return undefined if state is undefined', () => {
      const mockState: { calculationOptions: any } = {
        calculationOptions: undefined,
      };

      const result = getCalculationPerformed(mockState);
      expect(result).toBeUndefined();
    });

    it('should return undefined if calculationPerformed property is not set', () => {
      const incompleteState = {
        calculationOptions: {
          options: { option1: 'value1', option2: 'value2' },
        },
      };

      const result = getCalculationPerformed(incompleteState);
      expect(result).toBeUndefined();
    });
  });
});
