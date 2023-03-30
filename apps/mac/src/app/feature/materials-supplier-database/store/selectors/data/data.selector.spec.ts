import { TestBed } from '@angular/core/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { DataResult, SAPMaterialsResponse } from '@mac/msd/models';
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

  it('should get the navigation', () => {
    expect(
      DataSelectors.getNavigation.projector({
        ...initialState,
        navigation: {
          ...initialState.navigation,
          materialClass: MaterialClass.ALUMINUM,
          navigationLevel: NavigationLevel.SUPPLIER,
        },
      })
    ).toEqual({
      materialClass: MaterialClass.ALUMINUM,
      navigationLevel: NavigationLevel.SUPPLIER,
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
      'should return the materialClass',
      marbles((m) => {
        store.setState({
          msd: {
            data: {
              ...initialState,
              navigation: {
                ...initialState.navigation,
                materialClass: MaterialClass.STEEL,
                navigationLevel: NavigationLevel.MATERIAL,
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

  describe('getMaterialClassOptions', () => {
    it('should get material class options for undefined classes', () => {
      expect(
        DataSelectors.getMaterialClassOptions.projector({
          ...initialState,
          materialClasses: undefined,
        })
      ).toEqual(undefined);
    });

    it('should get material class options for empty classes', () => {
      expect(
        DataSelectors.getMaterialClassOptions.projector(initialState)
      ).toEqual(undefined);
    });

    it('should get material class options with sap materials', () => {
      expect(
        DataSelectors.getMaterialClassOptions.projector({
          ...initialState,
          materialClasses: [MaterialClass.STEEL],
        })
      ).toEqual([MaterialClass.STEEL, MaterialClass.SAP_MATERIAL]);
    });
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

  it('should get initial agGridFilter', () => {
    expect(
      DataSelectors.getAgGridFilter.projector(
        {
          materialClass: MaterialClass.STEEL,
          navigationLevel: NavigationLevel.MATERIAL,
        },
        { ...initialState.filter }
      )
    ).toEqual({});
  });

  it('should get agGridFilter as undefined if unable to parse', () => {
    expect(
      DataSelectors.getAgGridFilter.projector(
        {
          materialClass: MaterialClass.STEEL,
          navigationLevel: NavigationLevel.MATERIAL,
        },
        {
          ...initialState.filter,
          agGridFilter: {
            ...initialState.filter.agGridFilter,
            [MaterialClass.STEEL]: {
              ...initialState.filter.agGridFilter[MaterialClass.STEEL],
              [NavigationLevel.MATERIAL]: 'something not parseable',
            },
          },
        }
      )
    ).toEqual(undefined);
  });
  it('should get agGridFilter', () => {
    expect(
      DataSelectors.getAgGridFilter.projector(
        {
          materialClass: MaterialClass.STEEL,
          navigationLevel: NavigationLevel.MATERIAL,
        },
        {
          ...initialState.filter,
          agGridFilter: {
            ...initialState.filter.agGridFilter,
            [MaterialClass.STEEL]: {
              ...initialState.filter.agGridFilter[MaterialClass.STEEL],
              [NavigationLevel.MATERIAL]: '{"someKey":"someValue"}',
            },
          },
        }
      )
    ).toEqual({
      someKey: 'someValue',
    });
  });

  it('should get query filter params', () => {
    const materialClass = MaterialClass.STEEL;
    const navigationLevel = NavigationLevel.MATERIAL;
    const agGridFilter = 'some filter';

    expect(
      DataSelectors.getShareQueryParams.projector(
        {
          ...initialState.navigation,
          materialClass,
          navigationLevel,
        },
        {
          agGridFilter: {
            ...initialState.filter.agGridFilter,
            [materialClass]: {
              ...initialState.filter.agGridFilter[materialClass],
              [navigationLevel]: agGridFilter,
            },
          },
        }
      )
    ).toEqual({
      materialClass,
      navigationLevel,
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

  it('should get sap material rows', () => {
    expect(DataSelectors.getSAPMaterialsRows.projector(initialState)).toEqual(
      undefined
    );
  });

  it('should get sap material rows and result', () => {
    expect(
      DataSelectors.getSAPResult.projector(
        {
          ...initialState,
          result: {
            [MaterialClass.SAP_MATERIAL]: {
              materials: [],
            },
          },
        },
        {
          lastRow: -1,
          totalRows: 300,
          subTotalRows: 100,
          startRow: 0,
        }
      )
    ).toEqual({
      data: [],
      lastRow: -1,
      totalRows: 300,
      subTotalRows: 100,
      startRow: 0,
    } as SAPMaterialsResponse);
  });

  it('should return undefined if sap material rows are undefined', () => {
    expect(DataSelectors.getSAPResult.projector(undefined, [])).toEqual(
      undefined
    );
  });
});
