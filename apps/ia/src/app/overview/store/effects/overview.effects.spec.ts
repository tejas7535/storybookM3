import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';

import {
  filterSelected,
  timeRangeSelected,
  triggerLoad,
} from '../../../core/store/actions';
import { getCurrentFiltersAndTime } from '../../../core/store/selectors';
import {
  AttritionOverTime,
  EmployeesRequest,
  SelectedFilter,
  TimePeriod,
} from '../../../shared/models';
import { EmployeeService } from '../../../shared/services/employee.service';
import {
  loadAttritionOverTimeOverview,
  loadAttritionOverTimeOverviewFailure,
  loadAttritionOverTimeOverviewSuccess,
} from '../actions/overview.action';
import { OverviewEffects } from './overview.effects';

describe('Overview Effects', () => {
  let spectator: SpectatorService<OverviewEffects>;
  let actions$: any;
  let employeesService: EmployeeService;
  let action: any;
  let effects: OverviewEffects;
  let store: MockStore;

  const error = {
    message: 'An error message occured',
  };

  const createService = createServiceFactory({
    service: OverviewEffects,
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
    effects = spectator.inject(OverviewEffects);
    employeesService = spectator.inject(EmployeeService);
    store = spectator.inject(MockStore);
  });

  describe('filterChange$', () => {
    test('filterSelected - should trigger loadAtrritionOverTime + loadOrgChart + loadWorldMap if orgUnit is set', () => {
      const filter = new SelectedFilter('orgUnit', 'best');
      const request = { orgUnit: {} } as unknown as EmployeesRequest;
      action = filterSelected({ filter });
      store.overrideSelector(getCurrentFiltersAndTime, request);
      const resultAttrition = loadAttritionOverTimeOverview({ request });

      actions$ = hot('-a', { a: action });
      const expected = cold('-(b)', {
        b: resultAttrition,
      });

      expect(effects.filterChange$).toBeObservable(expected);
    });

    test('timeRangeSelected - should trigger loadAtrritionOverTime if orgUnit is set', () => {
      const timeRange = '123|456';
      const request = { orgUnit: {} } as unknown as EmployeesRequest;
      action = timeRangeSelected({ timeRange });
      store.overrideSelector(getCurrentFiltersAndTime, request);

      const resultAttrition = loadAttritionOverTimeOverview({ request });

      actions$ = hot('-a', { a: action });
      const expected = cold('-(b)', {
        b: resultAttrition,
      });
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

  describe('loadAttritionOverTimeOverview$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {} as unknown as EmployeesRequest;
      action = loadAttritionOverTimeOverview({ request });
    });

    test('should return loadAttritionOverTimeOverviewSuccess action when REST call is successful', () => {
      const data: AttritionOverTime = { events: [], data: {} };
      const result = loadAttritionOverTimeOverviewSuccess({
        data,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: data,
      });
      const expected = cold('--b', { b: result });

      employeesService.getAttritionOverTime = jest.fn(() => response);

      expect(effects.loadAttritionOverTimeOverview$).toBeObservable(expected);
      expect(employeesService.getAttritionOverTime).toHaveBeenCalledWith(
        request,
        TimePeriod.LAST_THREE_YEARS
      );
    });

    test('should return loadAttritionOverTimeOverviewFailure on REST error', () => {
      const result = loadAttritionOverTimeOverviewFailure({
        errorMessage: error.message,
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      employeesService.getAttritionOverTime = jest.fn(() => response);

      expect(effects.loadAttritionOverTimeOverview$).toBeObservable(expected);
      expect(employeesService.getAttritionOverTime).toHaveBeenCalledWith(
        request,
        TimePeriod.LAST_THREE_YEARS
      );
    });
  });

  describe('ngrxOnInitEffects', () => {
    it('should return triggerLoad Action', () => {
      expect(effects.ngrxOnInitEffects()).toEqual(triggerLoad());
    });
  });
});
