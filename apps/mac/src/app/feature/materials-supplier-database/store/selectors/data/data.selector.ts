import { createSelector } from '@ngrx/store';

import { Material } from '@mac/feature/materials-supplier-database/models';
import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import * as fromStore from '@mac/msd/store/reducers';

export const getDataState = createSelector(
  fromStore.getMSDState,
  (msdState) => msdState.data
);

export const getFilter = createSelector(
  getDataState,
  (dataState) => dataState.filter
);

export const getNavigation = createSelector(
  getDataState,
  (dataState) => dataState.navigation
);

export const getMaterialClass = createSelector(
  getNavigation,
  ({ materialClass }) => materialClass
);

export const getAgGridFilter = createSelector(
  getNavigation,
  getFilter,
  ({ materialClass, navigationLevel }, { agGridFilter }) => {
    try {
      return JSON.parse(agGridFilter[materialClass][navigationLevel]);
    } catch {
      return;
    }
  }
);

export const getShareQueryParams = createSelector(
  getNavigation,
  getFilter,
  ({ materialClass, navigationLevel }, { agGridFilter }) => ({
    materialClass,
    navigationLevel,
    agGridFilter: agGridFilter[materialClass][navigationLevel],
  })
);

export const getLoading = createSelector(getFilter, ({ loading }) => loading);

export const getMaterialClassOptions = createSelector(
  getDataState,
  (dataState) =>
    dataState.materialClasses && dataState.materialClasses.length > 0
      ? [
          ...dataState.materialClasses,
          MaterialClass.SAP_MATERIAL,
          MaterialClass.VITESCO,
        ]
      : undefined
);

export const getResult = createSelector(
  getDataState,
  getNavigation,
  (dataState, { materialClass, navigationLevel }) =>
    dataState.result[materialClass]?.[navigationLevel] || []
);

export const getOptionsLoading = createSelector(
  getDataState,
  (state) => state.materialClassLoading
);

export const getAgGridColumns = createSelector(
  getDataState,
  (state) => state.agGridColumns
);

export const getResultCount = createSelector(
  getResult,
  (result) => result?.length || 0
);

export const getSAPMaterialsRows = createSelector(
  getDataState,
  (state) => state.sapMaterialsRows
);

export const getVitescoMaterialsRows = createSelector(
  getDataState,
  (state) => state.vitescoMaterialsRows
);

export const getSAPResult = createSelector(
  getDataState,
  getSAPMaterialsRows,
  (
    state,
    sapMaterialsRows
  ):
    | {
        data?: Material[];
        lastRow?: number;
        totalRows?: number;
        subTotalRows?: number;
        startRow?: number;
        errorCode?: number;
        retryCount?: number;
      }
    | undefined =>
    sapMaterialsRows?.startRow === undefined
      ? undefined
      : {
          data: state.result?.[MaterialClass.SAP_MATERIAL]?.[
            NavigationLevel.MATERIAL
          ],
          ...sapMaterialsRows,
        }
);

export const getVitescoResult = createSelector(
  getDataState,
  getVitescoMaterialsRows,
  (
    state,
    vitescoMaterialsRows
  ):
    | {
        data?: Material[];
        lastRow?: number;
        totalRows?: number;
        subTotalRows?: number;
        startRow?: number;
        errorCode?: number;
        retryCount?: number;
      }
    | undefined =>
    vitescoMaterialsRows?.startRow === undefined
      ? undefined
      : {
          data: state.result?.[MaterialClass.VITESCO]?.[
            NavigationLevel.MATERIAL
          ],
          ...vitescoMaterialsRows,
        }
);

export const isBulkEditAllowed = createSelector(
  getNavigation,
  (navigation) => navigation.navigationLevel === NavigationLevel.MATERIAL
);
