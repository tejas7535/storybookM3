/* eslint-disable max-lines */
import { Action } from '@ngrx/store';

import { REFERENCE_TYPE_MOCK } from '@cdba/testing/mocks';

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
  selectReferenceTypes,
  shareSearchResult,
  updateFilter,
} from '../../actions/search/search.actions';
import {
  FilterItemIdValue,
  FilterItemRange,
  IdValue,
  SearchResult,
  TextSearch,
} from './models';
import { initialState, reducer, searchReducer } from './search.reducer';

describe('Search Reducer', () => {
  const filterItemIdVal = new FilterItemIdValue(
    'plant',
    [new IdValue('23', 'Best plant', false)],
    false
  );
  const filterItemRange = new FilterItemRange('length', 0, 200, 0, 200, 'cm');
  const errorMessage = 'An error occured';

  describe('loadInitialFilters', () => {
    test('should set loading', () => {
      const action = loadInitialFilters();
      const state = searchReducer(initialState, action);

      expect(state.filters.loading).toBeTruthy();
    });
  });

  describe('loadInitialFiltersSuccess', () => {
    test('should unset loading and set possible filters', () => {
      const items = [filterItemIdVal, filterItemRange];

      const expected = {
        plant: filterItemIdVal,
        length: filterItemRange,
      };
      const action = loadInitialFiltersSuccess({ items });

      const fakeState = {
        ...initialState,
        filters: { ...initialState.filters, loading: true },
      };

      const state = searchReducer(fakeState, action);

      expect(state.filters.loading).toBeFalsy();
      expect(state.filters.items.entities).toEqual(expected);
    });
  });

  describe('loadInitialFiltersFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadInitialFiltersFailure({ errorMessage });
      const fakeState = {
        ...initialState,
        filters: { ...initialState.filters, loading: true },
      };

      const state = searchReducer(fakeState, action);

      expect(state.filters.loading).toBeFalsy();
      expect(state.filters.errorMessage).toEqual(errorMessage);
    });
  });

  describe('search', () => {
    test('should set loading', () => {
      const action = search();
      const state = searchReducer(initialState, action);

      expect(state.referenceTypes.loading).toBeTruthy();
    });
  });

  describe('searchSuccess', () => {
    test('should unset loading and set ref types', () => {
      const searchResult = new SearchResult(
        [filterItemIdVal, filterItemRange],
        [REFERENCE_TYPE_MOCK],
        2
      );
      const expectedEntities = {
        plant: filterItemIdVal,
        length: filterItemRange,
      };

      const action = searchSuccess({ searchResult });

      const fakeState = {
        ...initialState,
        referenceTypes: {
          ...initialState.referenceTypes,
          loading: true,
        },
      };
      const state = searchReducer(fakeState, action);

      expect(state.referenceTypes.loading).toBeFalsy();
      expect(state.referenceTypes.tooManyResults).toBeFalsy();
      expect(state.referenceTypes.items).toEqual(searchResult.results);
      expect(state.filters.items.entities).toEqual(expectedEntities);
    });

    test('should unset loading and keep old filter if searchCount is zero', () => {
      const searchResult = new SearchResult(
        [filterItemIdVal, filterItemRange],
        [REFERENCE_TYPE_MOCK],
        0
      );

      const action = searchSuccess({ searchResult });

      const fakeState = {
        ...initialState,
        referenceTypes: {
          ...initialState.referenceTypes,
          loading: true,
        },
      };
      const state = searchReducer(fakeState, action);

      expect(state.referenceTypes.loading).toBeFalsy();
      expect(state.referenceTypes.tooManyResults).toBeFalsy();
      expect(state.referenceTypes.items).toEqual(searchResult.results);
      expect(state.filters.items).toEqual(fakeState.filters.items);
    });

    test('should unset loading and tooManyResults if too many results', () => {
      const searchResult = new SearchResult(
        [filterItemIdVal, filterItemRange],
        [],
        501
      );
      const expectedEntities = {
        plant: filterItemIdVal,
        length: filterItemRange,
      };

      const action = searchSuccess({ searchResult });

      const fakeState = {
        ...initialState,
        referenceTypes: {
          ...initialState.referenceTypes,
          loading: true,
        },
      };
      const state = searchReducer(fakeState, action);

      expect(state.referenceTypes.loading).toBeFalsy();
      expect(state.referenceTypes.tooManyResults).toBeTruthy();
      expect(state.referenceTypes.items).toEqual(searchResult.results);
      expect(state.filters.items.entities).toEqual(expectedEntities);
    });
  });

  describe('searchFailure', () => {
    test('should unset loading / set error message', () => {
      const action = searchFailure({ errorMessage });
      const fakeState = {
        ...initialState,
        referenceTypes: {
          ...initialState.referenceTypes,
          loading: true,
        },
      };

      const state = searchReducer(fakeState, action);

      expect(state.referenceTypes.loading).toBeFalsy();
      expect(state.referenceTypes.errorMessage).toEqual(errorMessage);
    });
  });

  describe('applyTextSearch', () => {
    test('should set loading', () => {
      const textSearch = new TextSearch('plant', 'awe');
      const action = applyTextSearch({ textSearch });
      const state = searchReducer(initialState, action);

      expect(state.referenceTypes.loading).toBeTruthy();
    });
  });

  describe('applyTextSearchSuccess', () => {
    test('should unset loading and set ref types', () => {
      const searchResult = new SearchResult(
        [filterItemIdVal, filterItemRange],
        [REFERENCE_TYPE_MOCK],
        2
      );
      const expectedEntities = {
        plant: filterItemIdVal,
        length: filterItemRange,
      };

      const action = applyTextSearchSuccess({ searchResult });

      const fakeState = {
        ...initialState,
        referenceTypes: {
          ...initialState.referenceTypes,
          loading: true,
        },
      };
      const state = searchReducer(fakeState, action);

      expect(state.referenceTypes.loading).toBeFalsy();
      expect(state.referenceTypes.tooManyResults).toBeFalsy();
      expect(state.referenceTypes.items).toEqual(searchResult.results);
      expect(state.filters.items.entities).toEqual(expectedEntities);
    });

    test('should unset loading and tooManyResults if results undefined', () => {
      const searchResult = new SearchResult(
        [filterItemIdVal, filterItemRange],
        undefined,
        2
      );
      const expectedEntities = {
        plant: filterItemIdVal,
        length: filterItemRange,
      };

      const action = applyTextSearchSuccess({ searchResult });

      const fakeState = {
        ...initialState,
        referenceTypes: {
          ...initialState.referenceTypes,
          loading: true,
        },
      };
      const state = searchReducer(fakeState, action);

      expect(state.referenceTypes.loading).toBeFalsy();
      expect(state.referenceTypes.tooManyResults).toBeTruthy();
      expect(state.referenceTypes.items).toEqual(searchResult.results);
      expect(state.filters.items.entities).toEqual(expectedEntities);
    });
  });

  describe('applyTextSearchFailure', () => {
    test('should unset loading', () => {
      const action = applyTextSearchFailure({ errorMessage });
      const fakeState = {
        ...initialState,
        referenceTypes: {
          ...initialState.referenceTypes,
          loading: true,
        },
      };

      const state = searchReducer(fakeState, action);

      expect(state.referenceTypes.loading).toBeFalsy();
    });
  });

  describe('updateFilter', () => {
    test('should update filter', () => {
      const item = new FilterItemIdValue(
        'customer',
        [new IdValue('audi', 'Audi', false), new IdValue('vw', 'VW', false)],
        true
      );
      const fakeState = {
        ...initialState,
        filters: {
          ...initialState.filters,
          items: {
            ids: ['customer'],
            entities: {
              customer: new FilterItemIdValue(
                'customer',
                [new IdValue('audi', 'Audi', false)],
                true
              ),
            },
          },
        },
      };

      const action = updateFilter({ item });
      const state = searchReducer(fakeState, action);

      expect(state.filters.items.entities.customer).toEqual(item);
    });

    test('should set dirty flag to true', () => {
      const item = new FilterItemIdValue(
        'customer',
        [new IdValue('audi', 'Audi', false), new IdValue('vw', 'VW', false)],
        true
      );
      const fakeState = {
        ...initialState,
      };

      const action = updateFilter({ item });
      const state = searchReducer(fakeState, action);

      expect(state.filters.dirty).toBeTruthy();
    });
  });

  describe('resetFilters', () => {
    test('should reset filters', () => {
      const customer = new FilterItemIdValue(
        'customer',
        [new IdValue('audi', 'Audi', true)],
        true
      );

      const plant = new FilterItemIdValue(
        'plant',
        [new IdValue('23', 'Awesome Plant', true)],
        false
      );

      const length = new FilterItemRange('length', 1, 20, 2, 19, 'min');

      const fakeState = {
        ...initialState,
        filters: {
          ...initialState.filters,
          items: {
            ids: ['customer', 'plant', 'length'],
            entities: {
              customer,
              plant,
              length,
            },
          },
          referenceTypes: {
            ...initialState.referenceTypes,
            items: [''],
            loading: false,
          },
        },
      };

      const action = resetFilters();
      const state = searchReducer(fakeState, action);

      expect(state.filters.items.entities).toEqual({
        customer: {
          ...customer,
          items: [
            ...customer.items.map((it) => {
              it.selected = false;

              return it;
            }),
          ],
        },
        plant: {
          ...plant,
          items: [
            ...plant.items.map((it) => {
              it.selected = false;

              return it;
            }),
          ],
        },
        length: {
          ...length,
          maxSelected: length.max,
          minSelected: length.min,
        },
      });
      expect(state.referenceTypes.items).toEqual(undefined);
    });

    test('should set dirty flag to false', () => {
      // eslint-disable-next-line max-lines
      const fakeState = {
        ...initialState,
        filters: {
          ...initialState.filters,
          dirty: true,
        },
      };

      const action = resetFilters();
      const state = searchReducer(fakeState, action);

      expect(state.filters.dirty).toEqual(false);
    });
  });

  describe('shareSearchResult', () => {
    test('should not manipulate state', () => {
      const action = shareSearchResult();
      const state = searchReducer(initialState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('autocomplete', () => {
    test('should set autocomplete loading', () => {
      const textSearch = new TextSearch('customer', 'Awesome Customer');
      const action = autocomplete({
        textSearch,
      });
      const state = searchReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        filters: { ...initialState.filters, autocompleteLoading: true },
      });
    });
  });

  describe('autocompleteSuccess', () => {
    test('should upsert possible filters', () => {
      const action = autocompleteSuccess({ item: filterItemIdVal });
      const state = searchReducer(initialState, action);

      expect(state.filters.items.entities.plant).toEqual(filterItemIdVal);
    });
  });

  describe('autocompleteFailure', () => {
    test('should not manipulate state', () => {
      const action = autocompleteFailure();
      const state = searchReducer(initialState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('selectReferenceTypes', () => {
    test('should add/replace selected node ids', () => {
      const action = selectReferenceTypes({ nodeIds: ['2', '3'] });
      const state = searchReducer(initialState, action);

      expect(state.referenceTypes.selectedNodeIds).toEqual(['2', '3']);
    });
  });

  describe('Reducer function', () => {
    test('should return searchReducer', () => {
      // prepare any action
      const action: Action = autocompleteFailure();
      expect(reducer(initialState, action)).toEqual(
        searchReducer(initialState, action)
      );
    });
  });
});
