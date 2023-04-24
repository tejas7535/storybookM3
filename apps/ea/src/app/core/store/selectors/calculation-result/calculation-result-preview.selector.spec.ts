import { APP_STATE_MOCK } from '@ea/testing/mocks';

import { getCalculationResultPreviewData } from './calculation-result-preview.selector';

describe('Calculation Result Selector', () => {
  const mockState = {
    ...APP_STATE_MOCK,
  };

  describe('getCalculationResultPreviewData', () => {
    it('should return the result preview data', () => {
      expect(getCalculationResultPreviewData(mockState)).toMatchSnapshot();
    });
  });
});
