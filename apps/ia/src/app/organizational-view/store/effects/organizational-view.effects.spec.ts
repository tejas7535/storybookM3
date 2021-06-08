/* eslint-disable max-lines */
import { marbles } from 'rxjs-marbles/jest';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

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
  TimePeriod,
} from '../../../shared/models';
import { Employee } from '../../../shared/models/employee.model';
import { EmployeeService } from '../../../shared/services/employee.service';
import { CountryData } from '../../world-map/models/country-data.model';
import {
  loadAttritionOverTimeOrgChart,
  loadAttritionOverTimeOrgChartFailure,
  loadAttritionOverTimeOrgChartSuccess,
  loadOrgChart,
  loadOrgChartFailure,
  loadOrgChartSuccess,
  loadParent,
  loadParentFailure,
  loadParentSuccess,
  loadWorldMap,
  loadWorldMapFailure,
  loadWorldMapSuccess,
} from '../actions/organizational-view.action';
import { OrganizationalViewEffects } from './organizational-view.effects';

describe('Organizational View Effects', () => {
  let spectator: SpectatorService<OrganizationalViewEffects>;
  let actions$: any;
  let employeesService: EmployeeService;
  let action: any;
  let effects: OrganizationalViewEffects;
  let store: MockStore;

  const error = {
    message: 'An error message occured',
  };

  const createService = createServiceFactory({
    service: OrganizationalViewEffects,
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
    effects = spectator.inject(OrganizationalViewEffects);
    employeesService = spectator.inject(EmployeeService);
    store = spectator.inject(MockStore);
  });

  describe('filterChange$', () => {
    test(
      'filterSelected - should trigger loadAtrritionOverTime + loadOrgChart + loadWorldMap if orgUnit is set',
      marbles((m) => {
        const filter = new SelectedFilter('orgUnit', 'best');
        const request = { orgUnit: {} } as unknown as EmployeesRequest;
        action = filterSelected({ filter });
        store.overrideSelector(getCurrentFiltersAndTime, request);
        const resultOrg = loadOrgChart({ request });
        const resultWorld = loadWorldMap({ request });
        const resultAttrition = loadAttritionOverTimeOrgChart({ request });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-(bcd)', {
          b: resultOrg,
          c: resultWorld,
          d: resultAttrition,
        });

        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );

    test(
      'timeRangeSelected - should trigger loadAtrritionOverTime + loadOrgChart + loadWorldMap if orgUnit is set',
      marbles((m) => {
        const timeRange = '123|456';
        const request = { orgUnit: {} } as unknown as EmployeesRequest;
        action = timeRangeSelected({ timeRange });
        store.overrideSelector(getCurrentFiltersAndTime, request);

        const resultOrg = loadOrgChart({ request });
        const resultWorld = loadWorldMap({ request });
        const resultAttrition = loadAttritionOverTimeOrgChart({ request });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-(bcd)', {
          b: resultOrg,
          c: resultWorld,
          d: resultAttrition,
        });
        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );

    test(
      'filterSelected - should do nothing when organization is not set',
      marbles((m) => {
        const filter = new SelectedFilter('nice', 'best');
        action = filterSelected({ filter });
        store.overrideSelector(getCurrentFiltersAndTime, {});

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--');

        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );

    test(
      'timeRangeSelected - should do nothing when organization is not set',
      marbles((m) => {
        const timeRange = '123|456';
        action = timeRangeSelected({ timeRange });
        store.overrideSelector(getCurrentFiltersAndTime, {});

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--');

        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );
  });

  describe('loadOrgChart$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {} as unknown as EmployeesRequest;
      action = loadOrgChart({ request });
    });

    test(
      'should return loadOrgChartSuccess action when REST call is successful',
      marbles((m) => {
        const employees = [
          { employeeId: '123' } as unknown as Employee,
          { employeeId: '456' } as unknown as Employee,
        ];
        const result = loadOrgChartSuccess({
          employees,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: employees,
        });
        const expected = m.cold('--b', { b: result });

        employeesService.getOrgChart = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadOrgChart$).toBeObservable(expected);
        m.flush();
        expect(employeesService.getOrgChart).toHaveBeenCalledWith(request);
      })
    );

    test(
      'should return loadOrgChartFailure on REST error',
      marbles((m) => {
        const result = loadOrgChartFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        employeesService.getOrgChart = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadOrgChart$).toBeObservable(expected);
        m.flush();
        expect(employeesService.getOrgChart).toHaveBeenCalledWith(request);
      })
    );
  });

  describe('loadWorldMap$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {} as unknown as EmployeesRequest;
      action = loadWorldMap({ request });
    });

    test(
      'should return loadWorldMapSuccess action when REST call is successful',
      marbles((m) => {
        const data = [
          { name: 'Germany' } as unknown as CountryData,
          { name: 'Poland' } as unknown as CountryData,
        ];
        const result = loadWorldMapSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        employeesService.getWorldMap = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadWorldMap$).toBeObservable(expected);
        m.flush();
        expect(employeesService.getWorldMap).toHaveBeenCalledWith(request);
      })
    );

    test(
      'should return loadWorldMapFailure on REST error',
      marbles((m) => {
        const result = loadWorldMapFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        employeesService.getWorldMap = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadWorldMap$).toBeObservable(expected);
        m.flush();
        expect(employeesService.getWorldMap).toHaveBeenCalledWith(request);
      })
    );
  });

  describe('loadParent$', () => {
    let childEmployeeId: string;

    beforeEach(() => {
      childEmployeeId = '123';
      const employee = {
        employeeId: childEmployeeId,
      } as unknown as Employee;

      action = loadParent({ employee });
    });
    test(
      'should return loadParentSuccess action',
      marbles((m) => {
        const resultEmployee = {
          employeeId: '12',
        } as unknown as Employee;
        const response = m.cold('-a|', {
          a: resultEmployee,
        });
        employeesService.getParentEmployee = jest
          .fn()
          .mockImplementation(() => response);

        actions$ = m.hot('-a', { a: action });
        const result = loadParentSuccess({ employee: resultEmployee });

        const expected = m.cold('--b', { b: result });

        m.expect(effects.loadParent$).toBeObservable(expected);
        m.flush();
        expect(employeesService.getParentEmployee).toHaveBeenCalledWith(
          childEmployeeId
        );
      })
    );

    test(
      'should return loadParentFailure on REST error',
      marbles((m) => {
        const result = loadParentFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        employeesService.getParentEmployee = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadParent$).toBeObservable(expected);
        m.flush();
        expect(employeesService.getParentEmployee).toHaveBeenCalledWith(
          childEmployeeId
        );
      })
    );
  });

  describe('loadParentSuccess$', () => {
    test(
      'should return filterSelected action',
      marbles((m) => {
        const employee = {
          orgUnit: 'Schaeffler_IT',
        } as unknown as Employee;

        action = loadParentSuccess({ employee });

        const filter = {
          name: FilterKey.ORG_UNIT,
          value: employee.orgUnit,
        };

        actions$ = m.hot('-a', { a: action });
        const result = filterSelected({ filter });

        const expected = m.cold('-b', { b: result });

        m.expect(effects.loadParentSuccess$).toBeObservable(expected);
      })
    );
  });

  describe('loadAttritionOverTimeOrgChart$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {} as unknown as EmployeesRequest;
      action = loadAttritionOverTimeOrgChart({ request });
    });

    test(
      'should return loadAttritionOverTimeOrgChartSuccess action when REST call is successful',
      marbles((m) => {
        const data: AttritionOverTime = { events: [], data: {} };
        const result = loadAttritionOverTimeOrgChartSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        employeesService.getAttritionOverTime = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadAttritionOverTimeOrgChart$).toBeObservable(
          expected
        );
        m.flush();
        expect(employeesService.getAttritionOverTime).toHaveBeenCalledWith(
          request,
          TimePeriod.PLUS_MINUS_THREE_MONTHS
        );
      })
    );

    test(
      'should return loadAttritionOverTimeOrgChartFailure on REST error',
      marbles((m) => {
        const result = loadAttritionOverTimeOrgChartFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        employeesService.getAttritionOverTime = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadAttritionOverTimeOrgChart$).toBeObservable(
          expected
        );
        m.flush();
        expect(employeesService.getAttritionOverTime).toHaveBeenCalledWith(
          request,
          TimePeriod.PLUS_MINUS_THREE_MONTHS
        );
      })
    );
  });

  describe('ngrxOnInitEffects', () => {
    it('should return triggerLoad Action', () => {
      expect(effects.ngrxOnInitEffects()).toEqual(triggerLoad());
    });
  });
});
