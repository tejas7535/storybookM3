import { CalculationParameters } from '../../models/calculation-parameters-state.model';
import { CalculationParametersActions } from '.';

describe('calculationParametersActions', () => {
  it('should create an action to set the calculation parameters', () => {
    const expectedAction = {
      type: '[Calculation Parameters] Set Calculation Parameters',
      parameters: {},
    };

    expect(
      CalculationParametersActions.setCalculationParameters({
        parameters:
          {} as Partial<CalculationParameters> as CalculationParameters,
      })
    ).toEqual(expectedAction);
  });
});
