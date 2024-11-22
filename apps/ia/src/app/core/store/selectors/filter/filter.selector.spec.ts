import { AppRoutePath } from '../../../../app-route-path.enum';
import {
  EmployeesRequest,
  FilterDimension,
  FilterKey,
  IdValue,
  TimePeriod,
} from '../../../../shared/models';
import {
  FilterState,
  initialState,
} from '../../reducers/filter/filter.reducer';
import {
  getAllSelectedFilters,
  getAreAllFiltersSelected,
  getAreOpenApplicationsAvailable,
  getBeautifiedFilterValues,
  getBenchmarkDimensionDataLoading,
  getBenchmarkDimensionFilter,
  getCurrentDimensionValue,
  getCurrentFilters,
  getCurrentRoute,
  getLast6MonthsTimeRange,
  getMomentTimeRangeConstraints,
  getSelectedBenchmarkValue,
  getSelectedDimension,
  getSelectedDimensionDataLoading,
  getSelectedDimensionFilter,
  getSelectedDimensionIdValue,
  getSelectedDimensionValue,
  getSelectedFilters,
  getSelectedMomentTimeRange,
  getSelectedTimePeriod,
  getSelectedTimeRange,
  getTimePeriods,
  getTimeRangeForAllAvailableData,
  showBenchmarkFilter,
} from './filter.selector';

