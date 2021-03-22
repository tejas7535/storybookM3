import { createAction, props, union } from '@ngrx/store';

import {
  Customer,
  MaterialTableItem,
  MaterialValidation,
  Quotation,
  QuotationIdentifier,
  UpdateQuotationDetail,
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

export const updateQuotationDetails = createAction(
  '[Offer] Update QuotationDetails',
  props<{ quotationDetailIDs: UpdateQuotationDetail[] }>()
);

export const updateQuotationDetailsSuccess = createAction(
  '[Offer] Update QuotationDetails Success',
  props<{ quotationDetailIDs: UpdateQuotationDetail[] }>()
);

export const updateQuotationDetailsFailure = createAction(
  '[Offer] Update QuotationDetails Failure',
  props<{ errorMessage: string }>()
);

export const addMaterials = createAction(
  '[Process Case] Add material to Quotation'
);

export const addMaterialsSuccess = createAction(
  '[Process Case] Add material to Quotation Success',
  props<{ item: Quotation }>()
);

export const addMaterialsFailure = createAction(
  '[Process Case] Add material to Quotation Failure',
  props<{ errorMessage: string }>()
);

export const addMaterialRowDataItem = createAction(
  '[Process Case] Add new Items to Material Table',
  props<{ items: MaterialTableItem[] }>()
);

export const deleteAddMaterialRowDataItem = createAction(
  '[Process Case] Delete Item from Material Table',
  props<{ materialNumber: string; quantity: number }>()
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
  '[Process Case] Add material to remove list',
  props<{ gqPositionIds: string[] }>()
);

export const removeMaterials = createAction(
  '[Process Case] Remove material from Quotation'
);

export const removeMaterialsSuccess = createAction(
  '[Process Case] Remove material from Quotation Success',
  props<{ item: Quotation }>()
);

export const removeMaterialsFailure = createAction(
  '[Process Case] Remove material from Quotation Failure',
  props<{ errorMessage: string }>()
);

export const setSelectedQuotationDetail = createAction(
  '[Process Case] Set Selected GqPositionId',
  props<{ gqPositionId: string }>()
);

export const loadSelectedQuotationDetailFromUrl = createAction(
  '[Process Case] Load selected quotation detail from URL',
  props<{ gqPositionId: string }>()
);

export const loadQuotationFromUrl = createAction(
  '[Process Case] Load quotation from URL',
  props<{ queryParams: any }>()
);

export const uploadOfferToSap = createAction(
  '[Process Case] Upload offer to Sap'
);

export const uploadOfferToSapFailure = createAction(
  '[Process Case] Upload offer to Sap Failure',
  props<{ errorMessage: string }>()
);

export const uploadOfferToSapSuccess = createAction(
  '[Process Case] Upload offer to Sap Success'
);

const all = union({
  addMaterials,
  deleteAddMaterialRowDataItem,
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotation,
  loadQuotationFailure,
  loadQuotationSuccess,
  removeMaterials,
  removeMaterialsFailure,
  removeMaterialsSuccess,
  selectQuotation,
  updateQuotationDetails,
  updateQuotationDetailsFailure,
  updateQuotationDetailsSuccess,
  validateAddMaterialsFailure,
  validateAddMaterialsSuccess,
  setSelectedQuotationDetail,
  loadSelectedQuotationDetailFromUrl,
  loadQuotationFromUrl,
  uploadOfferToSap,
  uploadOfferToSapSuccess,
  uploadOfferToSapFailure,
});

export type CaseActions = typeof all;
