/* eslint-disable max-lines */
import { Action } from '@ngrx/store';

import { StringOption } from '@schaeffler/inputs';

import { DEFAULT_RESULTS_THRESHOLD } from '@cdba/shared/constants/reference-type';
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
  FilterItem,
  FilterItemIdValue,
  FilterItemRange,
  FilterItemType,
  SearchResult,
  TextSearch,
} from './models';
import { initialState, reducer, searchReducer } from './search.reducer';

describe('Search Reducer', () => {
  const filterItemIdValueStub = new FilterItemIdValue(
    'plant',
    [{ id: '23', title: '23 | Best Plant' } as StringOption],
    [],
    false,
    false
  );
  const filterItemRangeStub = new FilterItemRange(
    'length',
    0,
    200,
    0,
    200,
    'cm',
    false,
    false
  );
  const filterItemRangeLimitStub = new FilterItemRange(
    'limit',
    undefined,
    undefined,
    1000,
    777,
    undefined,
    false,
    false
  );
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
      const items = [filterItemIdValueStub, filterItemRangeStub];

      const expected = {
        plant: filterItemIdValueStub,
        length: filterItemRangeStub,
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
      expect(state.referenceTypes.tooManyResultsThreshold).toEqual(
        initialState.referenceTypes.tooManyResultsThreshold
      );
    });
  });

  describe('searchSuccess', () => {
    test('should unset loading and set ref types', () => {
      const searchResult = new SearchResult(
        [filterItemIdValueStub, filterItemRangeStub],
        [REFERENCE_TYPE_MOCK],
        2
      );
      const expectedEntities = {
        plant: filterItemIdValueStub,
        length: filterItemRangeStub,
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
        [filterItemIdValueStub, filterItemRangeStub],
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

    test('should unset loading and set tooManyResults if too many results', () => {
      const searchResult = new SearchResult(
        [filterItemIdValueStub, filterItemRangeStub],
        [],
        501
      );
      const expectedEntities = {
        plant: filterItemIdValueStub,
        length: filterItemRangeStub,
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

    test('should unset loading and set update tooManyResults based on results and changed threshold', () => {
      const searchResult = new SearchResult(
        [filterItemIdValueStub, filterItemRangeStub, filterItemRangeLimitStub],
        [],
        123
      );
      const expectedEntities = {
        plant: filterItemIdValueStub,
        length: filterItemRangeStub,
        limit: filterItemRangeLimitStub,
      };

      const action = searchSuccess({ searchResult });

      const fakeState = {
        ...initialState,
        referenceTypes: {
          ...initialState.referenceTypes,
          loading: true,
          tooManyResultsThreshold: 1000,
        },
      };
      const state = searchReducer(fakeState, action);

      expect(state.referenceTypes.loading).toBeFalsy();
      expect(state.referenceTypes.tooManyResults).toBeFalsy();
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
        [filterItemIdValueStub, filterItemRangeStub],
        [REFERENCE_TYPE_MOCK],
        2
      );
      const expectedEntities = {
        plant: filterItemIdValueStub,
        length: filterItemRangeStub,
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
        [filterItemIdValueStub, filterItemRangeStub],
        undefined,
        2
      );
      const expectedEntities = {
        plant: filterItemIdValueStub,
        length: filterItemRangeStub,
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
      const filter = new FilterItemIdValue(
        'customer',
        [
          { id: 'audi', title: 'Audi' } as StringOption,
          { id: 'vw', title: 'VW' } as StringOption,
        ],
        [],
        true,
        false
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
                [{ id: 'audi', title: 'Audi' } as StringOption],
                [],
                true,
                false
              ),
            },
          },
        },
      };

      const action = updateFilter({ filter });
      const state = searchReducer(fakeState, action);

      expect(state.filters.items.entities.customer).toEqual(filter);
    });

    test('should update tooManyResultsThreshold if limit filter was changed', () => {
      const filter = { ...filterItemRangeLimitStub, maxSelected: 777 };

      const fakeState = {
        ...initialState,
        filters: {
          ...initialState.filters,
          referenceTypes: {
            tooManyResultsThreshold: DEFAULT_RESULTS_THRESHOLD,
          },
        },
      };

      const action = updateFilter({ filter });
      const state = searchReducer(fakeState, action);

      expect(state.referenceTypes.tooManyResultsThreshold).toEqual(
        filter.maxSelected
      );
    });

    test('should set dirty flag to true', () => {
      const filter = new FilterItemIdValue(
        'customer',
        [
          { id: 'audi', title: 'Audi' } as StringOption,
          { id: 'vw', title: 'VW' } as StringOption,
        ],
        [],
        true,
        false
      );
      const fakeState = {
        ...initialState,
      };

      const action = updateFilter({ filter });
      const state = searchReducer(fakeState, action);

      expect(state.filters.dirty).toBeTruthy();
    });
  });

  describe('resetFilters', () => {
    test('should reset filters', () => {
      const customer = new FilterItemIdValue(
        'customer',
        [{ id: 'audi', title: 'Audi' } as StringOption],
        [],
        true,
        false
      );

      const plant = new FilterItemIdValue(
        'plant',
        [],
        [{ id: '23', title: 'Awesome Plant' } as StringOption],
        false,
        false
      );

      const length = new FilterItemRange(
        'length',
        1,
        20,
        2,
        19,
        'min',
        false,
        false
      );

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
          items: [],
          selectedItems: [],
        },
        plant: {
          ...plant,
          items: [],
          selectedItems: [],
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
      const searchFor = 'Awesome Customer';
      const filter = new FilterItemIdValue('customer', [], [], true, false);
      const action = autocomplete({
        searchFor,
        filter,
      });
      const state = searchReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        filters: {
          ...initialState.filters,
          items: {
            ...initialState.filters.items,
            entities: {
              ...initialState.filters.items.entities,
              customer: {
                autocomplete: true,
                autocompleteLoading: true,
                disabled: false,
                items: [],
                name: 'customer',
                selectedItems: [],
                type: 'ID_VALUE',
              },
            },
            ids: ['customer'],
          },
        },
      });
    });
  });

  describe('autocompleteSuccess', () => {
    test('should upsert possible filters', () => {
      const preparedItem = {
        ...filterItemIdValueStub,
        autocompleteLoading: true,
      };

      const action = autocompleteSuccess({ item: preparedItem });
      const state = searchReducer(initialState, action);

      expect(state.filters.items.entities.plant).toEqual({
        name: 'plant',
        type: 'ID_VALUE',
        disabled: false,
        items: [{ id: '23', title: '23 | Best Plant' } as StringOption],
        selectedItems: [],
        autocomplete: false,
        autocompleteLoading: false,
      } as FilterItemIdValue);
    });
  });

  describe('autocompleteFailure', () => {
    test('should set autocompleteLoading to false on failed request', () => {
      const filter = {
        name: 'customer',
        type: FilterItemType.ID_VALUE,
      } as FilterItem;
      const action = autocompleteFailure({ item: filter });
      const state = searchReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        filters: {
          ...initialState.filters,
          items: {
            ...initialState.filters.items,
            entities: {
              ...initialState.filters.items.entities,
              customer: {
                autocompleteLoading: false,
                name: 'customer',
                type: 'ID_VALUE',
              },
            },
            ids: ['customer'],
          },
        },
      });
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
      const filter = {
        name: 'customer',
        type: FilterItemType.ID_VALUE,
      } as FilterItem;
      const action: Action = autocompleteFailure({ item: filter });
      expect(reducer(initialState, action)).toEqual(
        searchReducer(initialState, action)
      );
    });
  });
});
