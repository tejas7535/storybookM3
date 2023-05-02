import { APP_STATE_MOCK } from '@ea/testing/mocks';

import { AppState } from '../../reducers';
import {
  getCO2EmissionReport,
  getSelectedCalculations,
} from './calculation-result-report.selector';

describe('Calculation Result Selector', () => {
  const mockState: AppState = {
    ...APP_STATE_MOCK,
    co2UpstreamCalculationResult: {
      calculationResult: {
        unit: 'kg',
        upstreamEmissionFactor: 3,
        upstreamEmissionTotal: 5,
        weight: 0.5,
      },
      isLoading: false,
    },
    frictionCalculationResult: {
      calculationResult: {
        co2_downstream: {
          unit: 'kg',
          value: 32.2,
        },
      },
      isLoading: false,
    },
  };

  describe('getCO2EmissionReport', () => {
    it('should return the co2 emission report data', () => {
      expect(getCO2EmissionReport(mockState)).toMatchSnapshot();
    });
  });

  describe('getSelectedCalculations', () => {
    it('should return the selected calculations', () => {
      expect(getSelectedCalculations(mockState)).toMatchSnapshot();
    });
  });
});
