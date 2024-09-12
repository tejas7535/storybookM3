import { getCalculationParameters } from './calculation-parameters.selector';

describe('CalculationParametersSelector', () => {
  describe('getCalculationParameters', () => {
    describe('when parameters are not defined', () => {
      it('should return undefined', () => {
        expect(
          getCalculationParameters({ calculationParameters: {} })
        ).toBeUndefined();
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
