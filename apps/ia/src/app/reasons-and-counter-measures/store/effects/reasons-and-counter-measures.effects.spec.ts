import { EMPTY } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { RouterReducerState } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/marbles';

import { AppRoutePath } from '../../../app-route-path.enum';
import { RouterStateUrl, selectRouterState } from '../../../core/store';
import {
  benchmarkFilterSelected,
  filterSelected,
  timePeriodSelected,
} from '../../../core/store/actions';
import {
  getCurrentBenchmarkFilters,
  getCurrentFilters,
} from '../../../core/store/selectors';
import { ExitEntryEmployeesResponse } from '../../../overview/models';
import {
  EmployeesRequest,
  FilterDimension,
  TimePeriod,
} from '../../../shared/models';
import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';
import { ReasonsAndCounterMeasuresService } from '../../reasons-and-counter-measures.service';
import {
  loadComparedLeaversByReason,
  loadComparedReasonsWhyPeopleLeft,
  loadComparedReasonsWhyPeopleLeftFailure,
  loadComparedReasonsWhyPeopleLeftSuccess,
  loadLeaversByReason,
  loadLeaversByReasonFailure,
  loadLeaversByReasonSuccess,
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftFailure,
  loadReasonsWhyPeopleLeftSuccess,
} from '../actions/reasons-and-counter-measures.actions';
import { ReasonsAndCounterMeasuresEffects } from './reasons-and-counter-measures.effects';

