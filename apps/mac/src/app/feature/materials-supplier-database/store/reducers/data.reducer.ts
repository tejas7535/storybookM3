/* eslint-disable max-lines */
import { Action, createReducer, on } from '@ngrx/store';

import { StringOption } from '@schaeffler/inputs';

import {
  DataResult,
  ManufacturerSupplier,
  MaterialStandard,
} from '../../models';
import {
  addMaterialDialogCanceled,
  addMaterialDialogConfirmed,
  addMaterialDialogOpened,
  createMaterialComplete,
  fetchCastingModesFailure,
  fetchCastingModesSuccess,
  fetchCategoryOptionsFailure,
  fetchCategoryOptionsSuccess,
  fetchClassAndCategoryOptions,
  fetchClassOptionsFailure,
  fetchClassOptionsSuccess,
  fetchCo2ClassificationsFailure,
  fetchCo2ClassificationsSuccess,
  fetchManufacturerSuppliersFailure,
  fetchManufacturerSuppliersSuccess,
  fetchMaterials,
  fetchMaterialsFailure,
  fetchMaterialsSuccess,
  fetchMaterialStandardsFailure,
  fetchMaterialStandardsSuccess,
  fetchRatingsFailure,
  fetchRatingsSuccess,
  fetchSteelMakingProcessesFailure,
  fetchSteelMakingProcessesSuccess,
  resetResult,
  setAgGridColumns,
  setAgGridFilter,
  setFilter,
} from '../actions';

export interface DataState {
  filter: {
    materialClass: StringOption;
    productCategory: StringOption[];
    agGridFilter: string;
    loading: boolean;
  };
  agGridColumns: string;
  materialClassOptions: StringOption[];
  productCategoryOptions: StringOption[];
  materialClassLoading: boolean;
  productCategoryLoading: boolean;
  result: DataResult[];
  addMaterialDialog: {
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
      materialStandardsLoading: boolean;
      manufacturerSuppliers: ManufacturerSupplier[];
      manufacturerSuppliersLoading: boolean;
      ratings: string[];
      ratingsLoading: boolean;
      steelMakingProcesses: string[];
      steelMakingProcessesLoading: boolean;
      co2Classifications: StringOption[];
      co2ClassificationsLoading: boolean;
      castingModes: string[];
      castingModesLoading: boolean;
      loading: boolean;
    };
    createMaterial: {
      createMaterialLoading: boolean;
      createMaterialSuccess: boolean;
    };
  };
}

export const initialState: DataState = {
  filter: {
    materialClass: undefined,
    productCategory: undefined,
    agGridFilter: JSON.stringify({}),
    loading: undefined,
  },
  agGridColumns: undefined,
  materialClassOptions: [],
  productCategoryOptions: [],
  materialClassLoading: undefined,
  productCategoryLoading: undefined,
  result: undefined,
  addMaterialDialog: {
    manufacturerSupplier: undefined,
    materialStandard: undefined,
    dialogOptions: undefined,
    createMaterial: undefined,
  },
};

