import {
  APP_STATE_MOCK,
  CALCULATION_PARAMETERS_STATE_MOCK,
} from '@ea/testing/mocks';

import { AppState } from '../../reducers';
import {
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
    describe('when all selected calculation result are available', () => {
      it('should return true if calculation result is available', () => {
        expect(isCalculationResultReportAvailable(mockState)).toBe(true);
      });
    });

    describe('when some of the selected calculation results are not available', () => {
      let state: AppState;
      beforeEach(() => {
        state = {
          ...APP_STATE_MOCK,
          catalogCalculationResult: {
            isLoading: false,
          },
        };
      });

      it('should return false if calculation result is not available', () => {
        expect(isCalculationResultReportAvailable(state)).toBe(false);
      });
    });

    describe('when there is no selection', () => {
      let state: AppState;
      beforeEach(() => {
        state = {
          ...APP_STATE_MOCK,
          calculationParameters: {
            ...CALCULATION_PARAMETERS_STATE_MOCK,
            calculationTypes: {
              ...CALCULATION_PARAMETERS_STATE_MOCK.calculationTypes,
              emission: {
                disabled: true,
                selected: false,
                visible: true,
              },
              frictionalPowerloss: {
                disabled: false,
                selected: false,
                visible: true,
              },
            },
          },
        };
      });

      it('should return false if calculation result is not available', () => {
        expect(isCalculationResultReportAvailable(state)).toBe(false);
      });
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
});
