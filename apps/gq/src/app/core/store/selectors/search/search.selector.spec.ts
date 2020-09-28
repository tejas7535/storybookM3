import { IdValue } from '../../models';
import { initialState } from '../../reducers/search/search.reducer';
import * as searchSelectors from './search.selectors';

describe('Search Selector', () => {
  const fakeState = {
    search: {
      ...initialState,
      filters: {
        ...initialState.filters,
        items: [...initialState.filters.items],
        autocompleteLoading: 'customer',
      },
    },
  };

  describe('getFilters', () => {
    test('should return all filters', () => {
      expect(searchSelectors.getFilters.projector(fakeState.search)).toEqual(
        fakeState.search.filters.items
      );
    });
  });

  describe('getSelectedFilter', () => {
    test('should return selectedFilter', () => {
      expect(
        searchSelectors.getSelectedFilter.projector(fakeState.search)
      ).toEqual(
        fakeState.search.filters.items.find(
          (elem) => elem.filter === 'customer'
        )
      );
    });
  });

  describe('getAutocompleteLoading', () => {
    test('should return true if autocomplete is currently loading', () => {
      expect(
        searchSelectors.getAutocompleteLoading.projector(fakeState.search)
      ).toEqual('customer');
    });
  });

  describe('getFilterQueryInputs', () => {
    test('should return query inputs', () => {
      expect(
        searchSelectors.getFilterQueryInputs.projector(fakeState.search)
      ).toEqual(fakeState.search.filters.queryInputs);
    });
  });

  describe('getOptionalFilters', () => {
    test('should return optional Filters', () => {
      expect(
        searchSelectors.getOptionalFilters.projector(
          fakeState.search,
          'country'
        )
      ).toEqual([]);
    });
  });

  describe('getMaterialNumberAndQuantity', () => {
    test('should return mandatory filters', () => {
      expect(
        searchSelectors.getMaterialNumberAndQuantity.projector(fakeState.search)
      ).toEqual(
        fakeState.search.filters.items.filter(
          (item) =>
            item.filter === 'materialNumber' || item.filter === 'quantity'
        )
      );
    });
  });

  describe('getIsInvalidTransaction', () => {
    test('should return false when QueryKey, Quantity and materialNumber are selected', () => {
      const selectedOption = new IdValue('test', 'test', true);
      const setOptionsfor = ['customer', 'quantity', 'materialNumber'];
      setOptionsfor.forEach((filter) => {
        fakeState.search.filters.items[
          fakeState.search.filters.items.findIndex((el) => el.filter === filter)
        ].options.push(selectedOption);
      });

      expect(
        searchSelectors.getIsInvalidTransaction.projector(fakeState.search)
      ).toBeFalsy();
    });
  });
});
