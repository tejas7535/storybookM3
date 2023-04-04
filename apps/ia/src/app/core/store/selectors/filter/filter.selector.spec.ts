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
  getCurrentFilters,
  getCurrentRoute,
  getOrgUnitsLoading,
  getSelectedDimension,
  getSelectedDimensionDataLoading,
  getSelectedDimensionFilter,
  getSelectedDimensionIdValue,
  getSelectedFilters,
  getSelectedFilterValues,
  getSelectedTimePeriod,
  getSelectedTimeRange,
  getSelectOrgUnitValueShort,
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
      selectedDimension: FilterDimension.ORG_UNIT,
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

  describe('getSelectedDimensionDataLoading', () => {
    test('should return loading status', () => {
      expect(getSelectedDimensionDataLoading(fakeState)).toBeTruthy();
    });
  });

  describe('getOrgUnitsLoading', () => {
    test('should return loading status', () => {
      expect(getOrgUnitsLoading(fakeState)).toBeTruthy();
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

  describe('getSelectOrgUnitValueShort', () => {
    test('should return selected org unit without the medium name', () => {
      const idVal = {
        id: 'Schaeffler_IT_1',
        value: 'Schaeffler_IT_1 (Best IT department)',
      };
      const result = getSelectOrgUnitValueShort.projector(idVal);
      expect(result).toEqual('Schaeffler_IT_1');
    });
  });

  describe('getSelectedFilterValues', () => {
    test('should return selected filter values', () => {
      const expectedResult = ['Schaeffler_IT_1', '1/1/2020 - 12/31/2020'];
      expect(getSelectedFilterValues(fakeState)).toEqual(expectedResult);
    });
  });
});
