import { EMPTY, of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { RouterReducerState } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/marbles';

import { AppRoutePath } from '../../../app-route-path.enum';
import { RouterStateUrl, selectRouterState } from '../../../core/store';
import {
  filterSelected,
  timePeriodSelected,
} from '../../../core/store/actions';
import { getCurrentFilters } from '../../../core/store/selectors';
import {
  FilterDimension,
  SelectedFilter,
  TimePeriod,
} from '../../../shared/models';
import { AttritionAnalyticsService } from '../../attrition-analytics.service';
import { EmployeeCluster } from '../../models';
import {
  loadAvailableClusters,
  loadAvailableClustersSuccess,
  loadEmployeeAnalytics,
  loadEmployeeAnalyticsSuccess,
  selectCluster,
} from '../actions/attrition-analytics.action';
import { getSelectedCluster } from '../selectors/attrition-analytics.selector';
import { AttritionAnalyticsEffects } from './attrition-analytics.effects';

describe('Attrition Anayltics Effects', () => {
  let spectator: SpectatorService<AttritionAnalyticsEffects>;
  let actions$: any;
  let action: any;
  let effects: AttritionAnalyticsEffects;
  let store: MockStore;

  const createService = createServiceFactory({
    service: AttritionAnalyticsEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: AttritionAnalyticsService,
        useValue: {
          getAvailableClusters: jest.fn(() =>
            of([{ name: 'xyz' } as EmployeeCluster])
          ),
          getEmployeeAnalytics: jest.fn(() => of([])),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    store = spectator.inject(MockStore);
    effects = spectator.inject(AttritionAnalyticsEffects);
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  describe('routeChange$', () => {
    test(
      'should return loadAvailableClusters when url /fluctuation-analytics',
      marbles((m) => {
        store.overrideSelector(selectRouterState, {
          state: {
            url: `/${AppRoutePath.AnalyticsPath}`,
          },
        } as RouterReducerState<RouterStateUrl>);
        action = loadAvailableClusters();
        actions$ = m.hot('-', { a: action });
        const expected = m.cold('-');

        m.expect(effects.routeChange$).toBeObservable(expected);
      })
    );

    test(
      'should not return loadAvailableClusters when url different than /fluctuation-analytics',
      marbles((m) => {
        store.overrideSelector(selectRouterState, {
          state: {
            url: `/different-path`,
          },
        } as RouterReducerState<RouterStateUrl>);
        actions$ = m.hot('-', { a: EMPTY });
        const expected = m.cold('-');

        m.expect(effects.routeChange$).toBeObservable(expected);
      })
    );
  });

  describe('filterChange$', () => {
    beforeEach(() => {
      store.overrideSelector(getCurrentFilters, {
        filterDimension: FilterDimension.COUNTRY,
        timeRange: '123-321',
        value: 'PL',
      });
    });

    test(
      'should return loadEmployeeAnalytics when filter selected',
      marbles((m) => {
        const selectedFilter: SelectedFilter = {
          idValue: { id: 'PL', value: 'Poland' },
          name: 'Poland',
        };
        action = filterSelected({ filter: selectedFilter });
        actions$ = m.hot('a', { a: action });
        const expected = m.cold('b', { b: loadEmployeeAnalytics() });

        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );

    test(
      'should return loadEmployeeAnalytics when time period selected',
      marbles((m) => {
        const timePeriod = TimePeriod.LAST_12_MONTHS;
        action = timePeriodSelected({ timePeriod });
        actions$ = m.hot('a', { a: action });
        const expected = m.cold('b', { b: loadEmployeeAnalytics() });

        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );
  });

  describe('loadAvailableClusters$', () => {
    test(
      'should return loadAvailableClusters',
      marbles((m) => {
        action = loadAvailableClusters();
        actions$ = m.hot('-a', {
          a: action,
        });
        const expected = m.cold('-(b))', {
          b: loadAvailableClustersSuccess({
            data: [{ name: 'xyz' } as EmployeeCluster],
          }),
        });

        m.expect(effects.loadAvailableClusters$).toBeObservable(expected);
      })
    );
  });

  describe('loadEmployeeAnalytics$', () => {
    test(
      'should return loadEmployeeAnalytics on loadEmployeeAnalytics',
      marbles((m) => {
        action = loadEmployeeAnalytics();
        store.overrideSelector(selectRouterState, {
          state: {
            url: `/${AppRoutePath.AnalyticsPath}`,
          },
        } as RouterReducerState<RouterStateUrl>);
        store.overrideSelector(getCurrentFilters, {
          filterDimension: FilterDimension.COUNTRY,
          timeRange: '123-321',
          value: 'PL',
        });
        store.overrideSelector(getSelectedCluster, 'Test');
        actions$ = m.hot('-a', { a: action });
        const result = loadEmployeeAnalyticsSuccess({ data: [] });
        const expected = m.cold('-b', {
          b: result,
        });

        m.expect(effects.loadEmployeeAnalytics$).toBeObservable(expected);
      })
    );

    test(
      'should return loadEmployeeAnalytics on selectCluster',
      marbles((m) => {
        action = selectCluster({ cluster: 'Test' });
        store.overrideSelector(selectRouterState, {
          state: {
            url: `/${AppRoutePath.AnalyticsPath}`,
          },
        } as RouterReducerState<RouterStateUrl>);
        store.overrideSelector(getCurrentFilters, {
          filterDimension: FilterDimension.COUNTRY,
          timeRange: '123-321',
          value: 'PL',
        });
        store.overrideSelector(getSelectedCluster, 'Test');
        actions$ = m.hot('-a', { a: action });
        const result = loadEmployeeAnalyticsSuccess({ data: [] });
        const expected = m.cold('-b', {
          b: result,
        });

        m.expect(effects.loadEmployeeAnalytics$).toBeObservable(expected);
      })
    );
  });

  describe('selectCluster$', () => {
    test(
      'should return loadEmployeeAnalytics when cluster selected',
      marbles((m) => {
        action = selectCluster({ cluster: 'Personal' });
        actions$ = m.hot('a', { a: action });
        const expected = m.cold('b', { b: loadEmployeeAnalytics() });

        m.expect(effects.selectCluster$).toBeObservable(expected);
      })
    );
  });
});
