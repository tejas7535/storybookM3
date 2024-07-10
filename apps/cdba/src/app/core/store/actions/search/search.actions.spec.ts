import { StringOption } from '@schaeffler/inputs';

import { REFERENCE_TYPE_MOCK } from '@cdba/testing/mocks';

import {
  FilterItemIdValue,
  FilterItemRange,
  FilterItemType,
  SearchResult,
  TextSearch,
} from '../../reducers/search/models';
import {
  applyTextSearch,
  applyTextSearchFailure,
  applyTextSearchSuccess,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  changePaginationVisibility,
  deselectReferenceType,
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
  resetFilters,
  search,
  searchFailure,
  searchSuccess,
  selectReferenceTypes,
  shareSearchResult,
  updateFilter,
} from './search.actions';

describe('Search Actions', () => {
  const errorMessage = 'An error occured';

  describe('Get initial filters actions', () => {
    test('loadInitialFilters', () => {
      const action = loadInitialFilters();

      expect(action).toEqual({
        type: '[Search] Load Initial Filters',
      });
    });

    test('loadInitialFiltersSuccess', () => {
      const items = [
        new FilterItemIdValue(
          'plant',
          [{ id: '23', title: 'Super Plant' } as StringOption],
          [],
          false,
          false
        ),
      ];
      const action = loadInitialFiltersSuccess({ items });

      expect(action).toEqual({
        items,
        type: '[Search] Load Initial Filters Success',
      });
    });

    test('loadInitialFiltersFailure', () => {
      const action = loadInitialFiltersFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
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
      const item = new FilterItemIdValue(
        'plant',
        [{ id: '23', title: 'Super Plant' } as StringOption],
        [],
        false,
        false
      );
      const ref = REFERENCE_TYPE_MOCK;
      const searchResult = new SearchResult([item], [ref], 1);
      const action = searchSuccess({ searchResult });

      expect(action).toEqual({
        searchResult,
        type: '[Search] Search Reference Types Success',
      });
    });

    test('searchFailure', () => {
      const action = searchFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Search] Search Reference Types Failure',
      });
    });
  });

  describe('Update Filter Action', () => {
    test('updateFilter', () => {
      const filter: FilterItemRange = new FilterItemRange(
        'width',
        100,
        200,
        100,
        200,
        'cm',
        false
      );

      const action = updateFilter({ filter });

      expect(action).toEqual({
        filter,
        type: '[Search] Update Filter',
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
      const item = new FilterItemIdValue(
        'plant',
        [{ id: '23', title: 'Super Plant' } as StringOption],
        [],
        false,
        false
      );
      const ref = REFERENCE_TYPE_MOCK;
      const searchResult = new SearchResult([item], [ref], 1);
      const action = applyTextSearchSuccess({ searchResult });

      expect(action).toEqual({
        searchResult,
        type: '[Search] Apply Text Search Success',
      });
    });

    test('applyTextSearchFailure', () => {
      const action = applyTextSearchFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
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
      const action = autocomplete({
        searchFor: 'Awe',
        filter: { name: 'customer', type: FilterItemType.ID_VALUE },
      });

      expect(action).toEqual({
        type: '[Search] Get Autocomplete Suggestions For Provided Filter Type',
        searchFor: 'Awe',
        filter: { name: 'customer', type: FilterItemType.ID_VALUE },
      });
    });

    test('autocompleteSuccess', () => {
      const item = new FilterItemIdValue(
        'plant',
        [{ id: '23', title: 'Super Plant' } as StringOption],
        [],
        false,
        false
      );

      const action = autocompleteSuccess({ item });

      expect(action).toEqual({
        item,
        type: '[Search] Get Autocomplete Suggestions For Provided Filter Type Success',
      });
    });

    test('autocompleteFailure', () => {
      const action = autocompleteFailure({
        item: { name: '', type: FilterItemType.ID_VALUE },
      });

      expect(action).toEqual({
        type: '[Search] Get Autocomplete Suggestions For Provided Filter Type Failure',
        item: { name: '', type: FilterItemType.ID_VALUE },
      });
    });
  });

  describe('Selection Actions', () => {
    test('selectReferenceTypes', () => {
      const action = selectReferenceTypes({ nodeIds: ['3', '4'] });

      expect(action).toEqual({
        type: '[Search] Select Reference Types',
        nodeIds: ['3', '4'],
      });
    });

    test('deselectReferenceType', () => {
      const action = deselectReferenceType({ nodeId: '3' });

      expect(action).toEqual({
        type: '[Search] Deselect Reference Type',
        nodeId: '3',
      });
    });
  });

  describe('Pagination Actions', () => {
    test('changePaginationVisibility', () => {
      const action = changePaginationVisibility({ isVisible: true });

      expect(action).toEqual({
        type: '[Search] Change Pagination State',
        isVisible: true,
      });
    });
  });
});
