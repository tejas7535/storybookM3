import { StringOption } from '@schaeffler/inputs';

import { ManufacturerSupplier, MaterialStandard } from '@mac/msd/models';
import { initialState } from '@mac/msd/store/reducers/dialog/dialog.reducer';

import * as DialogSelectors from './dialog.selector';

describe('DialogSelectors', () => {
  it('should sort alphabetically', () => {
    const strings = ['a', 'a', 'c', 'e', 'b', 'd'];
    const sorted = ['a', 'a', 'b', 'c', 'd', 'e'];

    const result = strings.sort(DialogSelectors.sortAlphabetically);

    expect(result).toEqual(sorted);
  });
  it('should get dialogState', () => {
    expect(
      DialogSelectors.getDialogState.projector({ dialog: initialState })
    ).toEqual(initialState);
  });

  it('should get the dialogOptions object', () => {
    const result = DialogSelectors.getAddMaterialDialogOptions.projector({
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
      DialogSelectors.getAddMaterialDialogOptionsLoadingError.projector({
        ...dialogOptionsBase,
      }),

      DialogSelectors.getAddMaterialDialogOptionsLoadingError.projector({
        ...dialogOptionsBase,
        castingModesLoading: undefined,
      }),

      DialogSelectors.getAddMaterialDialogOptionsLoadingError.projector({
        ...dialogOptionsBase,
        castingModesLoading: undefined,
        materialStandardsLoading: undefined,
      }),

      DialogSelectors.getAddMaterialDialogOptionsLoadingError.projector({
        ...dialogOptionsBase,
        castingModesLoading: undefined,
        materialStandardsLoading: undefined,
        co2ClassificationsLoading: undefined,
      }),

      DialogSelectors.getAddMaterialDialogOptionsLoadingError.projector({
        ...dialogOptionsBase,
        castingModesLoading: undefined,
        materialStandardsLoading: undefined,
        co2ClassificationsLoading: undefined,
        steelMakingProcessesLoading: undefined,
      }),

      DialogSelectors.getAddMaterialDialogOptionsLoadingError.projector({
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

    const result = DialogSelectors.getAddMaterialDialogOptionsLoading.projector(
      {
        ...dialogOptionsBase,
      }
    );

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
      DialogSelectors.getAddMaterialDialogOptionsLoading.projector({
        ...dialogOptionsBase,
      }),

      DialogSelectors.getAddMaterialDialogOptionsLoading.projector({
        ...dialogOptionsBase,
        castingModesLoading: true,
      }),

      DialogSelectors.getAddMaterialDialogOptionsLoading.projector({
        ...dialogOptionsBase,
        castingModesLoading: true,
        materialStandardsLoading: true,
      }),

      DialogSelectors.getAddMaterialDialogOptionsLoading.projector({
        ...dialogOptionsBase,
        castingModesLoading: true,
        materialStandardsLoading: true,
        co2ClassificationsLoading: true,
      }),

      DialogSelectors.getAddMaterialDialogOptionsLoading.projector({
        ...dialogOptionsBase,
        castingModesLoading: true,
        materialStandardsLoading: true,
        co2ClassificationsLoading: true,
        steelMakingProcessesLoading: true,
      }),

      DialogSelectors.getAddMaterialDialogOptionsLoading.projector({
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
      DialogSelectors.getAddMaterialDialogOptionsLoadingError.projector({
        ...dialogOptionsBase,
      });

    expect(result).toBe(false);
  });

  it('should return the castingModes', () => {
    expect(
      DialogSelectors.getAddMaterialDialogCastingModes.projector({
        castingModes: ['1', '2'],
      })
    ).toEqual(['1', '2']);
  });

  it('should return the co2Classifications', () => {
    expect(
      DialogSelectors.getAddMaterialDialogCo2Classifications.projector({
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
      DialogSelectors.getAddMaterialDialogSuppliers.projector({
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
      DialogSelectors.getAddMaterialDialogMaterialStandards.projector({
        materialStandards,
      })
    ).toEqual(materialStandards);
  });

  it('should return the ratings', () => {
    expect(
      DialogSelectors.getAddMaterialDialogRatings.projector({
        ratings: ['1', '2'],
      })
    ).toEqual(['1', '2']);
  });

  it('should return the steelMakingProcesses', () => {
    expect(
      DialogSelectors.getAddMaterialDialogSteelMakingProcesses.projector({
        steelMakingProcesses: ['1', '2'],
      })
    ).toEqual(['1', '2']);
  });

  it('should return the castingDiameters', () => {
    expect(
      DialogSelectors.getAddMaterialDialogCastingDiameters.projector({
        castingDiameters: ['200x200'],
      })
    ).toEqual(['200x200']);
  });

  it('should return the customCastingDiameters', () => {
    expect(
      DialogSelectors.getAddMaterialDialogCustomCastingDiameters.projector({
        customCastingDiameters: ['200x200'],
      })
    ).toEqual(['200x200']);
  });

  it('should return the casting diameter stringOptions', () => {
    const mockState = {
      msd: {
        dialog: {
          dialogOptions: {
            customCastingDiameters: ['custom'],
            castingDiameters: ['notCustom'],
          },
        },
      },
    };

    expect(
      DialogSelectors.getAddMaterialDialogCastingDiameterStringOptions(
        mockState
      )
    ).toEqual([
      {
        id: 'custom',
        title: 'custom',
      },
      {
        id: 'notCustom',
        title: 'notCustom',
      },
    ]);
  });

  it('should return the casting diameter stringOptions with empty lists', () => {
    const mockState = {
      msd: {
        dialog: {
          dialogOptions: {},
        },
      },
    };

    expect(
      DialogSelectors.getAddMaterialDialogCastingDiameterStringOptions(
        mockState
      )
    ).toEqual([]);
  });

  it('should return castingDiametersLoading', () => {
    expect(
      DialogSelectors.getAddMaterialDialogCastingDiametersLoading.projector({
        castingDiametersLoading: true,
      })
    ).toBe(true);
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
      DialogSelectors.getSupplierStringOptions.projector(mockSuppliers);

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
      DialogSelectors.getSupplierPlantStringOptions.projector(mockSuppliers);

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

    const result = DialogSelectors.getMaterialNameStringOptions.projector(
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
      DialogSelectors.getMaterialNameStringOptionsExtended.projector(
        materialNameOptions
      )
    ).toEqual(expected);
  });

  it('should return custom materialNames first', () => {
    const materialNameOptions: StringOption[] = [
      {
        id: 3,
        title: '3',
      },
    ];
    const customMaterialStandardNames: string[] = ['first'];

    const expected: StringOption[] = [
      {
        id: undefined,
        title: 'first',
      },
      {
        id: 3,
        title: '3',
      },
    ];

    expect(
      DialogSelectors.getMaterialNameStringOptionsMerged.projector(
        materialNameOptions,
        customMaterialStandardNames
      )
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
      DialogSelectors.getMaterialStandardDocumentStringOptions.projector(
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
      DialogSelectors.getMaterialStandardDocumentStringOptionsExtended.projector(
        standardDocumentOptions
      )
    ).toEqual(expected);
  });

  it('should return standardDocuments with custom standard documents', () => {
    const standardDocumentOptions: StringOption[] = [
      {
        id: 1,
        title: '1',
      },
    ];
    const customs: string[] = ['first'];
    const expected: StringOption[] = [
      {
        id: undefined,
        title: 'first',
      },
      {
        id: 1,
        title: '1',
      },
    ];

    expect(
      DialogSelectors.getMaterialStandardDocumentStringOptionsMerged.projector(
        standardDocumentOptions,
        customs
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

    const result = DialogSelectors.getStringOptions(
      DialogSelectors.getAddMaterialDialogRatings
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

    const result = DialogSelectors.getStringOptions(
      DialogSelectors.getAddMaterialDialogRatings,
      mockExtraOptions
    ).projector(mockRatings);

    expect(result).toEqual(expected);
  });

  it('should return createMaterialLoading', () => {
    expect(
      DialogSelectors.getCreateMaterialLoading.projector({
        createMaterial: {
          createMaterialLoading: true,
        },
      })
    ).toEqual(true);
  });

  it('should return createMaterialRecord', () => {
    expect(
      DialogSelectors.getCreateMaterialRecord.projector({
        createMaterial: {
          createMaterialRecord: {},
        },
      })
    ).toEqual({});
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

    const result = DialogSelectors.getUniqueStringOptions(
      DialogSelectors.getMaterialStandardDocumentStringOptions
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

      const result = DialogSelectors.stringOptionsSortFn(
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

      const result = DialogSelectors.stringOptionsSortFn(
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

      const result = DialogSelectors.stringOptionsSortFn(
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

      const result = DialogSelectors.stringOptionsSortFn(
        mockOptionA,
        mockOptionB
      );
      const result2 = DialogSelectors.stringOptionsSortFn(
        mockOptionB,
        mockOptionA
      );

      expect(result).toEqual(0);
      expect(result2).toEqual(0);
    });
  });
});
