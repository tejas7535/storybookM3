import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';

import { IdValue } from '../../../../shared/models';
import { EmployeeService } from '../../../../shared/services/employee.service';
import {
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
} from '../../actions/employee/employee.action';
import { EmployeeEffects } from './employee.effects';

describe('Employees Effects', () => {
  let spectator: SpectatorService<EmployeeEffects>;
  let actions$: any;
  let employeesService: EmployeeService;
  let action: any;
  let effects: EmployeeEffects;

  const error = {
    error: {
      message: 'An error message occured',
    },
  };

  const createService = createServiceFactory({
    service: EmployeeEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
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
  });

  describe('loadInitialFilters$', () => {
    beforeEach(() => {
      action = loadInitialFilters();
    });

    test('should return loadInitialFiltersSuccess action when REST call is successful', () => {
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
        errorMessage: error.error.message,
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      employeesService.getInitialFilters = jest.fn(() => response);

      expect(effects.loadInitialFilters$).toBeObservable(expected);
      expect(employeesService.getInitialFilters).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngrxOnInitEffects', () => {
    test('should return loadInitialFilters', () => {
      const result = effects.ngrxOnInitEffects();

      expect(result).toEqual(loadInitialFilters());
    });
  });
});
