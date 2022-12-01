/* eslint-disable max-lines */
import { Action, createReducer, on } from '@ngrx/store';

import { StringOption } from '@schaeffler/inputs';

import { MaterialClass } from '@mac/msd/constants';
import {
  AluminumMaterial,
  PolymerMaterial,
  SteelMaterial,
} from '@mac/msd/models';
import {
  fetchCategoryOptionsFailure,
  fetchCategoryOptionsSuccess,
  fetchClassAndCategoryOptions,
  fetchClassOptionsFailure,
  fetchClassOptionsSuccess,
  fetchMaterials,
  fetchMaterialsFailure,
  fetchMaterialsSuccess,
  resetResult,
  setAgGridColumns,
  setAgGridFilter,
  setFilter,
} from '@mac/msd/store/actions';

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
  materials: {
    aluminumMaterials: AluminumMaterial[];
    steelMaterials: SteelMaterial[];
    polymerMaterials: PolymerMaterial[];
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
  materials: {
    aluminumMaterials: undefined,
    steelMaterials: undefined,
    polymerMaterials: undefined,
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
  on(fetchMaterialsSuccess, (state, { materialClass, result }): DataState => {
    const newState = {
      ...state,
      filter: {
        ...state.filter,
        loading: false,
      },
    };
    switch (materialClass) {
      case MaterialClass.STEEL:
        return {
          ...newState,
          materials: {
            ...state.materials,
            steelMaterials: result as SteelMaterial[],
          },
        };
      case MaterialClass.ALUMINUM:
        return {
          ...newState,
          materials: {
            ...state.materials,
            aluminumMaterials: result as AluminumMaterial[],
          },
        };
      case MaterialClass.POLYMER:
        return {
          ...newState,
          materials: {
            ...state.materials,
            polymerMaterials: result as PolymerMaterial[],
          },
        };
      default:
        return {
          ...newState,
          materials: {
            ...state.materials,
            steelMaterials: result as SteelMaterial[],
          },
        };
    }
  }),
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
      materials: {
        aluminumMaterials: undefined,
        steelMaterials: undefined,
        polymerMaterials: undefined,
      },
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
