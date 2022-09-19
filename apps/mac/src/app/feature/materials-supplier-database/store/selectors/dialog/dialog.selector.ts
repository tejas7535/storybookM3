/* eslint-disable max-lines */
import { filter, map, pipe } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { createSelector, MemoizedSelector, select } from '@ngrx/store';

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
            (compareOption) =>
              compareOption.title === option.title &&
              compareOption.data === option.data
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
export const getMaterialDialogOptions = createSelector(
  getDialogState,
  (materialDialog) => materialDialog.dialogOptions
);
export const getCustomMaterialStandardNames = createSelector(
  getMaterialDialogOptions,
  (dialogOptions) => dialogOptions.customMaterialStandardNames
);
export const getCustomMaterialStandardDocuments = createSelector(
  getMaterialDialogOptions,
  (dialogOptions) => dialogOptions.customMaterialStandardDocuments
);
export const getMaterialDialogOptionsLoading = createSelector(
  getMaterialDialogOptions,
  (dialogOptions) =>
    dialogOptions.ratingsLoading ||
    dialogOptions.castingModesLoading ||
    dialogOptions.materialStandardsLoading ||
    dialogOptions.co2ClassificationsLoading ||
    dialogOptions.steelMakingProcessesLoading ||
    dialogOptions.manufacturerSuppliersLoading
);

export const getMaterialDialogOptionsLoadingError = createSelector(
  getMaterialDialogOptions,
  (dialogOptions) =>
    dialogOptions.ratingsLoading === undefined ||
    dialogOptions.castingModesLoading === undefined ||
    dialogOptions.materialStandardsLoading === undefined ||
    dialogOptions.co2ClassificationsLoading === undefined ||
    dialogOptions.steelMakingProcessesLoading === undefined ||
    dialogOptions.manufacturerSuppliersLoading === undefined
);

export const getMaterialDialogCastingModes = createSelector(
  getMaterialDialogOptions,
  (dialogOptions) => dialogOptions.castingModes
);
export const getMaterialDialogCo2Classifications = createSelector(
  getMaterialDialogOptions,
  (dialogOptions) => [
    ...dialogOptions.co2Classifications,
    {
      id: undefined,
      title: translate('materialsSupplierDatabase.mainTable.dialog.none'),
    },
  ]
);
export const getMaterialDialogSuppliers = createSelector(
  getMaterialDialogOptions,
  (dialogOptions) => dialogOptions.manufacturerSuppliers
);
export const getCustomSupplierNames = createSelector(
  getMaterialDialogOptions,
  (dialogOptions) => dialogOptions.customManufacturerSupplierNames
);
export const getCustomSupplierPlants = createSelector(
  getMaterialDialogOptions,
  (dialogOptions) => dialogOptions.customManufacturerSupplierPlants
);
export const getMaterialDialogMaterialStandards = createSelector(
  getMaterialDialogOptions,
  (dialogOptions) => dialogOptions.materialStandards
);
export const getMaterialDialogRatings = createSelector(
  getMaterialDialogOptions,
  (dialogOptions) => dialogOptions.ratings
);
export const getMaterialDialogSteelMakingProcesses = createSelector(
  getMaterialDialogOptions,
  (dialogOptions) => dialogOptions.steelMakingProcesses
);

export const getMaterialDialogCastingDiameters = createSelector(
  getMaterialDialogOptions,
  (dialogOptions) => dialogOptions.castingDiameters
);

export const getMaterialDialogCustomCastingDiameters = createSelector(
  getMaterialDialogOptions,
  (dialogOptions) => dialogOptions.customCastingDiameters
);

