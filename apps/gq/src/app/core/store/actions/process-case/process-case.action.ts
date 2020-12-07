import { createAction, props, union } from '@ngrx/store';

import {
  Customer,
  MaterialTableItem,
  MaterialValidation,
  Quotation,
  QuotationIdentifier,
} from '../../models';

export const loadCustomer = createAction('[Process Case] Get Customer Details');

export const loadCustomerSuccess = createAction(
  '[Process Case] Get Customer Details Success',
  props<{ item: Customer }>()
);

export const loadCustomerFailure = createAction(
  '[Process Case] Get Customer Details Failure',
  props<{ errorMessage: string }>()
);

export const loadQuotation = createAction(
  '[Process Case] Get Quotation Details'
);

export const loadQuotationSuccess = createAction(
  '[Process Case] Get Quotation Details Success',
  props<{ item: Quotation }>()
);

export const loadQuotationFailure = createAction(
  '[Process Case] Get Quotation Details Failure',
  props<{ errorMessage: string }>()
);

export const selectQuotation = createAction(
  '[Process Case] Select Quotation',
  props<{ quotationIdentifier: QuotationIdentifier }>()
);

export const addQuotationDetailToOffer = createAction(
  '[Offer] add QuotationDetail to offer',
  props<{ quotationDetailIDs: string[] }>()
);

export const removeQuotationDetailFromOffer = createAction(
  '[Offer] remove QuotationDetail to offer',
  props<{ quotationDetailIDs: string[] }>()
);

export const addMaterials = createAction(
  '[Process Case] add material to Quotation'
);

export const addMaterialsSuccess = createAction(
  '[Process Case] add material to Quotation Success',
  props<{ item: Quotation }>()
);

export const addMaterialsFailure = createAction(
  '[Process Case] add material to Quotation Failure',
  props<{ errorMessage: string }>()
);

export const addMaterialRowDataItem = createAction(
  '[Process Case] Add new Items to Material Table',
  props<{ items: MaterialTableItem[] }>()
);

export const deleteAddMaterialRowDataItem = createAction(
  '[Process Case] Delete Item from Material Table',
  props<{ materialNumber: string }>()
);

export const pasteRowDataItemsToAddMaterial = createAction(
  '[Process Case] Paste new Items to Material Table',
  props<{ items: MaterialTableItem[]; pasteDestination: MaterialTableItem }>()
);

export const validateAddMaterialsFailure = createAction(
  '[Process Case] Get Validation for RowData Validation Failure',
  props<{ errorMessage: string }>()
);

export const validateAddMaterialsSuccess = createAction(
  '[Process Case] Get Validation for RowData Validation Success',
  props<{ materialValidations: MaterialValidation[] }>()
);

export const addToRemoveMaterials = createAction(
  '[Process Case] add material to remove list',
  props<{ gqPositionIds: string[] }>()
);

export const removeMaterials = createAction(
  '[Process Case] remove material from Quotation'
);

export const removeMaterialsSuccess = createAction(
  '[Create Case] CreateCase from table and selected customer Success',
  props<{ item: Quotation }>()
);

export const removeMaterialsFailure = createAction(
  '[Create Case] CreateCase from table and selected customer Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  addQuotationDetailToOffer,
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotation,
  loadQuotationFailure,
  loadQuotationSuccess,
  removeQuotationDetailFromOffer,
  selectQuotation,
  addMaterials,
  deleteAddMaterialRowDataItem,
  validateAddMaterialsFailure,
  validateAddMaterialsSuccess,
  removeMaterials,
  removeMaterialsSuccess,
  removeMaterialsFailure,
});

export type CaseActions = typeof all;
