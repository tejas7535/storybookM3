/* eslint-disable max-lines */
import { Action, createReducer, on } from '@ngrx/store';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import {
  AluminumMaterial,
  PolymerMaterial,
  SteelMaterial,
} from '@mac/msd/models';
import {
  fetchClassOptions,
  fetchClassOptionsFailure,
  fetchClassOptionsSuccess,
  fetchMaterials,
  fetchMaterialsFailure,
  fetchMaterialsSuccess,
  resetResult,
  setAgGridColumns,
  setAgGridFilter,
  setNavigation,
} from '@mac/msd/store/actions';

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
