import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';

import {
  changeShowAreaFiltersSetting,
  filterSelected,
  timeRangeSelected,
} from '../../../core/store/actions';
import { getCurrentFiltersAndTime } from '../../../core/store/selectors';
import {
  Employee,
  EmployeesRequest,
  SelectedFilter,
} from '../../../shared/models';
import { EmployeeService } from '../../../shared/services/employee.service';
import { ChartType } from '../../models/chart-type.enum';
import {
  chartTypeSelected,
  initOverview,
  loadOrgChart,
  loadOrgChartFailure,
  loadOrgChartSuccess,
} from '../actions/overview.action';
import { getSelectedChartType } from '../selectors/overview.selector';
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
    test('filterSelected - should trigger loadOrgChart if orgUnit is set', () => {
      const filter = new SelectedFilter('orgUnit', 'best');
      const request = ({ orgUnit: {} } as unknown) as EmployeesRequest;
      action = filterSelected({ filter });
      store.overrideSelector(getCurrentFiltersAndTime, request);
      const result = loadOrgChart({ request });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: result });

      expect(effects.filterChange$).toBeObservable(expected);
    });

    test('timeRangeSelected - should trigger loadOrgChart if orgUnit is set', () => {
      const timeRange = '123|456';
      const request = ({ orgUnit: {} } as unknown) as EmployeesRequest;
      action = timeRangeSelected({ timeRange });
      store.overrideSelector(getCurrentFiltersAndTime, request);
      const result = loadOrgChart({ request });

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

  describe('loadOrgChart$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = ({} as unknown) as EmployeesRequest;
      action = loadOrgChart({ request });
    });

    test('should return loadOrgChartSuccess action when REST call is successful', () => {
      const employees = [
        ({ employeeId: '123' } as unknown) as Employee,
        ({ employeeId: '456' } as unknown) as Employee,
      ];
      const result = loadOrgChartSuccess({
        employees,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: employees,
      });
      const expected = cold('--b', { b: result });

      employeesService.getEmployees = jest.fn(() => response);

      expect(effects.loadOrgChart$).toBeObservable(expected);
      expect(employeesService.getEmployees).toHaveBeenCalledWith(request);
    });

    test('should return loadOrgChartFailure on REST error', () => {
      const result = loadOrgChartFailure({
        errorMessage: error.message,
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      employeesService.getEmployees = jest.fn(() => response);

      expect(effects.loadOrgChart$).toBeObservable(expected);
      expect(employeesService.getEmployees).toHaveBeenCalledWith(request);
    });
  });

  describe('changeChartType$', () => {
    test('should return changeShowAreaFiltersSetting', () => {
      action = chartTypeSelected({ chartType: ChartType.HEAT_MAP });

      actions$ = hot('-a', { a: action });

      const result = changeShowAreaFiltersSetting({ show: false });
      const expected = cold('-b', { b: result });

      expect(effects.changeChartType$).toBeObservable(expected);
    });
  });

  describe('init$', () => {
    test('should return changeShowAreaFiltersSetting', () => {
      store.overrideSelector(getSelectedChartType, ChartType.WORLD_MAP);
      action = initOverview();

      actions$ = hot('-a', { a: action });

      const result = changeShowAreaFiltersSetting({ show: true });
      const expected = cold('-b', { b: result });

      expect(effects.init$).toBeObservable(expected);
    });
  });

  describe('ngrxOnInitEffects', () => {
    test('should return initOverview', () => {
      const act: Action = effects.ngrxOnInitEffects();

      expect(act).toEqual(initOverview());
    });
  });
});
