import { Action } from '@ngrx/store';

import { REFRENCE_TYPE_MOCK } from '../../../../../../src/testing/mocks';
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
  resetFilters,
  search,
  searchFailure,
  searchSuccess,
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

  describe('getInitialFilters', () => {
    test('should set loading', () => {
      const action = getInitialFilters();
      const state = searchReducer(initialState, action);

      expect(state.filters.loading).toBeTruthy();
    });
  });

  describe('getInitialFiltersSuccess', () => {
    test('should unset loading and set possible filters', () => {
      const items = [filterItemIdVal, filterItemRange];

      const expected = {
        plant: filterItemIdVal,
        length: filterItemRange,
      };
      const action = getInitialFiltersSuccess({ items });

      const fakeState = {
        ...initialState,
        filters: { ...initialState.filters, loading: true },
      };

      const state = searchReducer(fakeState, action);

      expect(state.filters.loading).toBeFalsy();
      expect(state.filters.items.entities).toEqual(expected);
    });
  });

  describe('getInitialFiltersFailure', () => {
    test('should unset loading', () => {
      const action = getInitialFiltersFailure();
      const fakeState = {
        ...initialState,
        filters: { ...initialState.filters, loading: true },
      };

      const state = searchReducer(fakeState, action);

      expect(state.filters.loading).toBeFalsy();
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
      const ref = REFRENCE_TYPE_MOCK;
      const searchResult = new SearchResult(
        [filterItemIdVal, filterItemRange],
        [ref],
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
      expect(state.referenceTypes.items).toEqual(searchResult.result);
      expect(state.filters.items.entities).toEqual(expectedEntities);
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
      expect(state.referenceTypes.items).toEqual(searchResult.result);
      expect(state.filters.items.entities).toEqual(expectedEntities);
    });
  });

  describe('searchFailure', () => {
    test('should unset loading', () => {
      const action = searchFailure();
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
      const ref = REFRENCE_TYPE_MOCK;
      const searchResult = new SearchResult(
        [filterItemIdVal, filterItemRange],
        [ref],
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
      expect(state.referenceTypes.items).toEqual(searchResult.result);
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
      expect(state.referenceTypes.items).toEqual(searchResult.result);
      expect(state.filters.items.entities).toEqual(expectedEntities);
    });
  });

  describe('applyTextSearchFailure', () => {
    test('should unset loading', () => {
      const action = applyTextSearchFailure();
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

  describe('Reducer function', () => {
    test('should return searchReducer', () => {
      // prepare any action
      const action: Action = autocompleteFailure();
      expect(reducer(initialState, action)).toEqual(
        searchReducer(initialState, action)
      );
    });
  });
  // tslint:disable-next-line: max-file-line-count
});
