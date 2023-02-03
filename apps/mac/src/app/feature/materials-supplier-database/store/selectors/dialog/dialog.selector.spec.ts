import { TestBed } from '@angular/core/testing';

import { TranslocoModule } from '@ngneat/transloco';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { StringOption } from '@schaeffler/inputs';

import {
  DataResult,
  ManufacturerSupplierV2,
  MaterialFormValue,
  MaterialStandardV2,
} from '@mac/msd/models';
import { initialState } from '@mac/msd/store/reducers/dialog/dialog.reducer';

import * as DialogSelectors from './dialog.selector';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string.split('.').pop()),
}));

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
    const result = DialogSelectors.getMaterialDialogOptions.projector({
      dialogOptions: {
        materialStandardsLoading: true,
      },
    });

    expect(result).toEqual({
      materialStandardsLoading: true,
    });
  });

  it.each([
    [{}, false],
    [
      {
        ratingsLoading: undefined,
      },
      true,
    ],
    [
      {
        castingModesLoading: undefined,
      },
      true,
    ],
    [
      {
        materialStandardsLoading: undefined,
      },
      true,
    ],
    [
      {
        co2ClassificationsLoading: undefined,
      },
      true,
    ],
    [
      {
        steelMakingProcessesLoading: undefined,
      },
      true,
    ],
    [
      {
        productionProcessesLoading: undefined,
      },
      true,
    ],
    [
      {
        manufacturerSuppliersLoading: undefined,
      },
      true,
    ],
    [
      {
        productCategoriesLoading: undefined,
      },
      true,
    ],
  ])(
    'should return true if at least one part of the optionsLoading is undefined',
    (replaceOptions, expected) => {
      const dialogOptionsBase: {
        ratingsLoading: boolean;
        castingModesLoading: boolean;
        materialStandardsLoading: boolean;
        co2ClassificationsLoading: boolean;
        steelMakingProcessesLoading: boolean;
        productionProcessesLoading: boolean;
        manufacturerSuppliersLoading: boolean;
        productCategoriesLoading: boolean;
      } = {
        ratingsLoading: false,
        castingModesLoading: false,
        materialStandardsLoading: false,
        co2ClassificationsLoading: false,
        steelMakingProcessesLoading: false,
        productionProcessesLoading: false,
        manufacturerSuppliersLoading: false,
        productCategoriesLoading: false,
      };

      const result =
        DialogSelectors.getMaterialDialogOptionsLoadingError.projector({
          ...dialogOptionsBase,
          ...replaceOptions,
        });

      expect(result).toEqual(expected);
    }
  );

  it('should return false, if no part is loading', () => {
    const dialogOptionsBase = {
      ratingsLoading: false,
      castingModesLoading: false,
      materialStandardsLoading: false,
      co2ClassificationsLoading: false,
      steelMakingProcessesLoading: false,
      productionProcessesLoading: false,
      manufacturerSuppliersLoading: false,
      productCategoriesLoading: false,
    };

    const result = DialogSelectors.getMaterialDialogOptionsLoading.projector({
      ...dialogOptionsBase,
    });

    expect(result).toBe(false);
  });

  it.each([
    [{}, false],
    [
      {
        ratingsLoading: true,
      },
      true,
    ],
    [
      {
        castingModesLoading: true,
      },
      true,
    ],
    [
      {
        materialStandardsLoading: true,
      },
      true,
    ],
    [
      {
        co2ClassificationsLoading: true,
      },
      true,
    ],
    [
      {
        steelMakingProcessesLoading: true,
      },
      true,
    ],
    [
      {
        productionProcessesLoading: true,
      },
      true,
    ],
    [
      {
        manufacturerSuppliersLoading: true,
      },
      true,
    ],
    [
      {
        productCategoriesLoading: true,
      },
      true,
    ],
  ])(
    'should return true if at least one part of the options is loading',
    (replaceOptions, expected) => {
      const dialogOptionsBase = {
        ratingsLoading: false,
        castingModesLoading: false,
        materialStandardsLoading: false,
        co2ClassificationsLoading: false,
        steelMakingProcessesLoading: false,
        productionProcessesLoading: false,
        manufacturerSuppliersLoading: false,
        productCategoriesLoading: false,
      };

      const result = DialogSelectors.getMaterialDialogOptionsLoading.projector({
        ...dialogOptionsBase,
        ...replaceOptions,
      });

      expect(result).toEqual(expected);
    }
  );

  it('should return false, if no part is undefined', () => {
    const dialogOptionsBase = {
      ratingsLoading: false,
      castingModesLoading: false,
      materialStandardsLoading: false,
      co2ClassificationsLoading: false,
      steelMakingProcessesLoading: false,
      productionProcessesLoading: false,
      manufacturerSuppliersLoading: false,
      productCategoriesLoading: false,
    };

    const result =
      DialogSelectors.getMaterialDialogOptionsLoadingError.projector({
        ...dialogOptionsBase,
      });

    expect(result).toBe(false);
  });

  it('should return the castingModes', () => {
    expect(
      DialogSelectors.getMaterialDialogCastingModes.projector({
        castingModes: ['1', '2'],
      })
    ).toEqual(['1', '2']);
  });

  it('should return the co2Classifications', () => {
    expect(
      DialogSelectors.getMaterialDialogCo2Classifications.projector({
        co2Classifications: ['1', '2'],
      })
    ).toEqual(['1', '2', { id: undefined, title: 'none' }]);
  });

  it('should return the manufaturerSuppliers', () => {
    const manufacturerSuppliers: ManufacturerSupplierV2[] = [
      {
        id: 1,
        name: '1',
        plant: '1',
        country: '1',
        manufacturer: true,
      },
      {
        id: 2,
        name: '2',
        plant: '2',
        country: '2',
        manufacturer: true,
      },
    ];
    expect(
      DialogSelectors.getMaterialDialogSuppliers.projector({
        manufacturerSuppliers,
      })
    ).toEqual(manufacturerSuppliers);
  });

  it('should return the materialStandards', () => {
    const materialStandards: MaterialStandardV2[] = [
      {
        id: 1,
        materialName: '1',
        standardDocument: '1',
        materialNumber: ['1'],
      },
      {
        id: 2,
        materialName: '2',
        standardDocument: '2',
        materialNumber: ['2'],
      },
    ];
    expect(
      DialogSelectors.getMaterialDialogMaterialStandards.projector({
        materialStandards,
      })
    ).toEqual(materialStandards);
  });

  it('should return the ratings', () => {
    expect(
      DialogSelectors.getMaterialDialogRatings.projector({
        ratings: ['1', '2'],
      })
    ).toEqual(['1', '2']);
  });

  it('should return the steelMakingProcesses', () => {
    expect(
      DialogSelectors.getMaterialDialogSteelMakingProcesses.projector({
        steelMakingProcesses: ['1', '2'],
      })
    ).toEqual(['1', '2']);
  });

  it('should return the productionProcesses', () => {
    expect(
      DialogSelectors.getMaterialDialogProductionProcesses.projector({
        productionProcesses: ['1', '2'],
      })
    ).toEqual(['1', '2']);
  });

  it('should return the castingDiameters', () => {
    expect(
      DialogSelectors.getMaterialDialogCastingDiameters.projector({
        castingDiameters: ['200x200'],
      })
    ).toEqual(['200x200']);
  });

  it('should return the customCastingDiameters', () => {
    expect(
      DialogSelectors.getMaterialDialogCustomCastingDiameters.projector({
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
      DialogSelectors.getMaterialDialogCastingDiameterStringOptions(mockState)
    ).toEqual([
      {
        id: 'custom',
        title: 'custom',
        tooltip: 'custom',
        tooltipDelay: 1500,
      },
      {
        id: 'notCustom',
        title: 'notCustom',
        tooltip: 'notCustom',
        tooltipDelay: 1500,
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
      DialogSelectors.getMaterialDialogCastingDiameterStringOptions(mockState)
    ).toEqual([]);
  });

  it('should return castingDiametersLoading', () => {
    expect(
      DialogSelectors.getMaterialDialogCastingDiametersLoading.projector({
        castingDiametersLoading: true,
      })
    ).toBe(true);
  });

  it('should return the productCategories', () => {
    const mockProductCategories = [{ id: 'raw', title: 'raw' }];
    expect(
      DialogSelectors.getProductCategories.projector({
        productCategories: mockProductCategories,
      })
    ).toEqual(mockProductCategories);
  });

  it('should return the productCategories loading state', () => {
    expect(
      DialogSelectors.getProductCategoriesLoading.projector({
        productCategoriesLoading: true,
      })
    ).toEqual(true);
  });

  it('should return the referenceDocuments', () => {
    expect(
      DialogSelectors.getMaterialDialogReferenceDocuments.projector({
        referenceDocuments: ['reference'],
      })
    ).toEqual(['reference']);
  });

  it('should return the customReferenceDocuments', () => {
    expect(
      DialogSelectors.getMaterialDialogCustomReferenceDocuments.projector({
        customReferenceDocuments: ['reference'],
      })
    ).toEqual(['reference']);
  });

  it('should return the referenceDocuments stringOptions', () => {
    const mockState = {
      msd: {
        dialog: {
          dialogOptions: {
            customReferenceDocuments: ['custom'],
            referenceDocuments: ['notCustom'],
          },
        },
      },
    };

    expect(
      DialogSelectors.getMaterialDialogReferenceDocumentsStringOptions(
        mockState
      )
    ).toEqual([
      {
        id: 'custom',
        title: 'custom',
        tooltip: 'custom',
        tooltipDelay: 1500,
      },
      {
        id: 'notCustom',
        title: 'notCustom',
        tooltip: 'notCustom',
        tooltipDelay: 1500,
      },
    ]);
  });

  it('should return the reference documents stringOptions with empty lists', () => {
    const mockState = {
      msd: {
        dialog: {
          dialogOptions: {},
        },
      },
    };

    expect(
      DialogSelectors.getMaterialDialogReferenceDocumentsStringOptions(
        mockState
      )
    ).toEqual([]);
  });

  it('should return referenceDocumentsLoading', () => {
    expect(
      DialogSelectors.getMaterialDialogReferenceDocumentsLoading.projector({
        referenceDocumentsLoading: true,
      })
    ).toBe(true);
  });

  // unit tests for selecting values for suppliers
  describe('supplier stringOptions', () => {
    const mockSuppliers: ManufacturerSupplierV2[] = [
      {
        id: 1,
        name: 'supplier1',
        plant: 'plant1',
        country: 'country1',
        manufacturer: true,
      },
      {
        id: 2,
        name: 'supplier2',
        plant: 'plant2',
        country: 'country2',
        manufacturer: false,
      },
      undefined,
      {
        id: 3,
        name: '   ',
        plant: '   ',
        country: '   ',
        manufacturer: false,
      },
      {
        id: 4,
        name: undefined,
        plant: undefined,
        country: undefined,
        manufacturer: false,
      },
    ];
    const mockCustoms: string[] = ['custom1', 'custom2'];
    const mockStringOptions: StringOption[] = [
      {
        id: 1,
        title: 'opt1',
        tooltip: 'opt1',
        tooltipDelay: 1500,
      },
      {
        id: 2,
        title: 'opt2',
        tooltip: 'opt2',
        tooltipDelay: 1500,
      },
    ];
    const mockCustomStringOptions: StringOption[] = [
      {
        id: undefined,
        tooltip: 'custom1',
        title: 'custom1',
        tooltipDelay: 1500,
      },
      {
        id: undefined,
        title: 'custom2',
        tooltip: 'custom2',
        tooltipDelay: 1500,
      },
      ...mockStringOptions,
    ];
    it('should return the suppliers as StringOptions', () => {
      const expected: StringOption[] = [
        {
          id: 1,
          title: 'supplier1',
          tooltip: 'supplier1',
          tooltipDelay: 1500,
          data: {
            plant: 'plant1',
          },
        },
        {
          id: 2,
          title: 'supplier2',
          tooltip: 'supplier2',
          tooltipDelay: 1500,
          data: {
            plant: 'plant2',
          },
        },
      ];

      const result =
        DialogSelectors.getSupplierStringOptions.projector(mockSuppliers);

      expect(result).toEqual(expected);
    });

    it('should return the suppliers including Customs as StringOptions', () => {
      const result =
        DialogSelectors.getSupplierNameStringOptionsMerged.projector(
          mockStringOptions,
          mockCustoms
        );

      expect(result).toEqual(mockCustomStringOptions);
    });
    it('should return the suppliers with undefined Customs as StringOptions', () => {
      const mockCustom: string[] = undefined;
      const result =
        DialogSelectors.getSupplierNameStringOptionsMerged.projector(
          mockStringOptions,
          mockCustom
        );

      expect(result).toEqual(mockStringOptions);
    });

    it('should return the supplier plants as StringOptions', () => {
      const expected: StringOption[] = [
        {
          id: 'plant1',
          title: 'plant1',
          tooltip: 'plant1',
          tooltipDelay: 1500,
          data: {
            supplierId: 1,
            supplierName: 'supplier1',
            supplierCountry: 'country1',
            manufacturer: true,
          },
        },
        {
          id: 'plant2',
          title: 'plant2',
          tooltip: 'plant2',
          tooltipDelay: 1500,
          data: {
            supplierId: 2,
            supplierName: 'supplier2',
            supplierCountry: 'country2',
            manufacturer: false,
          },
        },
      ];

      const result =
        DialogSelectors.getSupplierPlantStringOptions.projector(mockSuppliers);

      expect(result).toEqual(expected);
    });

    it('should return the supplier plants including Customs as StringOptions', () => {
      const result =
        DialogSelectors.getSupplierPlantsStringOptionsMerged.projector(
          mockStringOptions,
          mockCustoms
        );

      expect(result).toEqual(mockCustomStringOptions);
    });

    it('should return the supplier plants with undefined Customs as StringOptions', () => {
      const mockCustom: string[] = undefined;

      const result =
        DialogSelectors.getSupplierPlantsStringOptionsMerged.projector(
          mockStringOptions,
          mockCustom
        );

      expect(result).toEqual(mockStringOptions);
    });

    it('should return the supplier countries as StringOptions', () => {
      const expected: StringOption[] = [
        {
          id: 'country1',
          title: 'country1',
          tooltip: 'country1',
          tooltipDelay: 1500,
        },
        {
          id: 'country2',
          title: 'country2',
          tooltip: 'country2',
          tooltipDelay: 1500,
        },
      ];

      const result =
        DialogSelectors.getSupplierCountryStringOptions.projector(
          mockSuppliers
        );

      expect(result).toEqual(expected);
    });

    it('should return the supplier countries including Customs as StringOptions', () => {
      const result =
        DialogSelectors.getSupplierCountriesStringOptionsMerged.projector(
          mockStringOptions,
          mockCustoms
        );

      expect(result).toEqual(mockCustomStringOptions);
    });
    it('should return the supplier countries with undefined Customs as StringOptions', () => {
      const mockCustom: string[] = undefined;

      const result =
        DialogSelectors.getSupplierCountriesStringOptionsMerged.projector(
          mockStringOptions,
          mockCustom
        );

      expect(result).toEqual(mockStringOptions);
    });
  });

  it('should return the material names as StringOptions', () => {
    const mockMaterialStandards: MaterialStandardV2[] = [
      {
        id: 1,
        materialName: 'material1',
        standardDocument: 'S 1',
        materialNumber: ['1.1234'],
      },
      {
        id: 2,
        materialName: 'material2',
        standardDocument: 'S 2',
        materialNumber: ['1.1234'],
      },
    ];

    const expected: StringOption[] = [
      {
        id: 1,
        title: 'material1',
        tooltip: 'material1',
        tooltipDelay: 1500,
        data: {
          standardDocument: 'S 1',
        },
      },
      {
        id: 2,
        title: 'material2',
        tooltip: 'material2',
        tooltipDelay: 1500,
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
        id: 3,
        title: '3',
        data: {
          standardDocument: 'std3',
        },
      },
      {
        id: 2,
        title: '1',
        data: {
          standardDocument: 'std2',
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
        tooltip: 'first',
        tooltipDelay: 1500,
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
    const mockMaterialStandards: MaterialStandardV2[] = [
      {
        id: 1,
        materialName: 'material1',
        standardDocument: 'S 1',
        materialNumber: ['1.1234'],
      },
      {
        id: 2,
        materialName: 'material2',
        standardDocument: 'S 2',
        materialNumber: ['1.1234'],
      },
    ];

    const expected: StringOption[] = [
      {
        id: 1,
        title: 'S 1',
        tooltip: 'S 1',
        tooltipDelay: 1500,
        data: {
          materialName: 'material1',
        },
      },
      {
        id: 2,
        title: 'S 2',
        tooltip: 'S 2',
        tooltipDelay: 1500,
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
        id: 3,
        title: '3',
        data: {
          materialName: 'material3',
        },
      },
      {
        id: 2,
        title: '1',
        data: {
          materialName: 'material2',
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
        tooltip: 'first',
        tooltipDelay: 1500,
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
        tooltip: 'bad',
        tooltipDelay: 1500,
      },
      {
        id: 'good',
        title: 'good',
        tooltip: 'good',
        tooltipDelay: 1500,
      },
    ];

    const result = DialogSelectors.getStringOptions(
      DialogSelectors.getMaterialDialogRatings
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
        tooltip: 'bad',
        tooltipDelay: 1500,
      },
      {
        id: 'good',
        title: 'good',
        tooltip: 'good',
        tooltipDelay: 1500,
      },
      {
        id: undefined,
        title: 'none',
      },
    ];

    const result = DialogSelectors.getStringOptions(
      DialogSelectors.getMaterialDialogRatings,
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

  it('shoudl return editMaterial', () => {
    expect(
      DialogSelectors.getEditMaterialData.projector({
        editMaterial: {
          row: {} as DataResult,
          column: 'column',
        },
      })
    ).toEqual({ row: {} as DataResult, column: 'column' });
  });

  it('should return false if there is no minimized dialog', () => {
    expect(
      DialogSelectors.getHasMinimizedDialog.projector({
        minimizedDialog: undefined,
      })
    ).toBe(false);
  });

  it('should return true if there is a minimized dialog', () => {
    expect(
      DialogSelectors.getHasMinimizedDialog.projector({
        minimizedDialog: {
          id: 1,
          value: {} as MaterialFormValue,
        },
      })
    ).toBe(true);
  });

  it('should return the minimized dialog', () => {
    expect(
      DialogSelectors.getMinimizedDialog.projector({
        minimizedDialog: {
          id: 1,
          value: {} as MaterialFormValue,
        },
      })
    ).toEqual({
      id: 1,
      value: {} as MaterialFormValue,
    });
  });

  it('should return the resume dialog data', () => {
    expect(
      DialogSelectors.getResumeDialogData.projector(
        {
          row: {} as DataResult,
          parsedMaterial: {} as MaterialFormValue,
          column: 'column',
        },
        {
          id: 1,
          value: {} as MaterialFormValue,
        }
      )
    ).toEqual({
      editMaterial: {
        row: {} as DataResult,
        parsedMaterial: {} as MaterialFormValue,
        column: 'column',
      },
      minimizedDialog: {
        id: 1,
        value: {} as MaterialFormValue,
      },
    });
  });

  it('should remove duplicate string options compared by title and sort', () => {
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
      {
        id: 5,
        title: 'c1',
        data: { something: 'something' },
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
  it('should remove duplicate string options compared with title and data and sort', () => {
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
      {
        id: 5,
        title: 'c1',
        data: { something: 'something' },
      },
      {
        id: 6,
        title: 'c1',
        data: { something: 'something' },
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
      {
        id: 5,
        title: 'c1',
        data: { something: 'something' },
      },
    ];

    const result =
      DialogSelectors.getUniqueStringOptionsWithCompareDataStringified(
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

  describe('getSteelMakingProcessesInUse', () => {
    it('should return the steel making processes in use', () => {
      expect(
        DialogSelectors.getSteelMakingProcessesInUse.projector({
          steelMakingProcessesInUse: ['BF+BOF'],
        })
      ).toEqual(['BF+BOF']);
    });
  });

  describe('getCo2ValuesForSupplierSteelMakingProcess', () => {
    it('should return the co2 values', () => {
      expect(
        DialogSelectors.getCo2ValuesForSupplierSteelMakingProcess.projector({
          co2Values: [],
        })
      ).toEqual([]);
    });
  });

  describe('getHighestCo2Values', () => {
    it('should return the highest value with other values count', () => {
      expect(
        DialogSelectors.getHighestCo2Values.projector([
          {
            co2PerTon: 3,
            co2Scope1: 1,
            co2Scope2: 1,
            co2Scope3: 1,
            co2Classification: 'c1',
          },
          {
            co2PerTon: 1,
            co2Scope1: undefined,
            co2Scope2: undefined,
            co2Scope3: undefined,
            co2Classification: undefined,
          },
        ])
      ).toEqual({
        co2Values: {
          co2PerTon: 3,
          co2Scope1: 1,
          co2Scope2: 1,
          co2Scope3: 1,
          co2Classification: {
            id: 'c1',
            title: 'c1',
            tooltip: 'c1',
            tooltipDelay: 1500,
          },
        },
        otherValues: 1,
      });
    });

    it('should return the highest value with other values count without classification', () => {
      expect(
        DialogSelectors.getHighestCo2Values.projector([
          {
            co2PerTon: 3,
            co2Scope1: 1,
            co2Scope2: 1,
            co2Scope3: 1,
            co2Classification: 'c1',
          },
          {
            co2PerTon: 10,
            co2Scope1: undefined,
            co2Scope2: undefined,
            co2Scope3: undefined,
            co2Classification: undefined,
          },
        ])
      ).toEqual({
        co2Values: {
          co2PerTon: 10,
          co2Scope1: undefined,
          co2Scope2: undefined,
          co2Scope3: undefined,
          co2Classification: {
            id: undefined,
            title: 'none',
            tooltip: 'none',
            tooltipDelay: 1500,
          },
        },
        otherValues: 1,
      });
    });

    it('should return undefined values for undefined co2Values', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(DialogSelectors.getHighestCo2Values.projector(undefined)).toEqual({
        co2Values: undefined,
        otherValues: undefined,
      });
    });

    it('should return undefined values for empty co2Values', () => {
      expect(DialogSelectors.getHighestCo2Values.projector([])).toEqual({
        co2Values: undefined,
        otherValues: undefined,
      });
    });

    it('should return highest value if only one value', () => {
      expect(
        DialogSelectors.getHighestCo2Values.projector([
          {
            co2PerTon: 3,
            co2Scope1: 1,
            co2Scope2: 1,
            co2Scope3: 1,
            co2Classification: 'c1',
          },
        ])
      ).toEqual({
        co2Values: {
          co2PerTon: 3,
          co2Scope1: 1,
          co2Scope2: 1,
          co2Scope3: 1,
          co2Classification: {
            id: 'c1',
            title: 'c1',
            tooltip: 'c1',
            tooltipDelay: 1500,
          },
        },
        otherValues: 0,
      });
    });

    it('should return highest value if only one value without classification', () => {
      expect(
        DialogSelectors.getHighestCo2Values.projector([
          {
            co2PerTon: 10,
            co2Scope1: undefined,
            co2Scope2: undefined,
            co2Scope3: undefined,
            co2Classification: undefined,
          },
        ])
      ).toEqual({
        co2Values: {
          co2PerTon: 10,
          co2Scope1: undefined,
          co2Scope2: undefined,
          co2Scope3: undefined,
          co2Classification: {
            id: undefined,
            title: 'none',
            tooltip: 'none',
            tooltipDelay: 1500,
          },
        },
        otherValues: 0,
      });
    });
  });

  describe('getDialogError', () => {
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
            dialog: {
              ...initialState,
              dialogOptions: {
                ...initialState.dialogOptions,
                error: true,
              },
            },
          },
        });

        const expected = m.cold('a', { a: true });
        const result = store.pipe(DialogSelectors.getDialogError);

        m.expect(result).toBeObservable(expected);
      })
    );
  });

  describe('getEditMaterialDataLoaded', () => {
    let store: MockStore;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideMockStore()],
      });

      store = TestBed.inject(MockStore);
    });
    it(
      'should return the edit information if all info is loaded',
      marbles((m) => {
        const editMaterial = {
          row: {} as DataResult,
          parsedMaterial: {} as MaterialFormValue,
          column: 'column',
          materialNames: [] as { id: number; materialName: string }[],
          materialNamesLoading: false,
          standardDocuments: [] as { id: number; standardDocument: string }[],
          standardDocumentsLoading: false,
          supplierIds: [] as number[],
          supplierIdsLoading: false,
          loadingComplete: true,
        };

        store.setState({
          msd: {
            dialog: {
              ...initialState,
              editMaterial,
            },
          },
        });

        const expected = m.cold('a', { a: editMaterial });

        const result = store.pipe(DialogSelectors.getEditMaterialDataLoaded);

        m.expect(result).toBeObservable(expected);
      })
    );

    it(
      'should return undefined if some loading failed',
      marbles((m) => {
        const editMaterial: { [key: string]: any } = {
          row: {} as DataResult,
          parsedMaterial: {} as MaterialFormValue,
          column: 'column',
          materialNames: [] as { id: number; materialName: string }[],
          materialNamesLoading: undefined,
          standardDocuments: [] as { id: number; standardDocument: string }[],
          standardDocumentsLoading: undefined,
          supplierIds: [] as number[],
          supplierIdsLoading: undefined,
          loadingComplete: true,
        };

        store.setState({
          msd: {
            dialog: {
              ...initialState,
              editMaterial,
            },
          },
        });

        const expected = m.cold('a', { a: undefined });

        const result = store.pipe(DialogSelectors.getEditMaterialDataLoaded);

        m.expect(result).toBeObservable(expected);
      })
    );
  });
});
