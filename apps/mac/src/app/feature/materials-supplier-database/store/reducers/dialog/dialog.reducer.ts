/* eslint-disable max-lines */

import { Action, createReducer, on } from '@ngrx/store';

import { StringOption } from '@schaeffler/inputs';

import {
  CreateMaterialRecord,
  DataResult,
  ManufacturerSupplier,
  MaterialFormValue,
  MaterialStandard,
} from '@mac/msd/models';
// TODO: clean import
import {
  addCustomCastingDiameter,
  addCustomMaterialStandardDocument,
  addCustomMaterialStandardName,
  addCustomReferenceDocument,
  addCustomSupplierCountry,
  addCustomSupplierName,
  addCustomSupplierPlant,
  addCustomSupplierSapId,
  cleanMinimizeDialog,
  createMaterialComplete,
  editDialogLoadingComplete,
  fetchCastingDiameters,
  fetchCastingDiametersFailure,
  fetchCastingDiametersSuccess,
  fetchCastingModes,
  fetchCastingModesFailure,
  fetchCastingModesSuccess,
  fetchCo2ClassificationsFailure,
  fetchCo2ClassificationsSuccess,
  fetchCo2ValuesForSupplierSteelMakingProcessFailure,
  fetchCo2ValuesForSupplierSteelMakingProcessSuccess,
  fetchCoatings,
  fetchCoatingsFailure,
  fetchCoatingsSuccess,
  fetchConditions,
  fetchConditionsFailure,
  fetchConditionsSuccess,
  fetchEditMaterialNameDataFailure,
  fetchEditMaterialNameDataSuccess,
  fetchEditMaterialSuppliersFailure,
  fetchEditMaterialSuppliersSuccess,
  fetchEditStandardDocumentDataFailure,
  fetchEditStandardDocumentDataSuccess,
  fetchManufacturerSuppliersFailure,
  fetchManufacturerSuppliersSuccess,
  fetchMaterialStandardsFailure,
  fetchMaterialStandardsSuccess,
  fetchProductCategories,
  fetchProductCategoriesFailure,
  fetchProductCategoriesSuccess,
  fetchProductionProcesses,
  fetchProductionProcessesFailure,
  fetchProductionProcessesSuccess,
  fetchRatings,
  fetchRatingsFailure,
  fetchRatingsSuccess,
  fetchReferenceDocuments,
  fetchReferenceDocumentsFailure,
  fetchReferenceDocumentsSuccess,
  fetchSteelMakingProcesses,
  fetchSteelMakingProcessesFailure,
  fetchSteelMakingProcessesInUseFailure,
  fetchSteelMakingProcessesInUseSuccess,
  fetchSteelMakingProcessesSuccess,
  manufacturerSupplierDialogOpened,
  materialDialogCanceled,
  materialDialogConfirmed,
  materialstandardDialogOpened,
  minimizeDialog,
  openDialog,
  openEditDialog,
  postManufacturerSupplier,
  postMaterial,
  resetCo2ValuesForSupplierSteelMakingProcess,
  resetDialogOptions,
  resetMaterialRecord,
  resetSteelMakingProcessInUse,
  setMaterialFormValue,
} from '@mac/msd/store/actions/dialog';

