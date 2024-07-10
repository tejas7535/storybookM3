import { Router } from '@angular/router';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { StringOption } from '@schaeffler/inputs';

import { REFERENCE_TYPE_MOCK } from '@cdba/testing/mocks';

import { SearchService } from '../../../../search/services/search.service';
import {
  applyTextSearch,
  applyTextSearchFailure,
  applyTextSearchSuccess,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  changePaginationVisibility,
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
  resetFilters,
  search,
  searchFailure,
  searchSuccess,
} from '../../actions';
import {
  FilterItem,
  FilterItemIdValue,
  FilterItemRange,
  FilterItemType,
  SearchResult,
  TextSearch,
} from '../../reducers/search/models';
import {
  getFiltersForSearchRequest,
  getSelectedFilterIdValueOptionsByFilterName,
  getTooManyResultsThreshold,
} from '../../selectors';
import { SearchEffects } from './search.effects';

describe('Search Effects', () => {
  let spectator: SpectatorService<SearchEffects>;
  let action: any;
  let actions$: any;
  let store: any;
  let effects: SearchEffects;
  let searchService: SearchService;

  const errorMessage = 'An error message occurred';

  const createService = createServiceFactory({
    service: SearchEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      mockProvider(SearchService),
      {
        provide: Router,
        useValue: {
          navigateByUrl: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    store = spectator.inject(Store);
    effects = spectator.inject(SearchEffects);
    searchService = spectator.inject(SearchService);

    store.overrideSelector(getFiltersForSearchRequest, []);
    store.overrideSelector(getTooManyResultsThreshold, 500);
    store.overrideSelector(getSelectedFilterIdValueOptionsByFilterName, []);
  });

  describe('loadInitialFilters$', () => {
    beforeEach(() => {
      action = loadInitialFilters();
    });

    it(
      'should return loadInitialFiltersSuccess action when REST call is successful',
      marbles((m) => {
        const items = [
          new FilterItemIdValue(
            'customer',
            [{ id: 'audi', title: 'Audi' } as StringOption],
            [],
            false,
            true
          ),
        ];
        const result = loadInitialFiltersSuccess({
          items,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: items,
        });
        const expected = m.cold('--b', { b: result });

        searchService.getInitialFilters = jest.fn(() => response);

        m.expect(effects.loadInitialFilters$).toBeObservable(expected);
        m.flush();
        expect(searchService.getInitialFilters).toHaveBeenCalled();
      })
    );

    it(
      'should return loadInitialFiltersFailure on REST error',
      marbles((m) => {
        const result = loadInitialFiltersFailure({ errorMessage });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        searchService.getInitialFilters = jest.fn(() => response);

        m.expect(effects.loadInitialFilters$).toBeObservable(expected);
        m.flush();
        expect(searchService.getInitialFilters).toHaveBeenCalled();
      })
    );
  });

  describe('search$', () => {
    let filterIdValue: FilterItemIdValue;
    let filterRange: FilterItemRange;

    beforeEach(() => {
      jest.resetAllMocks();

      action = search();

      filterIdValue = new FilterItemIdValue(
        'plant',
        [{ id: '23', title: 'Best plant' } as StringOption],
        [],
        false,
        false
      );

      filterRange = new FilterItemRange('length', 0, 200, 0, 200, 'kg', false);
    });

    it(
      'should return searchSuccess action when REST call is successful and navigate to results',
      marbles((m) => {
        const ref = REFERENCE_TYPE_MOCK;
        const searchResult = new SearchResult(
          [filterIdValue, filterRange],
          [ref],
          2
        );
        const result = searchSuccess({
          searchResult,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: searchResult,
        });
        const expected = m.cold('--b', { b: result });

        searchService.search = jest.fn(() => response);

        m.expect(effects.search$).toBeObservable(expected);
        m.flush();
        expect(searchService.search).toHaveBeenCalled();
        expect(searchService.search).toHaveBeenCalledWith([]);
        expect(effects['router'].navigateByUrl).toHaveBeenCalledWith('results');
      })
    );

    it(
      'should return searchSuccess action when REST call is successful and not navigate to results due to exceeded results limit',
      marbles((m) => {
        const ref = REFERENCE_TYPE_MOCK;
        const searchResult = new SearchResult(
          [filterIdValue, filterRange],
          [ref],
          750
        );
        const result = searchSuccess({
          searchResult,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: searchResult,
        });
        const expected = m.cold('--b', { b: result });

        searchService.search = jest.fn(() => response);

        m.expect(effects.search$).toBeObservable(expected);
        m.flush();
        expect(searchService.search).toHaveBeenCalled();
        expect(searchService.search).toHaveBeenCalledWith([]);
        expect(effects['router'].navigateByUrl).not.toHaveBeenCalled();
      })
    );

    it(
      'should return searchFailure on REST error',
      marbles((m) => {
        const result = searchFailure({ errorMessage });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        searchService.search = jest.fn(() => response);

        m.expect(effects.search$).toBeObservable(expected);
        m.flush();
        expect(searchService.search).toHaveBeenCalled();
        expect(searchService.search).toHaveBeenCalledWith([]);
      })
    );
  });

  describe('applyTextSearch$', () => {
    let textSearch: TextSearch;

    beforeEach(() => {
      textSearch = new TextSearch('customer', 'Awesome Customer');
      action = applyTextSearch({ textSearch });
    });

    it(
      'should return applyTextSearchSuccess action when REST call is successful',
      marbles((m) => {
        const filterItemIdVal = new FilterItemIdValue(
          'plant',
          [{ id: '23', title: 'Best plant' } as StringOption],
          [],
          false,
          false
        );
        const filterItemRange = new FilterItemRange(
          'length',
          0,
          200,
          0,
          200,
          'kg',
          false
        );

        const ref = REFERENCE_TYPE_MOCK;
        const searchResult = new SearchResult(
          [filterItemIdVal, filterItemRange],
          [ref],
          2
        );
        const result = applyTextSearchSuccess({
          searchResult,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: searchResult,
        });
        const expected = m.cold('--b', { b: result });

        searchService.textSearch = jest.fn(() => response);

        m.expect(effects.applyTextSearch$).toBeObservable(expected);
        m.flush();
        expect(searchService.textSearch).toHaveBeenCalled();
        expect(searchService.textSearch).toHaveBeenCalledWith(textSearch);
      })
    );

    it(
      'should return applyTextSearchFailure on REST error',
      marbles((m) => {
        const result = applyTextSearchFailure({ errorMessage });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        searchService.textSearch = jest.fn(() => response);

        m.expect(effects.applyTextSearch$).toBeObservable(expected);
        m.flush();
        expect(searchService.textSearch).toHaveBeenCalled();
        expect(searchService.textSearch).toHaveBeenCalledWith(textSearch);
      })
    );
  });

  describe('resetFilters$', () => {
    // eslint-disable-next-line jest/expect-expect
    it(
      'should dispatch loadInitialFilters',
      marbles((m) => {
        actions$ = m.cold('-a', { a: resetFilters() });

        const expected = m.cold('-b', { b: loadInitialFilters() });

        m.expect(effects.resetFilters$).toBeObservable(expected);
      })
    );
  });

  describe('autocomplete$', () => {
    beforeEach(() => {
      action = autocomplete({
        searchFor: 'Audi',
        filter: { name: 'customer', type: FilterItemType.ID_VALUE },
      });
    });

    it(
      'should return autocompleteSuccess action when REST call is successful',
      marbles((m) => {
        const item = new FilterItemIdValue(
          'customer',
          [{ id: 'audi', title: 'Audi' } as StringOption],
          [],
          false,
          true
        );
        const result = autocompleteSuccess({
          item,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: item,
        });
        const expected = m.cold('--b', { b: result });

        searchService.autocomplete = jest.fn(() => response);

        m.expect(effects.autocomplete$).toBeObservable(expected);
        m.flush();
        expect(searchService.autocomplete).toHaveBeenCalled();
        expect(searchService.autocomplete).toHaveBeenCalledWith(
          action.searchFor,
          action.filter.name
        );
      })
    );

    it(
      'should return autocompleteFailure on REST error',
      marbles((m) => {
        const filter = {
          name: 'customer',
          type: FilterItemType.ID_VALUE,
        } as FilterItem;

        const result = autocompleteFailure({ item: filter });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined);
        const expected = m.cold('--b', { b: result });

        searchService.autocomplete = jest.fn(() => response);

        m.expect(effects.autocomplete$).toBeObservable(expected);
        m.flush();
        expect(searchService.autocomplete).toHaveBeenCalled();
        expect(searchService.autocomplete).toHaveBeenCalledWith(
          action.searchFor,
          action.filter.name
        );
      })
    );
  });

  describe('resetPaginationVisibility$', () => {
    it(
      'should dispatch changePaginationVisibility action when navigating to /search page for other than first time',
      marbles((m) => {
        action = {
          type: ROUTER_NAVIGATED,
          payload: {
            event: {
              id: 2,
              urlAfterRedirects: '/search',
            },
          },
        } as RouterNavigatedAction;

        actions$ = m.hot('-a', { a: action });

        const result = changePaginationVisibility({ isVisible: false });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.resetPaginationVisibility$).toBeObservable(expected);
      })
    );
    it(
      'should not dispatch changePaginationVisibility action when navigating to other pages',
      marbles((m) => {
        action = {
          type: ROUTER_NAVIGATED,
          payload: {
            event: {
              id: 2,
              urlAfterRedirects: '/foo/bar',
            },
          },
        } as RouterNavigatedAction;

        actions$ = m.hot('-a', { a: action });

        m.expect(effects.resetPaginationVisibility$).toBeObservable('');
      })
    );
  });
});
