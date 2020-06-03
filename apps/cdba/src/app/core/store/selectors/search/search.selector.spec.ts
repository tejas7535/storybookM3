import {
  FilterItemIdValue,
  FilterItemIdValueUpdate,
  FilterItemRange,
  FilterItemRangeUpdate,
  IdValue,
  ReferenceType,
} from '../../reducers/search/models';
import { initialState } from '../../reducers/search/search.reducer';
import {
  getAutocompleteLoading,
  getFilters,
  getInitialFiltersLoading,
  getReferenceTypes,
  getReferenceTypesLoading,
  getSearchSuccessful,
  getSearchText,
  getSelectedFilterIdValueOptionsByFilterName,
  getSelectedFilters,
  getTooManyResults,
} from './search.selector';

describe('Search Selector', () => {
  const fakeState = {
    search: {
      ...initialState,
      filters: {
        ...initialState.filters,
        autocompleteLoading: true,
        searchText: {
          field: 'customer',
          value: 'aud',
        },
      },
      referenceTypes: {
        ...initialState.referenceTypes,
        items: [new ReferenceType()],
      },
    },
  };

  describe('getInitialFiltersLoading', () => {
    test('should return loading status', () => {
      expect(getInitialFiltersLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getFilters', () => {
    it('should return all filters', () => {
      const customer = new FilterItemIdValue(
        'customer',
        [
          new IdValue('vw', 'VW', false),
          new IdValue('vw2', 'VW 2', false),
          new IdValue('vw3', 'VW 3', true),
        ],
        true
      );
      const plant = new FilterItemIdValue(
        'plant',
        [
          new IdValue('32', 'Nice Plant', false),
          new IdValue('33', 'Nicer Plant', true),
        ],
        false
      );
      const items = [customer, plant];

      const entityState = {
        ids: ['customer', 'plant'],
        entities: {
          customer,
          plant,
        },
      };

      expect(getFilters.projector(entityState)).toEqual(items);
    });
  });

  describe('getSelectedFilters', () => {
    test('should return selected filters', () => {
      const customer = new FilterItemIdValue(
        'customer',
        [new IdValue('vw', 'VW', false)],
        true
      );
      const plant = new FilterItemIdValue(
        'plant',
        [new IdValue('32', 'Nice Plant', true)],
        false
      );
      const range = new FilterItemRange('length', 0, 200, 0, 200, 'kg');
      const items = [customer, plant, range];

      expect(getSelectedFilters.projector(items)).toEqual([
        new FilterItemIdValueUpdate('plant', ['32']),
        new FilterItemRangeUpdate('length', 0, 200),
      ]);
    });
  });

  describe('getSelectedFilterIdValueOptionsByFilterName', () => {
    test('should return filter by name', () => {
      const customer = new FilterItemIdValue(
        'customer',
        [new IdValue('vw', 'VW', true)],
        true
      );
      const plant = new FilterItemIdValue(
        'plant',
        [new IdValue('32', 'Nice Plant', false)],
        false
      );
      const items = {
        ids: ['customer', 'plant'],
        entities: {
          customer,
          plant,
        },
      };
      expect(
        getSelectedFilterIdValueOptionsByFilterName.projector(items.entities, {
          name: 'customer',
        })
      ).toEqual([new IdValue('vw', 'VW', true)]);
    });
  });

  describe('getSearchText', () => {
    test('should return searchText', () => {
      expect(getSearchText(fakeState)).toEqual(
        fakeState.search.filters.searchText
      );
    });
  });

  describe('getReferenceTypes', () => {
    test('should return ref types', () => {
      expect(getReferenceTypes(fakeState)).toEqual(
        fakeState.search.referenceTypes.items
      );
    });
  });

  describe('getReferenceTypesLoading', () => {
    test('should return loading status', () => {
      expect(getReferenceTypesLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getTooManyResults', () => {
    test('should return info about too many results found', () => {
      expect(getTooManyResults(fakeState)).toBeFalsy();
    });
  });

  describe('getSearchSuccessful', () => {
    test('should return false if search has not been triggered yet', () => {
      expect(getSearchSuccessful({ search: initialState })).toBeFalsy();
    });
  });

  describe('getAutocompleteLoading', () => {
    test('should return true if autocomplete is currently loading', () => {
      expect(getAutocompleteLoading(fakeState)).toBeTruthy();
    });
  });
});
