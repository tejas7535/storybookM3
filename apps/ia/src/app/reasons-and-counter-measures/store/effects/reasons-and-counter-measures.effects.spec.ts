import { EMPTY } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { RouterReducerState } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/marbles';

import { AppRoutePath } from '../../../app-route-path.enum';
import { RouterStateUrl, selectRouterState } from '../../../core/store';
import { filterSelected, triggerLoad } from '../../../core/store/actions';
import {
  getCurrentFilters,
  getSelectedTimeRange,
} from '../../../core/store/selectors';
import { FilterService } from '../../../filter-section/filter.service';
import {
  EmployeesRequest,
  FilterDimension,
  IdValue,
  SelectedFilter,
} from '../../../shared/models';
import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';
import { ReasonsAndCounterMeasuresService } from '../../reasons-and-counter-measures.service';
import {
  comparedFilterDimensionSelected,
  comparedFilterSelected,
  loadComparedFilterDimensionData,
  loadComparedFilterDimensionDataFailure,
  loadComparedFilterDimensionDataSuccess,
  loadComparedOrgUnits,
  loadComparedOrgUnitsFailure,
  loadComparedOrgUnitsSuccess,
  loadComparedReasonsWhyPeopleLeft,
  loadComparedReasonsWhyPeopleLeftFailure,
  loadComparedReasonsWhyPeopleLeftSuccess,
  loadReasonsAndCounterMeasuresData,
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftFailure,
  loadReasonsWhyPeopleLeftSuccess,
} from '../actions/reasons-and-counter-measures.actions';
import {
  getComparedSelectedTimeRange,
  getCurrentComparedFilters,
} from '../selectors/reasons-and-counter-measures.selector';
import { ReasonsAndCounterMeasuresEffects } from './reasons-and-counter-measures.effects';