export interface DialogState {
  manufacturerSupplier: {
    name: string;
    plant: string;
    country: string;
  };
  materialStandard: {
    materialName: string;
    standardDocument: string;
    materialNumber: string[];
  };
  dialogOptions: {
    materialStandards: MaterialStandard[];
    customMaterialStandardNames: string[];
    customMaterialStandardDocuments: string[];
    materialStandardsLoading: boolean;
    manufacturerSuppliers: ManufacturerSupplier[];
    customManufacturerSupplierNames: string[];
    customManufacturerSupplierPlants: string[];
    customManufacturerSupplierCountries: string[];
    customManufacturerSupplierSapIds: string[];
    manufacturerSuppliersLoading: boolean;
    conditions: StringOption[];
    conditionsLoading: boolean;
    coatings: StringOption[];
    coatingsLoading: boolean;
    productCategories: StringOption[];
    productCategoriesLoading: boolean;
    productionProcesses: StringOption[];
    productionProcessesLoading: boolean;
    referenceDocuments: string[];
    referenceDocumentsLoading: boolean;
    customReferenceDocuments: string[];
    ratings: string[];
    ratingsLoading: boolean;
    steelMakingProcesses: string[];
    steelMakingProcessesLoading: boolean;
    co2Classifications: StringOption[];
    co2ClassificationsLoading: boolean;
    castingModes: string[];
    castingModesLoading: boolean;
    castingDiameters: string[];
    castingDiametersLoading: boolean;
    customCastingDiameters: string[];
    co2Values: {
      co2PerTon: number;
      co2Scope1: number;
      co2Scope2: number;
      co2Scope3: number;
      co2Classification: string;
    }[];
    steelMakingProcessesInUse: string[];
    loading: boolean;
    error: boolean;
  };
  createMaterial: {
    createMaterialLoading: boolean;
    createMaterialRecord: CreateMaterialRecord;
  };
  editMaterial?: {
    row: DataResult;
    parsedMaterial: Partial<MaterialFormValue>;
    column: string;
    standardDocuments: { id: number; standardDocument: string }[];
    standardDocumentsLoading: boolean;
    materialNames: { id: number; materialName: string }[];
    materialNamesLoading: boolean;
    supplierIds: number[];
    supplierIdsLoading: boolean;
    loadingComplete: boolean;
  };
  minimizedDialog?: {
    id?: number;
    value: Partial<MaterialFormValue>;
    isCopy?: boolean;
  };
}

export const initialState: DialogState = {
  manufacturerSupplier: undefined,
  materialStandard: undefined,
  dialogOptions: undefined,
  createMaterial: undefined,
  editMaterial: undefined,
  minimizedDialog: undefined,
};

