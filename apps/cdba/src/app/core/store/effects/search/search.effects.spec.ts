import { Router } from '@angular/router';

import { marbles } from 'rxjs-marbles/jest';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { REFERENCE_TYPE_MOCK } from '@cdba/testing/mocks';

import { SearchService } from '../../../../search/services/search.service';
import {
  applyTextSearch,
  applyTextSearchFailure,
  applyTextSearchSuccess,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
  resetFilters,
  search,
  searchFailure,
  searchSuccess,
} from '../../actions';
import {
  FilterItemIdValue,
  FilterItemRange,
  IdValue,
  SearchResult,
  TextSearch,
} from '../../reducers/search/models';
import {
  getSelectedFilterIdValueOptionsByFilterName,
  getSelectedFilters,
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

    store.overrideSelector(getSelectedFilters, []);
    store.overrideSelector(getSelectedFilterIdValueOptionsByFilterName, []);
  });

  describe('loadInitialFilters$', () => {
    beforeEach(() => {
      action = loadInitialFilters();
    });

    test(
      'should return loadInitialFiltersSuccess action when REST call is successful',
      marbles((m) => {
        const items = [
          new FilterItemIdValue(
            'customer',
            [new IdValue('audi', 'Audi', false)],
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

    test(
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
    beforeEach(() => {
      action = search();
    });

    test(
      'should return searchSuccess action and navigate to results when REST call is successful',
      marbles((m) => {
        const filterItemIdVal = new FilterItemIdValue(
          'plant',
          [new IdValue('23', 'Best plant', false)],
          false
        );
        const filterItemRange = new FilterItemRange(
          'length',
          0,
          200,
          0,
          200,
          'kg'
        );

        const ref = REFERENCE_TYPE_MOCK;
        const searchResult = new SearchResult(
          [filterItemIdVal, filterItemRange],
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

    test(
      'should return searchSuccess action when REST call is successful',
      marbles((m) => {
        jest.resetAllMocks();
        const filterItemIdVal = new FilterItemIdValue(
          'plant',
          [new IdValue('23', 'Best plant', false)],
          false
        );
        const filterItemRange = new FilterItemRange(
          'length',
          0,
          200,
          0,
          200,
          'kg'
        );

        const ref = REFERENCE_TYPE_MOCK;
        const searchResult = new SearchResult(
          [filterItemIdVal, filterItemRange],
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

    test(
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

    test(
      'should return applyTextSearchSuccess action when REST call is successful',
      marbles((m) => {
        const filterItemIdVal = new FilterItemIdValue(
          'plant',
          [new IdValue('23', 'Best plant', false)],
          false
        );
        const filterItemRange = new FilterItemRange(
          'length',
          0,
          200,
          0,
          200,
          'kg'
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

    test(
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
    test(
      'should dispatch loadInitialFilters',
      marbles((m) => {
        actions$ = m.cold('-a', { a: resetFilters() });

        const expected = m.cold('-b', { b: loadInitialFilters() });

        m.expect(effects.resetFilters$).toBeObservable(expected);
      })
    );
  });

  describe('autocomplete$', () => {
    let textSearch: TextSearch;

    beforeEach(() => {
      textSearch = new TextSearch('customer', 'Aud');
      action = autocomplete({ textSearch });
    });

    test(
      'should return autocompleteSuccess action when REST call is successful',
      marbles((m) => {
        const item = new FilterItemIdValue(
          'customer',
          [new IdValue('audi', 'Audi', false)],
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
        expect(searchService.autocomplete).toHaveBeenCalledWith(textSearch, []);
      })
    );

    test(
      'should return autocompleteFailure on REST error',
      marbles((m) => {
        const error = new Error('damn');
        const result = autocompleteFailure();

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        searchService.autocomplete = jest.fn(() => response);

        m.expect(effects.autocomplete$).toBeObservable(expected);
        m.flush();
        expect(searchService.autocomplete).toHaveBeenCalled();
        expect(searchService.autocomplete).toHaveBeenCalledWith(textSearch, []);
      })
    );
  });
});
