/* eslint-disable max-lines */
import { Action, createReducer, on } from '@ngrx/store';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import {
  AluminumMaterial,
  ManufacturerSupplierTableValue,
  MaterialStandardTableValue,
  MaterialV2,
  PolymerMaterial,
  SteelMaterial,
} from '@mac/msd/models';
import {
  fetchClassOptions,
  fetchClassOptionsFailure,
  fetchClassOptionsSuccess,
  fetchManufacturerSuppliers,
  fetchManufacturerSuppliersFailure,
  fetchManufacturerSuppliersSuccess,
  fetchMaterials,
  fetchMaterialsFailure,
  fetchMaterialsSuccess,
  fetchMaterialStandards,
  fetchMaterialStandardsFailure,
  fetchMaterialStandardsSuccess,
  resetResult,
  setAgGridColumns,
  setAgGridFilter,
  setNavigation,
} from '@mac/msd/store/actions/data';

export interface DataState {
  filter: {
    agGridFilter: string;
    loading: boolean;
  };
  navigation: {
    materialClass: MaterialClass;
    navigationLevel: NavigationLevel;
  };
  agGridColumns: string;
  materialClasses: MaterialClass[];
  materialClassLoading: boolean;
  materials: {
    aluminumMaterials: AluminumMaterial[];
    steelMaterials: SteelMaterial[];
    polymerMaterials: PolymerMaterial[];
  };
  result: {
    [key in MaterialClass]?: {
      [NavigationLevel.MATERIAL]?: MaterialV2[];
      [NavigationLevel.SUPPLIER]?: ManufacturerSupplierTableValue[];
      [NavigationLevel.STANDARD]?: MaterialStandardTableValue[];
    };
  };
}

export const initialState: DataState = {
  filter: {
    agGridFilter: JSON.stringify({}),
    loading: undefined,
  },
  navigation: {
    materialClass: undefined,
    navigationLevel: undefined,
  },
  agGridColumns: undefined,
  materialClasses: [],
  materialClassLoading: undefined,
  materials: {
    aluminumMaterials: undefined,
    steelMaterials: undefined,
    polymerMaterials: undefined,
  },
  result: {},
};

export const dataReducer = createReducer(
  initialState,
  on(
    setNavigation,
    (state, { materialClass, navigationLevel }): DataState => ({
      ...state,
      navigation: {
        ...state.navigation,
        materialClass,
        navigationLevel,
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
    (state, { materialClass, result }): DataState => ({
      ...state,
      filter: {
        ...state.filter,
        loading: false,
      },
      result: {
        ...state.result,
        [materialClass]: {
          ...state.result[materialClass],
          materials: result,
        },
      },
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
    fetchManufacturerSuppliers,
    (state): DataState => ({
      ...state,
      filter: {
        ...state.filter,
        loading: true,
      },
    })
  ),
  on(
    fetchManufacturerSuppliersSuccess,
    (state, { materialClass, manufacturerSuppliers }): DataState => ({
      ...state,
      filter: {
        ...state.filter,
        loading: false,
      },
      result: {
        ...state.result,
        [materialClass]: {
          ...state.result[materialClass],
          suppliers: manufacturerSuppliers,
        },
      },
    })
  ),
  on(
    fetchManufacturerSuppliersFailure,
    (state): DataState => ({
      ...state,
      filter: {
        ...state.filter,
        loading: false,
      },
    })
  ),
  on(
    fetchMaterialStandards,
    (state): DataState => ({
      ...state,
      filter: {
        ...state.filter,
        loading: true,
      },
    })
  ),
  on(
    fetchMaterialStandardsSuccess,
    (state, { materialClass, materialStandards }): DataState => ({
      ...state,
      filter: {
        ...state.filter,
        loading: false,
      },
      result: {
        ...state.result,
        [materialClass]: {
          ...state.result[materialClass],
          materialStandards,
        },
      },
    })
  ),
  on(
    fetchMaterialStandardsFailure,
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
    fetchClassOptions,
    (state): DataState => ({
      ...state,
      materialClassLoading: true,
      materialClasses: undefined,
    })
  ),
  on(
    fetchClassOptionsSuccess,
    (state, { materialClasses }): DataState => ({
      ...state,
      materialClasses,
      materialClassLoading: false,
    })
  ),
  on(
    fetchClassOptionsFailure,
    (state): DataState => ({
      ...state,
      materialClasses: undefined,
      materialClassLoading: false,
    })
  ),
  on(
    resetResult,
    (state): DataState => ({
      ...state,
      materials: {
        aluminumMaterials: undefined,
        steelMaterials: undefined,
        polymerMaterials: undefined,
      },
      result: {},
    })
  ),
  on(
    setAgGridColumns,
    (state, { agGridColumns }): DataState => ({
      ...state,
      agGridColumns,
    })
  )
);

export function reducer(state: DataState, action: Action): DataState {
  return dataReducer(state, action);
}
