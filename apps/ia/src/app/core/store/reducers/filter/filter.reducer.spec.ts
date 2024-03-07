import { Action } from '@ngrx/store';
import moment from 'moment';

import {
  FilterDimension,
  FilterKey,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../../../../shared/models';
import {
  benchmarkFilterSelected,
  filterDimensionSelected,
  filterSelected,
  loadFilterBenchmarkDimensionData,
  loadFilterDimensionData,
  loadFilterDimensionDataFailure,
  loadFilterDimensionDataSuccess,
  timePeriodSelected,
} from '../../actions/filter/filter.action';
import {
  filterReducer,
  getInitialSelectedTimeRange,
  initialState,
  reducer,
} from './filter.reducer';

describe('Filter Reducer', () => {
  const errorMessage = 'An error occured';

  describe('loadFilterDimensionData', () => {
    test('should set loading and selected dimension', () => {
      const searchFor = 'search';
      const filterDimension = FilterDimension.ORG_UNIT;
      const action = loadFilterDimensionData({
        filterDimension,
        searchFor,
      });
      const state = filterReducer(initialState, action);

      expect(state.data.ORG_UNIT.loading).toBeTruthy();
      expect(state.selectedDimension).toEqual(filterDimension);
    });
  });

  describe('loadFilterBenchmarkDimensionData', () => {
    test('should set loading and benchmark dimension', () => {
      const searchFor = 'search';
      const filterDimension = FilterDimension.ORG_UNIT;
      const action = loadFilterBenchmarkDimensionData({
        filterDimension,
        searchFor,
      });
      const state = filterReducer(initialState, action);

      expect(state.data.ORG_UNIT.loading).toBeTruthy();
      expect(state.benchmarkDimension).toEqual(filterDimension);
    });
  });

  describe('loadFilterDimensionDataSuccess', () => {
    test('should unset loading and set filter options', () => {
      const items = [new IdValue('Department1', 'Department1')];

      const action = loadFilterDimensionDataSuccess({
        filterDimension: FilterDimension.ORG_UNIT,
        items,
      });

      const state = filterReducer(initialState, action);

      expect(state.data.ORG_UNIT.loading).toBeFalsy();
      expect(state.data.ORG_UNIT.items).toEqual(items);
    });
  });

  describe('loadOrgUnitsFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadFilterDimensionDataFailure({
        filterDimension: FilterDimension.ORG_UNIT,
        errorMessage,
      });
      const fakeState = {
        ...initialState,
        orgUnits: {
          ...initialState.data.ORG_UNIT,
          loading: true,
          errorMessage: '',
        },
      };

      const state = filterReducer(fakeState, action);

      expect(state.data.ORG_UNIT.loading).toBeFalsy();
      expect(state.data.ORG_UNIT.errorMessage).toEqual(errorMessage);
    });
  });

  describe('filterSelected', () => {
    test('should add selection', () => {
      const filter = new SelectedFilter('test', {
        id: '1',
        value: '1',
      });
      const action = filterSelected({ filter });

      const state = filterReducer(initialState, action);

      expect(state.selectedFilters.entities.test).toEqual(filter);
    });

    test('should update existing selection', () => {
      const filter = new SelectedFilter('test', {
        id: '1',
        value: '1',
      });

      const fakeState = {
        ...initialState,
        selectedFilters: {
          ids: ['test'],
          entities: {
            test: filter,
          },
        },
      };

      const update = new SelectedFilter('test', {
        id: '3',
        value: '3',
      });

      const action = filterSelected({ filter: update });

      const state = filterReducer(fakeState, action);

      expect(state.selectedFilters.entities).toEqual({
        test: update,
      });
    });

    test('should update both filters on time range change', () => {
      const filter = new SelectedFilter(FilterKey.TIME_RANGE, {
        id: '1',
        value: '1',
      });

      const fakeState = {
        ...initialState,
        selectedFilters: {
          ids: [FilterKey.TIME_RANGE],
          entities: {
            [FilterKey.TIME_RANGE]: filter,
          },
        },
        benchmarkFilters: {
          ids: [FilterKey.TIME_RANGE],
          entities: {
            [FilterKey.TIME_RANGE]: filter,
          },
        },
      };

      const update = new SelectedFilter(FilterKey.TIME_RANGE, {
        id: '3',
        value: '3',
      });

      const action = filterSelected({ filter: update });

      const state = filterReducer(fakeState, action);

      expect(state.selectedFilters.entities).toEqual({
        [FilterKey.TIME_RANGE]: update,
      });
      expect(state.benchmarkFilters.entities).toEqual({
        [FilterKey.TIME_RANGE]: update,
      });
    });

    test('should update selectedDimension', () => {
      const filter = new SelectedFilter('BOARD', {
        id: '1',
        value: '1',
      });

      const action = filterSelected({ filter });

      const state = filterReducer(initialState, action);

      expect(state.selectedDimension).toEqual(FilterDimension.BOARD);
    });
  });

  describe('timePeriodSelected', () => {
    test('should set time period', () => {
      const timePeriod = TimePeriod.LAST_12_MONTHS;
      const action = timePeriodSelected({ timePeriod });

      const state = filterReducer(initialState, action);

      expect(state.selectedTimePeriod).toEqual(timePeriod);
    });
  });

  describe('benchmarkFilterSelected', () => {
    test('should add benchmark filter', () => {
      const filterDimension = FilterDimension.BOARD;
      const filter: SelectedFilter = {
        idValue: { id: 'a', value: 'b' },
        name: filterDimension,
      };
      const action = benchmarkFilterSelected({ filter });

      const state = filterReducer(initialState, action);

      const result = state.benchmarkFilters.entities[filterDimension];
      expect(result).toEqual(filter);
    });
  });

  describe('filterDimensionSelected', () => {
    test('should add selected filter and set selected dimension', () => {
      const filterDimension = FilterDimension.BOARD;
      const filter: SelectedFilter = {
        idValue: { id: 'a', value: 'b' },
        name: filterDimension,
      };
      const action = filterDimensionSelected({ filter, filterDimension });

      const state = filterReducer(initialState, action);

      const result = state.selectedFilters.entities[filterDimension];
      expect(result).toEqual(filter);
      expect(state.selectedDimension).toEqual(filterDimension);
    });
  });

  describe('Reducer function', () => {
    test('should return searchReducer', () => {
      // prepare any action
      const action: Action = { type: 'Test' };
      expect(reducer(initialState, action)).toEqual(
        filterReducer(initialState, action)
      );
    });
  });

  describe('getInitialSelectedTimeRange', () => {
    test('should return one month earlier when 9th day of month', () => {
      const today = moment.utc({ year: 2022, month: 5, day: 9 });

      const result = getInitialSelectedTimeRange(today);

      expect(result).toBe('1619827200|1651363199'); // 01-05-2021|30-04-2022
    });

    test('should return one month later when 14th day of month', () => {
      const today = moment.utc({ year: 2022, month: 5, day: 14 });

      const result = getInitialSelectedTimeRange(today);

      expect(result).toBe('1622505600|1654041599'); // 01-06-2021|31-05-2022
    });
  });
});
