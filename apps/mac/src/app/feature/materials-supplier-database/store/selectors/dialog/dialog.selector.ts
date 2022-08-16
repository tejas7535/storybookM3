import { createSelector, MemoizedSelector } from '@ngrx/store';

import { StringOption } from '@schaeffler/inputs';

import * as fromStore from '@mac/msd/store/reducers';

export const sortAlphabetically = (a: string, b: string): number =>
  a.localeCompare(b);

export const getStringOptions = (
  selector: MemoizedSelector<object, string[]>,
  addOptions?: StringOption[]
) =>
  createSelector(selector, (values): StringOption[] => {
    const options: StringOption[] =
      values
        ?.map((value) => ({ id: value, title: value }))
        .sort(stringOptionsSortFn) || [];
    if (addOptions && addOptions.length > 0) {
      options.push(...addOptions);
    }

    return options;
  });

export const getUniqueStringOptions = (
  selector: MemoizedSelector<object, StringOption[]>
) =>
  createSelector(selector, (stringOptions): StringOption[] =>
    stringOptions
      .filter(
        (option, index) =>
          stringOptions.findIndex(
            (compareOption) => compareOption.title === option.title
          ) === index
      )
      .sort(stringOptionsSortFn)
  );

export const stringOptionsSortFn = (
  a: StringOption,
  b: StringOption
): number => {
  if (!a.title || !b.title) {
    return 0;
  }

  const lowerA = a.title.toLowerCase();
  const lowerB = b.title.toLowerCase();

  if (lowerA < lowerB) {
    return -1;
  }

  if (lowerA > lowerB) {
    return 1;
  }

  return 0;
};

export const getDialogState = createSelector(
  fromStore.getMSDState,
  (msdState) => msdState.dialog
);
export const getAddMaterialDialogOptions = createSelector(
  getDialogState,
  (addMaterialDialog) => addMaterialDialog.dialogOptions
);
export const getCustomMaterialStandardNames = createSelector(
  getAddMaterialDialogOptions,
  (dialogOptions) => dialogOptions.customMaterialStandardNames
);
export const getCustomMaterialStandardDocuments = createSelector(
  getAddMaterialDialogOptions,
  (dialogOptions) => dialogOptions.customMaterialStandardDocuments
);
export const getAddMaterialDialogOptionsLoading = createSelector(
  getAddMaterialDialogOptions,
  (dialogOptions) =>
    dialogOptions.ratingsLoading ||
    dialogOptions.castingModesLoading ||
    dialogOptions.materialStandardsLoading ||
    dialogOptions.co2ClassificationsLoading ||
    dialogOptions.steelMakingProcessesLoading ||
    dialogOptions.manufacturerSuppliersLoading
);

export const getAddMaterialDialogOptionsLoadingError = createSelector(
  getAddMaterialDialogOptions,
  (dialogOptions) =>
    dialogOptions.ratingsLoading === undefined ||
    dialogOptions.castingModesLoading === undefined ||
    dialogOptions.materialStandardsLoading === undefined ||
    dialogOptions.co2ClassificationsLoading === undefined ||
    dialogOptions.steelMakingProcessesLoading === undefined ||
    dialogOptions.manufacturerSuppliersLoading === undefined
);

export const getAddMaterialDialogCastingModes = createSelector(
  getAddMaterialDialogOptions,
  (dialogOptions) => dialogOptions.castingModes
);
export const getAddMaterialDialogCo2Classifications = createSelector(
  getAddMaterialDialogOptions,
  (dialogOptions) => dialogOptions.co2Classifications
);
export const getAddMaterialDialogSuppliers = createSelector(
  getAddMaterialDialogOptions,
  (dialogOptions) => dialogOptions.manufacturerSuppliers
);
export const getCustomSupplierNames = createSelector(
  getAddMaterialDialogOptions,
  (dialogOptions) => dialogOptions.customManufacturerSupplierNames
);
export const getCustomSupplierPlants = createSelector(
  getAddMaterialDialogOptions,
  (dialogOptions) => dialogOptions.customManufacturerSupplierPlants
);
export const getAddMaterialDialogMaterialStandards = createSelector(
  getAddMaterialDialogOptions,
  (dialogOptions) => dialogOptions.materialStandards
);
export const getAddMaterialDialogRatings = createSelector(
  getAddMaterialDialogOptions,
  (dialogOptions) => dialogOptions.ratings
);
export const getAddMaterialDialogSteelMakingProcesses = createSelector(
  getAddMaterialDialogOptions,
  (dialogOptions) => dialogOptions.steelMakingProcesses
);

export const getAddMaterialDialogCastingDiameters = createSelector(
  getAddMaterialDialogOptions,
  (dialogOptions) => dialogOptions.castingDiameters
);

export const getAddMaterialDialogCustomCastingDiameters = createSelector(
  getAddMaterialDialogOptions,
  (dialogOptions) => dialogOptions.customCastingDiameters
);

export const getAddMaterialDialogCastingDiameterStringOptions = createSelector(
  getAddMaterialDialogCastingDiameters,
  getAddMaterialDialogCustomCastingDiameters,
  (castingDiameters, customCastingDiameters) => {
    const options: StringOption[] = (castingDiameters || [])
      .filter((diameter) => !!diameter)
      .map((diameter) => ({ id: diameter, title: diameter }))
      .sort(stringOptionsSortFn);
    const customOptions: StringOption[] = (customCastingDiameters || []).map(
      (diameter) => ({ id: diameter, title: diameter })
    );
    options.unshift(...customOptions);

    return options;
  }
);

