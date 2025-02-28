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
  getVersions,
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

  describe('getVersions', () => {
    it('should return undefined if there are no versions', () => {
      expect(
        getVersions({
          ...mockState,
          calculationResult: {
            ...mockState.calculationResult,
            versions: undefined,
          },
        })
      ).toBeUndefined();
    });

    it('should return undefined if the versions object is empty', () => {
      expect(
        getVersions({
          ...mockState,
          calculationResult: {
            ...mockState.calculationResult,
            versions: {},
          },
        })
      ).toBeUndefined();
    });

    it('should return the versions as a string', () => {
      expect(
        getVersions({
          ...mockState,
          calculationResult: {
            ...mockState.calculationResult,
            versions: {
              '1': 'v1',
              '2': 'v2',
            },
          },
        })
      ).toEqual('1 v1 / 2 v2');
    });
  });
});
