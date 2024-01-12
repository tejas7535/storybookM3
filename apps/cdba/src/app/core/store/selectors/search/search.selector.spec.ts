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
  getChangedFilters,
  getChangedIdValueFilters,
  getFilterByName,
  getFilters,
  getFiltersWithoutLimit,
  getInitialFiltersLoading,
  getIsDirty,
  getMaterialDesignationOfSelectedRefType,
  getNoResultsFound,
  getReferenceTypes,
  getReferenceTypesLoading,
  getResultCount,
  getSearchText,
  getSelectedFilterIdValueOptionsByFilterName,
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

  let customer: FilterItemIdValue;
  let plant: FilterItemIdValue;
  let limit: FilterItemRange;

  beforeEach(() => {
    customer = new FilterItemIdValue(
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
    plant = new FilterItemIdValue(
      'plant',
      [
        { id: '32', title: '32 | Nice Plant' } as StringOption,
        { id: '33', title: '33 | Nicer Plant' } as StringOption,
      ],
      [],
      false,
      false
    );
    limit = new FilterItemRange(
      'limit',
      undefined,
      1000,
      undefined,
      500,
      '',
      false
    );
  });

  describe('getInitialFiltersLoading', () => {
    it('should return loading status', () => {
      expect(getInitialFiltersLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getFilters', () => {
    it('should return all filters', () => {
      const items = [customer, plant, limit];

      const entityState = {
        ids: ['customer', 'plant', 'limit'],
        entities: {
          customer,
          plant,
          limit,
        },
      };

      expect(getFilters.projector(entityState)).toEqual(items);
    });
  });

  describe('getFiltersWithoutLimit', () => {
    it('should return filters without the limit filter', () => {
      const weigth = new FilterItemRange('weigth', 0, 100, 10, 80, 'kg', false);

      const items = [customer, plant, weigth, limit];

      const expectedFilters = [
        {
          autocomplete: true,
          autocompleteLoading: false,
          disabled: false,
          items: [
            { id: 'vw', title: 'VW' } as StringOption,
            { id: 'vw2', title: 'VW 2' } as StringOption,
            { id: 'vw3', title: 'VW 3' } as StringOption,
          ],
          name: 'customer',
          selectedItems: [],
          type: 'ID_VALUE',
        } as FilterItemIdValue,
        {
          autocomplete: false,
          autocompleteLoading: false,
          disabled: false,
          items: [
            { id: '32', title: '32 | Nice Plant' } as StringOption,
            { id: '33', title: '33 | Nicer Plant' } as StringOption,
          ],
          name: 'plant',
          selectedItems: [],
          type: 'ID_VALUE',
        } as FilterItemIdValue,
        {
          name: 'weigth',
          min: 0,
          max: 100,
          minSelected: 10,
          maxSelected: 80,
          unit: 'kg',
          disabled: false,
          type: 'RANGE',
        } as FilterItemRange,
      ];

      expect(getFiltersWithoutLimit.projector(items)).toEqual(expectedFilters);
    });
  });

  describe('getChangedFilters', () => {
    let mockedCustomer: FilterItemIdValue;
    let mockedPlant: FilterItemIdValue;
    let mockedLength: FilterItemRange;
    let mockedLimit: FilterItemRange;

    beforeAll(() => {
      mockedCustomer = {
        ...customer,
        selectedItems: [{ id: 'id', title: 'VW' } as StringOption],
      } as FilterItemIdValue;

      mockedPlant = {
        ...plant,
        selectedItems: [
          {
            id: '32',
            title: '32 | Nice Plant',
          } as StringOption,
        ],
      } as FilterItemIdValue;

      mockedLength = new FilterItemRange('length', 0, 200, 0, 200, 'kg', false);

      mockedLimit = new FilterItemRange(
        'limit',
        undefined,
        1000,
        undefined,
        500,
        undefined,
        false
      );
    });
    it('should return selected filters when dimension is enabled', () => {
      const items = [mockedCustomer, mockedPlant, mockedLength];

      const expectedFilters = [
        {
          autocomplete: true,
          autocompleteLoading: false,
          disabled: false,
          items: [
            { id: 'vw', title: 'VW' } as StringOption,
            { id: 'vw2', title: 'VW 2' } as StringOption,
            { id: 'vw3', title: 'VW 3' } as StringOption,
          ],
          name: 'customer',
          selectedItems: [{ id: 'id', title: 'VW' } as StringOption],
          type: 'ID_VALUE',
        } as FilterItemIdValue,
        {
          autocomplete: false,
          autocompleteLoading: false,
          disabled: false,
          items: [
            { id: '32', title: '32 | Nice Plant' } as StringOption,
            { id: '33', title: '33 | Nicer Plant' } as StringOption,
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
          name: 'length',
          type: 'RANGE',
          min: 0,
          max: 200,
          minSelected: 0,
          maxSelected: 200,
          unit: 'kg',
          disabled: false,
        } as FilterItemRange,
      ];

      expect(getChangedFilters.projector(items)).toEqual(expectedFilters);
    });
    it('should return selected filters when dimension is disabled', () => {
      const items = [
        mockedCustomer,
        mockedPlant,
        { ...mockedLength, disabled: true },
      ];

      const expectedFilters = [
        {
          autocomplete: true,
          autocompleteLoading: false,
          disabled: false,
          items: [
            { id: 'vw', title: 'VW' } as StringOption,
            { id: 'vw2', title: 'VW 2' } as StringOption,
            { id: 'vw3', title: 'VW 3' } as StringOption,
          ],
          name: 'customer',
          selectedItems: [{ id: 'id', title: 'VW' } as StringOption],
          type: 'ID_VALUE',
        } as FilterItemIdValue,
        {
          autocomplete: false,
          autocompleteLoading: false,
          disabled: false,
          items: [
            { id: '32', title: '32 | Nice Plant' } as StringOption,
            { id: '33', title: '33 | Nicer Plant' } as StringOption,
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
      ];

      expect(getChangedFilters.projector(items)).toEqual(expectedFilters);
    });
    it('should return selected filters when limit is changed', () => {
      const items = [
        mockedCustomer,
        mockedPlant,
        { ...mockedLimit, maxSelected: 800 },
      ];

      const expectedFilters = [
        {
          autocomplete: true,
          autocompleteLoading: false,
          disabled: false,
          items: [
            { id: 'vw', title: 'VW' } as StringOption,
            { id: 'vw2', title: 'VW 2' } as StringOption,
            { id: 'vw3', title: 'VW 3' } as StringOption,
          ],
          name: 'customer',
          selectedItems: [{ id: 'id', title: 'VW' } as StringOption],
          type: 'ID_VALUE',
        } as FilterItemIdValue,
        {
          autocomplete: false,
          autocompleteLoading: false,
          disabled: false,
          items: [
            { id: '32', title: '32 | Nice Plant' } as StringOption,
            { id: '33', title: '33 | Nicer Plant' } as StringOption,
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
          name: 'limit',
          type: 'RANGE',
          min: undefined,
          max: 1000,
          minSelected: undefined,
          maxSelected: 800,
          unit: undefined,
          disabled: false,
        } as FilterItemRange,
      ];

      expect(getChangedFilters.projector(items)).toEqual(expectedFilters);
    });
    it('should return selected filters when limit is not changed', () => {
      const items = [mockedCustomer, mockedPlant, mockedLimit];

      const expectedFilters = [
        {
          autocomplete: true,
          autocompleteLoading: false,
          disabled: false,
          items: [
            { id: 'vw', title: 'VW' } as StringOption,
            { id: 'vw2', title: 'VW 2' } as StringOption,
            { id: 'vw3', title: 'VW 3' } as StringOption,
          ],
          name: 'customer',
          selectedItems: [{ id: 'id', title: 'VW' } as StringOption],
          type: 'ID_VALUE',
        } as FilterItemIdValue,
        {
          autocomplete: false,
          autocompleteLoading: false,
          disabled: false,
          items: [
            { id: '32', title: '32 | Nice Plant' } as StringOption,
            { id: '33', title: '33 | Nicer Plant' } as StringOption,
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
      ];

      expect(getChangedFilters.projector(items)).toEqual(expectedFilters);
    });
  });

  describe('getChangedIdValueFilters', () => {
    it('should return changed (selected) IdValue filters', () => {
      const range = new FilterItemRange('length', 0, 200, 0, 200, 'kg', false);
      const items = [plant, range];

      expect(
        getChangedIdValueFilters.projector(
          items as unknown as FilterItemIdValueUpdate[]
        )
      ).toEqual([
        new FilterItemIdValue(
          'plant',
          [
            { id: '32', title: '32 | Nice Plant' } as StringOption,
            {
              id: '33',
              title: '33 | Nicer Plant',
            } as StringOption,
          ],
          [],
          false,
          false
        ),
      ]);
    });
  });

  describe('getResultCount', () => {
    it('should return provided result count', () => {
      fakeState.search.referenceTypes.resultCount = 32;

      expect(getResultCount(fakeState)).toEqual(
        fakeState.search.referenceTypes.resultCount
      );
    });
  });

  describe('getFilterByName', () => {
    it('should return filter by name', () => {
      const filterName = 'limit';
      const expectedFilter = limit;

      const fakeFiltersState = [customer, plant, limit];

      expect(getFilterByName(filterName).projector(fakeFiltersState)).toEqual(
        expectedFilter
      );
    });
  });

  describe('getSelectedFilterIdValueOptionsByFilterName', () => {
    it('should return selected filter options by filter name', () => {
      const mockedCustomer = {
        ...customer,
        selectedItems: [{ id: 'vw', title: 'VW' } as StringOption],
      } as FilterItemIdValue;

      const items = {
        ids: ['mockedCustomer', 'plant'],
        entities: {
          mockedCustomer,
          plant,
        },
      };

      expect(
        getSelectedFilterIdValueOptionsByFilterName.projector(items.entities, {
          name: 'mockedCustomer',
        })
      ).toEqual([{ id: 'vw', title: 'VW' } as StringOption]);
    });
  });

  describe('getSearchText', () => {
    it('should return searchText', () => {
      expect(getSearchText(fakeState)).toEqual(
        fakeState.search.filters.searchText
      );
    });
  });

  describe('getReferenceTypes', () => {
    it('should return ref types', () => {
      expect(getReferenceTypes(fakeState)).toEqual(
        fakeState.search.referenceTypes.items
      );
    });
  });

  describe('getReferenceTypesLoading', () => {
    it('should return loading status', () => {
      expect(getReferenceTypesLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getTooManyResults', () => {
    it('should return info about too many results found', () => {
      expect(getTooManyResults(fakeState)).toBeFalsy();
    });
  });

  describe('getNoResultsFound', () => {
    it('should return true if result count 0 and items are not undefined', () => {
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

    it('should return false when reftype items are defined', () => {
      expect(getNoResultsFound(fakeState)).toBeFalsy();
    });
  });

  describe('getIsDirty', () => {
    it('should return true after updateFilter', () => {
      expect(getIsDirty(fakeState)).toBeTruthy();
    });
  });

  describe('getSelectedRefTypeNodeIds', () => {
    it('should return string array', () => {
      expect(getSelectedRefTypeNodeIds(fakeState)).toEqual(['2', '3']);
    });
  });

  describe('getMaterialDesignationOfSelectedRefType', () => {
    it('should return undefined, if no ref type is selected', () => {
      expect(
        getMaterialDesignationOfSelectedRefType.projector(
          fakeState.search.referenceTypes.items,
          undefined
        )
      ).toBeUndefined();
    });

    it('should return undefined, if multiple ref types are selected', () => {
      expect(
        getMaterialDesignationOfSelectedRefType.projector(
          fakeState.search.referenceTypes.items,
          ['1', '2']
        )
      ).toBeUndefined();
    });

    it('should return materialdesignation of selected reftype', () => {
      expect(
        getMaterialDesignationOfSelectedRefType.projector(
          fakeState.search.referenceTypes.items,
          ['0']
        )
      ).toEqual('F-446509.SLH');
    });
  });
});
