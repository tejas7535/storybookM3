/* eslint-disable max-lines */
import { Action, createReducer, on } from '@ngrx/store';

import { StringOption } from '@schaeffler/inputs';

import { DataResult } from '@mac/msd/models';
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
  result: DataResult[];
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
  )
);

export function reducer(state: DataState, action: Action): DataState {
  return dataReducer(state, action);
}
