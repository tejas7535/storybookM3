/* eslint-disable max-lines */
import { Action, createReducer, on } from '@ngrx/store';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import {
  ManufacturerSupplierTableValue,
  Material,
  MaterialStandardTableValue,
  ProductCategoryRuleTableValue,
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
  fetchProductCategoryRules,
  fetchProductCategoryRulesFailure,
  fetchProductCategoryRulesSuccess,
  fetchSAPMaterials,
  fetchSAPMaterialsFailure,
  fetchSAPMaterialsSuccess,
  resetResult,
  setAgGridColumns,
  setAgGridFilterForNavigation,
  setNavigation,
} from '@mac/msd/store/actions/data';
import { navigationLevelFactory } from '@mac/msd/util';

export interface DataState {
  filter: {
    agGridFilter: {
      [key in MaterialClass]?: {
        [NavigationLevel.MATERIAL]?: string;
        [NavigationLevel.SUPPLIER]?: string;
        [NavigationLevel.STANDARD]?: string;
        [NavigationLevel.PRODUCT_CATEGORY_RULES]?: string;
      };
    };
    loading: boolean;
  };
  navigation: {
    materialClass: MaterialClass;
    navigationLevel: NavigationLevel;
  };
  agGridColumns: string;
  materialClasses: MaterialClass[];
  materialClassLoading: boolean;
  sapMaterialsRows: {
    lastRow?: number;
    totalRows?: number;
    subTotalRows?: number;
    startRow: number;
    errorCode?: number;
    retryCount?: number;
  };
  result: {
    [key in MaterialClass]?: {
      [NavigationLevel.MATERIAL]?: Material[];
      [NavigationLevel.SUPPLIER]?: ManufacturerSupplierTableValue[];
      [NavigationLevel.STANDARD]?: MaterialStandardTableValue[];
      [NavigationLevel.PRODUCT_CATEGORY_RULES]?: ProductCategoryRuleTableValue[];
    };
  };
}

export const initialState: DataState = {
  filter: {
    agGridFilter: navigationLevelFactory(JSON.stringify({})),
    loading: false,
  },
  navigation: {
    materialClass: undefined,
    navigationLevel: undefined,
  },
  agGridColumns: undefined,
  materialClasses: [],
  materialClassLoading: undefined,
  sapMaterialsRows: undefined,
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
    fetchSAPMaterials,
    (state): DataState => ({
      ...state,
      sapMaterialsRows: {
        ...state.sapMaterialsRows,
        lastRow: undefined,
        startRow: undefined,
      },
      result: {
        ...state.result,
        [MaterialClass.SAP_MATERIAL]: {
          ...state.result[MaterialClass.SAP_MATERIAL],
          materials: undefined,
        },
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
    fetchSAPMaterialsSuccess,
    (
      state,
      { data, lastRow, totalRows, subTotalRows, startRow }
    ): DataState => ({
      ...state,
      sapMaterialsRows: {
        lastRow,
        totalRows,
        subTotalRows,
        startRow,
      },
      result: {
        ...state.result,
        [MaterialClass.SAP_MATERIAL]: {
          ...state.result[MaterialClass.SAP_MATERIAL],
          materials: data,
        },
      },
    })
  ),
  on(
    fetchSAPMaterialsFailure,
    (state, { startRow, errorCode, retryCount }): DataState => ({
      ...state,
      sapMaterialsRows: {
        startRow,
        errorCode,
        retryCount,
      },
      result: {
        ...state.result,
        [MaterialClass.SAP_MATERIAL]: {
          ...state.result[MaterialClass.SAP_MATERIAL],
          materials: undefined,
        },
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
    fetchProductCategoryRules,
    (state): DataState => ({
      ...state,
      filter: {
        ...state.filter,
        loading: true,
      },
    })
  ),
  on(
    fetchProductCategoryRulesSuccess,
    (state, { materialClass, productCategoryRules }): DataState => ({
      ...state,
      filter: {
        ...state.filter,
        loading: false,
      },
      result: {
        ...state.result,
        [materialClass]: {
          ...state.result[materialClass],
          productCategoryRules,
        },
      },
    })
  ),
  on(
    fetchProductCategoryRulesFailure,
    (state): DataState => ({
      ...state,
      filter: {
        ...state.filter,
        loading: false,
      },
    })
  ),
  on(
    setAgGridFilterForNavigation,
    (state, { filterModel, materialClass, navigationLevel }): DataState => ({
      ...state,
      filter: {
        ...state.filter,
        agGridFilter: {
          ...state.filter.agGridFilter,
          [materialClass]: {
            ...state.filter.agGridFilter[materialClass],
            [navigationLevel]: filterModel
              ? JSON.stringify(filterModel)
              : initialState.filter.agGridFilter[materialClass][
                  navigationLevel
                ],
          },
        },
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
