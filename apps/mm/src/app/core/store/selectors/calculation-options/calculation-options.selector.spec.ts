import {
  getCalculationPerformed,
  getOptions,
  getThermalOptions,
  getToleranceClasses,
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

  describe('getToleranceClasses selector', () => {
    it('should select the tolerance classes', () => {
      const testState = {
        calculationOptions: {
          options: { option1: 'value1', option2: 'value2' },
          toleranceClasses: ['class1', 'class2'],
        },
      };

      const result = getToleranceClasses(testState);
      expect(result).toEqual(['class1', 'class2']);
    });

    it('should return an empty array if toleranceClasses is not set', () => {
      const incompleteState = {
        calculationOptions: {
          options: { option1: 'value1', option2: 'value2' },
        },
      };

      const result = getToleranceClasses(incompleteState);
      expect(result).toEqual([]);
    });

    it('should return an empty array if state is undefined', () => {
      const mockState: { calculationOptions: any } = {
        calculationOptions: undefined,
      };

      const result = getToleranceClasses(mockState);
      expect(result).toEqual([]);
    });
  });

  describe('getThermalOptions selector', () => {
    it('should select the thermal options', () => {
      const testState = {
        calculationOptions: {
          options: { option1: 'value1', option2: 'value2' },
          thermalOptions: { thermalOption1: 'value1' },
        },
      };

      const result = getThermalOptions(testState);
      expect(result).toEqual({ thermalOption1: 'value1' });
    });

    it('should return undefined if thermalOptions is not set', () => {
      const incompleteState = {
        calculationOptions: {
          options: { option1: 'value1', option2: 'value2' },
        },
      };

      const result = getThermalOptions(incompleteState);
      expect(result).toBeUndefined();
    });

    it('should return undefined if state is undefined', () => {
      const mockState: { calculationOptions: any } = {
        calculationOptions: undefined,
      };

      const result = getThermalOptions(mockState);
      expect(result).toBeUndefined();
    });
  });
});
