import { CALCULATION_PARAMETERS_STATE_MOCK } from '@ea/testing/mocks';

import { getCalculationFieldsConfig } from './calculation-fields.selector';

describe('Calculation Fields Selector', () => {
  const mockState = {
    calculationParameters: {
      ...CALCULATION_PARAMETERS_STATE_MOCK,
    },
  };

  describe('getCalculationFieldsConfig', () => {
    it('should return the fields config', () => {
      expect(getCalculationFieldsConfig(mockState)).toMatchSnapshot();
    });
  });
});
