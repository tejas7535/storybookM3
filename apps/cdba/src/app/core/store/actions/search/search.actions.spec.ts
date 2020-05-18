import {
  applyTextSearch,
  applyTextSearchFailure,
  applyTextSearchSuccess,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  getInitialFilters,
  getInitialFiltersFailure,
  getInitialFiltersSuccess,
  removeFilter,
  resetFilters,
  search,
  searchFailure,
  searchSuccess,
  shareSearchResult,
  updateFilter,
} from '../';
import {
  FilterItemIdValue,
  FilterItemRange,
  IdValue,
  ReferenceType,
  SearchResult,
  TextSearch,
} from '../../reducers/search/models';

describe('Search Actions', () => {
  describe('Get initial filters actions', () => {
    test('getInitialFilters', () => {
      const action = getInitialFilters();

      expect(action).toEqual({
        type: '[Search] Load Initial Filters',
      });
    });

    test('getInitialFiltersSuccess', () => {
      const items = [
        new FilterItemIdValue('plant', [new IdValue('23', 'Super Plant')]),
      ];
      const action = getInitialFiltersSuccess({ items });

      expect(action).toEqual({
        items,
        type: '[Search] Load Initial Filters Success',
      });
    });

    test('getInitialFiltersFailure', () => {
      const action = getInitialFiltersFailure();

      expect(action).toEqual({
        type: '[Search] Load Initial Filters Failure',
      });
    });
  });

  describe('Search reference types actions', () => {
    test('search', () => {
      const action = search();

      expect(action).toEqual({
        type: '[Search] Search Reference Types',
      });
    });

    test('searchSuccess', () => {
      const item = new FilterItemIdValue('plant', [
        new IdValue('23', 'Super Plant'),
      ]);
      const ref = new ReferenceType();
      const searchResult = new SearchResult([item], [ref]);
      const action = searchSuccess({ searchResult });

      expect(action).toEqual({
        searchResult,
        type: '[Search] Search Reference Types Success',
      });
    });

    test('searchFailure', () => {
      const action = searchFailure();

      expect(action).toEqual({
        type: '[Search] Search Reference Types Failure',
      });
    });
  });

  describe('Update Filter Action', () => {
    test('updateFilter', () => {
      const item: FilterItemRange = new FilterItemRange('width', 100, 200);

      const action = updateFilter({ item });

      expect(action).toEqual({
        item,
        type: '[Search] Update Filter',
      });
    });
  });

  describe('Remove Filter Action', () => {
    test('removeFilter', () => {
      const name = 'plant';

      const action = removeFilter({ name });

      expect(action).toEqual({
        name,
        type: '[Search] Remove Filter',
      });
    });
  });

  describe('Apply Text Search Actions', () => {
    test('applyTextSearch', () => {
      const textSearch = new TextSearch('customer', 'Awesome Customer');

      const action = applyTextSearch({ textSearch });

      expect(action).toEqual({
        textSearch,
        type: '[Search] Apply Text Search',
      });
    });

    test('applyTextSearchSuccess', () => {
      const item = new FilterItemIdValue('plant', [
        new IdValue('23', 'Super Plant'),
      ]);
      const ref = new ReferenceType();
      const searchResult = new SearchResult([item], [ref]);
      const action = applyTextSearchSuccess({ searchResult });

      expect(action).toEqual({
        searchResult,
        type: '[Search] Apply Text Search Success',
      });
    });

    test('applyTextSearchFailure', () => {
      const action = applyTextSearchFailure();

      expect(action).toEqual({
        type: '[Search] Apply Text Search Failure',
      });
    });
  });

  describe('Reset Filters Action', () => {
    test('resetFilters', () => {
      const action = resetFilters();

      expect(action).toEqual({
        type: '[Search] Reset All Filters',
      });
    });
  });

  describe('Share Search Result Action', () => {
    test('shareSearchResult', () => {
      const action = shareSearchResult();

      expect(action).toEqual({
        type: '[Search] Share Search Result',
      });
    });
  });

  describe('Autocomplete Actions', () => {
    test('autocomplete', () => {
      const textSearch = new TextSearch('customer', 'Awe');

      const action = autocomplete({ textSearch });

      expect(action).toEqual({
        textSearch,
        type: '[Search] Get Autocomplete Suggestions For Provided Filter Type',
      });
    });

    test('autocompleteSuccess', () => {
      const item = new FilterItemIdValue('plant', [
        new IdValue('23', 'Super Plant'),
      ]);

      const action = autocompleteSuccess({ item });

      expect(action).toEqual({
        item,
        type:
          '[Search] Get Autocomplete Suggestions For Provided Filter Type Success',
      });
    });

    test('autocompleteFailure', () => {
      const action = autocompleteFailure();

      expect(action).toEqual({
        type:
          '[Search] Get Autocomplete Suggestions For Provided Filter Type Failure',
      });
    });
  });
});
