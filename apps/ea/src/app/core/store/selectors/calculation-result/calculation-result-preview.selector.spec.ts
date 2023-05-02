import { APP_STATE_MOCK } from '@ea/testing/mocks';

import { AppState } from '../../reducers';
import {
  co2Downstream,
  co2Upstream,
  getCalculationResultPreviewData,
  isCalculationResultReportAvailable,
} from './calculation-result-preview.selector';

describe('Calculation Result Selector', () => {
  const mockState: AppState = {
    ...APP_STATE_MOCK,
  };

  describe('getCalculationResultPreviewData', () => {
    it('should return the result preview data', () => {
      expect(getCalculationResultPreviewData(mockState)).toMatchSnapshot();
    });
  });

  describe('isCalculationResultReportAvailable', () => {
    it('should return true if calculation result is available', () => {
      expect(isCalculationResultReportAvailable(mockState)).toBe(true);
    });
  });

  describe('co2Upstream', () => {
    it('should return the upstream co2 result', () => {
      expect(co2Upstream(mockState)).toMatchSnapshot();
    });

    it('should return undefined if no upstream co2 result is available', () => {
      expect(
        co2Upstream({ ...mockState, co2UpstreamCalculationResult: {} })
      ).toMatchSnapshot();
    });
  });

  describe('co2Downstream', () => {
    it('should return the downstream co2 result', () => {
      expect(co2Downstream(mockState)).toMatchSnapshot();
    });

    it('should return undefined if no downstream co2 result is available', () => {
      expect(
        co2Downstream({
          ...mockState,
          frictionCalculationResult: { co2_downstream: undefined },
        })
      ).toMatchSnapshot();
    });
  });
});
