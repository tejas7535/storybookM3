import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { routerNavigationAction, RouterReducerState } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import moment from 'moment';
import { marbles } from 'rxjs-marbles/jest';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { FilterService } from '../../../../filter-section/filter.service';
import { clearLossOfSkillDimensionData } from '../../../../loss-of-skill/store/actions/loss-of-skill.actions';
import {
  clearOverviewBenchmarkData,
  clearOverviewDimensionData,
} from '../../../../overview/store/actions/overview.action';
import {
  FilterDimension,
  IdValue,
  TimePeriod,
} from '../../../../shared/models';
import { loadUserSettingsDimensionData } from '../../../../user/store/actions/user.action';
import {
  activateTimePeriodFilters,
  benchmarDimensionSelected as benchmarkDimensionSelected,
  benchmarkFilterSelected,
  dimensionSelected,
  filterSelected,
  loadFilterBenchmarkDimensionData,
  loadFilterDimensionData,
  loadFilterDimensionDataFailure,
  loadFilterDimensionDataSuccess,
} from '../../actions/filter/filter.action';
import { RouterStateUrl, selectRouterState } from '../../reducers';
import {
  getBenchmarkIdValue,
  getCurrentFilters,
  getSelectedBenchmarkValue,
  getSelectedDimensionIdValue,
  getSelectedTimeRange,
} from '../../selectors';
import { FilterEffects } from './filter.effects';

