import { StringOption } from '@schaeffler/inputs';

import { ReferenceType } from '@cdba/shared/models';

import { REFERENCE_TYPE_MOCK } from '../../../../../../src/testing/mocks';
import {
  FilterItemIdValue,
  FilterItemIdValueUpdate,
  FilterItemRange,
} from '../../reducers/search/models';
import { initialState } from '../../reducers/search/search.reducer';
import {
  getFilters,
  getInitialFiltersLoading,
  getIsDirty,
  getMaterialDesignationOfSelectedRefType,
  getNoResultsFound,
  getReferenceTypes,
  getReferenceTypesLoading,
  getResultCount,
  getSearchText,
  getSelectedFilterIdValueOptionsByFilterName,
  getSelectedFilters,
  getSelectedIdValueFilters,
  getSelectedRefTypeNodeIds,
  getTooManyResults,
} from './search.selector';

describe('Search Selector', () => {
  const fakeState = {
    search: {
      ...initialState,
      filters: {
        ...initialState.filters,
        dirty: true,
        searchText: {
          field: 'customer',
          value: 'aud',
        },
      },
      referenceTypes: {
        ...initialState.referenceTypes,
        items: [REFERENCE_TYPE_MOCK],
        selectedNodeIds: ['2', '3'],
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
          { id: 'vw', title: 'VW' } as StringOption,
          { id: 'vw2', title: 'VW 2' } as StringOption,
          { id: 'vw3', title: 'VW 3' } as StringOption,
        ],
        [],
        true,
        false
      );
      const plant = new FilterItemIdValue(
        'plant',
        [
          { id: '32', title: '32 | Nice Plant' } as StringOption,
          { id: '33', title: '33 | Nicer Plant' } as StringOption,
        ],
        [],
        false,
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
        [{ id: 'id', title: 'VW' } as StringOption],
        [],
        false,
        true
      );
      const plant = new FilterItemIdValue(
        'plant',
        [{ id: '32', title: '32 | Nice Plant' } as StringOption],
        [{ id: '32', title: '32 | Nice Plant' } as StringOption],
        false,
        false
      );
      const range = new FilterItemRange('length', 0, 200, 0, 200, 'kg');
      const items = [customer, plant, range];

      const expectedFilters = [
        {
          autocomplete: false,
          autocompleteLoading: false,
          disabled: false,
          items: [
            {
              id: '32',
              title: '32 | Nice Plant',
            } as StringOption,
          ],
          name: 'plant',
          selectedItems: [
            {
              id: '32',
              title: '32 | Nice Plant',
            } as StringOption,
          ],
          type: 'ID_VALUE',
        } as FilterItemIdValue,
        {
          disabled: false,
          max: 200,
          maxSelected: 200,
          min: 0,
          minSelected: 0,
          name: 'length',
          type: 'RANGE',
          unit: 'kg',
        } as FilterItemRange,
      ];

      expect(getSelectedFilters.projector(items)).toEqual(expectedFilters);
    });
  });

  describe('getSelectedIdValueFilters', () => {
    test('should return selected IdValue filters', () => {
      const plant = new FilterItemIdValue(
        'plant',
        [{ id: '32', title: '32 | Nice Plant' } as StringOption],
        [],
        false,
        false
      );
      const range = new FilterItemRange('length', 0, 200, 0, 200, 'kg');
      const items = [plant, range];

      expect(
        getSelectedIdValueFilters.projector(
          items as unknown as FilterItemIdValueUpdate[]
        )
      ).toEqual([
        new FilterItemIdValue(
          'plant',
          [{ id: '32', title: '32 | Nice Plant' } as StringOption],
          [],
          false,
          false
        ),
      ]);
    });
  });

  describe('getResultCount', () => {
    test('should return provided result count', () => {
      fakeState.search.referenceTypes.resultCount = 32;

      expect(getResultCount(fakeState)).toEqual(
        fakeState.search.referenceTypes.resultCount
      );
    });
  });

  describe('getSelectedFilterIdValueOptionsByFilterName', () => {
    test('should return filter by name', () => {
      const customer = new FilterItemIdValue(
        'customer',
        [{ id: 'vw', title: 'VW' } as StringOption],
        [{ id: 'vw', title: 'VW' } as StringOption],
        true,
        false
      );
      const plant = new FilterItemIdValue(
        'plant',
        [{ id: '32', title: '32 | Nice Plant' } as StringOption],
        [],
        false,
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
      ).toEqual([{ id: 'vw', title: 'VW' } as StringOption]);
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

  describe('getNoResultsFound', () => {
    test('should return true if result count 0 and items are not undefined', () => {
      const items: ReferenceType[] = [];
      const mockState = {
        ...fakeState,
        search: {
          ...fakeState.search,
          referenceTypes: {
            ...fakeState.search.referenceTypes,
            items,
            resultCount: 0,
          },
        },
      };

      expect(getNoResultsFound(mockState)).toBeTruthy();
    });

    test('should return false when reftype items are defined', () => {
      expect(getNoResultsFound(fakeState)).toBeFalsy();
    });
  });

  describe('getIsDirty', () => {
    test('should return true after updateFilter', () => {
      expect(getIsDirty(fakeState)).toBeTruthy();
    });
  });

  describe('getSelectedRefTypeNodeIds', () => {
    test('should return string array', () => {
      expect(getSelectedRefTypeNodeIds(fakeState)).toEqual(['2', '3']);
    });
  });

  describe('getMaterialDesignationOfSelectedRefType', () => {
    test('should return undefined, if no ref type is selected', () => {
      expect(
        getMaterialDesignationOfSelectedRefType.projector(
          fakeState.search.referenceTypes.items,
          undefined
        )
      ).toBeUndefined();
    });

    test('should return undefined, if multiple ref types are selected', () => {
      expect(
        getMaterialDesignationOfSelectedRefType.projector(
          fakeState.search.referenceTypes.items,
          ['1', '2']
        )
      ).toBeUndefined();
    });

    test('should return materialdesignation of selected reftype', () => {
      expect(
        getMaterialDesignationOfSelectedRefType.projector(
          fakeState.search.referenceTypes.items,
          ['0']
        )
      ).toEqual('F-446509.SLH');
    });
  });
});
