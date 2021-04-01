import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';

import { REFERENCE_TYPE_MOCK } from '../../../../../../src/testing/mocks';
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
} from '../../actions/search/search.actions';
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
} from '../../selectors/search/search.selector';
import { SearchEffects } from './search.effects';

describe('Search Effects', () => {
  let spectator: SpectatorService<SearchEffects>;
  let action: any;
  let actions$: any;
  let store: any;
  let metadata: EffectsMetadata<SearchEffects>;
  let effects: SearchEffects;
  let searchService: SearchService;

  const errorMessage = 'An error message occured';

  const createService = createServiceFactory({
    service: SearchEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: SearchService,
        useValue: {
          getInitialFilters: jest.fn(),
          search: jest.fn(),
          autocomplete: jest.fn(),
          textSearch: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    store = spectator.inject(Store);
    effects = spectator.inject(SearchEffects);
    metadata = getEffectsMetadata(effects);
    searchService = spectator.inject(SearchService);

    store.overrideSelector(getSelectedFilters, []);
    store.overrideSelector(getSelectedFilterIdValueOptionsByFilterName, []);
  });

  describe('loadInitialFilters$', () => {
    beforeEach(() => {
      action = loadInitialFilters();
    });

    test('should return loadInitialFiltersSuccess action when REST call is successful', () => {
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

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: items,
      });
      const expected = cold('--b', { b: result });

      searchService.getInitialFilters = jest.fn(() => response);

      expect(effects.loadInitialFilters$).toBeObservable(expected);
      expect(searchService.getInitialFilters).toHaveBeenCalledTimes(1);
    });

    test('should return loadInitialFiltersFailure on REST error', () => {
      const result = loadInitialFiltersFailure({ errorMessage });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      searchService.getInitialFilters = jest.fn(() => response);

      expect(effects.loadInitialFilters$).toBeObservable(expected);
      expect(searchService.getInitialFilters).toHaveBeenCalledTimes(1);
    });
  });

  describe('search$', () => {
    beforeEach(() => {
      action = search();
    });

    test('should return searchSuccess action when REST call is successful', () => {
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

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: searchResult,
      });
      const expected = cold('--b', { b: result });

      searchService.search = jest.fn(() => response);

      expect(effects.search$).toBeObservable(expected);
      expect(searchService.search).toHaveBeenCalledTimes(1);
      expect(searchService.search).toHaveBeenCalledWith([]);
    });

    test('should return searchFailure on REST error', () => {
      const result = searchFailure({ errorMessage });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      searchService.search = jest.fn(() => response);

      expect(effects.search$).toBeObservable(expected);
      expect(searchService.search).toHaveBeenCalledTimes(1);
      expect(searchService.search).toHaveBeenCalledWith([]);
    });
  });

  describe('applyTextSearch$', () => {
    let textSearch: TextSearch;

    beforeEach(() => {
      textSearch = new TextSearch('customer', 'Awesome Customer');
      action = applyTextSearch({ textSearch });
    });

    test('should return applyTextSearchSuccess action when REST call is successful', () => {
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

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: searchResult,
      });
      const expected = cold('--b', { b: result });

      searchService.textSearch = jest.fn(() => response);

      expect(effects.applyTextSearch$).toBeObservable(expected);
      expect(searchService.textSearch).toHaveBeenCalledTimes(1);
      expect(searchService.textSearch).toHaveBeenCalledWith(textSearch);
    });

    test('should return applyTextSearchFailure on REST error', () => {
      const result = applyTextSearchFailure({ errorMessage });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      searchService.textSearch = jest.fn(() => response);

      expect(effects.applyTextSearch$).toBeObservable(expected);
      expect(searchService.textSearch).toHaveBeenCalledTimes(1);
      expect(searchService.textSearch).toHaveBeenCalledWith(textSearch);
    });
  });

  describe('resetFilters$', () => {
    test('should not return an action', () => {
      expect(metadata.resetFilters$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should dispatch loadInitialFilters', () => {
      store.dispatch = jest.fn();
      actions$ = cold('-a', { a: resetFilters() });

      expect(effects.resetFilters$).toBeObservable(actions$);
      expect(store.dispatch).toHaveBeenCalledWith(loadInitialFilters());
    });
  });

  describe('shareSearchResult', () => {
    test('should not return an action', () => {
      expect(metadata.shareSearchResult$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });
  });

  describe('autocomplete$', () => {
    let textSearch: TextSearch;

    beforeEach(() => {
      textSearch = new TextSearch('customer', 'Aud');
      action = autocomplete({ textSearch });
    });

    test('should return autocompleteSuccess action when REST call is successful', () => {
      const item = new FilterItemIdValue(
        'customer',
        [new IdValue('audi', 'Audi', false)],
        true
      );
      const result = autocompleteSuccess({
        item,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: item,
      });
      const expected = cold('--b', { b: result });

      searchService.autocomplete = jest.fn(() => response);

      expect(effects.autocomplete$).toBeObservable(expected);
      expect(searchService.autocomplete).toHaveBeenCalledTimes(1);
      expect(searchService.autocomplete).toHaveBeenCalledWith(textSearch, []);
    });

    test('should return autocompleteFailure on REST error', () => {
      const error = new Error('damn');
      const result = autocompleteFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      searchService.autocomplete = jest.fn(() => response);

      expect(effects.autocomplete$).toBeObservable(expected);
      expect(searchService.autocomplete).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngrxOnInitEffects', () => {
    test('should return loadInitialFilters', () => {
      const result = effects.ngrxOnInitEffects();

      expect(result).toEqual(loadInitialFilters());
    });
  });
});
