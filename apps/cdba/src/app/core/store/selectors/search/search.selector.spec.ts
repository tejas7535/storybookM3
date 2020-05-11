import {
  FilterItemIdValue,
  IdValue,
  ReferenceType,
} from '../../reducers/search/models';
import { initialState } from '../../reducers/search/search.reducer';
import {
  getInitialFiltersLoading,
  getPossibleFilters,
  getReferenceTypes,
  getReferenceTypesLoading,
  getSearchSuccessful,
  getSearchText,
  getSelectedFilters,
  getTooManyResults,
} from './search.selector';

describe('Search Selector', () => {
  const fakeState = {
    search: {
      ...initialState,
      filters: {
        ...initialState.filters,
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

  describe('getSelectedFilters', () => {
    test('should return selected filters', () => {
      const customer = new FilterItemIdValue('customer', [
        new IdValue('vw', 'VW'),
      ]);
      const plant = new FilterItemIdValue('plant', [
        new IdValue('32', 'Nice Plant'),
      ]);
      const selected = {
        ids: ['customer', 'plant'],
        entities: {
          customer,
          plant,
        },
      };
      expect(getSelectedFilters.projector(selected)).toEqual([customer, plant]);
    });
  });

  describe('getPossibleFilters', () => {
    test('should return possible filters', () => {
      const customer = new FilterItemIdValue('customer', [
        new IdValue('vw', 'VW'),
      ]);
      const plant = new FilterItemIdValue('plant', [
        new IdValue('32', 'Nice Plant'),
      ]);
      const selected = {
        ids: ['customer', 'plant'],
        entities: {
          customer,
          plant,
        },
      };
      expect(getPossibleFilters.projector(selected)).toEqual([customer, plant]);
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
});
