import { createSelector } from '@ngrx/store';

import * as fromStore from '../reducers';
import { standardDocumentMaterialNumbers } from './../../constants/standard-document-material-numbers';

export const sortAlphabetically = (a: string, b: string): number =>
  a.localeCompare(b);

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

export const getListFilters = createSelector(
  getFilter,
  ({ listFilters }) => listFilters
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
    filterForm: JSON.stringify({ materialClass, productCategory }),
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

export const getFilteredResult = createSelector(getDataState, (dataState) =>
  dataState.filter.agGridFilter !== JSON.stringify({})
    ? dataState.filteredResult
    : dataState.result
);

export const getFilterLists = createSelector(getFilteredResult, (result) => {
  if (!result) {
    // eslint-disable-next-line unicorn/no-useless-undefined
    return undefined;
  }

  let materialNames: string[] = result.map(
    (entry) => entry.materialStandardMaterialName
  );
  materialNames = materialNames
    .filter((materialName, i) => i === materialNames.indexOf(materialName))
    .sort(sortAlphabetically);
  let materialStandards: string[] = result.map(
    (entry) => entry.materialStandardStandardDocument
  );
  materialStandards = materialStandards
    .filter(
      (materialStandard, i) => i === materialStandards.indexOf(materialStandard)
    )
    .sort(sortAlphabetically);
  let materialNumbers: string[] = [];
  materialStandards.map((standardDocument) =>
    materialNumbers.push(
      ...(standardDocumentMaterialNumbers[standardDocument] || [])
    )
  );
  materialNumbers = materialNumbers
    .filter(
      (materialNumber, i) => i === materialNumbers.indexOf(materialNumber)
    )
    .sort(sortAlphabetically);

  return { materialNames, materialStandards, materialNumbers };
});

export const getOptionsLoading = createSelector(
  getDataState,
  (state) => state.materialClassLoading || state.productCategoryLoading
);

export const getAgGridColumns = createSelector(
  getDataState,
  (state) => state.agGridColumns
);

export const getCo2ColumnVisible = createSelector(
  getResult,
  getAgGridColumns,
  (result, columnString): boolean => {
    if (!result) {
      return false;
    }
    try {
      const columns: { colId: string; hide: boolean }[] =
        JSON.parse(columnString);
      const hidden = columns.find(
        (column) => column.colId === 'co2PerTon'
      )?.hide;

      return !(hidden as boolean);
    } catch {
      return true;
    }
  }
);