export const dataReducer = createReducer(
  initialState,
  on(
    setFilter,
    (state, { materialClass, productCategory }): DataState => ({
      ...state,
      filter: {
        ...state.filter,
        materialClass,
        productCategory,
      },
    })
  ),
  on(
    fetchMaterials,
    (state): DataState => ({
      ...state,
      filter: {
        ...state.filter,
        loading: true,
      },
    })
  ),
  on(
    fetchMaterialsSuccess,
    (state, { result }): DataState => ({
      ...state,
      filter: {
        ...state.filter,
        loading: false,
      },
      result,
    })
  ),
  on(
    fetchMaterialsFailure,
    (state): DataState => ({
      ...state,
      filter: {
        ...state.filter,
        loading: false,
      },
    })
  ),
  on(
    setAgGridFilter,
    (state, { filterModel }): DataState => ({
      ...state,
      filter: {
        ...state.filter,
        agGridFilter: filterModel
          ? JSON.stringify(filterModel)
          : initialState.filter.agGridFilter,
      },
    })
  ),
  on(
    fetchClassAndCategoryOptions,
    (state): DataState => ({
      ...state,
      materialClassLoading: true,
      productCategoryLoading: true,
      materialClassOptions: undefined,
      productCategoryOptions: undefined,
    })
  ),
  on(
    fetchClassOptionsSuccess,
    (state, { materialClassOptions }): DataState => ({
      ...state,
      materialClassOptions,
      materialClassLoading: false,
    })
  ),
  on(
    fetchClassOptionsFailure,
    (state): DataState => ({
      ...state,
      materialClassOptions: undefined,
      materialClassLoading: false,
    })
  ),
  on(
    fetchCategoryOptionsSuccess,
    (state, { productCategoryOptions }): DataState => ({
      ...state,
      productCategoryOptions,
      productCategoryLoading: false,
    })
  ),
  on(
    fetchCategoryOptionsFailure,
    (state): DataState => ({
      ...state,
      productCategoryOptions: undefined,
      productCategoryLoading: false,
    })
  ),
  on(
    resetResult,
    (state): DataState => ({
      ...state,
      result: undefined,
    })
  ),
  on(
    setAgGridColumns,
    (state, { agGridColumns }): DataState => ({
      ...state,
      agGridColumns,
    })
  ),
  on(
    addMaterialDialogCanceled,
    (state): DataState => ({
      ...state,
      addMaterialDialog: {
        ...state.addMaterialDialog,
        dialogOptions: {
          ...state.addMaterialDialog.dialogOptions,
          materialStandards: undefined,
          manufacturerSuppliers: undefined,
          ratings: undefined,
          steelMakingProcesses: undefined,
          co2Classifications: undefined,
          castingModes: undefined,
        },
      },
    })
  ),
  on(
    addMaterialDialogOpened,
    (state): DataState => ({
      ...state,
      addMaterialDialog: {
        ...state.addMaterialDialog,
        dialogOptions: {
          ...state.addMaterialDialog.dialogOptions,
          materialStandardsLoading: true,
          manufacturerSuppliersLoading: true,
          ratingsLoading: true,
          steelMakingProcessesLoading: true,
          co2ClassificationsLoading: true,
          castingModesLoading: true,
        },
      },
    })
  ),
  on(
    fetchMaterialStandardsSuccess,
    (state, { materialStandards }): DataState => ({
      ...state,
      addMaterialDialog: {
        ...state.addMaterialDialog,
        dialogOptions: {
          ...state.addMaterialDialog.dialogOptions,
          materialStandards,
          materialStandardsLoading: false,
        },
      },
    })
  ),
  on(
    fetchMaterialStandardsFailure,
    (state): DataState => ({
      ...state,
      addMaterialDialog: {
        ...state.addMaterialDialog,
        dialogOptions: {
          ...state.addMaterialDialog.dialogOptions,
          materialStandards: undefined,
          materialStandardsLoading: undefined,
        },
      },
    })
  ),
  on(
    fetchManufacturerSuppliersSuccess,
    (state, { manufacturerSuppliers }): DataState => ({
      ...state,
      addMaterialDialog: {
        ...state.addMaterialDialog,
        dialogOptions: {
          ...state.addMaterialDialog.dialogOptions,
          manufacturerSuppliers,
          manufacturerSuppliersLoading: false,
        },
      },
    })
  ),
  on(
    fetchManufacturerSuppliersFailure,
    (state): DataState => ({
      ...state,
      addMaterialDialog: {
        ...state.addMaterialDialog,
        dialogOptions: {
          ...state.addMaterialDialog.dialogOptions,
          manufacturerSuppliers: undefined,
          manufacturerSuppliersLoading: undefined,
        },
      },
    })
  ),
  on(
    fetchRatingsSuccess,
    (state, { ratings }): DataState => ({
      ...state,
      addMaterialDialog: {
        ...state.addMaterialDialog,
        dialogOptions: {
          ...state.addMaterialDialog.dialogOptions,
          ratings,
          ratingsLoading: false,
        },
      },
    })
  ),
  on(
    fetchRatingsFailure,
    (state): DataState => ({
      ...state,
      addMaterialDialog: {
        ...state.addMaterialDialog,
        dialogOptions: {
          ...state.addMaterialDialog.dialogOptions,
          ratings: undefined,
          ratingsLoading: undefined,
        },
      },
    })
  ),
  on(
    fetchSteelMakingProcessesSuccess,
    (state, { steelMakingProcesses }): DataState => ({
      ...state,
      addMaterialDialog: {
        ...state.addMaterialDialog,
        dialogOptions: {
          ...state.addMaterialDialog.dialogOptions,
          steelMakingProcesses,
          steelMakingProcessesLoading: false,
        },
      },
    })
  ),
  on(
    fetchSteelMakingProcessesFailure,
    (state): DataState => ({
      ...state,
      addMaterialDialog: {
        ...state.addMaterialDialog,
        dialogOptions: {
          ...state.addMaterialDialog.dialogOptions,
          steelMakingProcesses: undefined,
          steelMakingProcessesLoading: undefined,
        },
      },
    })
  ),
  on(
    fetchCo2ClassificationsSuccess,
    (state, { co2Classifications }): DataState => ({
      ...state,
      addMaterialDialog: {
        ...state.addMaterialDialog,
        dialogOptions: {
          ...state.addMaterialDialog.dialogOptions,
          co2Classifications,
          co2ClassificationsLoading: false,
        },
      },
    })
  ),
  on(
    fetchCo2ClassificationsFailure,
    (state): DataState => ({
      ...state,
      addMaterialDialog: {
        ...state.addMaterialDialog,
        dialogOptions: {
          ...state.addMaterialDialog.dialogOptions,
          co2Classifications: undefined,
          co2ClassificationsLoading: undefined,
        },
      },
    })
  ),
  on(
    fetchCastingModesSuccess,
    (state, { castingModes }): DataState => ({
      ...state,
      addMaterialDialog: {
        ...state.addMaterialDialog,
        dialogOptions: {
          ...state.addMaterialDialog.dialogOptions,
          castingModes,
          castingModesLoading: false,
        },
      },
    })
  ),
  on(
    fetchCastingModesFailure,
    (state): DataState => ({
      ...state,
      addMaterialDialog: {
        ...state.addMaterialDialog,
        dialogOptions: {
          ...state.addMaterialDialog.dialogOptions,
          castingModes: undefined,
          castingModesLoading: undefined,
        },
      },
    })
  ),
  on(
    addMaterialDialogConfirmed,
    (state): DataState => ({
      ...state,
      addMaterialDialog: {
        ...state.addMaterialDialog,
        createMaterial: {
          createMaterialLoading: true,
          createMaterialSuccess: undefined,
        },
      },
    })
  ),
  on(
    createMaterialComplete,
    (state, { success }): DataState => ({
      ...state,
      addMaterialDialog: {
        ...state.addMaterialDialog,
        createMaterial: {
          createMaterialLoading: false,
          createMaterialSuccess: success,
        },
      },
    })
  )
);

export function reducer(state: DataState, action: Action): DataState {
  return dataReducer(state, action);
}
