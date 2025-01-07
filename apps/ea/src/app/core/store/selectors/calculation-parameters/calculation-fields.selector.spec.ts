import {
  CALCULATION_PARAMETERS_STATE_MOCK,
  PRODUCT_SELECTION_STATE_MOCK,
} from '@ea/testing/mocks';

import { getCalculationFieldsConfig } from './calculation-fields.selector';

describe('Calculation Fields Selector', () => {
  const mockState = {
    productSelection: {
      ...PRODUCT_SELECTION_STATE_MOCK,
    },
    calculationParameters: {
      ...CALCULATION_PARAMETERS_STATE_MOCK,
    },
  };

  describe('getCalculationFieldsConfig', () => {
    it('should return the fields config', () => {
      expect(
        getCalculationFieldsConfig({
          ...mockState,
          productSelection: {
            ...mockState.productSelection,
            co2DownstreamAvailable: true,
          },
        })
      ).toMatchSnapshot();
    });

    it('should return the fields config without downstream fields', () => {
      expect(
        getCalculationFieldsConfig({
          ...mockState,
          productSelection: {
            ...mockState.productSelection,
            co2DownstreamAvailable: false,
          },
        })
      ).toMatchSnapshot();
    });
  });
});