describe('ReasonsAndCounterMeasures Effects', () => {
  let spectator: SpectatorService<ReasonsAndCounterMeasuresEffects>;
  let actions$: any;
  let reasonsAndCounterMeasuresService: ReasonsAndCounterMeasuresService;
  let action: any;
  let effects: ReasonsAndCounterMeasuresEffects;
  let store: MockStore;

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
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(ReasonsAndCounterMeasuresEffects);
    reasonsAndCounterMeasuresService = spectator.inject(
      ReasonsAndCounterMeasuresService
    );
    store = spectator.inject(MockStore);
  });

  describe('filterChange$', () => {
    test(
      'should return loadReasonsWhyPeopleLeft when filterSelected action is dispatched',
      marbles((m) => {
        store.overrideSelector(selectRouterState, {
          state: {
            url: `/${AppRoutePath.ReasonsAndCounterMeasuresPath}`,
          },
        } as RouterReducerState<RouterStateUrl>);
        action = filterSelected({
          filter: { idValue: { id: 'B01', value: 'B01' }, name: 'xyz' },
        });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', { b: loadReasonsWhyPeopleLeft() });

        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );

    test(
      'should return loadReasonsWhyPeopleLeft when timePeriodSelected action is dispatched',
      marbles((m) => {
        store.overrideSelector(selectRouterState, {
          state: {
            url: `/${AppRoutePath.ReasonsAndCounterMeasuresPath}`,
          },
        } as RouterReducerState<RouterStateUrl>);
        action = timePeriodSelected({
          timePeriod: TimePeriod.LAST_12_MONTHS,
        });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', { b: loadReasonsWhyPeopleLeft() });

        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );

    test(
      'should return loadReasonsWhyPeopleLeft when url /reasons-and-counter-measures',
      marbles((m) => {
        store.overrideSelector(selectRouterState, {
          state: {
            url: `/${AppRoutePath.ReasonsAndCounterMeasuresPath}`,
          },
        } as RouterReducerState<RouterStateUrl>);
        action = loadReasonsWhyPeopleLeft();
        actions$ = m.hot('-', { a: action });
        const expected = m.cold('-');

        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );

    test(
      'should not return loadReasonsWhyPeopleLeft when url different than /reasons-and-counter-measures',
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

  describe('benchmarkFilterChange$', () => {
    test(
      'should return loadComparedReasonsWhyPeopleLeft when benchmarkFilterSelected action is dispatched',
      marbles((m) => {
        store.overrideSelector(selectRouterState, {
          state: {
            url: `/${AppRoutePath.ReasonsAndCounterMeasuresPath}`,
          },
        } as RouterReducerState<RouterStateUrl>);
        action = benchmarkFilterSelected({
          filter: { idValue: { id: 'B01', value: 'B01' }, name: 'xyz' },
        });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', {
          b: loadComparedReasonsWhyPeopleLeft(),
        });

        m.expect(effects.benchmarkFilterChange$).toBeObservable(expected);
      })
    );

    test(
      'should return loadComparedReasonsWhyPeopleLeft when timePeriodSelected action is dispatched',
      marbles((m) => {
        store.overrideSelector(selectRouterState, {
          state: {
            url: `/${AppRoutePath.ReasonsAndCounterMeasuresPath}`,
          },
        } as RouterReducerState<RouterStateUrl>);
        action = timePeriodSelected({
          timePeriod: TimePeriod.LAST_12_MONTHS,
        });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', {
          b: loadComparedReasonsWhyPeopleLeft(),
        });

        m.expect(effects.benchmarkFilterChange$).toBeObservable(expected);
      })
    );

    test(
      'should return loadComparedReasonsWhyPeopleLeft when url /reasons-and-counter-measures',
      marbles((m) => {
        store.overrideSelector(selectRouterState, {
          state: {
            url: `/${AppRoutePath.ReasonsAndCounterMeasuresPath}`,
          },
        } as RouterReducerState<RouterStateUrl>);
        action = loadComparedReasonsWhyPeopleLeft();
        actions$ = m.hot('-', { a: action });
        const expected = m.cold('-');

        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );

    test(
      'should not return loadComparedReasonsWhyPeopleLeft when url different than /reasons-and-counter-measures',
      marbles((m) => {
        store.overrideSelector(selectRouterState, {
          state: {
            url: `/different-path`,
          },
        } as RouterReducerState<RouterStateUrl>);
        actions$ = m.hot('-', { a: EMPTY });
        const expected = m.cold('-');

        m.expect(effects.benchmarkFilterChange$).toBeObservable(expected);
      })
    );
  });

  describe('loadReasonsWhyPeopleLeft$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {
        filterDimension: FilterDimension.BOARD,
        timeRange: '123|321',
        value: 'B01',
      } as EmployeesRequest;
      action = loadReasonsWhyPeopleLeft();
    });

    test(
      'should return loadReasonsWhyPeopleLeftSuccess action when REST call is successful',
      marbles((m) => {
        const data: ReasonForLeavingStats = {} as ReasonForLeavingStats;
        const result = loadReasonsWhyPeopleLeftSuccess({
          data,
        });
        store.overrideSelector(getCurrentFilters, request);

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
        store.overrideSelector(getCurrentFilters, request);

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

  describe('loadComparedReasonsWhyPeopleLeft$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {
        filterDimension: FilterDimension.BOARD,
        timeRange: '123|321',
        value: 'B01',
      } as EmployeesRequest;
      action = loadComparedReasonsWhyPeopleLeft();
    });

    test(
      'should return loadComparedReasonsWhyPeopleLeftSuccess action when REST call is successful',
      marbles((m) => {
        const data: ReasonForLeavingStats = {} as ReasonForLeavingStats;
        const result = loadComparedReasonsWhyPeopleLeftSuccess({
          data,
        });
        store.overrideSelector(getCurrentBenchmarkFilters, request);

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
        store.overrideSelector(getCurrentBenchmarkFilters, request);

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

  describe('loadLeaversByReason$', () => {
    const reasonId = 1;
    let request: EmployeesRequest;

    beforeEach(() => {
      action = loadLeaversByReason({ reasonId });
      request = {
        filterDimension: FilterDimension.BOARD,
        timeRange: '123|321',
        value: 'B01',
      } as EmployeesRequest;
    });

    test(
      'should load leavers by reason when REST call is successful',
      marbles((m) => {
        const data: ExitEntryEmployeesResponse =
          {} as ExitEntryEmployeesResponse;
        const result = loadLeaversByReasonSuccess({
          data,
        });
        store.overrideSelector(getCurrentFilters, request);

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        reasonsAndCounterMeasuresService.getLeaversByReason = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadLeaversByReason$).toBeObservable(expected);
        m.flush();
        expect(
          reasonsAndCounterMeasuresService.getLeaversByReason
        ).toHaveBeenCalledWith({ ...request, reasonId });
      })
    );

    test(
      'should return loadLeaversByReasonFailure on REST error',
      marbles((m) => {
        const result = loadLeaversByReasonFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });
        store.overrideSelector(getCurrentFilters, request);

        reasonsAndCounterMeasuresService.getLeaversByReason = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadLeaversByReason$).toBeObservable(expected);
        m.flush();
        expect(
          reasonsAndCounterMeasuresService.getLeaversByReason
        ).toHaveBeenCalledWith({ ...request, reasonId });
      })
    );
  });

  describe('loadComparedLeaversByReason$', () => {
    const reasonId = 1;
    let request: EmployeesRequest;

    beforeEach(() => {
      action = loadComparedLeaversByReason({ reasonId });
      request = {
        filterDimension: FilterDimension.BOARD,
        timeRange: '123|321',
        value: 'B01',
      } as EmployeesRequest;
    });

    test(
      'should load leavers by reason when REST call is successful',
      marbles((m) => {
        const data: ExitEntryEmployeesResponse =
          {} as ExitEntryEmployeesResponse;
        const result = loadLeaversByReasonSuccess({
          data,
        });
        store.overrideSelector(getCurrentBenchmarkFilters, request);

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        reasonsAndCounterMeasuresService.getLeaversByReason = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadComparedLeaversByReason$).toBeObservable(expected);
        m.flush();
        expect(
          reasonsAndCounterMeasuresService.getLeaversByReason
        ).toHaveBeenCalledWith({ ...request, reasonId });
      })
    );

    test(
      'should return loadLeaversByReasonFailure on REST error',
      marbles((m) => {
        const result = loadLeaversByReasonFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });
        store.overrideSelector(getCurrentBenchmarkFilters, request);

        reasonsAndCounterMeasuresService.getLeaversByReason = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadComparedLeaversByReason$).toBeObservable(expected);
        m.flush();
        expect(
          reasonsAndCounterMeasuresService.getLeaversByReason
        ).toHaveBeenCalledWith({ ...request, reasonId });
      })
    );
  });
});
