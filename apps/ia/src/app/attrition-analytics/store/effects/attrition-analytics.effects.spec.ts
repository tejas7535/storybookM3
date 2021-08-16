import { marbles } from 'rxjs-marbles/marbles';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { AttritionAnalyticsService } from '../../attrition-analytics.service';
import { EmployeeAnalytics } from '../../models/employee-analytics.model';
import {
  loadEmployeeAnalytics,
  loadEmployeeAnalyticsFailure,
  loadEmployeeAnalyticsSuccess,
} from '../actions/attrition-analytics.action';
import { AttritionAnalyticsEffects } from './attrition-analytics.effects';

describe('Attrition Anayltics Effects', () => {
  let spectator: SpectatorService<AttritionAnalyticsEffects>;
  let actions$: any;
  let employeeAnalyticsService: AttritionAnalyticsService;
  let action: any;
  let effects: AttritionAnalyticsEffects;

  const error = {
    message: 'An error message occured',
  };

  const createService = createServiceFactory({
    service: AttritionAnalyticsEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({}),
      {
        provide: AttritionAnalyticsService,
        useValue: {
          getInitialFilters: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(AttritionAnalyticsEffects);
    employeeAnalyticsService = spectator.inject(AttritionAnalyticsService);
  });

  describe('loadEmployeeAnalytics$', () => {
    beforeEach(() => {
      action = loadEmployeeAnalytics();
    });

    test('should return employeeAnalyticsSuccess when REST call is successful', () => {
      marbles((m) => {
        const employeeAnalytics: EmployeeAnalytics[] = [];
        const result = loadEmployeeAnalyticsSuccess({
          data: employeeAnalytics,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: employeeAnalytics,
        });
        const expected = m.cold('--b|', { b: result });

        employeeAnalyticsService.getEmployeeAnalytics = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadEmployeeAnalytics$).toBeObservable(expected);
        m.flush();
        expect(
          employeeAnalyticsService.getEmployeeAnalytics
        ).toHaveBeenCalledTimes(1);
      });
    });

    test('should return employeeAnalyticsFailure when REST call failed', () => {
      marbles((m) => {
        const result = loadEmployeeAnalyticsFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        employeeAnalyticsService.getEmployeeAnalytics = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadEmployeeAnalytics$).toBeObservable(expected);
        m.flush();
        expect(
          employeeAnalyticsService.getEmployeeAnalytics
        ).toHaveBeenCalledTimes(1);
      });
    });
  });
});
