/* eslint-disable max-lines */

import { Action, createReducer, on } from '@ngrx/store';

import { StringOption } from '@schaeffler/inputs';

import {
  CreateMaterialRecord,
  DataResult,
  ManufacturerSupplierV2,
  MaterialFormValue,
  MaterialStandardV2,
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
  materialDialogCanceled,
  materialDialogConfirmed,
  minimizeDialog,
  openDialog,
  openEditDialog,
  postManufacturerSupplier,
  postMaterial,
  resetCo2ValuesForSupplierSteelMakingProcess,
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
    materialStandards: MaterialStandardV2[];
    customMaterialStandardNames: string[];
    customMaterialStandardDocuments: string[];
    materialStandardsLoading: boolean;
    manufacturerSuppliers: ManufacturerSupplierV2[];
    customManufacturerSupplierNames: string[];
    customManufacturerSupplierPlants: string[];
    customManufacturerSupplierCountries: string[];
    manufacturerSuppliersLoading: boolean;
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
      },
    })
  ),
  // either error while creating or successfully created materiel record
  on(createMaterialComplete, (state, { record }): DialogState => {
    // reset loading state
    let newState: DialogState = {
      ...state,
      createMaterial: {
        createMaterialLoading: false,
        createMaterialRecord: record,
      },
    };
    // only reset properties if call was successful
    if (!record.error) {
      newState = {
        ...newState,
        dialogOptions: {
          ...newState.dialogOptions,
          co2Values: undefined,
          steelMakingProcessesInUse: [],
          castingDiameters: undefined,
          customCastingDiameters: undefined,
          referenceDocuments: undefined,
          customReferenceDocuments: undefined,
          error: undefined,
        },
        editMaterial: undefined,
        minimizedDialog: undefined,
      };
    }

    return newState;
  }),

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
    (state, { id, value }): DialogState => ({
      ...state,
      minimizedDialog: {
        id,
        value,
      },
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
