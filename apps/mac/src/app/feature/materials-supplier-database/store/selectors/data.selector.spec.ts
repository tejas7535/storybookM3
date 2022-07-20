import { StringOption } from '@schaeffler/inputs';

import {
  DataResult,
  ManufacturerSupplier,
  MaterialStandard,
} from '../../models';
import { initialState } from './../reducers/data.reducer';
import {
  getMaterialNameStringOptionsMerged,
  getMaterialStandardDocumentStringOptionsMerged,
} from '.';
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
    const result = DataSelectors.getResultCount.projector(initialState.result);

    expect(result).toEqual(0);
  });

  it('should get the materialDialog object', () => {
    const result = DataSelectors.getAddMaterialDialog.projector({
      ...initialState,
    });

    expect(result).toEqual({
      manufacturerSupplier: undefined,
      materialStandard: undefined,
      dialogOptions: undefined,
    });
  });

  it('should get the dialogOptions object', () => {
    const result = DataSelectors.getAddMaterialDialogOptions.projector({
      dialogOptions: {
        materialStandardsLoading: true,
      },
    });

    expect(result).toEqual({
      materialStandardsLoading: true,
    });
  });

  it('should return true if at least one part of the optionsLoading is undefined', () => {
    const dialogOptionsBase: {
      ratingsLoading: boolean;
      castingModesLoading: boolean;
      materialStandardsLoading: boolean;
      co2ClassificationsLoading: boolean;
      steelMakingProcessesLoading: boolean;
      manufacturerSuppliersLoading: boolean;
    } = {
      ratingsLoading: undefined,
      castingModesLoading: false,
      materialStandardsLoading: false,
      co2ClassificationsLoading: false,
      steelMakingProcessesLoading: false,
      manufacturerSuppliersLoading: false,
    };

    const results = [];

    results.push(
      DataSelectors.getAddMaterialDialogOptionsLoadingError.projector({
        ...dialogOptionsBase,
      }),

      DataSelectors.getAddMaterialDialogOptionsLoadingError.projector({
        ...dialogOptionsBase,
        castingModesLoading: undefined,
      }),

      DataSelectors.getAddMaterialDialogOptionsLoadingError.projector({
        ...dialogOptionsBase,
        castingModesLoading: undefined,
        materialStandardsLoading: undefined,
      }),

      DataSelectors.getAddMaterialDialogOptionsLoadingError.projector({
        ...dialogOptionsBase,
        castingModesLoading: undefined,
        materialStandardsLoading: undefined,
        co2ClassificationsLoading: undefined,
      }),

      DataSelectors.getAddMaterialDialogOptionsLoadingError.projector({
        ...dialogOptionsBase,
        castingModesLoading: undefined,
        materialStandardsLoading: undefined,
        co2ClassificationsLoading: undefined,
        steelMakingProcessesLoading: undefined,
      }),

      DataSelectors.getAddMaterialDialogOptionsLoadingError.projector({
        ...dialogOptionsBase,
        castingModesLoading: undefined,
        materialStandardsLoading: undefined,
        co2ClassificationsLoading: undefined,
        steelMakingProcessesLoading: undefined,
        manufacturerSuppliersLoading: undefined,
      })
    );

    expect(results.length).toEqual(6);

    for (const result of results) {
      expect(result).toBe(true);
    }
  });

  it('should return false, if no part is loading', () => {
    const dialogOptionsBase = {
      ratingsLoading: false,
      castingModesLoading: false,
      materialStandardsLoading: false,
      co2ClassificationsLoading: false,
      steelMakingProcessesLoading: false,
      manufacturerSuppliersLoading: false,
    };

    const result = DataSelectors.getAddMaterialDialogOptionsLoading.projector({
      ...dialogOptionsBase,
    });

    expect(result).toBe(false);
  });

  it('should return true if at least one part of the options is loading', () => {
    const dialogOptionsBase = {
      ratingsLoading: true,
      castingModesLoading: false,
      materialStandardsLoading: false,
      co2ClassificationsLoading: false,
      steelMakingProcessesLoading: false,
      manufacturerSuppliersLoading: false,
    };

    const results = [];

    results.push(
      DataSelectors.getAddMaterialDialogOptionsLoading.projector({
        ...dialogOptionsBase,
      }),

      DataSelectors.getAddMaterialDialogOptionsLoading.projector({
        ...dialogOptionsBase,
        castingModesLoading: true,
      }),

      DataSelectors.getAddMaterialDialogOptionsLoading.projector({
        ...dialogOptionsBase,
        castingModesLoading: true,
        materialStandardsLoading: true,
      }),

      DataSelectors.getAddMaterialDialogOptionsLoading.projector({
        ...dialogOptionsBase,
        castingModesLoading: true,
        materialStandardsLoading: true,
        co2ClassificationsLoading: true,
      }),

      DataSelectors.getAddMaterialDialogOptionsLoading.projector({
        ...dialogOptionsBase,
        castingModesLoading: true,
        materialStandardsLoading: true,
        co2ClassificationsLoading: true,
        steelMakingProcessesLoading: true,
      }),

      DataSelectors.getAddMaterialDialogOptionsLoading.projector({
        ...dialogOptionsBase,
        castingModesLoading: true,
        materialStandardsLoading: true,
        co2ClassificationsLoading: true,
        steelMakingProcessesLoading: true,
        manufacturerSuppliersLoading: true,
      })
    );

    expect(results.length).toEqual(6);

    for (const result of results) {
      expect(result).toBe(true);
    }
  });

  it('should return false, if no part is undefined', () => {
    const dialogOptionsBase = {
      ratingsLoading: false,
      castingModesLoading: false,
      materialStandardsLoading: false,
      co2ClassificationsLoading: false,
      steelMakingProcessesLoading: false,
      manufacturerSuppliersLoading: false,
    };

    const result =
      DataSelectors.getAddMaterialDialogOptionsLoadingError.projector({
        ...dialogOptionsBase,
      });

    expect(result).toBe(false);
  });

  it('should return the castingModes', () => {
    expect(
      DataSelectors.getAddMaterialDialogCastingModes.projector({
        castingModes: ['1', '2'],
      })
    ).toEqual(['1', '2']);
  });

  it('should return the co2Classifications', () => {
    expect(
      DataSelectors.getAddMaterialDialogCo2Classifications.projector({
        co2Classifications: ['1', '2'],
      })
    ).toEqual(['1', '2']);
  });

  it('should return the manufaturerSuppliers', () => {
    const manufacturerSuppliers: ManufacturerSupplier[] = [
      {
        id: 1,
        name: '1',
        plant: '1',
      },
      {
        id: 2,
        name: '2',
        plant: '2',
      },
    ];
    expect(
      DataSelectors.getAddMaterialDialogSuppliers.projector({
        manufacturerSuppliers,
      })
    ).toEqual(manufacturerSuppliers);
  });

  it('should return the materialStandards', () => {
    const materialStandards: MaterialStandard[] = [
      {
        id: 1,
        materialName: '1',
        standardDocument: '1',
        materialNumber: '1',
      },
      {
        id: 2,
        materialName: '2',
        standardDocument: '2',
        materialNumber: '2',
      },
    ];
    expect(
      DataSelectors.getAddMaterialDialogMaterialStandards.projector({
        materialStandards,
      })
    ).toEqual(materialStandards);
  });

  it('should return the ratings', () => {
    expect(
      DataSelectors.getAddMaterialDialogRatings.projector({
        ratings: ['1', '2'],
      })
    ).toEqual(['1', '2']);
  });

  it('should return the steelMakingProcesses', () => {
    expect(
      DataSelectors.getAddMaterialDialogSteelMakingProcesses.projector({
        steelMakingProcesses: ['1', '2'],
      })
    ).toEqual(['1', '2']);
  });

  it('should return the suppliers as StringOptions', () => {
    const mockSuppliers: ManufacturerSupplier[] = [
      {
        id: 1,
        name: 'supplier1',
        plant: 'plant1',
      },
      {
        id: 2,
        name: 'supplier2',
        plant: 'plant2',
      },
    ];

    const expected: StringOption[] = [
      {
        id: 1,
        title: 'supplier1',
        data: {
          plant: 'plant1',
        },
      },
      {
        id: 2,
        title: 'supplier2',
        data: {
          plant: 'plant2',
        },
      },
    ];

    const result =
      DataSelectors.getSupplierStringOptions.projector(mockSuppliers);

    expect(result).toEqual(expected);
  });

  it('should return the supplier plants as StringOptions', () => {
    const mockSuppliers: ManufacturerSupplier[] = [
      {
        id: 1,
        name: 'supplier1',
        plant: 'plant1',
      },
      {
        id: 2,
        name: 'supplier2',
        plant: 'plant2',
      },
    ];

    const expected: StringOption[] = [
      {
        id: 'plant1',
        title: 'plant1',
        data: {
          supplierId: 1,
          supplierName: 'supplier1',
        },
      },
      {
        id: 'plant2',
        title: 'plant2',
        data: {
          supplierId: 2,
          supplierName: 'supplier2',
        },
      },
    ];

    const result =
      DataSelectors.getSupplierPlantStringOptions.projector(mockSuppliers);

    expect(result).toEqual(expected);
  });

  it('should return the material names as StringOptions', () => {
    const mockMaterialStandards: MaterialStandard[] = [
      {
        id: 1,
        materialName: 'material1',
        standardDocument: 'S 1',
        materialNumber: '1.1234',
      },
      {
        id: 2,
        materialName: 'material2',
        standardDocument: 'S 2',
        materialNumber: '1.1234',
      },
    ];

    const expected: StringOption[] = [
      {
        id: 1,
        title: 'material1',
        data: {
          standardDocument: 'S 1',
        },
      },
      {
        id: 2,
        title: 'material2',
        data: {
          standardDocument: 'S 2',
        },
      },
    ];

    const result = DataSelectors.getMaterialNameStringOptions.projector(
      mockMaterialStandards
    );

    expect(result).toEqual(expected);
  });

  it('should return materialNames with merged standardDocumentMappings', () => {
    const materialNameOptions: StringOption[] = [
      {
        id: 1,
        title: '1',
        data: {
          standardDocument: 'std1',
        },
      },
      {
        id: 2,
        title: '1',
        data: {
          standardDocument: 'std2',
        },
      },
      {
        id: 3,
        title: '3',
        data: {
          standardDocument: 'std3',
        },
      },
    ];

    const expected: StringOption[] = [
      {
        id: 1,
        title: '1',
        data: {
          standardDocuments: [
            {
              id: 1,
              standardDocument: 'std1',
            },
            {
              id: 2,
              standardDocument: 'std2',
            },
          ],
        },
      },
      {
        id: 2,
        title: '1',
        data: {
          standardDocuments: [
            {
              id: 1,
              standardDocument: 'std1',
            },
            {
              id: 2,
              standardDocument: 'std2',
            },
          ],
        },
      },
      {
        id: 3,
        title: '3',
        data: {
          standardDocuments: [
            {
              id: 3,
              standardDocument: 'std3',
            },
          ],
        },
      },
    ];

    expect(
      getMaterialNameStringOptionsMerged.projector(materialNameOptions)
    ).toEqual(expected);
  });

  it('should return the material standard documents as StringOptions', () => {
    const mockMaterialStandards: MaterialStandard[] = [
      {
        id: 1,
        materialName: 'material1',
        standardDocument: 'S 1',
        materialNumber: '1.1234',
      },
      {
        id: 2,
        materialName: 'material2',
        standardDocument: 'S 2',
        materialNumber: '1.1234',
      },
    ];

    const expected: StringOption[] = [
      {
        id: 1,
        title: 'S 1',
        data: {
          materialName: 'material1',
        },
      },
      {
        id: 2,
        title: 'S 2',
        data: {
          materialName: 'material2',
        },
      },
    ];

    const result =
      DataSelectors.getMaterialStandardDocumentStringOptions.projector(
        mockMaterialStandards
      );

    expect(result).toEqual(expected);
  });

  it('should return standardDocuments with merged materialNameMappings', () => {
    const standardDocumentOptions: StringOption[] = [
      {
        id: 1,
        title: '1',
        data: {
          materialName: 'material1',
        },
      },
      {
        id: 2,
        title: '1',
        data: {
          materialName: 'material2',
        },
      },
      {
        id: 3,
        title: '3',
        data: {
          materialName: 'material3',
        },
      },
    ];

    const expected: StringOption[] = [
      {
        id: 1,
        title: '1',
        data: {
          materialNames: [
            {
              id: 1,
              materialName: 'material1',
            },
            {
              id: 2,
              materialName: 'material2',
            },
          ],
        },
      },
      {
        id: 2,
        title: '1',
        data: {
          materialNames: [
            {
              id: 1,
              materialName: 'material1',
            },
            {
              id: 2,
              materialName: 'material2',
            },
          ],
        },
      },
      {
        id: 3,
        title: '3',
        data: {
          materialNames: [
            {
              id: 3,
              materialName: 'material3',
            },
          ],
        },
      },
    ];

    expect(
      getMaterialStandardDocumentStringOptionsMerged.projector(
        standardDocumentOptions
      )
    ).toEqual(expected);
  });

  it('should return a string list as StringOptions', () => {
    const mockRatings: string[] = ['good', 'bad'];

    const expected: StringOption[] = [
      {
        id: 'bad',
        title: 'bad',
      },
      {
        id: 'good',
        title: 'good',
      },
    ];

    const result = DataSelectors.getStringOptions(
      DataSelectors.getAddMaterialDialogRatings
    ).projector(mockRatings);

    expect(result).toEqual(expected);
  });

  it('should return a string list as StringOptions with extra option', () => {
    const mockRatings: string[] = ['good', 'bad'];
    const mockExtraOptions: StringOption[] = [
      {
        id: undefined,
        title: 'none',
      },
    ];

    const expected: StringOption[] = [
      {
        id: 'bad',
        title: 'bad',
      },
      {
        id: 'good',
        title: 'good',
      },
      {
        id: undefined,
        title: 'none',
      },
    ];

    const result = DataSelectors.getStringOptions(
      DataSelectors.getAddMaterialDialogRatings,
      mockExtraOptions
    ).projector(mockRatings);

    expect(result).toEqual(expected);
  });

  it('should return createMaterialLoading', () => {
    expect(
      DataSelectors.getCreateMaterialLoading.projector({
        createMaterial: {
          createMaterialLoading: true,
        },
      })
    ).toEqual(true);
  });

  it('should return createMaterialSuccess', () => {
    expect(
      DataSelectors.getCreateMaterialSuccess.projector({
        createMaterial: {
          createMaterialSuccess: true,
        },
      })
    ).toEqual(true);
  });

  it('should remove duplicate string options and sort', () => {
    const mockOptions: StringOption[] = [
      {
        id: 1,
        title: 'c1',
      },
      {
        id: 2,
        title: 'b2',
      },
      {
        id: 3,
        title: 'a3',
      },
      {
        id: 4,
        title: 'c1',
      },
    ];

    const expected: StringOption[] = [
      {
        id: 3,
        title: 'a3',
      },
      {
        id: 2,
        title: 'b2',
      },
      {
        id: 1,
        title: 'c1',
      },
    ];

    const result = DataSelectors.getUniqueStringOptions(
      DataSelectors.getMaterialStandardDocumentStringOptions
    ).projector(mockOptions);

    expect(result).toEqual(expected);
    expect(result[0]).toEqual({ id: 3, title: 'a3' });
  });

  describe('stringOptionsSortFn', () => {
    it('should return 1', () => {
      const mockOptionA: StringOption = {
        id: 1,
        title: 'Bca',
      };
      const mockOptionB: StringOption = {
        id: 2,
        title: 'abc',
      };

      const result = DataSelectors.stringOptionsSortFn(
        mockOptionA,
        mockOptionB
      );

      expect(result).toEqual(1);
    });
    it('should return -1', () => {
      const mockOptionA: StringOption = {
        id: 1,
        title: 'abc',
      };
      const mockOptionB: StringOption = {
        id: 2,
        title: 'Bca',
      };

      const result = DataSelectors.stringOptionsSortFn(
        mockOptionA,
        mockOptionB
      );

      expect(result).toEqual(-1);
    });
    it('should return 0', () => {
      const mockOptionA: StringOption = {
        id: 1,
        title: 'ABC',
      };
      const mockOptionB: StringOption = {
        id: 2,
        title: 'abc',
      };

      const result = DataSelectors.stringOptionsSortFn(
        mockOptionA,
        mockOptionB
      );

      expect(result).toEqual(0);
    });
    it('should return 0 if one title is undefined', () => {
      const mockOptionA: StringOption = {
        id: 1,
        title: undefined,
      };
      const mockOptionB: StringOption = {
        id: 2,
        title: 'abc',
      };

      const result = DataSelectors.stringOptionsSortFn(
        mockOptionA,
        mockOptionB
      );
      const result2 = DataSelectors.stringOptionsSortFn(
        mockOptionB,
        mockOptionA
      );

      expect(result).toEqual(0);
      expect(result2).toEqual(0);
    });
  });
});