export const dialogReducer = createReducer(
  initialState,
  on(
    materialDialogCanceled,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        materialStandards: undefined,
        manufacturerSuppliers: undefined,
        ratings: undefined,
        steelMakingProcesses: undefined,
        productionProcesses: undefined,
        productCategories: undefined,
        co2Classifications: undefined,
        castingModes: undefined,
        castingDiameters: undefined,
        referenceDocuments: undefined,
        co2Values: undefined,
        steelMakingProcessesInUse: [],
        error: undefined,
      },
      editMaterial: undefined,
      minimizedDialog: undefined,
    })
  ),
  // open dialog will be called for every dialog
  // this is still required to set the loading spinner!
  on(
    openDialog,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        materialStandardsLoading: true,
        manufacturerSuppliersLoading: true,
        co2ClassificationsLoading: true,
        error: undefined,
      },
    })
  ),
  on(
    materialstandardDialogOpened,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        materialStandardsLoading: true,
        manufacturerSuppliersLoading: false,
        co2ClassificationsLoading: false,
        error: undefined,
      },
    })
  ),
  on(
    manufacturerSupplierDialogOpened,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        materialStandardsLoading: false,
        manufacturerSuppliersLoading: true,
        co2ClassificationsLoading: false,
        error: undefined,
      },
    })
  ),

  on(
    fetchRatings,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        ratingsLoading: true,
      },
    })
  ),
  on(
    fetchSteelMakingProcesses,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        steelMakingProcessesLoading: true,
      },
    })
  ),
  on(
    fetchProductionProcesses,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        productionProcessesLoading: true,
      },
    })
  ),
  on(
    fetchCastingModes,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        castingModesLoading: true,
      },
    })
  ),
  on(
    fetchMaterialStandardsSuccess,
    (state, { materialStandards }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        materialStandards,
        materialStandardsLoading: false,
      },
    })
  ),
  on(
    fetchMaterialStandardsFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        materialStandards: undefined,
        materialStandardsLoading: undefined,
        error: true,
      },
    })
  ),
  on(
    fetchManufacturerSuppliersSuccess,
    (state, { manufacturerSuppliers }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        manufacturerSuppliers,
        manufacturerSuppliersLoading: false,
      },
    })
  ),
  on(
    fetchManufacturerSuppliersFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        manufacturerSuppliers: undefined,
        manufacturerSuppliersLoading: undefined,
        error: true,
      },
    })
  ),
  on(
    fetchProductCategories,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        productCategories: undefined,
        productCategoriesLoading: true,
      },
    })
  ),
  on(
    fetchProductCategoriesSuccess,
    (state, { productCategories }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        productCategories,
        productCategoriesLoading: false,
      },
    })
  ),
  on(
    fetchProductCategoriesFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        productCategories: undefined,
        productCategoriesLoading: undefined,
        error: true,
      },
    })
  ),
  on(
    fetchCastingDiameters,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        castingDiameters: [],
        castingDiametersLoading: true,
      },
    })
  ),
  on(
    fetchCastingDiametersSuccess,
    (state, { castingDiameters }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        castingDiameters,
        castingDiametersLoading: false,
      },
    })
  ),
  on(
    fetchCastingDiametersFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        castingDiameters: [],
        castingDiametersLoading: undefined,
        error: true,
      },
    })
  ),
  on(
    fetchReferenceDocuments,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        referenceDocuments: [],
        referenceDocumentsLoading: true,
      },
    })
  ),
  on(
    fetchReferenceDocumentsSuccess,
    (state, { referenceDocuments }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        referenceDocuments,
        referenceDocumentsLoading: false,
      },
    })
  ),
  on(
    fetchReferenceDocumentsFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        referenceDocuments: [],
        referenceDocumentsLoading: undefined,
        error: true,
      },
    })
  ),
  on(
    fetchRatingsSuccess,
    (state, { ratings }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        ratings,
        ratingsLoading: false,
      },
    })
  ),
  on(
    fetchRatingsFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        ratings: undefined,
        ratingsLoading: undefined,
        error: true,
      },
    })
  ),
  on(
    fetchSteelMakingProcessesSuccess,
    (state, { steelMakingProcesses }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        steelMakingProcesses,
        steelMakingProcessesLoading: false,
      },
    })
  ),
  on(
    fetchSteelMakingProcessesFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        steelMakingProcesses: undefined,
        steelMakingProcessesLoading: undefined,
        error: true,
      },
    })
  ),
  on(
    fetchProductionProcessesSuccess,
    (state, { productionProcesses }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        productionProcesses,
        productionProcessesLoading: false,
      },
    })
  ),
  on(
    fetchProductionProcessesFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        productionProcesses: undefined,
        productionProcessesLoading: undefined,
        error: true,
      },
    })
  ),
  on(
    fetchCo2ClassificationsSuccess,
    (state, { co2Classifications }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        co2Classifications,
        co2ClassificationsLoading: false,
      },
    })
  ),
  on(
    fetchCo2ClassificationsFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        co2Classifications: undefined,
        co2ClassificationsLoading: undefined,
        error: true,
      },
    })
  ),
  on(
    fetchCastingModesSuccess,
    (state, { castingModes }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        castingModes,
        castingModesLoading: false,
      },
    })
  ),
  on(
    fetchCastingModesFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        castingModes: undefined,
        castingModesLoading: undefined,
        error: true,
      },
    })
  ),

  on(
    fetchConditions,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        conditions: undefined,
        conditionsLoading: true,
      },
    })
  ),
  on(
    fetchConditionsSuccess,
    (state, { conditions }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        conditions,
        conditionsLoading: false,
      },
    })
  ),
  on(
    fetchConditionsFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        conditions: undefined,
        conditionsLoading: undefined,
        error: true,
      },
    })
  ),

  on(
    fetchCoatings,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        coatings: undefined,
        coatingsLoading: true,
      },
    })
  ),
  on(
    fetchCoatingsSuccess,
    (state, { coatings }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        coatings,
        coatingsLoading: false,
      },
    })
  ),
  on(
    fetchCoatingsFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        coatings: undefined,
        coatingsLoading: undefined,
        error: true,
      },
    })
  ),

  on(
    materialDialogConfirmed,
    (state): DialogState => ({
      ...state,
      createMaterial: {
        createMaterialLoading: true,
        createMaterialRecord: undefined,
      },
    })
  ),
  on(
    postManufacturerSupplier,
    (state): DialogState => ({
      // successfully create material Standard
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        customMaterialStandardNames: undefined,
        customMaterialStandardDocuments: undefined,
      },
    })
  ),
  on(
    postMaterial,
    (state): DialogState => ({
      // successfully create manufacturer Supplier
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        customManufacturerSupplierNames: undefined,
        customManufacturerSupplierPlants: undefined,
        customManufacturerSupplierCountries: undefined,
        customManufacturerSupplierSapIds: undefined,
      },
    })
  ),
  // either error while creating or successfully created materiel record
  on(
    createMaterialComplete,
    (state, { record }): DialogState => ({
      // reset loading state
      ...state,
      createMaterial: {
        createMaterialLoading: false,
        createMaterialRecord: record,
      },
    })
  ),

  on(
    resetMaterialRecord,
    (state): DialogState => ({
      ...state,
      createMaterial: undefined,
    })
  ),

  on(
    resetDialogOptions,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        // reset custom fields
        customCastingDiameters: undefined,
        customReferenceDocuments: undefined,
        customMaterialStandardDocuments: undefined,
        customManufacturerSupplierNames: undefined,
        customManufacturerSupplierPlants: undefined,
        customManufacturerSupplierCountries: undefined,
        customManufacturerSupplierSapIds: undefined,
        customMaterialStandardNames: undefined,
        // reset loading fields
        co2Values: undefined,
        steelMakingProcessesInUse: [],
        castingDiameters: undefined,
        referenceDocuments: undefined,
        error: undefined,
      },
      // other fields
      editMaterial: undefined,
      minimizedDialog: undefined,
    })
  ),

  on(addCustomCastingDiameter, (state, { castingDiameter }): DialogState => {
    const customCastingDiameters = state.dialogOptions.customCastingDiameters
      ? [...state.dialogOptions.customCastingDiameters]
      : [];
    customCastingDiameters.unshift(castingDiameter);

    return {
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        customCastingDiameters,
      },
    };
  }),

  on(
    addCustomReferenceDocument,
    (state, { referenceDocument }): DialogState => {
      const customReferenceDocuments = state.dialogOptions
        .customReferenceDocuments
        ? [...state.dialogOptions.customReferenceDocuments]
        : [];
      customReferenceDocuments.unshift(referenceDocument);

      return {
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customReferenceDocuments,
        },
      };
    }
  ),

  on(
    addCustomMaterialStandardDocument,
    (state, { standardDocument }): DialogState => {
      const stdDoc = state.dialogOptions.customMaterialStandardDocuments
        ? [...state.dialogOptions.customMaterialStandardDocuments]
        : [];
      stdDoc.unshift(standardDocument);

      return {
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customMaterialStandardDocuments: stdDoc,
        },
      };
    }
  ),

  on(addCustomMaterialStandardName, (state, { materialName }): DialogState => {
    const matNames = state.dialogOptions.customMaterialStandardNames
      ? [...state.dialogOptions.customMaterialStandardNames]
      : [];
    matNames.unshift(materialName);

    return {
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        customMaterialStandardNames: matNames,
      },
    };
  }),

  on(addCustomSupplierName, (state, { supplierName }): DialogState => {
    const manufNames = state.dialogOptions.customManufacturerSupplierNames
      ? [...state.dialogOptions.customManufacturerSupplierNames]
      : [];
    manufNames.unshift(supplierName);

    return {
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        customManufacturerSupplierNames: manufNames,
      },
    };
  }),

  on(addCustomSupplierPlant, (state, { supplierPlant }): DialogState => {
    const manufPlants = state.dialogOptions.customManufacturerSupplierPlants
      ? [...state.dialogOptions.customManufacturerSupplierPlants]
      : [];
    manufPlants.unshift(supplierPlant);

    return {
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        customManufacturerSupplierPlants: manufPlants,
      },
    };
  }),

  on(addCustomSupplierCountry, (state, { supplierCountry }): DialogState => {
    const manufCountries = state.dialogOptions
      .customManufacturerSupplierCountries
      ? [...state.dialogOptions.customManufacturerSupplierCountries]
      : [];
    manufCountries.unshift(supplierCountry);

    return {
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        customManufacturerSupplierCountries: manufCountries,
      },
    };
  }),

  on(addCustomSupplierSapId, (state, { supplierSapId }): DialogState => {
    const manufSapIds = state.dialogOptions.customManufacturerSupplierSapIds
      ? [...state.dialogOptions.customManufacturerSupplierSapIds]
      : [];
    manufSapIds.unshift(supplierSapId);

    return {
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        customManufacturerSupplierSapIds: manufSapIds,
      },
    };
  }),

  on(
    openEditDialog,
    (state, { row, column }): DialogState => ({
      ...state,
      editMaterial: {
        ...state.editMaterial,
        row,
        column,
        materialNames: undefined,
        materialNamesLoading: true,
        standardDocuments: undefined,
        standardDocumentsLoading: true,
        supplierIds: undefined,
        supplierIdsLoading: true,
        loadingComplete: false,
      },
    })
  ),

  on(
    setMaterialFormValue,
    (state, { parsedMaterial }): DialogState => ({
      ...state,
      editMaterial: {
        ...state.editMaterial,
        parsedMaterial,
      },
    })
  ),

  on(
    fetchEditMaterialNameDataSuccess,
    (state, { standardDocuments }): DialogState => ({
      ...state,
      editMaterial: {
        ...state.editMaterial,
        standardDocuments,
        standardDocumentsLoading: false,
      },
    })
  ),

  on(
    fetchEditMaterialNameDataFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        error: true,
      },
      editMaterial: {
        ...state.editMaterial,
        standardDocuments: undefined,
        standardDocumentsLoading: undefined,
      },
    })
  ),

  on(
    fetchEditStandardDocumentDataSuccess,
    (state, { materialNames }): DialogState => ({
      ...state,
      editMaterial: {
        ...state.editMaterial,
        materialNames,
        materialNamesLoading: false,
      },
    })
  ),

  on(
    fetchEditStandardDocumentDataFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        error: true,
      },
      editMaterial: {
        ...state.editMaterial,
        materialNames: undefined,
        materialNamesLoading: undefined,
      },
    })
  ),

  on(
    fetchEditMaterialSuppliersSuccess,
    (state, { supplierIds }): DialogState => ({
      ...state,
      editMaterial: {
        ...state.editMaterial,
        supplierIds,
        supplierIdsLoading: false,
      },
    })
  ),

  on(
    fetchEditMaterialSuppliersFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        error: true,
      },
      editMaterial: {
        ...state.editMaterial,
        supplierIds: undefined,
        supplierIdsLoading: undefined,
      },
    })
  ),

  on(
    editDialogLoadingComplete,
    (state): DialogState => ({
      ...state,
      editMaterial: {
        ...state.editMaterial,
        loadingComplete: true,
      },
    })
  ),

  on(
    minimizeDialog,
    (state, { id, value, isCopy }): DialogState => ({
      ...state,
      minimizedDialog: {
        id,
        value,
        isCopy,
      },
    })
  ),

  on(
    cleanMinimizeDialog,
    (state): DialogState => ({
      ...state,
      minimizedDialog: undefined,
    })
  ),

  on(
    fetchSteelMakingProcessesInUseSuccess,
    (state, { steelMakingProcessesInUse }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        steelMakingProcessesInUse,
      },
    })
  ),
  on(
    fetchSteelMakingProcessesInUseFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        steelMakingProcessesInUse: [],
        error: true,
      },
    })
  ),
  on(
    resetSteelMakingProcessInUse,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        steelMakingProcessesInUse: [],
      },
    })
  ),

  on(
    fetchCo2ValuesForSupplierSteelMakingProcessSuccess,
    (state, { co2Values }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        co2Values,
      },
    })
  ),
  on(
    fetchCo2ValuesForSupplierSteelMakingProcessFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        co2Values: undefined,
        error: true,
      },
    })
  ),
  on(
    resetCo2ValuesForSupplierSteelMakingProcess,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        co2Values: undefined,
      },
    })
  )
);

export function reducer(state: DialogState, action: Action): DialogState {
  return dialogReducer(state, action);
}
