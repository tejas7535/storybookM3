import { initialState } from './../reducers/data.reducer';
import * as DataSelectors from './data.selector';
import { sortAlphabetically } from './data.selector';

describe('DataSelectors', () => {
  it('should sort alphabetically', () => {
    const strings = ['a', 'a', 'c', 'e', 'b', 'd'];
    const sorted = ['a', 'a', 'b', 'c', 'd', 'e'];

    const result = strings.sort(sortAlphabetically);

    expect(result).toEqual(sorted);
  });
  it('should get dataState', () => {
    expect(
      DataSelectors.getDataState.projector({ data: initialState })
    ).toEqual(initialState);
  });

  it('should get data filter', () => {
    expect(DataSelectors.getFilter.projector(initialState)).toEqual(
      initialState.filter
    );
  });

  it('should get data filters', () => {
    expect(DataSelectors.getFilters.projector(initialState)).toEqual({
      materialClass: undefined,
      productCategory: undefined,
    });
  });

  it('should get list fitlers', () => {
    expect(DataSelectors.getListFilters.projector(initialState.filter)).toEqual(
      initialState.filter.listFilters
    );
  });

  it('should get data loading', () => {
    expect(DataSelectors.getLoading.projector(initialState)).toEqual(undefined);
  });

  it('should get material class options', () => {
    expect(
      DataSelectors.getMaterialClassOptions.projector(initialState)
    ).toEqual(initialState.materialClassOptions);
  });

  it('should get product category options', () => {
    expect(
      DataSelectors.getProductCategoryOptions.projector(initialState)
    ).toEqual(initialState.productCategoryOptions);
  });

  it('should get result', () => {
    expect(DataSelectors.getResult.projector(initialState)).toEqual(
      initialState.result
    );
  });

  it('should get agGridFilter as undefined if not defined', () => {
    expect(
      DataSelectors.getAgGridFilter.projector({ ...initialState.filter })
    ).toEqual({});
  });

  it('should get agGridFilter as undefined if unable to parse', () => {
    expect(
      DataSelectors.getAgGridFilter.projector({
        ...initialState.filter,
        agGridFilter: 'some not parsable string',
      })
    ).toEqual(undefined);
  });
  it('should get agGridFilter', () => {
    expect(
      DataSelectors.getAgGridFilter.projector({
        ...initialState.filter,
        agGridFilter: '{"someKey":"someValue"}',
      })
    ).toEqual({
      someKey: 'someValue',
    });
  });

  it('should get query filter params', () => {
    const materialClass = { id: 0, name: 'gibts net' };
    const productCategory = { id: 0, name: 'gibts net' };
    const agGridFilter = 'some filter';

    expect(
      DataSelectors.getShareQueryParams.projector({
        ...initialState.filter,
        materialClass,
        productCategory,
        agGridFilter,
      })
    ).toEqual({
      filterForm: JSON.stringify({ materialClass, productCategory }),
      agGridFilter,
    });
  });

  it('should get unfiltered result if no filter is set', () => {
    const agGridFilter = JSON.stringify({});

    expect(
      DataSelectors.getFilteredResult.projector({
        ...initialState,
        filter: {
          ...initialState.filter,
          agGridFilter,
        },
        result: [],
        filteredResult: undefined,
      })
    ).toEqual([]);
  });
  it('should get filtered result', () => {
    const agGridFilter = JSON.stringify({ something: 'some value' });

    expect(
      DataSelectors.getFilteredResult.projector({
        ...initialState,
        filter: {
          ...initialState.filter,
          agGridFilter,
        },
        result: undefined,
        filteredResult: [],
      })
    ).toEqual([]);
  });

  it('should return undefined if result is not available', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    expect(DataSelectors.getFilterLists.projector(undefined)).toEqual(
      undefined
    );
  });
  it('should return an object with the filter lists', () => {
    const result = [
      {
        materialStandardMaterialName: 'etwas',
        materialStandardStandardDocument: 'irgendwas',
      },
      {
        materialStandardMaterialName: 'etwas',
        materialStandardStandardDocument: 'irgendwas',
      },
    ];

    const expected: {
      materialNames: string[];
      materialStandards: string[];
      materialNumbers: string[];
    } = {
      materialNames: ['etwas'],
      materialStandards: ['irgendwas'],
      materialNumbers: [],
    };

    expect(DataSelectors.getFilterLists.projector(result)).toEqual(expected);
  });
});
