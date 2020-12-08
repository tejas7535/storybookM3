import { Action } from '@ngrx/store';

import { IdValue, SelectedFilter, TimePeriod } from '../../../../shared/models';
import {
  filterSelected,
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
  timePeriodSelected,
  timeRangeSelected,
} from '../../actions/filter/filter.action';
import { filterReducer, initialState, reducer } from './filter.reducer';

describe('Filter Reducer', () => {
  const errorMessage = 'An error occured';

  describe('loadInitialFilters', () => {
    test('should set loading', () => {
      const action = loadInitialFilters();
      const state = filterReducer(initialState, action);

      expect(state.loading).toBeTruthy();
    });
  });

  describe('loadInitialFiltersSuccess', () => {
    test('should unset loading and set possible filters', () => {
      const filters = {
        orgUnits: [new IdValue('Department1', 'Department1')],
        regionsAndSubRegions: [
          new IdValue('Europe', 'Europe'),
          new IdValue('Americas', 'Americas'),
        ],
        countries: [
          new IdValue('germany', 'Germany'),
          new IdValue('usa', 'USA'),
        ],
        hrLocations: [new IdValue('herzogenaurach', 'Herzogenaurach')],
      };

      const action = loadInitialFiltersSuccess({ filters });

      const state = filterReducer(initialState, action);

      expect(state.loading).toBeFalsy();
      expect(state.orgUnits).toEqual(filters.orgUnits);
      expect(state.regionsAndSubRegions).toEqual(filters.regionsAndSubRegions);
      expect(state.countries).toEqual(filters.countries);
      expect(state.hrLocations).toEqual(filters.hrLocations);
    });
  });

  describe('loadInitialFiltersFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadInitialFiltersFailure({ errorMessage });
      const fakeState = {
        ...initialState,
        loading: true,
      };

      const state = filterReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
      expect(state.errorMessage).toEqual(errorMessage);
    });
  });

  describe('filterSelected', () => {
    test('should add selection', () => {
      const filter = new SelectedFilter('test', '1');
      const action = filterSelected({ filter });

      const state = filterReducer(initialState, action);

      expect(state.selectedFilters.entities).toEqual({
        test: filter,
      });
    });

    test('should update existing selection', () => {
      const filter = new SelectedFilter('test', '1');

      const fakeState = {
        ...initialState,
        selectedFilters: {
          ids: ['test'],
          entities: {
            test: filter,
          },
        },
      };

      const update = new SelectedFilter('test', '3');

      const action = filterSelected({ filter: update });

      const state = filterReducer(fakeState, action);

      expect(state.selectedFilters.entities).toEqual({
        test: update,
      });
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

  describe('timeRangeSelected', () => {
    test('should set time range', () => {
      const timeRange = '123|456';
      const action = timeRangeSelected({ timeRange });

      const state = filterReducer(initialState, action);

      expect(state.selectedTimeRange).toEqual(timeRange);
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
});