jest.mock('../../../../shared/utils/utilities', () => ({
  ...jest.requireActual('../../../../shared/utils/utilities'),
  getToday: jest.fn(() => moment.utc('2025-04-13')),
}));
describe('Filter Effects', () => {
  let spectator: SpectatorService<FilterEffects>;
  let actions$: any;
  let filterService: FilterService;
  let action: any;
  let effects: FilterEffects;
  let store: MockStore;

  const error = {
    message: 'An error message occured',
  };

  const createService = createServiceFactory({
    service: FilterEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({}),
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
    effects = spectator.inject(FilterEffects);
    filterService = spectator.inject(FilterService);
    store = spectator.inject(MockStore);
  });

  describe('dimensionSelected$', () => {
    test(
      'should return clearOverviewDimensionData when no dimension value selected',
      marbles((m) => {
        store.overrideSelector(getCurrentFilters, {
          filterDimension: undefined,
          timeRange: '123|321',
          value: 'cba',
        });
        action = loadFilterDimensionData({
          filterDimension: FilterDimension.BOARD,
        });
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(bc)', {
          b: clearOverviewDimensionData(),
          c: clearLossOfSkillDimensionData(),
        });

        m.expect(effects.dimensionSelected$).toBeObservable(expected);
      })
    );

    test(
      'should return clearOverviewDimensionData when no value selected',
      marbles((m) => {
        store.overrideSelector(getCurrentFilters, {
          filterDimension: FilterDimension.COUNTRY,
          timeRange: '123-321',
          value: undefined,
        });
        action = loadFilterDimensionData({
          filterDimension: FilterDimension.BOARD,
        });
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(bc)', {
          b: clearOverviewDimensionData(),
          c: clearLossOfSkillDimensionData(),
        });

        m.expect(effects.dimensionSelected$).toBeObservable(expected);
      })
    );

    test(
      'should return clearOverviewDimensionData when no time range selected',
      marbles((m) => {
        store.overrideSelector(getCurrentFilters, {
          filterDimension: FilterDimension.COUNTRY,
          timeRange: undefined,
          value: 'cba',
        });
        action = loadFilterDimensionData({
          filterDimension: FilterDimension.BOARD,
        });
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(bc)', {
          b: clearOverviewDimensionData(),
          c: clearLossOfSkillDimensionData(),
        });

        m.expect(effects.dimensionSelected$).toBeObservable(expected);
      })
    );

    test(
      'should return nothing when dimension value selected',
      marbles((m) => {
        store.overrideSelector(getCurrentFilters, {
          filterDimension: FilterDimension.BOARD,
          timeRange: '123-321',
          value: 'abc',
        });
        action = dimensionSelected();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('--');

        m.expect(effects.loadFilterDimensionData$).toBeObservable(expected);
      })
    );
  });

  describe('benchmarkDimensionSelected$', () => {
    test(
      'should return clearOverviewBenchmarkData when no dimension value selected',
      marbles((m) => {
        store.overrideSelector(getSelectedBenchmarkValue, undefined as string);
        action = benchmarkDimensionSelected();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: clearOverviewBenchmarkData(),
        });

        m.expect(effects.benchmarkDimensionSelected$).toBeObservable(expected);
      })
    );

    test(
      'should return nothing when dimension value selected',
      marbles((m) => {
        const value = 'ABC';
        store.overrideSelector(getSelectedBenchmarkValue, value);
        action = benchmarkDimensionSelected();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('--');

        m.expect(effects.benchmarkDimensionSelected$).toBeObservable(expected);
      })
    );
  });

  describe('loadFilterDimensionData$', () => {
    const searchFor = 'search';
    const timeRange = '123|456';

    beforeEach(() => {
      store.overrideSelector(getSelectedTimeRange, {
        id: timeRange,
        value: timeRange,
      });
    });

    test(
      'should return loadOrgUnitsSuccess on loadFilterDimensionData action when REST call is successful',
      marbles((m) => {
        action = loadFilterDimensionData({
          filterDimension: FilterDimension.ORG_UNIT,
          searchFor,
        });
        const items = [new IdValue('Department1', 'Department1')];
        const result = loadFilterDimensionDataSuccess({
          filterDimension: FilterDimension.ORG_UNIT,
          items,
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
      'should return loadOrgUnitsSuccess on loadFilterBenchmarkDimensionData action when REST call is successful',
      marbles((m) => {
        action = loadFilterBenchmarkDimensionData({
          filterDimension: FilterDimension.ORG_UNIT,
          searchFor,
        });
        const items = [new IdValue('Department1', 'Department1')];
        const result = loadFilterDimensionDataSuccess({
          filterDimension: FilterDimension.ORG_UNIT,
          items,
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
      'should return loadOrgUnitsSuccess on loadUserSettingsDimensionData action when REST call is successful',
      marbles((m) => {
        action = loadUserSettingsDimensionData({
          filterDimension: FilterDimension.ORG_UNIT,
          searchFor,
        });
        const items = [new IdValue('Department1', 'Department1')];
        const result = loadFilterDimensionDataSuccess({
          filterDimension: FilterDimension.ORG_UNIT,
          items,
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
      'should return loadOrgUnitsFailure on REST error',
      marbles((m) => {
        const result = loadFilterDimensionDataFailure({
          filterDimension: FilterDimension.ORG_UNIT,
          errorMessage: error.message,
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

  describe('loadFilterDimensionDataFilterSelected$', () => {
    const idValue = new IdValue('DE', 'Germany');
    const filterDimension = FilterDimension.COUNTRY;
    const selectedFilter = {
      name: filterDimension,
      idValue,
    };

    beforeEach(() => {
      action = loadFilterDimensionData({
        filterDimension,
      });
    });

    test(
      'should dispatch filterSelected action',
      marbles((m) => {
        store.overrideSelector(getSelectedDimensionIdValue, idValue);
        const result = filterSelected({
          filter: selectedFilter,
        });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.loadFilterDimensionDataFilterSelected$).toBeObservable(
          expected
        );
        m.flush();
      })
    );

    test(
      'should return empty observable when selectedDimensionIdValue undefined',
      marbles((m) => {
        store.overrideSelector(
          getSelectedDimensionIdValue,
          undefined as IdValue
        );

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('', {});

        m.expect(effects.loadFilterDimensionDataFilterSelected$).toBeObservable(
          expected
        );
        m.flush();
      })
    );
  });

  describe('loadFilterDimensionDataBenchmarkFilterSelected$', () => {
    const idValue = new IdValue('DE', 'Germany');
    const filterDimension = FilterDimension.COUNTRY;
    const selectedFilter = {
      name: filterDimension,
      idValue,
    };

    beforeEach(() => {
      action = loadFilterBenchmarkDimensionData({
        filterDimension,
      });
    });

    test(
      'should dispatch benchmarkFilterSelected action',
      marbles((m) => {
        store.overrideSelector(getBenchmarkIdValue, idValue);
        const result = benchmarkFilterSelected({
          filter: selectedFilter,
        });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', { b: result });

        m.expect(
          effects.loadFilterDimensionDataBenchmarkFilterSelected$
        ).toBeObservable(expected);
        m.flush();
      })
    );

    test(
      'should return empty observable when benchmarkDimensionIdValue undefined',
      marbles((m) => {
        store.overrideSelector(getBenchmarkIdValue, undefined as IdValue);

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('', {});

        m.expect(
          effects.loadFilterDimensionDataBenchmarkFilterSelected$
        ).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('setTimePeriodsFiltersForCurrentTab$', () => {
    test(
      'should return activateTimePeriodFilters when current route loss of skill',
      marbles((m) => {
        store.overrideSelector(selectRouterState, {
          state: {
            url: `/${AppRoutePath.LostPerformancePath}`,
          },
        } as RouterReducerState<RouterStateUrl>);

        const props = {
          timePeriods: [
            { id: TimePeriod.YEAR, value: TimePeriod.YEAR } as IdValue,
          ],
          activeTimePeriod: TimePeriod.YEAR,
          timeRange: { id: '1704067200|1735689599', value: '2024' } as IdValue,
          timeRangeConstraints: {
            min: 1_640_995_200,
            max: 1_735_689_599,
          },
        };

        action = routerNavigationAction({} as any);
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: activateTimePeriodFilters(props),
        });

        m.expect(effects.setTimePeriodsFiltersForCurrentTab$).toBeObservable(
          expected
        );
      })
    );
  });
});
