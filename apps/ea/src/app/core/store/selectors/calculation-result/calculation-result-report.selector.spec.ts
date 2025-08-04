import {
  CATALOG_BEARING_TYPE,
  SLEWING_BEARING_TYPE,
} from '@ea/shared/constants/products';
import {
  APP_STATE_MOCK,
  CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK,
} from '@ea/testing/mocks';
import { DOWNSTREAM_STATE_MOCK } from '@ea/testing/mocks/store/downstream-calculation-state.mock';

import { AppState } from '../../reducers';
import {
  combineLoadcaseResultItemValuesByKey,
  getAllErrors,
  getCalculationsWithResult,
  getCO2EmissionReport,
  getFilteredReportErrors,
  getFrictionalalPowerlossReport,
  getLubricationReport,
  getOverrollingFrequencies,
  getRatingLifeResultReport,
  getReportDownstreamErrors,
  getReportErrors,
  getReportNotes,
  getReportWarnings,
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
          errors: ['Errors'],
          warnings: ['Warnings'],
          notes: ['Notes'],
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

    describe('getReportDownstreamErrors', () => {
      it('should return report downstream errors', () => {
        expect(getReportDownstreamErrors(mockState)).toMatchSnapshot();
      });
    });

    describe('getReportErrors', () => {
      it('should return report errors', () => {
        expect(getReportErrors(mockState)).toMatchSnapshot();
      });
    });

    describe('getReportWarnings', () => {
      it('should return report warnings', () => {
        expect(getReportWarnings(mockState)).toMatchSnapshot();
      });
    });

    describe('when report messages are not defined', () => {
      let stateWithoutMessages: AppState;
      beforeAll(() => {
        stateWithoutMessages = {
          ...APP_STATE_MOCK,
          catalogCalculationResult: { isLoading: false },
        };
      });
      it('should return empty warnings', () => {
        expect(getReportWarnings(stateWithoutMessages)).toMatchSnapshot();
      });

      it('should return empty notes', () => {
        expect(getReportNotes(stateWithoutMessages)).toMatchSnapshot();
      });

      it('should return empty errors', () => {
        expect(getReportErrors(stateWithoutMessages)).toMatchSnapshot();
      });
    });

    describe('getReportNotes', () => {
      it('should return report notes', () => {
        expect(getReportNotes(mockState)).toMatchSnapshot();
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

    describe('getFrictionalPowerlossReport', () => {
      it('should return frictionalPowerloss', () => {
        expect(
          getFrictionalalPowerlossReport({
            ...mockState,
            downstreamCalculationState: {
              ...DOWNSTREAM_STATE_MOCK,
            },
          })
        ).toMatchSnapshot();
      });

      it('should return null result if no value frictionalPowerloss', () => {
        expect(
          getFrictionalalPowerlossReport({
            ...mockState,
            downstreamCalculationState: {},
          })
        ).toMatchSnapshot();
      });
    });

    describe('getLubricationReport', () => {
      it('should return lubrication', () => {
        expect(
          getLubricationReport({
            ...mockState,
            catalogCalculationResult: {
              ...CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK,
            },
          })
        ).toMatchSnapshot();
      });
    });

    describe('getRatingLifeResultReport', () => {
      it('should return ratingLife', () => {
        expect(
          getRatingLifeResultReport({
            ...mockState,
            catalogCalculationResult: {
              ...CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK,
            },
          })
        ).toMatchSnapshot();
      });

      it('should sort results for slewing bearings according to specified order', () => {
        const slewingBearingState = {
          ...mockState,
          productSelection: {
            ...mockState.productSelection,
            bearingProductClass: SLEWING_BEARING_TYPE,
          },
          catalogCalculationResult: {
            ...CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK,
            result: {
              ...CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK.result,
              bearingBehaviour: {
                // These keys map to short values via BEARING_BEHAVIOUR_ABBREVIATIONS_KEY_MAPPING
                lh10: {
                  value: '> 10000000',
                  unit: 'h',
                  title: 'lh10',
                },
                S0_min: {
                  value: '> 100.0',
                  title: 'S0_min',
                },
              },
              loadcaseFactorsAndEquivalentLoads: [
                {
                  lh10_i: {
                    value: '> 10000000',
                    title: 'lh10_i',
                    short: 'Lh10_i',
                    unit: 'h',
                    loadcaseName: 'Load case 1',
                  },
                  s0: {
                    value: '> 100.0',
                    title: 's0',
                    short: 'S0',
                    loadcaseName: 'Load case 1',
                  },
                },
                {
                  lh10_i: {
                    value: '> 10000000',
                    title: 'lh10_i',
                    short: 'Lh10_i',
                    unit: 'h',
                    loadcaseName: 'Load case 2',
                  },
                  s0: {
                    value: '> 100.0',
                    title: 's0',
                    short: 'S0',
                    loadcaseName: 'Load case 2',
                  },
                },
              ],
            },
          },
        };

        const result = getRatingLifeResultReport(slewingBearingState);

        // The sort order should be: Lh10, Lh10_i, S0_min, S0
        const expectedOrder = ['Lh10', 'Lh10_i', 'S0_min', 'S0'];

        // Filter to only the items we care about for sorting test
        const relevantItems = result.filter((item) =>
          expectedOrder.includes(item.short)
        );
        const relevantShorts = relevantItems.map((item) => item.short);

        // For slewing bearings, these should be sorted in the specified order
        expect(relevantShorts).toEqual(expectedOrder);
      });

      it('should not sort results for non-slewing bearings', () => {
        const catalogBearingState = {
          ...mockState,
          productSelection: {
            ...mockState.productSelection,
            bearingProductClass: CATALOG_BEARING_TYPE,
          },
          catalogCalculationResult: {
            isLoading: false,
            result: {
              bearingBehaviour: {
                s0: { value: '> 100.0', title: 's0' },
                lh10: {
                  value: '> 10000000',
                  title: 'lh10',
                  unit: 'h',
                },
                S0_min: { value: '> 100.0', title: 'S0_min' },
              },
            },
          },
        };

        const result = getRatingLifeResultReport(catalogBearingState);

        // For non-slewing bearings, no custom sorting should be applied
        expect(result).toHaveLength(3);
        const shortValues = result.map((item) => item.short);
        // The short values are: 's0' (no mapping), 'Lh10' (mapped from lh10 key), 'S0_min' (mapped from S0_min key)
        expect(shortValues).toEqual(['s0', 'Lh10', 'S0_min']);
      });
    });

    describe('getOverrollingFrequencies', () => {
      it('should return overrollingFrequencies', () => {
        expect(
          getOverrollingFrequencies({
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

    describe('getReportErrors', () => {
      it('should return report errors', () => {
        expect(
          getReportErrors({
            ...mockState,
            catalogCalculationResult: {
              ...CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK,
            },
          })
        ).toMatchSnapshot();
      });
    });

    describe('getFilteredReportErrors', () => {
      it('should remove references to the thermally safe rotation speed', () => {
        const result = getFilteredReportErrors({
          ...mockState,
          catalogCalculationResult: {
            ...CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK,
            result: {
              ...CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK.result,
              reportMessages: {
                ...CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK.result
                  .reportMessages,
                errors: [
                  'This should remain',
                  'This should be sripped thermally safe operating speed',
                  'Diese Zeile sollte entfernt werden thermisch zulässige Drehzahl',
                ],
              },
            },
          },
        });
        expect(result.length).toEqual(1);
      });

      it('the results without mentions of thermally safe operating speed should remain intact', () => {
        const result = getFilteredReportErrors({
          ...mockState,
          catalogCalculationResult: {
            ...CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK,
            result: {
              ...CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK.result,
              reportMessages: {
                ...CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK.result
                  .reportMessages,
                errors: ['This should remain', 'This line should also remain'],
              },
            },
          },
        });
        expect(result.length).toEqual(2);
      });
    });

    describe('getAllErrors', () => {
      it('should return report errors', () => {
        expect(
          getAllErrors({
            ...mockState,
            catalogCalculationResult: {
              ...CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK,
            },
          })
        ).toMatchSnapshot();
      });
    });

    describe('getAllFilteredErrors', () => {
      it('should drop references to frictional powerloss values', () => {
        expect(
          getAllErrors({
            ...mockState,
            catalogCalculationResult: {
              ...CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK,
              result: {
                ...CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK.result,
                reportMessages: {
                  ...CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK.result
                    .reportMessages,
                  errors: [
                    'This should remain',
                    'This line should also remain',
                    'This should be sripped thermally safe operating speed',
                  ],
                },
              },
            },
          })
        ).toMatchSnapshot();
      });
    });

    describe('getReportWarnings', () => {
      it('should return report warnings', () => {
        expect(
          getReportWarnings({
            ...mockState,
            catalogCalculationResult: {
              ...CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK,
            },
          })
        ).toMatchSnapshot();
      });
    });

    describe('getReportNotes', () => {
      it('should return report notes', () => {
        expect(
          getReportNotes({
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
