import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { filterSelected, triggerLoad } from '../../../core/store/actions';
import {
  getCurrentFilters,
  getSelectedTimeRange,
} from '../../../core/store/selectors';
import {
  AttritionOverTime,
  EmployeesRequest,
  FilterDimension,
  FilterKey,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../../../shared/models';
import { OrgUnitFluctuationData } from '../../models/org-unit-fluctuation-data.model';
import { OrganizationalViewService } from '../../organizational-view.service';
import { CountryData } from '../../world-map/models/country-data.model';
import {
  loadAttritionOverTimeOrgChart,
  loadAttritionOverTimeOrgChartFailure,
  loadAttritionOverTimeOrgChartSuccess,
  loadOrgChart,
  loadOrgChartFailure,
  loadOrgChartSuccess,
  loadOrgUnitFluctuationMeta,
  loadOrgUnitFluctuationRate,
  loadOrgUnitFluctuationRateFailure,
  loadOrgUnitFluctuationRateSuccess,
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
          filterDimension: FilterDimension.ORG_UNIT,
          value: filter.idValue.id,
          timeRange: '123',
        } as EmployeesRequest;
        action = filterSelected({ filter });
        store.overrideSelector(getCurrentFilters, request);
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
        const filter = new SelectedFilter('nice', {
          id: 'best',
          value: 'best',
        });
        action = filterSelected({ filter });
        store.overrideSelector(getCurrentFilters, {} as EmployeesRequest);

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--');

        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );
  });

  describe('loadOrgUnitFluctuationMeta$', () => {
    test(
      'should load org unit rates',
      marbles((m) => {
        const orgUnitFluctuationData = {
          orgUnitKey: '123',
          id: '32',
          parentId: '23',
        } as OrgUnitFluctuationData;

        const timeRange = {
          id: '1234|4567',
          value: '1.1.2020 - 31.1.2022',
        } as IdValue;
        const request = {
          value: orgUnitFluctuationData.orgUnitKey,
          timeRange: timeRange.id,
          filterDimension: FilterDimension.ORG_UNIT,
        };

        action = loadOrgUnitFluctuationMeta({ data: orgUnitFluctuationData });
        store.overrideSelector(getSelectedTimeRange, timeRange);
        const result = loadOrgUnitFluctuationRate({ request });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', {
          b: result,
        });

        m.expect(effects.loadOrgUnitFluctuationMeta$).toBeObservable(expected);
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
          { id: '123' } as unknown as OrgUnitFluctuationData,
          { id: '456' } as unknown as OrgUnitFluctuationData,
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

  describe('loadOrgUnitFluctuationRate$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {} as unknown as EmployeesRequest;
      action = loadOrgUnitFluctuationRate({ request });
    });

    test(
      'should return loadOrgUnitFluctuationRateSuccess action when REST call is successful',
      marbles((m) => {
        const rate = {
          value: '123',
          timeRange: '123|456',
          fluctuationRate: 0.1,
          unforcedFluctuationRate: 0.02,
        };
        const result = loadOrgUnitFluctuationRateSuccess({
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

        m.expect(effects.loadOrgUnitFluctuationRate$).toBeObservable(expected);
        m.flush();
        expect(
          organizationalViewService.getOrgUnitFluctuationRate
        ).toHaveBeenCalledWith(request);
      })
    );

    test(
      'should return loadOrgUnitFluctuationRateFailure on REST error',
      marbles((m) => {
        const result = loadOrgUnitFluctuationRateFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        organizationalViewService.getOrgUnitFluctuationRate = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadOrgUnitFluctuationRate$).toBeObservable(expected);
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
    let parentId: string;

    beforeEach(() => {
      parentId = '123';
      const data = {
        parentId,
      } as unknown as OrgUnitFluctuationData;

      action = loadParent({ data });
    });
    test(
      'should return loadParentSuccess action',
      marbles((m) => {
        const idValue: IdValue = {
          id: '12',
          value: '123',
        };
        const response = m.cold('-a|', {
          a: idValue,
        });
        organizationalViewService.getParentOrgUnit = jest
          .fn()
          .mockImplementation(() => response);

        actions$ = m.hot('-a', { a: action });
        const result = loadParentSuccess({ idValue });

        const expected = m.cold('--b', { b: result });

        m.expect(effects.loadParent$).toBeObservable(expected);
        m.flush();
        expect(organizationalViewService.getParentOrgUnit).toHaveBeenCalledWith(
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

        organizationalViewService.getParentOrgUnit = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadParent$).toBeObservable(expected);
        m.flush();
        expect(organizationalViewService.getParentOrgUnit).toHaveBeenCalledWith(
          parentId
        );
      })
    );
  });

  describe('loadParentSuccess$', () => {
    test(
      'should return filterSelected action',
      marbles((m) => {
        const idValue: IdValue = {
          id: 'Schaeffler_IT',
          value: '888',
        };

        action = loadParentSuccess({ idValue });

        const filter = {
          name: FilterKey.ORG_UNIT,
          idValue: {
            id: idValue.id,
            value: idValue.value,
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
    let value: string;
    let timeRange: string;
    let filterDimension: FilterDimension;

    beforeEach(() => {
      timeRange = '123';
      value = 'ACB';
      filterDimension = FilterDimension.ORG_UNIT;
      action = loadAttritionOverTimeOrgChart({
        request: {
          filterDimension,
          value,
          timeRange,
        } as EmployeesRequest,
      });
    });

    test(
      'should return loadAttritionOverTimeOrgChartSuccess action when REST call is successful',
      marbles((m) => {
        const data: AttritionOverTime = { data: {} };
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
        ).toHaveBeenCalledWith(
          filterDimension,
          value,
          TimePeriod.LAST_6_MONTHS
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

        organizationalViewService.getAttritionOverTime = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadAttritionOverTimeOrgChart$).toBeObservable(
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

  describe('ngrxOnInitEffects', () => {
    it('should return triggerLoad Action', () => {
      expect(effects.ngrxOnInitEffects()).toEqual(triggerLoad());
    });
  });
});
