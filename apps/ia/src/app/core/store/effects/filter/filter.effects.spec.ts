import { AccountInfo } from '@azure/msal-common';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';

import { loginSuccess } from '@schaeffler/azure-auth';

import { IdValue } from '../../../../shared/models';
import { EmployeeService } from '../../../../shared/services/employee.service';
import {
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
} from '../../actions/filter/filter.action';
import { FilterEffects } from './filter.effects';

describe('Filter Effects', () => {
  let spectator: SpectatorService<FilterEffects>;
  let actions$: any;
  let employeesService: EmployeeService;
  let action: any;
  let effects: FilterEffects;

  const error = {
    message: 'An error message occured',
  };

  const createService = createServiceFactory({
    service: FilterEffects,
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
    effects = spectator.inject(FilterEffects);
    employeesService = spectator.inject(EmployeeService);
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

  describe('loginSuccessful$', () => {
    test('should return loadInitialFilters for the first login success event', () => {
      action = loginSuccess({ accountInfo: ({} as unknown) as AccountInfo });
      actions$ = hot('-a', { a: action });
      const result = loadInitialFilters();

      const expected = cold('-(b|)', { b: result });

      expect(effects.loginSuccessful$).toBeObservable(expected);
    });
  });
});
