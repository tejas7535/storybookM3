import { createSelector } from '@ngrx/store';

import { MaterialClass } from '@mac/msd/constants';
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

export const getAgGridFilter = createSelector(getFilter, ({ agGridFilter }) => {
  try {
    return JSON.parse(agGridFilter);
  } catch {
    return;
  }
});

export const getShareQueryParams = createSelector(
  getNavigation,
  getFilter,
  ({ materialClass, navigationLevel }, { agGridFilter }) => ({
    materialClass,
    navigationLevel,
    agGridFilter,
  })
);

export const getLoading = createSelector(getFilter, ({ loading }) => loading);

export const getMaterialClassOptions = createSelector(
  getDataState,
  (dataState) => dataState.materialClasses
);

export const getResult = createSelector(
  getDataState,
  getMaterialClass,
  (dataState, materialClass) => {
    switch (materialClass) {
      case MaterialClass.ALUMINUM:
        return dataState.materials.aluminumMaterials;
      case MaterialClass.STEEL:
        return dataState.materials.steelMaterials;
      case MaterialClass.POLYMER:
        return dataState.materials.polymerMaterials;
      default:
        // eslint-disable-next-line unicorn/no-useless-undefined
        return undefined;
    }
  }
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
