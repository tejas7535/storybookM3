import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { FilterService } from '../../../../filter-section/filter.service';
import { clearLossOfSkillDimensionData } from '../../../../loss-of-skill/store/actions/loss-of-skill.actions';
import { clearOverviewDimensionData } from '../../../../overview/store/actions/overview.action';
import { FilterDimension, FilterKey, IdValue } from '../../../../shared/models';
import {
  dimensionSelected,
  filterSelected,
  loadFilterDimensionData,
  loadFilterDimensionDataFailure,
  loadFilterDimensionDataSuccess,
} from '../../actions/filter/filter.action';
import {
  getCurrentDimensionValue,
  getSelectedDimension,
  getSelectedDimensionIdValue,
  getSelectedTimeRange,
} from '../../selectors';
import { FilterEffects } from './filter.effects';

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
      'should return clearOverviewDimensionData and when no dimension value not selected',
      marbles((m) => {
        store.overrideSelector(getCurrentDimensionValue, undefined as string);
        action = dimensionSelected();
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
        const value = 'ABC';
        store.overrideSelector(getCurrentDimensionValue, value);
        action = dimensionSelected();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('--');

        m.expect(effects.dimensionSelected$).toBeObservable(expected);
      })
    );
  });

  describe('loadFilterDimensionData$', () => {
    const searchFor = 'search';
    const timeRange = '123|456';

    beforeEach(() => {
      action = loadFilterDimensionData({
        filterDimension: FilterDimension.ORG_UNIT,
        searchFor,
      });
      store.overrideSelector(getSelectedTimeRange, {
        id: timeRange,
        value: timeRange,
      });
    });

    test(
      'should return loadOrgUnitsSuccess action when REST call is successful',
      marbles((m) => {
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

  describe('loadFilterDimensionDataSuccess$', () => {
    const idValue = new IdValue('DE', 'Germany');
    const filterDimension = FilterDimension.COUNTRY;
    const selectedFilter = {
      name: filterDimension,
      idValue,
    };

    beforeEach(() => {
      action = loadFilterDimensionDataSuccess({
        filterDimension,
        items: [idValue],
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

        m.expect(effects.loadFilterDimensionDataSuccess$).toBeObservable(
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

        m.expect(effects.loadFilterDimensionDataSuccess$).toBeObservable(
          expected
        );
        m.flush();
      })
    );
  });

  describe('timeRangeSelected$', () => {
    test(
      'should dispatch loadFilterDimensionData action when selected filter time range',
      marbles((m) => {
        const idValue = new IdValue('123-123', '2020-2022');
        const filterDimension = FilterDimension.ORG_UNIT;
        const selectedFilter = {
          name: FilterKey.TIME_RANGE,
          idValue,
        };
        action = filterSelected({ filter: selectedFilter });

        store.overrideSelector(getSelectedDimension, filterDimension);
        const result = loadFilterDimensionData({
          filterDimension,
        });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.timeRangeSelected$).toBeObservable(expected);
        m.flush();
      })
    );

    test(
      'should not dispatch loadFilterDimensionData action when selected filter not time range',
      marbles((m) => {
        const idValue = new IdValue('123-123', '2020-2022');
        const selectedFilter = {
          name: FilterDimension.COUNTRY,
          idValue,
        };
        action = filterSelected({ filter: selectedFilter });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-');

        m.expect(effects.timeRangeSelected$).toBeObservable(expected);
        m.flush();
      })
    );
  });
});