export const getAddMaterialDialogCastingDiametersLoading = createSelector(
  getAddMaterialDialogOptions,
  (dialogOptions) => dialogOptions.castingDiametersLoading
);

export const getSupplierStringOptions = createSelector(
  getAddMaterialDialogSuppliers,
  (suppliers): StringOption[] =>
    suppliers.map((supplier) => ({
      id: supplier.id,
      title: supplier.name,
      data: { plant: supplier.plant },
    }))
);

export const getSupplierPlantStringOptions = createSelector(
  getAddMaterialDialogSuppliers,
  (suppliers): StringOption[] =>
    suppliers
      .map((supplier) => ({
        id: supplier.plant,
        title: supplier.plant,
        data: { supplierId: supplier.id, supplierName: supplier.name },
      }))
      .filter((option) => !!option)
      .sort(stringOptionsSortFn)
);

export const getSupplierNameStringOptionsMerged = createSelector(
  getUniqueStringOptions(getSupplierStringOptions),
  getCustomSupplierNames,
  (supplierOptions, customSupplierNames): StringOption[] => {
    const customOptions: StringOption[] = (customSupplierNames || []).map(
      (value) => ({ id: undefined, title: value } as StringOption)
    );
    customOptions.push(...supplierOptions);

    return customOptions;
  }
);

export const getSupplierPlantsStringOptionsMerged = createSelector(
  getUniqueStringOptions(getSupplierPlantStringOptions),
  getCustomSupplierPlants,
  (supplierOptions, customSupplierPlants): StringOption[] => {
    const customOptions: StringOption[] = (customSupplierPlants || []).map(
      (value) => ({ id: undefined, title: value } as StringOption)
    );
    customOptions.push(...supplierOptions);

    return customOptions;
  }
);

export const getMaterialNameStringOptions = createSelector(
  getAddMaterialDialogMaterialStandards,
  (materialStandards): StringOption[] =>
    materialStandards.map((materialStandard) => ({
      id: materialStandard.id,
      title: materialStandard.materialName,
      data: { standardDocument: materialStandard.standardDocument },
    }))
);

export const getMaterialNameStringOptionsExtended = createSelector(
  getMaterialNameStringOptions,
  (materialNameOptions): StringOption[] =>
    materialNameOptions.map((materialName) => {
      const extraStandardDocuments: { id: number; standardDocument: string }[] =
        materialNameOptions
          .filter((option) => option.title === materialName.title)
          .map((option) => ({
            id: option.id as number,
            standardDocument: option.data.standardDocument,
          }))
          .filter(
            (option, index, options) =>
              options.findIndex(
                (compareOption) =>
                  option.id === compareOption.id &&
                  compareOption.standardDocument === option.standardDocument
              ) === index && !!option
          );

      return {
        ...materialName,
        data: {
          standardDocuments: extraStandardDocuments,
        },
      };
    })
);

export const getMaterialNameStringOptionsMerged = createSelector(
  getUniqueStringOptions(getMaterialNameStringOptionsExtended),
  getCustomMaterialStandardNames,
  (materialNameOptions, customMaterialNames): StringOption[] => {
    const customOptions: StringOption[] = (customMaterialNames || []).map(
      (value) => ({ id: undefined, title: value } as StringOption)
    );
    customOptions.push(...materialNameOptions);

    return customOptions;
  }
);

export const getMaterialStandardDocumentStringOptions = createSelector(
  getAddMaterialDialogMaterialStandards,
  (materialStandards): StringOption[] =>
    materialStandards.map((materialStandard) => ({
      id: materialStandard.id,
      title: materialStandard.standardDocument,
      data: { materialName: materialStandard.materialName },
    }))
);

export const getMaterialStandardDocumentStringOptionsExtended = createSelector(
  getMaterialStandardDocumentStringOptions,
  (standardDocumentOptions): StringOption[] =>
    standardDocumentOptions.map((standardDocument) => {
      const extraMaterialNames: { id: number; materialName: string }[] =
        standardDocumentOptions
          .filter((option) => option.title === standardDocument.title)
          .map((option) => ({
            id: option.id as number,
            materialName: option.data.materialName,
          }))
          .filter(
            (option, index, options) =>
              options.findIndex(
                (compareOption) =>
                  compareOption.id === option.id &&
                  compareOption.materialName === option.materialName
              ) === index
          );

      return {
        ...standardDocument,
        data: {
          materialNames: extraMaterialNames,
        },
      };
    })
);

export const getMaterialStandardDocumentStringOptionsMerged = createSelector(
  getUniqueStringOptions(getMaterialStandardDocumentStringOptionsExtended),
  getCustomMaterialStandardDocuments,
  (
    standardDocumentOptions,
    customMaterialStandardDocuments
  ): StringOption[] => {
    const customOptions: StringOption[] = (
      customMaterialStandardDocuments || []
    ).map((value) => ({ id: undefined, title: value } as StringOption));
    customOptions.push(...standardDocumentOptions);

    return customOptions;
  }
);

export const getCreateMaterialLoading = createSelector(
  getDialogState,
  (addMaterialDialog) => addMaterialDialog.createMaterial?.createMaterialLoading
);

export const getCreateMaterialRecord = createSelector(
  getDialogState,
  (addMaterialDialog) => addMaterialDialog.createMaterial?.createMaterialRecord
);
