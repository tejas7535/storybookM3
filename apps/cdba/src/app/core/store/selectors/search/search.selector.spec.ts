import {
  FilterItemIdValue,
  FilterItemRange,
  IdValue,
  ReferenceType,
} from '../../reducers/search/models';
import { initialState } from '../../reducers/search/search.reducer';
import {
  getAllFilters,
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
      const possible = {
        ids: ['customer', 'plant'],
        entities: {
          customer,
          plant,
        },
      };
      expect(getPossibleFilters.projector(possible)).toEqual([customer, plant]);
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

  describe('getAllFilters', () => {
    test('should merge possible and selected filters', () => {
      const customer = new FilterItemIdValue('customer', [
        new IdValue('vw', 'VW'),
      ]);
      const plant = new FilterItemIdValue('plant', [
        new IdValue('32', 'Nice Plant'),
      ]);
      const width = new FilterItemRange(
        'width',
        0,
        100,
        undefined,
        undefined,
        'mm'
      );
      const length = new FilterItemRange('length', 0, 100);
      const possible = {
        ids: ['plant', 'customer', 'width', 'length'],
        entities: {
          plant,
          customer,
          width,
          length,
        },
      };
      const selected = {
        ids: ['plant', 'customer', 'width', 'length'],
        entities: {
          plant,
          customer: { ...customer, items: [new IdValue('vw', 'VW', true)] },
          width: { ...width, minSelected: 10 },
          length: { ...length, maxSelected: 90 },
        },
      };

      const state = {
        ...fakeState,
        search: {
          ...fakeState.search,
          filters: { ...fakeState.search.filters, possible, selected },
        },
      };

      const expected = [
        plant,
        { ...customer, items: [new IdValue('vw', 'VW', true)] },
        { ...width, minSelected: 10 },
        { ...length, maxSelected: 90 },
      ];

      expect(getAllFilters(state)).toEqual(expected);
    });
  });
});
