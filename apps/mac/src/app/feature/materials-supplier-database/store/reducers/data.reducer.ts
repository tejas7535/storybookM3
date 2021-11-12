import { Action, createReducer, on } from '@ngrx/store';

import { DataFilter, DataResult } from '../../models';
import {
  fetchMaterials,
  fetchMaterialsFailure,
  fetchMaterialsSuccess,
  setAgGridFilter,
  setFilter,
} from '../actions';
import {
  fetchCategoryOptionsFailure,
  fetchCategoryOptionsSuccess,
  fetchClassAndCategoryOptions,
  fetchClassOptionsFailure,
  fetchClassOptionsSuccess,
  resetResult,
  setFilteredRows,
  setListFilters,
} from './../actions/data.actions';

export interface DataState {
  filter: {
    materialClass: DataFilter;
    productCategory: DataFilter[];
    agGridFilter: string;
    loading: boolean;
    listFilters: {
      materialName: string;
      standardDocument: string;
      materialNumber: string;
    };
  };
  materialClassOptions: DataFilter[];
  productCategoryOptions: DataFilter[];
  materialClassLoading: boolean;
  productCategoryLoading: boolean;
  result: DataResult[];
  filteredResult: DataResult[];
}

export const initialState: DataState = {
  filter: {
    materialClass: undefined,
    productCategory: undefined,
    agGridFilter: JSON.stringify({}),
    loading: undefined,
    listFilters: {
      materialName: undefined,
      standardDocument: undefined,
      materialNumber: undefined,
    },
  },
  materialClassOptions: [],
  productCategoryOptions: [],
  materialClassLoading: undefined,
  productCategoryLoading: undefined,
  result: undefined,
  filteredResult: undefined,
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
    setFilteredRows,
    (state, { filteredResult }): DataState => ({
      ...state,
      filteredResult,
    })
  ),
  on(
    setListFilters,
    (
      state,
      {
        materialStandardMaterialName,
        materialStandardStandardDocument,
        materialNumber,
      }
    ): DataState => ({
      ...state,
      filter: {
        ...state.filter,
        listFilters: {
          materialName: materialStandardMaterialName
            ? materialStandardMaterialName[0]
            : undefined,
          standardDocument: materialStandardStandardDocument
            ? materialStandardStandardDocument[0]
            : undefined,
          materialNumber: materialNumber ? materialNumber[0] : undefined,
        },
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
  )
);

export function reducer(state: DataState, action: Action): DataState {
  return dataReducer(state, action);
}
