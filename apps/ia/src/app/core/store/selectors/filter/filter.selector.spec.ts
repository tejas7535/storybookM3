import { FilterKey, IdValue, TimePeriod } from '../../../../shared/models';
import { initialState } from '../../reducers/filter/filter.reducer';
import {
  getAllSelectedFilters,
  getCurrentFiltersAndTime,
  getCurrentRoute,
  getOrgUnitsFilter,
  getOrgUnitsLoading,
  getSelectedFilters,
  getSelectedFilterValues,
  getSelectedOrgUnit,
  getSelectedTimePeriod,
  getSelectedTimeRange,
  getTimePeriods,
} from './filter.selector';

describe('Filter Selector', () => {
  const fakeState = {
    filter: {
      ...initialState,
      orgUnits: {
        loading: true,
        items: [new IdValue('dep1', 'Department 1')],
        errorMessage: '',
      },
      selectedTimeRange: '1577863715000|1609399715000', // 01.01.2020 - 31.12.2020
      selectedFilters: {
        ids: [FilterKey.ORG_UNIT],
        entities: {
          orgUnit: {
            name: FilterKey.ORG_UNIT,
            id: 'Schaeffler_IT_1',
          },
        },
      },
    },
    router: {
      state: {
        url: '/overview',
      },
    },
  };

  describe('getOrgUnitsFilter', () => {
    test('should return organization units filter', () => {
      expect(getOrgUnitsFilter(fakeState).options.length).toEqual(1);
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
      expect(getTimePeriods(fakeState).length).toEqual(4);
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
      expect(getSelectedTimeRange(fakeState)).toEqual(
        '1577863715000|1609399715000'
      );
    });
  });

  describe('getBeautifiedSelectedTimeRange', () => {
    test('should return beautified time range', () => {
      const result = getSelectedTimeRange(fakeState);

      expect(result.match(/\d+\|\d+/).length === 1).toBeTruthy();
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
          name: FilterKey.ORG_UNIT,
          id: 'Schaeffler_IT_1',
        },
      ]);
    });
  });

  describe('getCurrentFiltersAndTime', () => {
    test('should return currently selected filters and time range', () => {
      expect(getCurrentFiltersAndTime(fakeState)).toEqual({
        orgUnit: 'Schaeffler_IT_1',
        timeRange: '1577863715000|1609399715000',
      });
    });
  });

  describe('getSelectedOrgUnit', () => {
    test('should return selected org unit', () => {
      expect(getSelectedOrgUnit(fakeState)).toEqual('Schaeffler_IT_1');
    });
  });

  describe('getSelectedFilterValues', () => {
    test('should return selected filter values', () => {
      const expectedResult = ['Schaeffler_IT_1', '1/1/2020 - 12/31/2020'];
      expect(getSelectedFilterValues(fakeState)).toEqual(expectedResult);
    });
  });
});
