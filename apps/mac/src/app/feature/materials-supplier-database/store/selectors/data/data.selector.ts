import { map, pipe } from 'rxjs';

import { createSelector, select } from '@ngrx/store';

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

export const getFilters = createSelector(
  getFilter,
  ({ materialClass, productCategory }) => ({ materialClass, productCategory })
);

// TODO: investigate
export const getMaterialClass = pipe(
  select(getFilters),
  // filter(({ materialClass }) => !!materialClass),
  map(
    ({ materialClass }) =>
      (materialClass?.id as MaterialClass) || MaterialClass.STEEL
  )
);

export const getAgGridFilter = createSelector(getFilter, ({ agGridFilter }) => {
  try {
    return JSON.parse(agGridFilter);
  } catch {
    return;
  }
});

export const getShareQueryParams = createSelector(
  getFilter,
  ({ materialClass, productCategory, agGridFilter }) => ({
    filterForm: JSON.stringify({
      materialClass: materialClass ?? { id: undefined, name: undefined },
      productCategory: productCategory ?? 'all',
    }),
    agGridFilter,
  })
);

export const getLoading = createSelector(getFilter, ({ loading }) => loading);

export const getMaterialClassOptions = createSelector(
  getDataState,
  (dataState) => dataState.materialClassOptions
);

export const getProductCategoryOptions = createSelector(
  getDataState,
  (dataState) => dataState.productCategoryOptions
);

export const getResult = createSelector(
  getDataState,
  (dataState) => dataState.result
);

export const getOptionsLoading = createSelector(
  getDataState,
  (state) => state.materialClassLoading || state.productCategoryLoading
);

export const getAgGridColumns = createSelector(
  getDataState,
  (state) => state.agGridColumns
);

export const getResultCount = createSelector(
  getResult,
  (result) => result?.length || 0
);
