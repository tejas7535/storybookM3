import {
  APP_STATE_MOCK,
  CALCULATION_RESULT_MOCK_ID,
  CALCULATION_RESULT_STATE_MOCK,
  MODEL_MOCK_ID,
  REPORT_URLS_MOCK,
} from '@ga/testing/mocks';

import {
  getReportUrls,
  getResultId,
  getResultMessages,
  hasResultMessage,
} from './calculation-result.selector';

describe('Calculation Result Selector', () => {
  const mockState = {
    ...APP_STATE_MOCK,
    bearingSelection: { modelId: MODEL_MOCK_ID },
    calculationResult: CALCULATION_RESULT_STATE_MOCK,
  };

  describe('getResultId', () => {
    it('should return result id', () => {
      expect(getResultId(mockState)).toEqual(CALCULATION_RESULT_MOCK_ID);
    });
  });

  describe('getReportUrls', () => {
    it('should return report urls', () => {
      expect(getReportUrls(mockState)).toEqual(REPORT_URLS_MOCK);
    });
  });

  describe('hasResultMessage', () => {
    it('should return true when messages contains at least one entry', () => {
      expect(hasResultMessage(mockState)).toEqual(true);
    });
  });

  describe('getResultMessages', () => {
    it('should the messages', () => {
      expect(getResultMessages(mockState)).toEqual([
        { translationKey: 'test' },
      ]);
    });
  });
});
