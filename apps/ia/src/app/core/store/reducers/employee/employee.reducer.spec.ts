import { Action } from '@ngrx/store';

import {
  Employee,
  EmployeesRequest,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../../../../shared/models';
import {
  filterSelected,
  loadEmployees,
  loadEmployeesFailure,
  loadEmployeesSuccess,
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

      const state = employeeReducer(initialState, action);

      expect(state.filters.loading).toBeFalsy();
      expect(state.filters.orgUnits).toEqual(filters.orgUnits);
      expect(state.filters.regionsAndSubRegions).toEqual(
        filters.regionsAndSubRegions
      );
      expect(state.filters.countries).toEqual(filters.countries);
      expect(state.filters.hrLocations).toEqual(filters.hrLocations);
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
      const filter = new SelectedFilter('test', '1');
      const action = filterSelected({ filter });

      const state = employeeReducer(initialState, action);

      expect(state.filters.selectedFilters.entities).toEqual({
        test: filter,
      });
    });

    test('should update existing selection', () => {
      const filter = new SelectedFilter('test', '1');

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

      const update = new SelectedFilter('test', '3');

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

  describe('loadEmployees', () => {
    test('should set loading', () => {
      const action = loadEmployees({
        request: ({} as unknown) as EmployeesRequest,
      });
      const state = employeeReducer(initialState, action);

      expect(state.employees.loading).toBeTruthy();
    });
  });

  describe('loadEmployeesSuccess', () => {
    test('should unset loading and set employees', () => {
      const employees: Employee[] = [({} as unknown) as Employee];

      const action = loadEmployeesSuccess({ employees });

      const state = employeeReducer(initialState, action);

      expect(state.employees.loading).toBeFalsy();
      expect(state.employees.result).toEqual(employees);
    });
  });

  describe('loadEmployeesFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadEmployeesFailure({ errorMessage });
      const fakeState = {
        ...initialState,
        employees: { ...initialState.employees, loading: true },
      };

      const state = employeeReducer(fakeState, action);

      expect(state.employees.loading).toBeFalsy();
      expect(state.employees.errorMessage).toEqual(errorMessage);
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
