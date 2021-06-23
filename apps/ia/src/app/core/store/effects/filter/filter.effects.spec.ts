import { marbles } from 'rxjs-marbles/jest';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { AccountInfo, loginSuccess } from '@schaeffler/azure-auth';

import { FilterKey, IdValue } from '../../../../shared/models';
import { EmployeeService } from '../../../../shared/services/employee.service';
import {
  filterSelected,
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

  const filters = {
    orgUnits: [new IdValue('Department1', 'Department1')],
  };

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

    test(
      'should return loadInitialFiltersSuccess action when REST call is successful',
      marbles((m) => {
        const result = loadInitialFiltersSuccess({
          filters,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-c', { c: filters });

        const expected = m.cold('--b', { b: result });

        employeesService.getInitialFilters = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadInitialFilters$).toBeObservable(expected);
        m.flush();
        expect(employeesService.getInitialFilters).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should return loadInitialFiltersFailure on REST error',
      marbles((m) => {
        const result = loadInitialFiltersFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        employeesService.getInitialFilters = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadInitialFilters$).toBeObservable(expected);
        m.flush();
        expect(employeesService.getInitialFilters).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('setInitialFilters$', () => {
    test(
      'should set initial org unit filter',
      marbles((m) => {
        const result = filterSelected({
          filter: { name: FilterKey.ORG_UNIT, value: 'Department1' },
        });
        actions$ = m.hot('-a', { a: loadInitialFiltersSuccess({ filters }) });

        const response = m.cold('-a|', {
          a: filters,
        });
        const expected = m.cold('--b', { b: result });

        employeesService.getInitialFilters = jest.fn(() => response);

        m.expect(effects.setInitialFilters$).toBeObservable(expected);
      })
    );
  });

  describe('loginSuccessful$', () => {
    test(
      'should return loadInitialFilters for the first login success event',
      marbles((m) => {
        action = loginSuccess({ accountInfo: {} as unknown as AccountInfo });
        actions$ = m.hot('-a', { a: action });
        const result = loadInitialFilters();

        const expected = m.cold('-(b|)', { b: result });

        m.expect(effects.loginSuccessful$).toBeObservable(expected);
      })
    );
  });
});
