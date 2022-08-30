import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { FilterService } from '../../../../filter-section/filter.service';
import { FilterDimension, IdValue } from '../../../../shared/models';
import {
  filterSelected,
  loadFilterDimensionData,
  loadFilterDimensionDataFailure,
  loadFilterDimensionDataSuccess,
} from '../../actions/filter/filter.action';
import { getSelectedBusinessArea, getSelectedTimeRange } from '../../selectors';
import { FilterEffects } from './filter.effects';

describe('Filter Effects', () => {
  let spectator: SpectatorService<FilterEffects>;
  let actions$: any;
  let filterService: FilterService;
  let action: any;
  let effects: FilterEffects;
  let store: MockStore;
  let service: FilterEffects;

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
    service = spectator.service;
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

        filterService.getOrgUnits = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadFilterDimensionData$).toBeObservable(expected);
        m.flush();
        expect(filterService.getOrgUnits).toHaveBeenCalledTimes(1);
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

        filterService.getOrgUnits = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadFilterDimensionData$).toBeObservable(expected);
        m.flush();
        expect(filterService.getOrgUnits).toHaveBeenCalledTimes(1);
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
        store.overrideSelector(getSelectedBusinessArea, idValue);
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
      'should return empty observable when selectedBusinessArea undefined',
      marbles((m) => {
        store.overrideSelector(getSelectedBusinessArea, undefined as IdValue);

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('', {});

        m.expect(effects.loadFilterDimensionDataSuccess$).toBeObservable(
          expected
        );
        m.flush();
      })
    );
  });

  describe('getDataForFilterDimension', () => {
    test('should return org units', () => {
      const searchFor = 't1';
      const timeRange = '123';
      const expectedResult = of();
      filterService.getOrgUnits = jest.fn().mockReturnValue(expectedResult);

      const result = service.getDataForFilterDimension(
        FilterDimension.ORG_UNIT,
        searchFor,
        timeRange
      );

      expect(result).toEqual(expectedResult);
      expect(filterService.getOrgUnits).toHaveBeenCalledWith(
        searchFor,
        timeRange
      );
    });

    test('should return regions', () => {
      const expectedResult = of();
      filterService.getRegions = jest.fn().mockReturnValue(expectedResult);

      const result = service.getDataForFilterDimension(FilterDimension.REGION);

      expect(result).toEqual(expectedResult);
      expect(filterService.getRegions).toHaveBeenCalled();
    });

    test('should return sub-regions', () => {
      const expectedResult = of();
      filterService.getSubRegions = jest.fn().mockReturnValue(expectedResult);

      const result = service.getDataForFilterDimension(
        FilterDimension.SUB_REGION
      );

      expect(result).toEqual(expectedResult);
      expect(filterService.getSubRegions).toHaveBeenCalled();
    });

    test('should return countries', () => {
      const expectedResult = of();
      filterService.getCountries = jest.fn().mockReturnValue(expectedResult);

      const result = service.getDataForFilterDimension(FilterDimension.COUNTRY);

      expect(result).toEqual(expectedResult);
      expect(filterService.getCountries).toHaveBeenCalled();
    });

    test('should return sub-functions', () => {
      const expectedResult = of();
      filterService.getSubFunctions = jest.fn().mockReturnValue(expectedResult);

      const result = service.getDataForFilterDimension(
        FilterDimension.SUB_FUNCTION
      );

      expect(result).toEqual(expectedResult);
      expect(filterService.getSubFunctions).toHaveBeenCalled();
    });
  });
});
