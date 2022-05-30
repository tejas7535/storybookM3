import {
  CALCULATION_RESULT_MOCK_ID,
  MODEL_MOCK_ID,
  REPORT_URLS_MOCK,
} from '@ga/testing/mocks';

import { BearingState } from '../../reducers/bearing/bearing.reducer';
import {
  initialState,
  ResultState,
} from '../../reducers/result/result.reducer';
import { getReportUrls, getResultId } from './result.selector';

describe('Result Selector', () => {
  let mockState: { result: ResultState; bearing: BearingState };

  beforeEach(() => {
    mockState = {
      result: { ...initialState, resultId: CALCULATION_RESULT_MOCK_ID },
      bearing: { modelId: MODEL_MOCK_ID } as BearingState,
    };
  });

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
});
