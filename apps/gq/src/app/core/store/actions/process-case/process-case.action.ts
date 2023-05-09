import { createAction, props, union } from '@ngrx/store';

import {
  MaterialTableItem,
  MaterialValidation,
} from '../../../../shared/models/table';

export const clearProcessCaseRowData = createAction(
  '[Process Case] Clear RowData'
);

export const addMaterialRowDataItems = createAction(
  '[Process Case] Add new Items to Material Table',
  props<{ items: MaterialTableItem[] }>()
);

export const duplicateMaterialRowDataItem = createAction(
  '[Process Case] Duplicate Item by Id from Material Table',
  props<{ itemId: number }>()
);

export const updateMaterialRowDataItem = createAction(
  '[Process Case] Update Item from Material Table',
  props<{ item: MaterialTableItem; revalidate: boolean }>()
);
export const deleteMaterialRowDataItem = createAction(
  '[Process Case] Delete Item from Material Table',
  props<{ id: number }>()
);

export const validateAddMaterialsOnCustomerAndSalesOrg = createAction(
  '[Process Case] Get Validation for RowData Materials on Customer and SalesOrg'
);

export const validateAddMaterialsOnCustomerAndSalesOrgFailure = createAction(
  '[Process Case] Get Validation for RowData Materials on Customer and SalesOrg: Validation Failure',
  props<{ errorMessage: string }>()
);

export const validateAddMaterialsOnCustomerAndSalesOrgSuccess = createAction(
  '[Process Case] Get Validation for RowData Materials on Customer and SalesOrg: Validation Success',
  props<{ materialValidations: MaterialValidation[] }>()
);

const all = union({
  clearProcessCaseRowData,
  addMaterialRowDataItems,
  duplicateMaterialRowDataItem,
  deleteMaterialRowDataItem,
  validateAddMaterialsOnCustomerAndSalesOrg,
  validateAddMaterialsOnCustomerAndSalesOrgFailure,
  validateAddMaterialsOnCustomerAndSalesOrgSuccess,
});

export type processCaseActions = typeof all;
