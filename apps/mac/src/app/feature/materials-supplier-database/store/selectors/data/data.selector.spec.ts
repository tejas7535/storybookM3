import { TestBed } from '@angular/core/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { MaterialClass } from '@mac/msd/constants';
import { DataResult } from '@mac/msd/models';
import { initialState } from '@mac/msd/store/reducers/data/data.reducer';

import * as DataSelectors from './data.selector';

describe('DataSelectors', () => {
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

  describe('getMaterialClass', () => {
    let store: MockStore;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideMockStore()],
      });

      store = TestBed.inject(MockStore);
    });

    it(
      'should return the error state',
      marbles((m) => {
        store.setState({
          msd: {
            data: {
              ...initialState,
              filter: {
                ...initialState.filter,
                materialClass: { id: 'st', title: 'Steel' },
              },
            },
          },
        });

        const expected = m.cold('a', { a: MaterialClass.STEEL });
        const result = store.select(DataSelectors.getMaterialClass);

        m.expect(result).toBeObservable(expected);
      })
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

  it.each([
    [MaterialClass.ALUMINUM, []],
    [MaterialClass.STEEL, []],
    [MaterialClass.POLYMER, []],
  ])('should get result', (materialClass, expected) => {
    expect(
      DataSelectors.getResult.projector(
        {
          ...initialState,
          materials: {
            steelMaterials: [],
            aluminumMaterials: [],
            polymerMaterials: [],
          },
        },
        materialClass
      )
    ).toEqual(expected);
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

  it('should return ag grid columns', () => {
    const result = DataSelectors.getAgGridColumns.projector({
      ...initialState,
      agGridColumns: 'columns',
    });

    expect(result).toEqual('columns');
  });

  it('should get result count', () => {
    const result = DataSelectors.getResultCount.projector([
      {} as DataResult,
      {} as DataResult,
      {} as DataResult,
    ]);

    expect(result).toEqual(3);
  });

  it('should get 0 if result is not defined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const result = DataSelectors.getResultCount.projector(undefined);

    expect(result).toEqual(0);
  });
});
