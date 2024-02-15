import {
  EmployeesRequest,
  FilterDimension,
  FilterKey,
  IdValue,
  TimePeriod,
} from '../../../../shared/models';
import { initialState } from '../../reducers/filter/filter.reducer';
import {
  getAllSelectedFilters,
  getAreOpenApplicationsAvailable,
  getBeautifiedFilterValues,
  getBenchmarkDimensionDataLoading,
  getBenchmarkDimensionFilter,
  getCurrentDimensionValue,
  getCurrentFilters,
  getCurrentRoute,
  getSelectedBenchmarkValue,
  getSelectedDimension,
  getSelectedDimensionDataLoading,
  getSelectedDimensionFilter,
  getSelectedDimensionIdValue,
  getSelectedDimensionValue,
  getSelectedFilters,
  getSelectedTimePeriod,
  getSelectedTimeRange,
  getTimePeriods,
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
              id: '1577863715000|1609399715000',
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
              id: '1577863715000|1609399715000',
              value: '1/1/2020 - 12/31/2020',
            },
          },
        },
      },
      selectedDimension: FilterDimension.ORG_UNIT,
      selectedBenchmark: FilterDimension.ORG_UNIT,
      selectedTimePeriod: TimePeriod.LAST_12_MONTHS,
    },
    router: {
      state: {
        url: '/overview',
      },
    },
  };

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

  describe('getCurrentFilters', () => {
    test('should return current filters', () => {
      const result = getCurrentFilters(fakeState);
      expect(result.filterDimension).toEqual(FilterDimension.ORG_UNIT);
      expect(result.value).toEqual('Schaeffler_IT_1');
      expect(result.timeRange).toEqual('1577863715000|1609399715000');
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
        id: '1577863715000|1609399715000',
        value: '1/1/2020 - 12/31/2020',
      });
    });
  });

  describe('getSelectedFilters', () => {
    test('should return selected Filters', () => {
      expect(getSelectedFilters(fakeState)).toEqual(
        fakeState.filter.selectedFilters
      );
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
            id: '1577863715000|1609399715000',
            value: '1/1/2020 - 12/31/2020',
          },
        },
      ]);
    });
  });

  describe('getCurrentFilters', () => {
    test('should return currently selected filters and time range', () => {
      expect(getCurrentFilters(fakeState)).toEqual({
        filterDimension: FilterDimension.ORG_UNIT,
        value: 'Schaeffler_IT_1',
        timeRange: '1577863715000|1609399715000',
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
        timeRange: 'translate it',
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