export const getMaterialDialogCastingDiameterStringOptions = createSelector(
  getMaterialDialogCastingDiameters,
  getMaterialDialogCustomCastingDiameters,
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

export const getMaterialDialogCastingDiametersLoading = createSelector(
  getMaterialDialogOptions,
  (dialogOptions) => dialogOptions.castingDiametersLoading
);

export const getMaterialDialogReferenceDocuments = createSelector(
  getMaterialDialogOptions,
  (dialogOptions) => dialogOptions.referenceDocuments
);

export const getMaterialDialogCustomReferenceDocuments = createSelector(
  getMaterialDialogOptions,
  (dialogOptions) => dialogOptions.customReferenceDocuments
);

export const getMaterialDialogReferenceDocumentsStringOptions = createSelector(
  getMaterialDialogReferenceDocuments,
  getMaterialDialogCustomReferenceDocuments,
  (referenceDocuments, customReferenceDocuments) => {
    const options: StringOption[] = (referenceDocuments || [])
      .filter((document) => !!document)
      .map((document) => ({ id: document, title: document }));
    const customOptions: StringOption[] = (customReferenceDocuments || []).map(
      (document) => ({ id: document, title: document })
    );
    options.unshift(...customOptions);

    return options;
  }
);

export const getMaterialDialogReferenceDocumentsLoading = createSelector(
  getMaterialDialogOptions,
  (dialogOptions) => dialogOptions.referenceDocumentsLoading
);

export const getSupplierStringOptions = createSelector(
  getMaterialDialogSuppliers,
  (suppliers): StringOption[] =>
    suppliers.map((supplier) => ({
      id: supplier.id,
      title: supplier.name,
      data: { plant: supplier.plant },
    }))
);

export const getSupplierPlantStringOptions = createSelector(
  getMaterialDialogSuppliers,
  (suppliers): StringOption[] =>
    suppliers
      ?.filter(
        (supplier) =>
          !!supplier && !!supplier.plant && supplier.plant.trim() !== ''
      )
      .map((supplier) => ({
        id: supplier.plant,
        title: supplier.plant,
        data: { supplierId: supplier.id, supplierName: supplier.name },
      }))
      .filter((option) => !!option)
      .sort(stringOptionsSortFn) || []
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
  getMaterialDialogMaterialStandards,
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
  getMaterialDialogMaterialStandards,
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
  (materialDialog) => materialDialog.createMaterial?.createMaterialLoading
);

export const getCreateMaterialRecord = createSelector(
  getDialogState,
  (materialDialog) => materialDialog.createMaterial?.createMaterialRecord
);

export const getEditMaterialData = createSelector(
  getDialogState,
  (dialogState) => dialogState.editMaterial
);

export const getHasMinimizedDialog = createSelector(
  getDialogState,
  (dialogState) => !!dialogState.minimizedDialog
);

export const getMinimizedDialog = createSelector(
  getDialogState,
  (dialogState) => dialogState.minimizedDialog
);

export const getResumeDialogData = createSelector(
  getEditMaterialData,
  getMinimizedDialog,
  (editMaterial, minimizedDialog) => ({ editMaterial, minimizedDialog })
);

export const getSteelMakingProcessesInUse = createSelector(
  getMaterialDialogOptions,
  (dialogOptions) => dialogOptions.steelMakingProcessesInUse
);

export const getCo2ValuesForSupplierSteelMakingProcess = createSelector(
  getMaterialDialogOptions,
  (dialogOptions) => dialogOptions.co2Values
);

export const getHighestCo2Values = createSelector(
  getCo2ValuesForSupplierSteelMakingProcess,
  (
    co2Values
  ): {
    co2Values: {
      co2PerTon: number;
      co2Scope1: number;
      co2Scope2: number;
      co2Scope3: number;
      co2Classification: StringOption;
    };
    otherValues: number;
  } => {
    if (!co2Values || co2Values.length === 0) {
      return {
        co2Values: undefined,
        otherValues: undefined,
      };
    } else if (co2Values.length > 1) {
      const sortedCo2Values = [...co2Values]
        .filter((co2Value) => !!co2Value.co2PerTon)
        .sort((a, b) => b.co2PerTon - a.co2PerTon);
      const highestCo2Value = sortedCo2Values[0];

      return {
        co2Values: {
          ...highestCo2Value,
          co2Classification: {
            id: highestCo2Value.co2Classification ?? undefined,
            title: translate(
              highestCo2Value.co2Classification
                ? `materialsSupplierDatabase.mainTable.dialog.${highestCo2Value.co2Classification}`
                : 'materialsSupplierDatabase.mainTable.dialog.none'
            ),
          },
        },
        otherValues: co2Values.length - 1,
      };
    }

    const co2Value = co2Values[0];

    return {
      co2Values: {
        ...co2Value,
        co2Classification: {
          id: co2Value.co2Classification ?? undefined,
          title: translate(
            co2Value.co2Classification ??
              'materialsSupplierDatabase.mainTable.dialog.none'
          ),
        },
      },
      otherValues: 0,
    };
  }
);

export const getEditMaterialDataLoaded = pipe(
  select(getEditMaterialData),
  filter((editMaterial) => !!editMaterial),
  filter(
    (editMaterial) =>
      !editMaterial.standardDocumentsLoading &&
      !editMaterial.materialNamesLoading &&
      !editMaterial.supplierIdsLoading
  ),
  filter((editMaterial) => editMaterial.loadingComplete),
  map((editMaterial) =>
    editMaterial.standardDocumentsLoading !== undefined &&
    editMaterial.materialNamesLoading !== undefined &&
    editMaterial.supplierIdsLoading !== undefined
      ? editMaterial
      : undefined
  )
);
