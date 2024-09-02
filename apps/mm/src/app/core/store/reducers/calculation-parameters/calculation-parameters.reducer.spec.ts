import { CalculationParametersActions } from '../../actions/calculation-parameters';
import {
  CalculationParameters,
  CalculationParametersState,
} from '../../models/calculation-parameters-state.model';
import { calculationParametersReducer } from './calculation-parameters.reducer';

describe('calculationParametersReducer', () => {
  describe('set calculation parameters', () => {
    it('should set parameters', () => {
      const initialState: CalculationParametersState = {
        parameters: undefined,
      };

      const params: CalculationParameters = {
        RSY_BEARING_SERIES: 'some series',
      } as Partial<CalculationParameters> as CalculationParameters;

      const newState = calculationParametersReducer(
        initialState,
        CalculationParametersActions.setCalculationParameters({
          parameters: params,
        })
      );

      expect(newState).toEqual(
        expect.objectContaining({
          parameters: params,
        })
      );
    });
  });
});
