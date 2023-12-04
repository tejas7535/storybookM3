import {
  APP_STATE_MOCK,
  CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK,
} from '@ea/testing/mocks';

import { AppState } from '../../reducers';
import {
  combineLoadcaseResultItemValuesByKey,
  getCalculationsWithResult,
  getCO2EmissionReport,
  getReportMessages,
  getResultInput,
  getSelectedCalculations,
  pdfReportAvailable,
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

  describe('combineLoadcaseResultItemValuesByKey', () => {
    it('should return loadcase values for specified key', () => {
      const key = 'test';
      const mockResultItems = [
        {
          test: {
            value: 1,
            unit: 'unit',
            short: 'short',
            loadcaseName: 'loadcase1',
            title: 'test',
          },
          ignore: {
            value: -1,
            unit: 'unit',
            short: 'short',
            loadcaseName: 'loadcase1',
            title: 'ignore',
          },
        },
        {
          test: {
            value: 2,
            unit: 'unit',
            short: 'short',
            loadcaseName: 'loadcase2',
            title: 'test',
          },
          ignore: {
            value: -1,
            unit: 'unit',
            short: 'short',
            loadcaseName: 'loadcase2',
            title: 'ignore',
          },
        },
      ];

      const expected = [
        {
          value: 1,
          loadcaseName: 'loadcase1',
        },
        {
          value: 2,
          loadcaseName: 'loadcase2',
        },
      ];

      const result = combineLoadcaseResultItemValuesByKey(mockResultItems, key);

      expect(result).toEqual(expected);
    });
  });

  describe('emptry result', () => {
    describe('getCO2EmissionReport', () => {
      it('should return the co2 emission report data', () => {
        expect(getCO2EmissionReport(mockState)).toMatchSnapshot();
      });
    });

    describe('getCalculationWithResult', () => {
      it('should return the calculations with result', () => {
        expect(getCalculationsWithResult(mockState)).toMatchSnapshot();
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

  describe('full result', () => {
    describe('getCO2EmissionReport', () => {
      it('should return the co2 emission report data', () => {
        expect(
          getCO2EmissionReport({
            ...mockState,
            catalogCalculationResult: {
              ...CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK,
            },
          })
        ).toMatchSnapshot();
      });
    });

    describe('getCalculationWithResult', () => {
      it('should return the calculations with result', () => {
        expect(
          getCalculationsWithResult({
            ...mockState,
            catalogCalculationResult: {
              ...CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK,
            },
          })
        ).toMatchSnapshot();
      });
    });

    describe('getSelectedCalculations', () => {
      it('should return the selected calculations', () => {
        expect(
          getSelectedCalculations({
            ...mockState,
            catalogCalculationResult: {
              ...CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK,
            },
          })
        ).toMatchSnapshot();
      });
    });

    describe('getResultInput', () => {
      it('should return result input', () => {
        expect(
          getResultInput({
            ...mockState,
            catalogCalculationResult: {
              ...CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK,
            },
          })
        ).toMatchSnapshot();
      });
    });

    describe('getReportMessages', () => {
      it('should return report messages', () => {
        expect(
          getReportMessages({
            ...mockState,
            catalogCalculationResult: {
              ...CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK,
            },
          })
        ).toMatchSnapshot();
      });
    });
  });

  describe('pdfReportAvailable', () => {
    it('should be truthy if something is selected', () => {
      expect(pdfReportAvailable(mockState)).toBeTruthy();
    });
  });
});
