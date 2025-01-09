import { getOptions } from './calculation-options.selector';

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
});
