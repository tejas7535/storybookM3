import { Action, createReducer, on } from '@ngrx/store';

import { StringOption } from '@schaeffler/inputs';

import {
  CreateMaterialRecord,
  ManufacturerSupplier,
  MaterialStandard,
} from '@mac/msd/models';
// TODO: clean import
import {
  addCustomCastingDiameter,
  addCustomMaterialStandardDocument,
  addCustomMaterialStandardName,
  addCustomSupplierName,
  addCustomSupplierPlant,
  addMaterialDialogCanceled,
  addMaterialDialogConfirmed,
  addMaterialDialogOpened,
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
  fetchSteelMakingProcessesFailure,
  fetchSteelMakingProcessesSuccess,
} from '@mac/msd/store/actions/dialog';

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
}

export const initialState: DialogState = {
  manufacturerSupplier: undefined,
  materialStandard: undefined,
  dialogOptions: undefined,
  createMaterial: undefined,
};

export const dialogReducer = createReducer(
  initialState,
  on(
    addMaterialDialogCanceled,
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
      },
    })
  ),
  on(
    addMaterialDialogOpened,
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
    addMaterialDialogConfirmed,
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
  })
);

export function reducer(state: DialogState, action: Action): DialogState {
  return dialogReducer(state, action);
}
