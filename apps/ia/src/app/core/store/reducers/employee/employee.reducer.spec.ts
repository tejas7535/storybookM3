import { Action } from '@ngrx/store';

import { Filter, IdValue, TimePeriod } from '../../../../shared/models';
import {
  filterSelected,
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
  timePeriodSelected,
  timeRangeSelected,
} from '../../actions/employee/employee.action';
import { employeeReducer, initialState, reducer } from './employee.reducer';

describe('Employees Reducer', () => {
  const errorMessage = 'An error occured';

  describe('loadInitialFilters', () => {
    test('should set loading', () => {
      const action = loadInitialFilters();
      const state = employeeReducer(initialState, action);

      expect(state.filters.loading).toBeTruthy();
    });
  });

  describe('loadInitialFiltersSuccess', () => {
    test('should unset loading and set possible filters', () => {
      const filters = {
        organizations: [new IdValue('Department1', 'Department1')],
        regionsAndSubRegions: [
          new IdValue('Europe', 'Europe'),
          new IdValue('Americas', 'Americas'),
        ],
        countries: [
          new IdValue('germany', 'Germany'),
          new IdValue('usa', 'USA'),
        ],
        locations: [new IdValue('herzogenaurach', 'Herzogenaurach')],
      };

      const action = loadInitialFiltersSuccess({ filters });

      const state = employeeReducer(initialState, action);

      expect(state.filters.loading).toBeFalsy();
      expect(state.filters.organizations).toEqual(filters.organizations);
      expect(state.filters.regionsAndSubRegions).toEqual(
        filters.regionsAndSubRegions
      );
      expect(state.filters.countries).toEqual(filters.countries);
      expect(state.filters.locations).toEqual(filters.locations);
    });
  });

  describe('loadInitialFiltersFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadInitialFiltersFailure({ errorMessage });
      const fakeState = {
        ...initialState,
        filters: { ...initialState.filters, loading: true },
      };

      const state = employeeReducer(fakeState, action);

      expect(state.filters.loading).toBeFalsy();
      expect(state.filters.errorMessage).toEqual(errorMessage);
    });
  });

  describe('filterSelected', () => {
    test('should add selection', () => {
      const filter = new Filter('test', [new IdValue('1', 'testval')]);
      const action = filterSelected({ filter });

      const state = employeeReducer(initialState, action);

      expect(state.filters.selectedFilters.entities).toEqual({
        test: filter,
      });
    });

    test('should update existing selection', () => {
      const filter = new Filter('test', [new IdValue('1', 'testval')]);

      const fakeState = {
        ...initialState,
        filters: {
          ...initialState.filters,
          selectedFilters: {
            ids: ['test'],
            entities: {
              test: filter,
            },
          },
        },
      };

      const update = new Filter('test', [new IdValue('3', 'xd')]);

      const action = filterSelected({ filter: update });

      const state = employeeReducer(fakeState, action);

      expect(state.filters.selectedFilters.entities).toEqual({
        test: update,
      });
    });
  });

  describe('timePeriodSelected', () => {
    test('should set time period', () => {
      const timePeriod = TimePeriod.LAST_12_MONTHS;
      const action = timePeriodSelected({ timePeriod });

      const state = employeeReducer(initialState, action);

      expect(state.filters.selectedTimePeriod).toEqual(timePeriod);
    });
  });

  describe('timeRangeSelected', () => {
    test('should set time range', () => {
      const timeRange = '123|456';
      const action = timeRangeSelected({ timeRange });

      const state = employeeReducer(initialState, action);

      expect(state.filters.selectedTimeRange).toEqual(timeRange);
    });
  });

  describe('Reducer function', () => {
    test('should return searchReducer', () => {
      // prepare any action
      const action: Action = { type: 'Test' };
      expect(reducer(initialState, action)).toEqual(
        employeeReducer(initialState, action)
      );
    });
  });
});
