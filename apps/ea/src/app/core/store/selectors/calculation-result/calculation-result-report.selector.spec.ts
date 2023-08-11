import { APP_STATE_MOCK } from '@ea/testing/mocks';

import { AppState } from '../../reducers';
import {
  getCO2EmissionReport,
  getReportMessages,
  getResultInput,
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
    catalogCalculationResult: {
      result: {
        reportInputSuborinates: {
          inputSubordinates: [
            {
              hasNestedStructure: true,
              title: 'some title',
            },
          ],
        },
        reportMessages: {
          messages: [
            {
              title: 'Errors',
            },
            {
              title: 'Warnings',
            },
          ],
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

  describe('getResultInput', () => {
    it('should return result input', () => {
      expect(getResultInput(mockState)).toMatchSnapshot();
    });
  });

  describe('getReportMessages', () => {
    it('should return report messages', () => {
      expect(getReportMessages(mockState)).toMatchSnapshot();
    });
  });
});
