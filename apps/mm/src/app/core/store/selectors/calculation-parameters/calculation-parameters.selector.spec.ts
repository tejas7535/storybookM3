import { APP_STATE_MOCK } from '../../../../../testing/mocks/store/app-state.mock';
import { CalculationParametersState } from '../../models/calculation-parameters-state.model';
import { getCalculationParameters } from './calculation-parameters.selector';

describe('CalculationParametersSelector', () => {
  const state: CalculationParametersState = {
    ...APP_STATE_MOCK.calculationParameters,
  };

  describe('getCalculationParameters', () => {
    describe('when parameters are not defined', () => {
      it('should return undefined', () => {
        expect(getCalculationParameters(state)).toBeUndefined();
      });
    });

    describe('when parameters are defined', () => {
      it('should return inputs', () => {
        expect(
          getCalculationParameters({
            calculationParameters: {
              parameters: {
                RSY_BEARING_SERIES: 'some series',
              },
            },
          })
        ).toMatchSnapshot();
      });
    });
  });
});