describe('Filter Selector', () => {
  const fakeState = {
    filter: {
      ...initialState,
      data: {
        [FilterDimension.ORG_UNIT]: {
          loading: true,
          items: [new IdValue('Schaeffler_IT_1', 'Schaeffler_IT_1')],
          errorMessage: '',
        },
      },
      selectedFilters: {
        ids: [FilterDimension.ORG_UNIT, FilterKey.TIME_RANGE],
        entities: {
          [FilterDimension.ORG_UNIT]: {
            name: FilterDimension.ORG_UNIT,
            idValue: {
              id: 'Schaeffler_IT_1',
              value: 'Schaeffler_IT_1',
            },
          },
          [FilterKey.TIME_RANGE]: {
            name: FilterKey.TIME_RANGE,
            idValue: {
              id: '1577863715|1609399715',
              value: '1/1/2020 - 12/31/2020',
            },
          },
        },
      },
      benchmarkFilters: {
        ids: [FilterDimension.ORG_UNIT, FilterKey.TIME_RANGE],
        entities: {
          [FilterDimension.ORG_UNIT]: {
            name: FilterDimension.ORG_UNIT,
            idValue: {
              id: 'Schaeffler',
              value: 'Schaeffler',
            },
          },
          [FilterKey.TIME_RANGE]: {
            name: FilterKey.TIME_RANGE,
            idValue: {
              id: '1577863715|1609399715',
              value: '1/1/2020 - 12/31/2020',
            },
          },
        },
      },
      selectedDimension: FilterDimension.ORG_UNIT,
      selectedBenchmark: FilterDimension.ORG_UNIT,
      selectedTimePeriod: TimePeriod.LAST_12_MONTHS,
      timeRangeConstraints: {
        min: '1609459200',
        max: '1893455999',
      },
    } as unknown as FilterState,
    router: {
      state: {
        url: `/${AppRoutePath.OverviewPath}`,
      },
    },
  };

  describe('shouldShowBenchmarkFilter', () => {
    test('should return true when url overview', () => {
      expect(showBenchmarkFilter(fakeState)).toBeTruthy();
    });

    test('should return true when url reasons for leaving', () => {
      expect(
        showBenchmarkFilter({
          ...fakeState,
          router: { state: { url: `/${AppRoutePath.ReasonsForLeavingPath}` } },
        })
      ).toBeTruthy();
    });

    test('should return false when url loss of skill', () => {
      expect(
        showBenchmarkFilter({
          ...fakeState,
          router: { state: { url: `/${AppRoutePath.LossOfSkillPath}` } },
        })
      ).toBeFalsy();
    });

    test('should return false when url drill down', () => {
      expect(
        showBenchmarkFilter({
          ...fakeState,
          router: { state: { url: `/${AppRoutePath.DrillDownPath}` } },
        })
      ).toBeFalsy();
    });

    test('should return false when url fluctuation analytics', () => {
      expect(
        showBenchmarkFilter({
          ...fakeState,
          router: {
            state: { url: `/${AppRoutePath.FluctuationAnalyticsPath}` },
          },
        })
      ).toBeFalsy();
    });
  });

  describe('getSelectedDimension', () => {
    test('should return selected dimension', () => {
      expect(getSelectedDimension(fakeState)).toEqual(FilterDimension.ORG_UNIT);
    });
  });

  describe('getSelectedDimensionFilter', () => {
    test('should return organization units filter', () => {
      expect(getSelectedDimensionFilter(fakeState).options.length).toEqual(1);
    });
  });

  describe('getBenchmarkDimensionFilter', () => {
    test('should return benchmark dimension filter', () => {
      const result = getBenchmarkDimensionFilter(fakeState);
      expect(result.name).toEqual('ORG_UNIT');
      expect(result.options.length).toEqual(1);
    });
  });

  describe('getSelectedDimensionDataLoading', () => {
    test('should return loading status', () => {
      expect(getSelectedDimensionDataLoading(fakeState)).toBeTruthy();
    });
  });

  describe('getBenchmarkDimensionDataLoading', () => {
    test('should return loading status', () => {
      expect(getBenchmarkDimensionDataLoading(fakeState)).toBeTruthy();
    });
  });

  describe('getMomentTimeRangeConstraints', () => {
    test('should return moment time range constraints', () => {
      const result = getMomentTimeRangeConstraints.projector(fakeState.filter);
      expect(result.min.unix()).toEqual(1_609_459_200);
      expect(result.max.unix()).toEqual(1_893_455_999);
    });

    test('should return undefined time range constraints', () => {
      const fakeStateNoTimeRangeConstraints = {
        ...fakeState.filter,
        timeRangeConstraints: undefined as any,
      };
      const result = getMomentTimeRangeConstraints.projector(
        fakeStateNoTimeRangeConstraints
      );
      expect(result.min).toBeUndefined();
      expect(result.max).toBeUndefined();
    });
  });

  describe('getCurrentRoute', () => {
    test('should return current route', () => {
      expect(getCurrentRoute(fakeState)).toEqual('/overview');
    });
  });

  describe('getTimePeriods', () => {
    test('should return time periods', () => {
      expect(getTimePeriods(fakeState).length).toEqual(3);
    });
  });

  describe('getSelectedTimePeriod', () => {
    test('should return selected time period', () => {
      expect(getSelectedTimePeriod(fakeState)).toEqual(
        TimePeriod.LAST_12_MONTHS
      );
    });
  });

  describe('getSelectedTimeRange', () => {
    test('should return selected time range', () => {
      expect(getSelectedTimeRange(fakeState)).toEqual({
        id: '1577863715|1609399715',
        value: '1/1/2020 - 12/31/2020',
      });
    });
  });

  describe('getTimeRangeForAllAvailableData', () => {
    test('should return time range since 2021 until 2029 for org unit when today is 2029', () => {
      Date.now = jest.fn().mockReturnValue(new Date('2029-05-13').getTime());

      const result = getTimeRangeForAllAvailableData.projector(
        FilterDimension.ORG_UNIT
      );

      expect(result).toEqual('1609459200|1893455999');
    });
  });

  describe('getLast6MonthsTimeRange', () => {
    test('should return time range for last 6 months when today is 2022-05-04', () => {
      Date.now = jest.fn().mockReturnValue(new Date('2022-05-04').getTime());

      const result = getLast6MonthsTimeRange.projector(
        new IdValue('1577836800|1609372800', '2020-01-01 - 2020-12-31')
      );

      expect(result).toEqual('1593561600|1609459199');
    });
  });

  describe('getSelectedFilters', () => {
    test('should return selected Filters', () => {
      expect(getSelectedFilters(fakeState)).toEqual(
        fakeState.filter.selectedFilters
      );
    });
  });

  describe('getSelectedMomentTimeRange', () => {
    test('should return moment time range', () => {
      const timeRange = new IdValue('1609459200|1893455999', 'XYZ');

      const result = getSelectedMomentTimeRange.projector(timeRange);

      expect(result.from.unix()).toEqual(1_609_459_200);
      expect(result.to.unix()).toEqual(1_893_455_999);
    });

    test('should return undefined time range', () => {
      const timeRange = new IdValue(undefined, undefined);

      const result = getSelectedMomentTimeRange.projector(timeRange);
      expect(result.from).toBeUndefined();
      expect(result.to).toBeUndefined();
    });
  });

  describe('getAreAllFiltersSelected', () => {
    test('should return true when dimension, value and time range selected', () => {
      const result = getAreAllFiltersSelected.projector({
        filterDimension: FilterDimension.BOARD,
        value: 'Schaeffler_IT_1',
        timeRange: '1577863715|1609399715',
      });

      expect(result).toBeTruthy();
    });

    test('should return false when dimension not selected', () => {
      const result = getAreAllFiltersSelected.projector({
        filterDimension: undefined,
        value: 'Schaeffler_IT_1',
        timeRange: '1577863715|1609399715',
      });

      expect(result).toBeFalsy();
    });

    test('should return false when value not selected', () => {
      const result = getAreAllFiltersSelected.projector({
        filterDimension: FilterDimension.BOARD,
        value: undefined,
        timeRange: '1577863715|1609399715',
      });

      expect(result).toBeFalsy();
    });

    test('should return false when time range not selected', () => {
      const result = getAreAllFiltersSelected.projector({
        filterDimension: FilterDimension.BOARD,
        value: 'abc',
        timeRange: undefined,
      });

      expect(result).toBeFalsy();
    });
  });

  describe('getAllSelectedFilters', () => {
    test('should return all selected filters', () => {
      expect(getAllSelectedFilters(fakeState)).toEqual([
        {
          name: FilterDimension.ORG_UNIT,
          idValue: {
            id: 'Schaeffler_IT_1',
            value: 'Schaeffler_IT_1',
          },
        },
        {
          name: FilterKey.TIME_RANGE,
          idValue: {
            id: '1577863715|1609399715',
            value: '1/1/2020 - 12/31/2020',
          },
        },
      ]);
    });
  });

  describe('getCurrentFilters and time range', () => {
    test('should return currently selected filters and time range', () => {
      expect(getCurrentFilters(fakeState)).toEqual({
        filterDimension: FilterDimension.ORG_UNIT,
        value: 'Schaeffler_IT_1',
        timeRange: '1577863715|1609399715',
      } as EmployeesRequest);
    });
  });

  describe('getSelectedDimensionIdValue', () => {
    test('should return selected org unit', () => {
      expect(getSelectedDimensionIdValue(fakeState)).toEqual({
        id: 'Schaeffler_IT_1',
        value: 'Schaeffler_IT_1',
      });
    });
  });

  describe('getSelectedDimensionValue', () => {
    test('should return selected dimension value', () => {
      const idVal = {
        id: 'Schaeffler_IT_1',
        value: 'Schaeffler_IT_1 (Best IT department)',
      };
      const result = getSelectedDimensionValue.projector(idVal);
      expect(result).toEqual('Schaeffler_IT_1 (Best IT department)');
    });
  });

  describe('getSelectedBenchmarkValue', () => {
    test('should return benchmark dimension value', () => {
      const idVal = {
        id: 'Schaeffler',
        value: 'Schaeffler (Best IT department)',
      };
      expect(getSelectedBenchmarkValue.projector(idVal)).toEqual(
        'Schaeffler (Best IT department)'
      );
    });
  });

  describe('getBeautifiedFilterValues', () => {
    test('should return selected filter values when last 12 months', () => {
      const expectedResult = {
        timeRange: 'January 2020 - December 2020',
        value: 'Schaeffler_IT_1',
        filterDimension: 'translate it',
      };
      expect(getBeautifiedFilterValues(fakeState)).toEqual(expectedResult);
    });

    test('should return selected filter values when month', () => {
      const expectedResult = {
        timeRange: 'March 2021',
        value: 'Schaeffler_IT_1',
        filterDimension: 'translate it',
      };
      const monthFakeState = {
        ...fakeState,
        filter: {
          ...fakeState.filter,
          selectedTimePeriod: TimePeriod.MONTH,
          selectedFilters: {
            ids: [FilterDimension.ORG_UNIT, FilterKey.TIME_RANGE],
            entities: {
              [FilterDimension.ORG_UNIT]: {
                name: FilterDimension.ORG_UNIT,
                idValue: {
                  id: 'Schaeffler_IT_1',
                  value: 'Schaeffler_IT_1',
                },
              },
              [FilterKey.TIME_RANGE]: {
                name: FilterKey.TIME_RANGE,
                idValue: {
                  id: '1615161600|1615161600',
                },
              },
            },
          },
        },
      };

      const result = getBeautifiedFilterValues(monthFakeState);

      expect(result).toEqual(expectedResult);
    });

    test('should return selected filter values when year', () => {
      const expectedResult = {
        timeRange: '2021',
        value: 'Schaeffler_IT_1',
        filterDimension: 'translate it',
      };
      const yearFakeState = {
        ...fakeState,
        filter: {
          ...fakeState.filter,
          selectedTimePeriod: TimePeriod.YEAR,
          selectedFilters: {
            ids: [FilterDimension.ORG_UNIT, FilterKey.TIME_RANGE],
            entities: {
              [FilterDimension.ORG_UNIT]: {
                name: FilterDimension.ORG_UNIT,
                idValue: {
                  id: 'Schaeffler_IT_1',
                  value: 'Schaeffler_IT_1',
                },
              },
              [FilterKey.TIME_RANGE]: {
                name: FilterKey.TIME_RANGE,
                idValue: {
                  id: '1615161600|1615161600',
                },
              },
            },
          },
        },
      };

      expect(getBeautifiedFilterValues(yearFakeState)).toEqual(expectedResult);
    });
  });

  describe('getCurrentDimensionValue', () => {
    test('should get short name for org unit', () => {
      const expectedResult = 'Schaeffler_IT_1';
      const orgUnitFakeState = {
        ...fakeState,
        filter: {
          ...fakeState.filter,
          selectedFilters: {
            ids: [FilterDimension.ORG_UNIT],
            entities: {
              [FilterDimension.ORG_UNIT]: {
                name: FilterDimension.ORG_UNIT,
                idValue: {
                  id: 'Schaeffler_IT_1',
                  value: 'Schaeffler_IT_1 (long text)',
                },
              },
            },
          },
        },
      };

      const result = getCurrentDimensionValue(orgUnitFakeState);

      expect(result).toEqual(expectedResult);
    });

    test('should get name for other dimension', () => {
      const expectedResult = 'Schaeffler_IT_1 (long text)';
      const orgUnitFakeState = {
        ...fakeState,
        filter: {
          ...fakeState.filter,
          selectedFilters: {
            ids: [FilterDimension.BOARD],
            entities: {
              [FilterDimension.BOARD]: {
                name: FilterDimension.BOARD,
                idValue: {
                  id: 'Schaeffler_IT_1',
                  value: 'Schaeffler_IT_1 (long text)',
                },
              },
            },
          },
          selectedDimension: FilterDimension.BOARD,
        },
      };

      const result = getCurrentDimensionValue(orgUnitFakeState);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAreOpenApplicationsAvailable', () => {
    test('should return false when open applications not available for function', () => {
      const result = getAreOpenApplicationsAvailable.projector(
        FilterDimension.FUNCTION
      );

      expect(result).toBeFalsy();
    });

    test('should return false when open applications not available for hr location', () => {
      const result = getAreOpenApplicationsAvailable.projector(
        FilterDimension.HR_LOCATION
      );

      expect(result).toBeFalsy();
    });

    test('should return false when open applications not available for personal area', () => {
      const result = getAreOpenApplicationsAvailable.projector(
        FilterDimension.PERSONAL_AREA
      );

      expect(result).toBeFalsy();
    });

    test('should return true when open applications available for org unit', () => {
      const result = getAreOpenApplicationsAvailable.projector(
        FilterDimension.ORG_UNIT
      );

      expect(result).toBeTruthy();
    });
  });
});
