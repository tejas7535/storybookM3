import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { filterSelected, triggerLoad } from '../../../core/store/actions';
import { getCurrentFilters } from '../../../core/store/selectors';
import {
  AttritionOverTime,
  Employee,
  EmployeesRequest,
  FilterKey,
  SelectedFilter,
  TimePeriod,
} from '../../../shared/models';
import { OrganizationalViewService } from '../../organizational-view.service';
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
  let organizationalViewService: OrganizationalViewService;
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
        provide: OrganizationalViewService,
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
    organizationalViewService = spectator.inject(OrganizationalViewService);
    store = spectator.inject(MockStore);
  });

  describe('filterChange$', () => {
    test(
      'filterSelected - should trigger loadAtrritionOverTime + loadOrgChart + loadWorldMap if orgUnit is set',
      marbles((m) => {
        const filter = new SelectedFilter('orgUnit', {
          id: 'best',
          value: 'best',
        });
        const request = {
          orgUnit: filter.idValue.id,
        } as unknown as EmployeesRequest;
        action = filterSelected({ filter });
        store.overrideSelector(getCurrentFilters, request);
        const resultOrg = loadOrgChart({ request });
        const resultWorld = loadWorldMap({ request });
        const resultAttrition = loadAttritionOverTimeOrgChart({
          orgUnit: filter.idValue.id,
        });

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
        const filter = new SelectedFilter('nice', {
          id: 'best',
          value: 'best',
        });
        action = filterSelected({ filter });
        store.overrideSelector(getCurrentFilters, {});

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

        organizationalViewService.getOrgChart = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadOrgChart$).toBeObservable(expected);
        m.flush();
        expect(organizationalViewService.getOrgChart).toHaveBeenCalledWith(
          request
        );
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

        organizationalViewService.getOrgChart = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadOrgChart$).toBeObservable(expected);
        m.flush();
        expect(organizationalViewService.getOrgChart).toHaveBeenCalledWith(
          request
        );
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

        organizationalViewService.getWorldMap = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadWorldMap$).toBeObservable(expected);
        m.flush();
        expect(organizationalViewService.getWorldMap).toHaveBeenCalledWith(
          request
        );
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

        organizationalViewService.getWorldMap = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadWorldMap$).toBeObservable(expected);
        m.flush();
        expect(organizationalViewService.getWorldMap).toHaveBeenCalledWith(
          request
        );
      })
    );
  });

  describe('loadParent$', () => {
    let parentEmployeeId: string;
    let reportDate: string;

    beforeEach(() => {
      parentEmployeeId = '123';
      const employee = {
        parentEmployeeId,
      } as unknown as Employee;

      action = loadParent({ employee });
    });
    test(
      'should return loadParentSuccess action',
      marbles((m) => {
        const resultEmployee = {
          employeeId: '12',
          reportDate: '123',
        } as unknown as Employee;
        const response = m.cold('-a|', {
          a: resultEmployee,
        });
        organizationalViewService.getParentEmployee = jest
          .fn()
          .mockImplementation(() => response);

        actions$ = m.hot('-a', { a: action });
        const result = loadParentSuccess({ employee: resultEmployee });

        const expected = m.cold('--b', { b: result });

        m.expect(effects.loadParent$).toBeObservable(expected);
        m.flush();
        expect(
          organizationalViewService.getParentEmployee
        ).toHaveBeenCalledWith(parentEmployeeId, reportDate);
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

        organizationalViewService.getParentEmployee = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadParent$).toBeObservable(expected);
        m.flush();
        expect(
          organizationalViewService.getParentEmployee
        ).toHaveBeenCalledWith(parentEmployeeId, reportDate);
      })
    );
  });

  describe('loadParentSuccess$', () => {
    test(
      'should return filterSelected action',
      marbles((m) => {
        const employee = {
          orgUnit: 'Schaeffler_IT',
          orgUnitKey: '888',
        } as unknown as Employee;

        action = loadParentSuccess({ employee });

        const filter = {
          name: FilterKey.ORG_UNIT,
          idValue: {
            id: employee.orgUnitKey,
            value: employee.orgUnit,
          },
        };

        actions$ = m.hot('-a', { a: action });
        const result = filterSelected({ filter });

        const expected = m.cold('-b', { b: result });

        m.expect(effects.loadParentSuccess$).toBeObservable(expected);
      })
    );
  });

  describe('loadAttritionOverTimeOrgChart$', () => {
    let orgUnit: string;

    beforeEach(() => {
      orgUnit = 'ACB';
      action = loadAttritionOverTimeOrgChart({ orgUnit });
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

        organizationalViewService.getAttritionOverTime = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadAttritionOverTimeOrgChart$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          organizationalViewService.getAttritionOverTime
        ).toHaveBeenCalledWith(orgUnit, TimePeriod.PLUS_MINUS_THREE_MONTHS);
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

        organizationalViewService.getAttritionOverTime = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadAttritionOverTimeOrgChart$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          organizationalViewService.getAttritionOverTime
        ).toHaveBeenCalledWith(orgUnit, TimePeriod.PLUS_MINUS_THREE_MONTHS);
      })
    );
  });

  describe('ngrxOnInitEffects', () => {
    it('should return triggerLoad Action', () => {
      expect(effects.ngrxOnInitEffects()).toEqual(triggerLoad());
    });
  });
});
