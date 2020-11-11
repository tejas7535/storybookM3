import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';

import { loginSuccess } from '@schaeffler/auth';

import {
  Employee,
  EmployeesRequest,
  IdValue,
  SelectedFilter,
} from '../../../../shared/models';
import { EmployeeService } from '../../../../shared/services/employee.service';
import {
  filterSelected,
  loadEmployees,
  loadEmployeesFailure,
  loadEmployeesSuccess,
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
  timeRangeSelected,
} from '../../actions/employee/employee.action';
import { getCurrentFiltersAndTime } from '../../selectors';
import { EmployeeEffects } from './employee.effects';

describe('Employees Effects', () => {
  let spectator: SpectatorService<EmployeeEffects>;
  let actions$: any;
  let employeesService: EmployeeService;
  let action: any;
  let effects: EmployeeEffects;
  let store: MockStore;

  const error = {
    message: 'An error message occured',
  };

  const createService = createServiceFactory({
    service: EmployeeEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({}),
      {
        provide: EmployeeService,
        useValue: {
          getInitialFilters: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(EmployeeEffects);
    employeesService = spectator.inject(EmployeeService);
    store = spectator.inject(MockStore);
  });

  describe('loadInitialFilters$', () => {
    beforeEach(() => {
      action = loadInitialFilters();
    });

    test('should return loadInitialFiltersSuccess action when REST call is successful', () => {
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
      const result = loadInitialFiltersSuccess({
        filters,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: filters,
      });
      const expected = cold('--b', { b: result });

      employeesService.getInitialFilters = jest.fn(() => response);

      expect(effects.loadInitialFilters$).toBeObservable(expected);
      expect(employeesService.getInitialFilters).toHaveBeenCalledTimes(1);
    });

    test('should return loadInitialFiltersFailure on REST error', () => {
      const result = loadInitialFiltersFailure({
        errorMessage: error.message,
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      employeesService.getInitialFilters = jest.fn(() => response);

      expect(effects.loadInitialFilters$).toBeObservable(expected);
      expect(employeesService.getInitialFilters).toHaveBeenCalledTimes(1);
    });
  });

  describe('filterChange$', () => {
    test('filterSelected - should trigger loadEmployees if orgUnit is set', () => {
      const filter = new SelectedFilter('orgUnit', 'best');
      const request = ({ orgUnit: {} } as unknown) as EmployeesRequest;
      action = filterSelected({ filter });
      store.overrideSelector(getCurrentFiltersAndTime, request);
      const result = loadEmployees({ request });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: result });

      expect(effects.filterChange$).toBeObservable(expected);
    });

    test('timeRangeSelected - should trigger loadEmployees if orgUnit is set', () => {
      const timeRange = '123|456';
      const request = ({ orgUnit: {} } as unknown) as EmployeesRequest;
      action = timeRangeSelected({ timeRange });
      store.overrideSelector(getCurrentFiltersAndTime, request);
      const result = loadEmployees({ request });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: result });

      expect(effects.filterChange$).toBeObservable(expected);
    });

    test('filterSelected - should do nothing when organization is not set', () => {
      const filter = new SelectedFilter('nice', 'best');
      action = filterSelected({ filter });
      store.overrideSelector(getCurrentFiltersAndTime, {});

      actions$ = hot('-a', { a: action });
      const expected = cold('--');

      expect(effects.filterChange$).toBeObservable(expected);
    });

    test('timeRangeSelected - should do nothing when organization is not set', () => {
      const timeRange = '123|456';
      action = timeRangeSelected({ timeRange });
      store.overrideSelector(getCurrentFiltersAndTime, {});

      actions$ = hot('-a', { a: action });
      const expected = cold('--');

      expect(effects.filterChange$).toBeObservable(expected);
    });
  });

  describe('loadEmployees$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = ({} as unknown) as EmployeesRequest;
      action = loadEmployees({ request });
    });

    test('should return loadEmployeesSuccess action when REST call is successful', () => {
      const employees = [
        ({ employeeId: '123' } as unknown) as Employee,
        ({ employeeId: '456' } as unknown) as Employee,
      ];
      const result = loadEmployeesSuccess({
        employees,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: employees,
      });
      const expected = cold('--b', { b: result });

      employeesService.getEmployees = jest.fn(() => response);

      expect(effects.loadEmployees$).toBeObservable(expected);
      expect(employeesService.getEmployees).toHaveBeenCalledWith(request);
    });

    test('should return loadEmployeesFailure on REST error', () => {
      const result = loadEmployeesFailure({
        errorMessage: error.message,
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      employeesService.getEmployees = jest.fn(() => response);

      expect(effects.loadEmployees$).toBeObservable(expected);
      expect(employeesService.getEmployees).toHaveBeenCalledWith(request);
    });
  });

  describe('loginSuccessful$', () => {
    test('should return loadInitialFilters for the first login success event', () => {
      action = loginSuccess({ user: {} });
      actions$ = hot('-a', { a: action });
      const result = loadInitialFilters();

      const expected = cold('-(b|)', { b: result });

      expect(effects.loginSuccessful$).toBeObservable(expected);
    });
  });
});
