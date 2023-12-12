import { EMPTY } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { RouterReducerState } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { AppRoutePath } from '../../../app-route-path.enum';
import { RouterStateUrl, selectRouterState } from '../../../core/store';
import {
  filterSelected,
  loadFilterDimensionData,
} from '../../../core/store/actions';
import {
  getCurrentDimensionValue,
  getCurrentFilters,
  getSelectedDimension,
  getSelectedTimeRange,
} from '../../../core/store/selectors';
import {
  AttritionOverTime,
  EmployeeAttritionMeta,
  EmployeesRequest,
  FilterDimension,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../../../shared/models';
import { DimensionFluctuationData } from '../../models';
import {
  DimensionParentResponse,
  OrgChartEmployee,
} from '../../org-chart/models';
import { OrganizationalViewService } from '../../organizational-view.service';
import { CountryDataAttrition } from '../../world-map/models/country-data-attrition.model';
import {
  loadChildAttritionOverTimeForWorldMap,
  loadChildAttritionOverTimeOrgChart,
  loadChildAttritionOverTimeOrgChartFailure,
  loadChildAttritionOverTimeOrgChartSuccess,
  loadOrganizationalViewData,
  loadOrgChart,
  loadOrgChartEmployees,
  loadOrgChartEmployeesFailure,
  loadOrgChartEmployeesSuccess,
  loadOrgChartFailure,
  loadOrgChartFluctuationMeta,
  loadOrgChartFluctuationRate,
  loadOrgChartFluctuationRateFailure,
  loadOrgChartFluctuationRateSuccess,
  loadOrgChartSuccess,
  loadParent,
  loadParentAttritionOverTimeOrgChart,
  loadParentAttritionOverTimeOrgChartFailure,
  loadParentAttritionOverTimeOrgChartSuccess,
  loadParentFailure,
  loadParentSuccess,
  loadWorldMap,
  loadWorldMapFailure,
  loadWorldMapSuccess,
} from '../actions/organizational-view.action';
import { getWorldMap } from '../selectors/organizational-view.selector';
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
      'should return loadOrganizationalViewData when url /organizational-view',
      marbles((m) => {
        store.overrideSelector(selectRouterState, {
          state: {
            url: `/${AppRoutePath.DrillDownPath}`,
          },
        } as RouterReducerState<RouterStateUrl>);
        action = loadOrganizationalViewData();
        actions$ = m.hot('-', { a: action });
        const expected = m.cold('-');

        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );

    test(
      'should not return loadOverviewData when url different than /organizational-view',
      marbles((m) => {
        store.overrideSelector(selectRouterState, {
          state: {
            url: `/different-path`,
          },
        } as RouterReducerState<RouterStateUrl>);
        actions$ = m.hot('-', { a: EMPTY });
        const expected = m.cold('-');

        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );
  });

  describe('loadOrganitzationalViewData$', () => {
    test(
      'loadOrganizationalViewData - should trigger loadAtrritionOverTime + loadOrgChart + loadWorldMap if orgUnit is set',
      marbles((m) => {
        const filter = new SelectedFilter('orgUnit', {
          id: 'best',
          value: 'best',
        });
        const request = {
          filterDimension: FilterDimension.ORG_UNIT,
          value: filter.idValue.id,
          timeRange: '123',
        } as EmployeesRequest;
        const dimensionName = 'SH/ZHZ';
        action = loadOrganizationalViewData();
        store.overrideSelector(getCurrentFilters, {
          filterDimension: request.filterDimension,
          value: request.value,
          timeRange: request.timeRange,
        });
        store.overrideSelector(getCurrentDimensionValue, dimensionName);
        const resultOrg = loadOrgChart({
          request: {
            filterDimension: request.filterDimension,
            value: request.value,
            timeRange: request.timeRange,
          },
        });
        const resultWorld = loadWorldMap({
          request: {
            filterDimension: request.filterDimension,
            value: request.value,
            timeRange: request.timeRange,
          },
        });
        const resultAttrition = loadParentAttritionOverTimeOrgChart({
          request,
          dimensionName,
        });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-(bcd)', {
          b: resultOrg,
          c: resultWorld,
          d: resultAttrition,
        });

        m.expect(effects.loadOrganizationalViewData$).toBeObservable(expected);
      })
    );

    test(
      'loadOrganizationalViewData - should do nothing when organization is not set',
      marbles((m) => {
        action = loadOrganizationalViewData();
        store.overrideSelector(getCurrentFilters, {} as EmployeesRequest);

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--');

        m.expect(effects.loadOrganizationalViewData$).toBeObservable(expected);
      })
    );
  });

  describe('loadOrgChartFluctuationMeta$', () => {
    test(
      'should load org chart rates',
      marbles((m) => {
        const orgUnitFluctuationData = {
          dimensionKey: '123',
          id: '32',
          parentId: '23',
          filterDimension: FilterDimension.ORG_UNIT,
        } as DimensionFluctuationData;

        const timeRange = {
          id: '1234|4567',
          value: '1.1.2020 - 31.1.2022',
        } as IdValue;
        const request = {
          value: orgUnitFluctuationData.dimensionKey,
          timeRange: timeRange.id,
          filterDimension: FilterDimension.ORG_UNIT,
        };

        action = loadOrgChartFluctuationMeta({ data: orgUnitFluctuationData });
        store.overrideSelector(getSelectedTimeRange, {
          id: timeRange.id,
          value: timeRange.value,
        });
        const result = loadOrgChartFluctuationRate({ request });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', {
          b: result,
        });

        m.expect(effects.loadOrgChartFluctuationMeta$).toBeObservable(expected);
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
        const data = [
          { id: '123' } as unknown as DimensionFluctuationData,
          { id: '456' } as unknown as DimensionFluctuationData,
        ];
        const result = loadOrgChartSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: data,
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
        store.overrideSelector(getSelectedDimension, FilterDimension.ORG_UNIT);

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

  describe('loadOrgChartFluctuationRate$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {} as unknown as EmployeesRequest;
      action = loadOrgChartFluctuationRate({ request });
    });

    test(
      'should return loadOrgChartFluctuationRateSuccess action when REST call is successful',
      marbles((m) => {
        const rate = {
          value: '123',
          timeRange: '123|456',
          fluctuationRate: 0.1,
          unforcedFluctuationRate: 0.02,
        };
        const result = loadOrgChartFluctuationRateSuccess({
          rate,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: rate,
        });
        const expected = m.cold('--b', { b: result });

        organizationalViewService.getOrgUnitFluctuationRate = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadOrgChartFluctuationRate$).toBeObservable(expected);
        m.flush();
        expect(
          organizationalViewService.getOrgUnitFluctuationRate
        ).toHaveBeenCalledWith(request);
      })
    );

    test(
      'should return loadOrgChartFluctuationRateFailure on REST error',
      marbles((m) => {
        const result = loadOrgChartFluctuationRateFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        organizationalViewService.getOrgUnitFluctuationRate = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadOrgChartFluctuationRate$).toBeObservable(expected);
        m.flush();
        expect(
          organizationalViewService.getOrgUnitFluctuationRate
        ).toHaveBeenCalledWith(request);
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
          { name: 'Germany' } as unknown as CountryDataAttrition,
          { name: 'Poland' } as unknown as CountryDataAttrition,
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

  describe('loadOrgChartEmployees$', () => {
    let data: DimensionFluctuationData;
    let timeRange: IdValue;
    let request: EmployeesRequest;
    let dimensionName: string;

    beforeEach(() => {
      data = {
        dimensionKey: '123',
        id: '32',
        parentId: '23',
        filterDimension: FilterDimension.ORG_UNIT,
      } as DimensionFluctuationData;
      timeRange = {
        id: '1234|4567',
        value: '1.1.2020 - 31.1.2022',
      } as IdValue;
      dimensionName = 'SH/ZHZ';
      request = {
        value: data.dimensionKey,
        timeRange: timeRange.id,
        filterDimension: FilterDimension.ORG_UNIT,
      };

      action = loadOrgChartEmployees({ data });
    });

    test(
      'should return loadOrgChartEmployeesSuccess action when REST call is successful',
      marbles((m) => {
        const employees = [
          { employeeName: 'Hans' } as unknown as OrgChartEmployee,
          { employeeName: 'Peter' } as unknown as OrgChartEmployee,
        ];

        store.overrideSelector(getSelectedTimeRange, {
          id: timeRange.id,
          value: timeRange.value,
        });

        const result = loadOrgChartEmployeesSuccess({
          employees,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: employees,
        });
        const expected = m.cold('--b', { b: result });

        organizationalViewService.getOrgChartEmployeesForNode = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadOrgChartEmployees$).toBeObservable(expected);
        m.flush();
        expect(
          organizationalViewService.getOrgChartEmployeesForNode
        ).toHaveBeenCalledWith({
          value: data.dimensionKey,
          timeRange: timeRange.id,
          filterDimension: FilterDimension.ORG_UNIT,
        });
      })
    );

    test(
      'should return loadOrgChartEmployeesFailure on REST error',
      marbles((m) => {
        const result = loadOrgChartEmployeesFailure({
          errorMessage: error.message,
        });
        store.overrideSelector(getCurrentFilters, {
          ...request,
          dimensionName,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        organizationalViewService.getOrgChartEmployeesForNode = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadOrgChartEmployees$).toBeObservable(expected);
        m.flush();
        expect(
          organizationalViewService.getOrgChartEmployeesForNode
        ).toHaveBeenCalledWith({ ...request, timeRange: timeRange.id });
      })
    );
  });

  describe('loadParent$', () => {
    let parentId: string;

    beforeEach(() => {
      parentId = '123';
      const data = {
        parentId,
      } as unknown as DimensionFluctuationData;

      action = loadParent({ data });
    });
    test(
      'should return loadParentSuccess action',
      marbles((m) => {
        const idValue: IdValue = {
          id: '12',
          value: '123',
        };
        const parentResponse: DimensionParentResponse = {
          data: idValue,
          filterDimension: FilterDimension.ORG_UNIT,
        };
        const response = m.cold('-a|', {
          a: parentResponse,
        });
        organizationalViewService.getParentOrgUnit = jest
          .fn()
          .mockImplementation(() => response);

        actions$ = m.hot('-a', { a: action });
        const result = loadParentSuccess({ response: parentResponse });

        const expected = m.cold('--b', { b: result });

        m.expect(effects.loadParent$).toBeObservable(expected);
        m.flush();
        expect(organizationalViewService.getParentOrgUnit).toHaveBeenCalledWith(
          FilterDimension.ORG_UNIT,
          '1234|4567',
          parentId
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
        const timeRange = '1-1';
        store.overrideSelector(getSelectedTimeRange, {
          id: timeRange,
          value: timeRange,
        });

        store.overrideSelector(getSelectedDimension, FilterDimension.ORG_UNIT);

        organizationalViewService.getParentOrgUnit = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadParent$).toBeObservable(expected);
        m.flush();
        expect(organizationalViewService.getParentOrgUnit).toHaveBeenCalledWith(
          FilterDimension.ORG_UNIT,
          timeRange,
          parentId
        );
      })
    );
  });

  describe('loadParentSuccess$', () => {
    test(
      'should return filterDimensionSelected action',
      marbles((m) => {
        const idValue: IdValue = {
          id: 'Schaeffler_IT',
          value: '888',
        };
        const parentResponse: DimensionParentResponse = {
          data: idValue,
          filterDimension: FilterDimension.ORG_UNIT,
        };

        action = loadParentSuccess({ response: parentResponse });

        const filter = {
          name: FilterDimension.ORG_UNIT,
          idValue,
        };

        actions$ = m.hot('-a', { a: action });
        const filterSelectedAction = filterSelected({
          filter,
        });
        const loadFilterDimensionDataAction = loadFilterDimensionData({
          filterDimension: filter.name,
        });

        const expected = m.cold('-(bc)', {
          b: filterSelectedAction,
          c: loadFilterDimensionDataAction,
        });

        m.expect(effects.loadParentSuccess$).toBeObservable(expected);
      })
    );
  });

  describe('loadParentAttritionOverTimeOrgChart$', () => {
    let value: string;
    let timeRange: string;
    let filterDimension: FilterDimension;
    let dimensionName: string;

    beforeEach(() => {
      timeRange = '123';
      value = 'ACB';
      filterDimension = FilterDimension.ORG_UNIT;
      dimensionName = 'SH/ZHZ';
      action = loadParentAttritionOverTimeOrgChart({
        request: {
          filterDimension,
          value,
          timeRange,
        } as EmployeesRequest,
        dimensionName,
      });
    });

    test(
      'should return loadParentAttritionOverTimeOrgChartSuccess action when REST call is successful',
      marbles((m) => {
        const data: AttritionOverTime = { data: {} };
        const result = loadParentAttritionOverTimeOrgChartSuccess({
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

        m.expect(effects.loadParentAttritionOverTimeOrgChart$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          organizationalViewService.getAttritionOverTime
        ).toHaveBeenCalledWith(
          filterDimension,
          value,
          TimePeriod.LAST_6_MONTHS
        );
      })
    );

    test(
      'should return loadParentAttritionOverTimeOrgChartFailure on REST error',
      marbles((m) => {
        const result = loadParentAttritionOverTimeOrgChartFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        organizationalViewService.getAttritionOverTime = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadParentAttritionOverTimeOrgChart$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          organizationalViewService.getAttritionOverTime
        ).toHaveBeenCalledWith(
          filterDimension,
          value,
          TimePeriod.LAST_6_MONTHS
        );
      })
    );
  });

  describe('loadChildAttritionOverTimeOrgChart$', () => {
    let value: string;
    let name: string;
    let filterDimension: FilterDimension;

    beforeEach(() => {
      value = 'ACB';
      name = 'SH/zhz';
      filterDimension = FilterDimension.ORG_UNIT;
      action = loadChildAttritionOverTimeOrgChart({
        filterDimension,
        dimensionKey: value,
        dimensionName: name,
      });
    });

    test(
      'should return loadChildAttritionOverTimeOrgChartSuccess action when REST call is successful',
      marbles((m) => {
        const data: AttritionOverTime = { data: {} };
        const result = loadChildAttritionOverTimeOrgChartSuccess({
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

        m.expect(effects.loadChildAttritionOverTimeOrgChart$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          organizationalViewService.getAttritionOverTime
        ).toHaveBeenCalledWith(
          filterDimension,
          value,
          TimePeriod.LAST_6_MONTHS
        );
      })
    );

    test(
      'should return loadChildAttritionOverTimeOrgChartFailure on REST error',
      marbles((m) => {
        const result = loadChildAttritionOverTimeOrgChartFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        organizationalViewService.getAttritionOverTime = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadChildAttritionOverTimeOrgChart$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          organizationalViewService.getAttritionOverTime
        ).toHaveBeenCalledWith(
          filterDimension,
          value,
          TimePeriod.LAST_6_MONTHS
        );
      })
    );
  });

  describe('loadChildAttritionOverTimeForWorldMap$', () => {
    test(
      'should return loadChildAttritionOverTimeOrgChart',
      marbles((m) => {
        const filterDimension = FilterDimension.COUNTRY;
        const dimensionName = 'Germany';
        const dimensionKey = 'DE';
        const worldMap: CountryDataAttrition[] = [
          {
            name: dimensionName,
            countryKey: dimensionKey,
            region: 'Europe',
            regionKey: '2',
            attritionMeta: {} as EmployeeAttritionMeta,
          },
        ];
        store.overrideSelector(getWorldMap, worldMap);
        const result = loadChildAttritionOverTimeOrgChart({
          dimensionKey,
          dimensionName,
          filterDimension,
        });
        action = loadChildAttritionOverTimeForWorldMap({
          filterDimension,
          dimensionName,
        });

        actions$ = m.hot('a', { a: action });
        const expected = m.cold('b', { b: result });

        m.expect(effects.loadChildAttritionOverTimeForWorldMap$).toBeObservable(
          expected
        );
      })
    );
  });
});