describe('ReasonsAndCounterMeasures Effects', () => {
  let spectator: SpectatorService<ReasonsAndCounterMeasuresEffects>;
  let actions$: any;
  let reasonsAndCounterMeasuresService: ReasonsAndCounterMeasuresService;
  let action: any;
  let effects: ReasonsAndCounterMeasuresEffects;
  let store: MockStore;
  let filterService: FilterService;

  const error = {
    message: 'An error message occured',
  };

  const createService = createServiceFactory({
    service: ReasonsAndCounterMeasuresEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({}),
      {
        provide: ReasonsAndCounterMeasuresService,
        useValue: {
          getResignedEmployees: jest.fn(),
        },
      },
      {
        provide: FilterService,
        useValue: {
          getOrgUnits: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(ReasonsAndCounterMeasuresEffects);
    reasonsAndCounterMeasuresService = spectator.inject(
      ReasonsAndCounterMeasuresService
    );
    filterService = spectator.inject(FilterService);
    store = spectator.inject(MockStore);
  });

  describe('filterChange$', () => {
    test(
      'should return loadReasonsAndCounterMeasuresData when url /reasons-and-counter-measures',
      marbles((m) => {
        store.overrideSelector(selectRouterState, {
          state: {
            url: `/${AppRoutePath.ReasonsAndCounterMeasuresPath}`,
          },
        } as RouterReducerState<RouterStateUrl>);
        action = loadReasonsAndCounterMeasuresData();
        actions$ = m.hot('-', { a: action });
        const expected = m.cold('-');

        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );

    test(
      'should not return loadReasonsAndCounterMeasuresData when url different than /reasons-and-counter-measures',
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

  describe('loadReasonsAndCounterMeasuresData$', () => {
    test(
      'filterSelected - should do nothing when organization is not set',
      marbles((m) => {
        const filter = new SelectedFilter('nice', {
          id: 'best',
          value: 'best',
        });
        action = filterSelected({ filter });
        store.overrideSelector(
          getCurrentFilters,
          {} as EmployeesRequest as any
        );

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--');

        m.expect(effects.loadReasonsAndCounterMeasuresData$).toBeObservable(
          expected
        );
      })
    );

    test(
      'timeRangeSelected - should do nothing when organization is not set',
      marbles((m) => {
        action = triggerLoad();
        store.overrideSelector(
          getCurrentFilters,
          {} as EmployeesRequest as any
        );

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--');

        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );
  });

  describe('loadReasonsWhyPeopleLeft$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {} as unknown as EmployeesRequest;
      action = loadReasonsWhyPeopleLeft({ request });
    });

    test(
      'should return loadReasonsWhyPeopleLeftSuccess action when REST call is successful',
      marbles((m) => {
        const data: ReasonForLeavingStats[] = [];
        const result = loadReasonsWhyPeopleLeftSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        reasonsAndCounterMeasuresService.getReasonsWhyPeopleLeft = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadReasonsWhyPeopleLeft$).toBeObservable(expected);
        m.flush();
        expect(
          reasonsAndCounterMeasuresService.getReasonsWhyPeopleLeft
        ).toHaveBeenCalledWith(request);
      })
    );

    test(
      'should return loadReasonsWhyPeopleLeftFailure on REST error',
      marbles((m) => {
        const result = loadReasonsWhyPeopleLeftFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        reasonsAndCounterMeasuresService.getReasonsWhyPeopleLeft = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadReasonsWhyPeopleLeft$).toBeObservable(expected);
        m.flush();
        expect(
          reasonsAndCounterMeasuresService.getReasonsWhyPeopleLeft
        ).toHaveBeenCalledWith(request);
      })
    );
  });

  describe('comparedFilterChange$', () => {
    test(
      'comparedFilterSelected - should trigger load actions if dimension, value and time range are set',
      marbles((m) => {
        const filterDimension = FilterDimension.ORG_UNIT;
        const filter = new SelectedFilter(filterDimension, {
          id: '123',
          value: 'Awesome Date',
        });
        const timeRange = '123-321';
        const request = {
          filterDimension,
          value: filter.idValue.id,
          timeRange,
        } as EmployeesRequest;

        action = comparedFilterSelected({ filter });
        store.overrideSelector(getCurrentComparedFilters, {
          ...request,
        });

        const resultComparedReasonsWhyPeopleLeft =
          loadComparedReasonsWhyPeopleLeft({
            request,
          });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(b)', {
          b: resultComparedReasonsWhyPeopleLeft,
        });
        m.expect(effects.comparedFilterChange$).toBeObservable(expected);
      })
    );
  });

  describe('loadComparedReasonsWhyPeopleLeft$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {} as unknown as EmployeesRequest;
      action = loadComparedReasonsWhyPeopleLeft({ request });
    });

    test(
      'should return loadComparedReasonsWhyPeopleLeftSuccess action when REST call is successful',
      marbles((m) => {
        const data: ReasonForLeavingStats[] = [];
        const result = loadComparedReasonsWhyPeopleLeftSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        reasonsAndCounterMeasuresService.getReasonsWhyPeopleLeft = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadComparedReasonsWhyPeopleLeft$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          reasonsAndCounterMeasuresService.getReasonsWhyPeopleLeft
        ).toHaveBeenCalledWith(request);
      })
    );

    test(
      'should return loadComparedReasonsWhyPeopleLeftFailure on REST error',
      marbles((m) => {
        const result = loadComparedReasonsWhyPeopleLeftFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        reasonsAndCounterMeasuresService.getReasonsWhyPeopleLeft = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadComparedReasonsWhyPeopleLeft$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          reasonsAndCounterMeasuresService.getReasonsWhyPeopleLeft
        ).toHaveBeenCalledWith(request);
      })
    );
  });

  describe('loadComparedOrgUnits', () => {
    const searchFor = 'search';
    const timeRange = '123|456';

    beforeEach(() => {
      action = loadComparedOrgUnits({ searchFor });
      store.overrideSelector(getComparedSelectedTimeRange, {
        id: timeRange,
        value: timeRange,
      });
    });
    test(
      'should return loadComparedOrgUnitsSuccess action when REST call is successful',
      marbles((m) => {
        const items = [new IdValue('Department1', 'Department1')];
        const result = loadComparedOrgUnitsSuccess({
          items,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-c', { c: items });

        const expected = m.cold('--b', { b: result });

        filterService.getOrgUnits = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadComparedOrgUnits$).toBeObservable(expected);
        m.flush();
        expect(filterService.getOrgUnits).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should return loadComparedOrgUnitsFailure on REST error',
      marbles((m) => {
        const result = loadComparedOrgUnitsFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        filterService.getOrgUnits = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadComparedOrgUnits$).toBeObservable(expected);
        m.flush();
        expect(filterService.getOrgUnits).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('loadFilterDimensionData', () => {
    const searchFor = 'search';
    const timeRange = '123|456';
    const filterDimension = FilterDimension.BOARD;
    const items = [new IdValue('Department1', 'Department1')];

    beforeEach(() => {
      action = loadComparedFilterDimensionData({ filterDimension, searchFor });
      store.overrideSelector(getComparedSelectedTimeRange, {
        id: timeRange,
        value: timeRange,
      });
      action = loadComparedFilterDimensionData({ filterDimension, searchFor });
    });

    test(
      'should return loadComparedFilterDimensionDataSuccess when REST call is successful',
      marbles((m) => {
        const result = loadComparedFilterDimensionDataSuccess({
          filterDimension,
          items,
        });
        store.overrideSelector(getSelectedTimeRange, {
          id: '123',
          value: 'avc',
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-c', { c: items });

        const expected = m.cold('--b', { b: result });

        filterService.getDataForFilterDimension = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadFilterDimensionData$).toBeObservable(expected);
        m.flush();
        expect(filterService.getDataForFilterDimension).toHaveBeenCalledTimes(
          1
        );
      })
    );

    test(
      'should return loadComparedFilterDimensionDataFailure on REST error',
      marbles((m) => {
        const result = loadComparedFilterDimensionDataFailure({
          errorMessage: error.message,
          filterDimension,
        });
        store.overrideSelector(getSelectedTimeRange, {
          id: '123',
          value: 'avc',
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        filterService.getDataForFilterDimension = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadFilterDimensionData$).toBeObservable(expected);
        m.flush();
        expect(filterService.getDataForFilterDimension).toHaveBeenCalledTimes(
          1
        );
      })
    );
  });

  describe('comparedFilterDimensionSelected$', () => {
    test(
      'should return comparedFilterSelected action',
      marbles((m) => {
        const filterDimension = FilterDimension.BOARD;
        const filter = new SelectedFilter('abcv', new IdValue('1', 'abc'));
        const result = comparedFilterSelected({ filter });

        action = comparedFilterDimensionSelected({ filterDimension, filter });

        actions$ = m.cold('-a', { a: action });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.comparedFilterDimensionSelected$).toBeObservable(
          expected
        );
      })
    );
  });
});
