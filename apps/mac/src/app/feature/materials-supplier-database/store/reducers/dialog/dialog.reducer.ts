/* eslint-disable max-lines */
import { Action, createReducer, on } from '@ngrx/store';

import { StringOption } from '@schaeffler/inputs';

import {
  CreateMaterialRecord,
  DataResult,
  ManufacturerSupplier,
  MaterialStandard,
} from '@mac/msd/models';
// TODO: clean import
import {
  addCustomCastingDiameter,
  addCustomMaterialStandardDocument,
  addCustomMaterialStandardName,
  addCustomReferenceDocument,
  addCustomSupplierName,
  addCustomSupplierPlant,
  createMaterialComplete,
  fetchCastingDiameters,
  fetchCastingDiametersFailure,
  fetchCastingDiametersSuccess,
  fetchCastingModesFailure,
  fetchCastingModesSuccess,
  fetchCo2ClassificationsFailure,
  fetchCo2ClassificationsSuccess,
  fetchManufacturerSuppliersFailure,
  fetchManufacturerSuppliersSuccess,
  fetchMaterialStandardsFailure,
  fetchMaterialStandardsSuccess,
  fetchRatingsFailure,
  fetchRatingsSuccess,
  fetchReferenceDocuments,
  fetchReferenceDocumentsFailure,
  fetchReferenceDocumentsSuccess,
  fetchSteelMakingProcessesFailure,
  fetchSteelMakingProcessesSuccess,
  materialDialogCanceled,
  materialDialogConfirmed,
  materialDialogOpened,
  openEditDialog,
} from '@mac/msd/store/actions/dialog';

import {
  editDialogLoadingComplete,
  fetchEditMaterialNameDataFailure,
  fetchEditMaterialNameDataSuccess,
  fetchEditMaterialSuppliersFailure,
  fetchEditMaterialSuppliersSuccess,
  fetchEditStandardDocumentDataFailure,
  fetchEditStandardDocumentDataSuccess,
} from './../../actions/dialog/dialog.actions';

export interface DialogState {
  manufacturerSupplier: {
    name: string;
    plant: string;
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
    loading: boolean;
  };
  createMaterial: {
    createMaterialLoading: boolean;
    createMaterialRecord: CreateMaterialRecord;
  };
  editMaterial: {
    material: DataResult;
    column: string;
    standardDocuments: { id: number; standardDocument: string }[];
    standardDocumentsLoading: boolean;
    materialNames: { id: number; materialName: string }[];
    materialNamesLoading: boolean;
    supplierIds: number[];
    supplierIdsLoading: boolean;
    loadingComplete: boolean;
  };
}

export const initialState: DialogState = {
  manufacturerSupplier: undefined,
  materialStandard: undefined,
  dialogOptions: undefined,
  createMaterial: undefined,
  editMaterial: undefined,
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
        customCastingDiameters: undefined,
        referenceDocuments: undefined,
        customReferenceDocuments: undefined,
      },
      editMaterial: undefined,
    })
  ),
  on(
    materialDialogOpened,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        materialStandardsLoading: true,
        manufacturerSuppliersLoading: true,
        ratingsLoading: true,
        steelMakingProcessesLoading: true,
        co2ClassificationsLoading: true,
        castingModesLoading: true,
        customCastingDiameters: undefined,
        castingDiameters: undefined,
        referenceDocuments: undefined,
        customReferenceDocuments: undefined,
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
    createMaterialComplete,
    (state, { record }): DialogState => ({
      ...state,
      createMaterial: {
        createMaterialLoading: false,
        createMaterialRecord: record,
      },
      editMaterial: undefined,
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

  on(
    openEditDialog,
    (state, { material, column }): DialogState => ({
      ...state,
      editMaterial: {
        ...state.editMaterial,
        material,
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
  )
);

export function reducer(state: DialogState, action: Action): DialogState {
  return dialogReducer(state, action);
}
