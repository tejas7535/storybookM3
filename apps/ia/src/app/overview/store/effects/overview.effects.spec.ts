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
  FilterKey,
  SelectedFilter,
} from '../../../shared/models';
import { EmployeeService } from '../../../shared/services/employee.service';
import { OrgChartEmployee } from '../../org-chart/models/org-chart-employee.model';
import { CountryData } from '../../world-map/models/country-data.model';
import {
  loadAttritionOverTime,
  loadAttritionOverTimeFailure,
  loadAttritionOverTimeSuccess,
  loadOrgChart,
  loadOrgChartFailure,
  loadOrgChartSuccess,
  loadParent,
  loadParentFailure,
  loadParentSuccess,
  loadWorldMap,
  loadWorldMapFailure,
  loadWorldMapSuccess,
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
      const request = ({ orgUnit: {} } as unknown) as EmployeesRequest;
      action = filterSelected({ filter });
      store.overrideSelector(getCurrentFiltersAndTime, request);
      const resultAttrition = loadAttritionOverTime({ request });
      const resultOrg = loadOrgChart({ request });
      const resultWorld = loadWorldMap({ request });

      actions$ = hot('-a', { a: action });
      const expected = cold('-(bcd)', {
        b: resultAttrition,
        c: resultOrg,
        d: resultWorld,
      });

      expect(effects.filterChange$).toBeObservable(expected);
    });

    test('timeRangeSelected - should trigger loadAtrritionOverTime + loadOrgChart + loadWorldMap if orgUnit is set', () => {
      const timeRange = '123|456';
      const request = ({ orgUnit: {} } as unknown) as EmployeesRequest;
      action = timeRangeSelected({ timeRange });
      store.overrideSelector(getCurrentFiltersAndTime, request);

      const resultAttrition = loadAttritionOverTime({ request });
      const resultOrg = loadOrgChart({ request });
      const resultWorld = loadWorldMap({ request });

      actions$ = hot('-a', { a: action });
      const expected = cold('-(bcd)', {
        b: resultAttrition,
        c: resultOrg,
        d: resultWorld,
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

  describe('loadOrgChart$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = ({} as unknown) as EmployeesRequest;
      action = loadOrgChart({ request });
    });

    test('should return loadOrgChartSuccess action when REST call is successful', () => {
      const employees = [
        ({ employeeId: '123' } as unknown) as OrgChartEmployee,
        ({ employeeId: '456' } as unknown) as OrgChartEmployee,
      ];
      const result = loadOrgChartSuccess({
        employees,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: employees,
      });
      const expected = cold('--b', { b: result });

      employeesService.getOrgChart = jest.fn(() => response);

      expect(effects.loadOrgChart$).toBeObservable(expected);
      expect(employeesService.getOrgChart).toHaveBeenCalledWith(request);
    });

    test('should return loadOrgChartFailure on REST error', () => {
      const result = loadOrgChartFailure({
        errorMessage: error.message,
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      employeesService.getOrgChart = jest.fn(() => response);

      expect(effects.loadOrgChart$).toBeObservable(expected);
      expect(employeesService.getOrgChart).toHaveBeenCalledWith(request);
    });
  });

  describe('loadWorldMap$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = ({} as unknown) as EmployeesRequest;
      action = loadWorldMap({ request });
    });

    test('should return loadWorldMapSuccess action when REST call is successful', () => {
      const data = [
        ({ name: 'Germany' } as unknown) as CountryData,
        ({ name: 'Poland' } as unknown) as CountryData,
      ];
      const result = loadWorldMapSuccess({
        data,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: data,
      });
      const expected = cold('--b', { b: result });

      employeesService.getWorldMap = jest.fn(() => response);

      expect(effects.loadWorldMap$).toBeObservable(expected);
      expect(employeesService.getWorldMap).toHaveBeenCalledWith(request);
    });

    test('should return loadWorldMapFailure on REST error', () => {
      const result = loadWorldMapFailure({
        errorMessage: error.message,
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      employeesService.getWorldMap = jest.fn(() => response);

      expect(effects.loadWorldMap$).toBeObservable(expected);
      expect(employeesService.getWorldMap).toHaveBeenCalledWith(request);
    });
  });

  describe('loadParent$', () => {
    let childEmployeeId: string;

    beforeEach(() => {
      childEmployeeId = '123';
      const employee = ({
        employeeId: childEmployeeId,
      } as unknown) as OrgChartEmployee;

      action = loadParent({ employee });
    });
    test('should return loadParentSuccess action', () => {
      const resultEmployee = ({
        employeeId: '12',
      } as unknown) as OrgChartEmployee;
      const response = cold('-a|', {
        a: resultEmployee,
      });
      employeesService.getParentEmployee = jest.fn(() => response);

      actions$ = hot('-a', { a: action });
      const result = loadParentSuccess({ employee: resultEmployee });

      const expected = cold('--b', { b: result });

      expect(effects.loadParent$).toBeObservable(expected);
      expect(employeesService.getParentEmployee).toHaveBeenCalledWith(
        childEmployeeId
      );
    });

    test('should return loadParentFailure on REST error', () => {
      const result = loadParentFailure({
        errorMessage: error.message,
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      employeesService.getParentEmployee = jest.fn(() => response);

      expect(effects.loadParent$).toBeObservable(expected);
      expect(employeesService.getParentEmployee).toHaveBeenCalledWith(
        childEmployeeId
      );
    });
  });

  describe('loadParentSuccess$', () => {
    test('should return filterSelected action', () => {
      const employee = ({
        orgUnit: 'Schaeffler_IT',
      } as unknown) as OrgChartEmployee;

      action = loadParentSuccess({ employee });

      const filter = {
        name: FilterKey.ORG_UNIT,
        value: employee.orgUnit,
      };

      actions$ = hot('-a', { a: action });
      const result = filterSelected({ filter });

      const expected = cold('-b', { b: result });

      expect(effects.loadParentSuccess$).toBeObservable(expected);
    });
  });

  describe('loadAttritionOverTime$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = ({} as unknown) as EmployeesRequest;
      action = loadAttritionOverTime({ request });
    });

    test('should return loadAttritionOverTimeSuccess action when REST call is successful', () => {
      const data: AttritionOverTime = { events: [], data: {} };
      const result = loadAttritionOverTimeSuccess({
        data,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: data,
      });
      const expected = cold('--b', { b: result });

      employeesService.getAttritionOverTime = jest.fn(() => response);

      expect(effects.loadAttritionOverTime$).toBeObservable(expected);
      expect(employeesService.getAttritionOverTime).toHaveBeenCalledWith(
        request
      );
    });

    test('should return loadAttritionOverTimeFailure on REST error', () => {
      const result = loadAttritionOverTimeFailure({
        errorMessage: error.message,
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      employeesService.getAttritionOverTime = jest.fn(() => response);

      expect(effects.loadAttritionOverTime$).toBeObservable(expected);
      expect(employeesService.getAttritionOverTime).toHaveBeenCalledWith(
        request
      );
    });
  });

  describe('ngrxOnInitEffects', () => {
    it('should return triggerLoad Action', () => {
      expect(effects.ngrxOnInitEffects()).toEqual(triggerLoad());
    });
  });
});
