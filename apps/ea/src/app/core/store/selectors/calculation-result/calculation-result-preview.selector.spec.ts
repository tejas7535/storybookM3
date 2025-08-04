import {
  CATALOG_BEARING_TYPE,
  SLEWING_BEARING_TYPE,
} from '@ea/shared/constants/products';
import {
  APP_STATE_MOCK,
  CALCULATION_PARAMETERS_STATE_MOCK,
  CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK,
} from '@ea/testing/mocks';

import { AppState } from '../../reducers';
import {
  co2DownstreamEmissionValue,
  co2Upstream,
  downstreamFrictionalPowerlossValue,
  getCalculationResultPreviewData,
  getFrictionalPreviewData,
  isCalculationResultReportAvailable,
  slewingBearingFrictionalValue,
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

      describe('when all calculations are selected', () => {
        let state: AppState;
        beforeEach(() => {
          state = {
            ...mockState,
            calculationParameters: {
              ...mockState.calculationParameters,
              calculationTypes: {
                emission: {
                  disabled: true,
                  selected: true,
                  visible: true,
                },
                frictionalPowerloss: {
                  disabled: true,
                  selected: true,
                  visible: true,
                },
                lubrication: {
                  disabled: true,
                  selected: true,
                  visible: true,
                },
                overrollingFrequency: {
                  disabled: true,
                  selected: true,
                  visible: true,
                },
                ratingLife: {
                  disabled: true,
                  selected: true,
                  visible: true,
                },
              },
            },
            catalogCalculationResult: {
              ...CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK,
            },
          };
        });

        it('should return preview data for all calculation types', () => {
          expect(getCalculationResultPreviewData(state)).toMatchSnapshot();
        });
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

  describe('co2Downstream', () => {
    it('should return the downstream co2 result', () => {
      expect(co2DownstreamEmissionValue(mockState)).toMatchSnapshot();
    });

    it('should return undefined if no downstream co2 result is available', () => {
      expect(
        co2DownstreamEmissionValue({
          ...mockState,
          cownstreamCalculationState: { isLoading: false, result: {} },
        })
      ).toMatchSnapshot();
    });
  });

  describe('downstreamFrictionalPowerlossValue', () => {
    it('should return the frictional powerloss value', () => {
      expect(downstreamFrictionalPowerlossValue(mockState)).toMatchSnapshot();
    });

    it('should return undefined if no downstream friction result is available', () => {
      expect(
        downstreamFrictionalPowerlossValue({
          ...mockState,
          cownstreamCalculationState: { isLoading: false, result: {} },
        })
      ).toMatchSnapshot();
    });
  });

  describe('slewingBearingFrictionalValue', () => {
    describe('when slewing bearing friction data is available', () => {
      let state: AppState;
      beforeEach(() => {
        state = {
          ...mockState,
          catalogCalculationResult: {
            isLoading: false,
            result: {
              loadcaseFriction: [
                {
                  MR: {
                    value: 125.5,
                    unit: 'Nm',
                    loadcaseName: 'LC1',
                    title: 'MR',
                    short: 'MR',
                  },
                  NR: {
                    value: 100.2,
                    unit: 'W',
                    loadcaseName: 'LC1',
                    title: 'NR',
                    short: 'NR',
                  },
                },
                {
                  MR: {
                    value: 89.7,
                    unit: 'Nm',
                    loadcaseName: 'LC2',
                    title: 'MR',
                    short: 'MR',
                  },
                  NR: {
                    value: 45.3,
                    unit: 'W',
                    loadcaseName: 'LC2',
                    title: 'NR',
                    short: 'NR',
                  },
                },
              ],
            },
          },
          calculationParameters: {
            ...mockState.calculationParameters,
            operationConditions: {
              ...mockState.calculationParameters.operationConditions,
              selectedLoadcase: 0,
            },
          },
        };
      });

      it('should return friction value for selected loadcase with priority key', () => {
        const result = slewingBearingFrictionalValue(state);
        expect(result).toEqual({
          isLoading: false,
          calculationError: undefined,
          unit: 'Nm',
          value: 125.5,
          valueLoadcaseName: 'LC1',
        });
      });

      it('should return friction value for different loadcase', () => {
        const stateWithDifferentLoadcase = {
          ...state,
          calculationParameters: {
            ...state.calculationParameters,
            operationConditions: {
              ...state.calculationParameters.operationConditions,
              selectedLoadcase: 1,
            },
          },
        };
        const result = slewingBearingFrictionalValue(
          stateWithDifferentLoadcase
        );
        expect(result).toEqual({
          isLoading: false,
          calculationError: undefined,
          unit: 'Nm',
          value: 89.7,
          valueLoadcaseName: 'LC2',
        });
      });

      it('should handle loading state', () => {
        const loadingState = {
          ...state,
          catalogCalculationResult: {
            ...state.catalogCalculationResult,
            isLoading: true,
          },
        };
        const result = slewingBearingFrictionalValue(loadingState);
        expect(result.isLoading).toBe(true);
      });

      it('should handle calculation error', () => {
        const errorState = {
          ...state,
          catalogCalculationResult: {
            ...state.catalogCalculationResult,
            result: {
              ...state.catalogCalculationResult.result,
              calculationError: {
                error: 'Calculation failed',
              },
            },
          },
        };
        const result = slewingBearingFrictionalValue(errorState);
        expect(result.calculationError).toBe('Calculation failed');
      });
    });

    describe('when no friction data is available', () => {
      let state: AppState;
      beforeEach(() => {
        state = {
          ...mockState,
          catalogCalculationResult: {
            isLoading: false,
            result: {},
          },
        };
      });

      it('should return empty result with undefined value', () => {
        const result = slewingBearingFrictionalValue(state);
        expect(result).toEqual({
          isLoading: false,
          calculationError: undefined,
          unit: '',
          value: undefined,
        });
      });
    });

    describe('when loadcase index is out of bounds', () => {
      let state: AppState;
      beforeEach(() => {
        state = {
          ...mockState,
          catalogCalculationResult: {
            isLoading: false,
            result: {
              loadcaseFriction: [
                {
                  MR: {
                    value: 125.5,
                    unit: 'Nm',
                    loadcaseName: 'LC1',
                    title: 'MR',
                    short: 'MR',
                  },
                },
              ],
            },
          },
          calculationParameters: {
            ...mockState.calculationParameters,
            operationConditions: {
              ...mockState.calculationParameters.operationConditions,
              selectedLoadcase: 5, // Out of bounds
            },
          },
        };
      });

      it('should return empty result when loadcase index is invalid', () => {
        const result = slewingBearingFrictionalValue(state);
        expect(result).toEqual({
          isLoading: false,
          calculationError: undefined,
          unit: '',
          value: undefined,
        });
      });
    });
  });

  describe('getFrictionalPreviewData', () => {
    describe('when frictional powerloss is not selected', () => {
      let state: AppState;
      beforeEach(() => {
        state = {
          ...mockState,
          calculationParameters: {
            ...mockState.calculationParameters,
            calculationTypes: {
              ...mockState.calculationParameters.calculationTypes,
              frictionalPowerloss: {
                disabled: false,
                selected: false,
                visible: true,
              },
            },
          },
        };
      });

      it('should return undefined', () => {
        const result = getFrictionalPreviewData(state);
        expect(result).toBeUndefined();
      });
    });

    describe('when bearing is slewing bearing type', () => {
      let state: AppState;
      beforeEach(() => {
        state = {
          ...mockState,
          productSelection: {
            ...mockState.productSelection,
            bearingProductClass: SLEWING_BEARING_TYPE,
          },
          catalogCalculationResult: {
            isLoading: false,
            result: {
              loadcaseFriction: [
                {
                  MR: {
                    value: 125.5,
                    unit: 'Nm',
                    loadcaseName: 'LC1',
                    title: 'MR',
                    short: 'MR',
                  },
                },
              ],
            },
          },
          calculationParameters: {
            ...mockState.calculationParameters,
            calculationTypes: {
              ...mockState.calculationParameters.calculationTypes,
              frictionalPowerloss: {
                disabled: false,
                selected: true,
                visible: true,
              },
            },
            operationConditions: {
              ...mockState.calculationParameters.operationConditions,
              selectedLoadcase: 0,
            },
          },
        };
      });

      it('should return slewing bearing specific preview data', () => {
        const result = getFrictionalPreviewData(state);
        expect(result).toEqual({
          title: 'slewingBearingFrictionTitle',
          icon: 'compress',
          values: [
            {
              title: 'slewingBearingFrictionSubtitle',
              calculationWarning: undefined,
              isLoading: false,
              calculationError: undefined,
              unit: 'Nm',
              value: 125.5,
              valueLoadcaseName: 'LC1',
            },
          ],
          // No loadcaseName at item level for slewing bearings
        });
      });

      it('should handle disabled frictional powerloss calculation', () => {
        const disabledState = {
          ...state,
          calculationParameters: {
            ...state.calculationParameters,
            calculationTypes: {
              ...state.calculationParameters.calculationTypes,
              frictionalPowerloss: {
                disabled: true,
                selected: true,
                visible: true,
              },
            },
          },
        };
        const result = getFrictionalPreviewData(disabledState);
        expect(result?.values[0].title).toBeUndefined();
        expect(result?.values[0].calculationWarning).toBe(
          'frictionalPowerlossUnavailable'
        );
      });

      it('should return slewing bearing UI when friction value is not available', () => {
        const stateWithoutFriction = {
          ...state,
          catalogCalculationResult: {
            isLoading: false,
            result: {},
          },
        };
        const result = getFrictionalPreviewData(stateWithoutFriction);
        expect(result).toEqual({
          title: 'slewingBearingFrictionTitle',
          icon: 'compress',
          values: [
            {
              title: 'slewingBearingFrictionSubtitle',
              calculationWarning: undefined,
              isLoading: false,
              calculationError: undefined,
              unit: '',
              value: undefined,
            },
          ],
        });
      });
    });

    describe('when bearing is catalog bearing type', () => {
      let state: AppState;
      beforeEach(() => {
        state = {
          ...mockState,
          productSelection: {
            ...mockState.productSelection,
            bearingProductClass: CATALOG_BEARING_TYPE,
          },
          calculationParameters: {
            ...mockState.calculationParameters,
            calculationTypes: {
              ...mockState.calculationParameters.calculationTypes,
              frictionalPowerloss: {
                disabled: false,
                selected: true,
                visible: true,
              },
            },
            operationConditions: {
              ...mockState.calculationParameters.operationConditions,
              selectedLoadcase: 0,
            },
          },
          downstreamCalculationState: {
            isLoading: false,
            errors: [],
            warnings: [],
            notes: [],
            result: {
              loadcaseEmissions: {
                Workload: {
                  totalFrictionalPowerLoss: 89.2,
                  co2Emissions: 100,
                  co2EmissionsUnit: 'kg',
                  totalFrictionalTorque: 50,
                  operatingTimeInHours: 8760,
                  thermallySafeOperatingSpeed: 1000,
                },
              },
            },
          },
        };
      });

      it('should return catalog bearing specific preview data', () => {
        const result = getFrictionalPreviewData(state);
        expect(result).toEqual({
          title: 'frictionalPowerloss',
          icon: 'compress',
          titleTooltip: 'frictionTitleTooltip',
          titleTooltipUrl: 'frictionTooltipUrl',
          titleTooltipUrlText: 'frictionTooltipUrlText',
          values: [
            {
              title: 'frictionalPowerlossSubtitle',
              calculationWarning: undefined,
              isLoading: false,
              calculationError: undefined,
              unit: 'W',
              value: '≈ 89.2',
            },
          ],
          loadcaseName: 'Workload',
        });
      });

      it('should handle disabled frictional powerloss calculation for catalog bearing', () => {
        const disabledState = {
          ...state,
          calculationParameters: {
            ...state.calculationParameters,
            calculationTypes: {
              ...state.calculationParameters.calculationTypes,
              frictionalPowerloss: {
                disabled: true,
                selected: true,
                visible: true,
              },
            },
          },
        };
        const result = getFrictionalPreviewData(disabledState);
        expect(result?.values[0].title).toBeUndefined();
        expect(result?.values[0].calculationWarning).toBe(
          'frictionalPowerlossUnavailable'
        );
      });
    });
  });
});
