import { Action } from '@ngrx/store';

import { Filter, IdValue } from '../../../../shared/models';
import {
  filterSelected,
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
} from '../../actions/employee/employee.action';
import { employeesReducer, initialState, reducer } from './employee.reducer';

describe('Employees Reducer', () => {
  const errorMessage = 'An error occured';

  describe('loadInitialFilters', () => {
    test('should set loading', () => {
      const action = loadInitialFilters();
      const state = employeesReducer(initialState, action);

      expect(state.filters.loading).toBeTruthy();
    });
  });

  describe('loadInitialFiltersSuccess', () => {
    test('should unset loading and set possible filters', () => {
      const filters = {
        organizations: [new IdValue('Department1', 'Department1')],
        regionAndSubRegions: [
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

      const state = employeesReducer(initialState, action);

      expect(state.filters.loading).toBeFalsy();
      expect(state.filters.organizations).toEqual(filters.organizations);
      expect(state.filters.regionAndSubRegions).toEqual(
        filters.regionAndSubRegions
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

      const state = employeesReducer(fakeState, action);

      expect(state.filters.loading).toBeFalsy();
      expect(state.filters.errorMessage).toEqual(errorMessage);
    });
  });

  describe('filterSelected', () => {
    test('should add selection', () => {
      const filter = new Filter('test', [new IdValue('1', 'testval')]);
      const action = filterSelected({ filter });

      const state = employeesReducer(initialState, action);

      expect(state.filters.currentSelection.entities).toEqual({
        test: filter,
      });
    });

    test('should update existing selection', () => {
      const filter = new Filter('test', [new IdValue('1', 'testval')]);

      const fakeState = {
        ...initialState,
        filters: {
          ...initialState.filters,
          currentSelection: {
            ids: ['test'],
            entities: {
              test: filter,
            },
          },
        },
      };

      const update = new Filter('test', [new IdValue('3', 'xd')]);

      const action = filterSelected({ filter: update });

      const state = employeesReducer(fakeState, action);

      expect(state.filters.currentSelection.entities).toEqual({
        test: update,
      });
    });
  });

  describe('Reducer function', () => {
    test('should return searchReducer', () => {
      // prepare any action
      const action: Action = { type: 'Test' };
      expect(reducer(initialState, action)).toEqual(
        employeesReducer(initialState, action)
      );
    });
  });
});
