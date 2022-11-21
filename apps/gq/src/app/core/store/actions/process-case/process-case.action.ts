import { createAction, props, union } from '@ngrx/store';

import { Quotation } from '../../../../shared/models';
import { Customer } from '../../../../shared/models/customer';
import { QuotationDetail } from '../../../../shared/models/quotation-detail';
import {
  MaterialTableItem,
  MaterialValidation,
} from '../../../../shared/models/table';
import {
  QuotationIdentifier,
  UpdateQuotationDetail,
} from '../../reducers/process-case/models';

export const loadCustomer = createAction('[Process Case] Get Customer Details');

export const loadCustomerSuccess = createAction(
  '[Process Case] Get Customer Details Success',
  props<{ item: Customer }>()
);

export const loadCustomerFailure = createAction(
  '[Process Case] Get Customer Details Failure',
  props<{ errorMessage: string }>()
);

export const loadQuotationInInterval = createAction(
  '[Process Case] Get Quotation in Interval'
);
export const loadQuotation = createAction(
  '[Process Case] Get Quotation Details'
);

export const loadQuotationSuccess = createAction(
  '[Process Case] Get Quotation Details Success',
  props<{ item: Quotation }>()
);

export const loadQuotationSuccessFullyCompleted = createAction(
  '[Process Case] Get Quotation Details with Calculation Completed'
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
  '[Process Case] Update QuotationDetails',
  props<{ updateQuotationDetailList: UpdateQuotationDetail[] }>()
);

export const updateQuotationDetailsSuccess = createAction(
  '[Process Case] Update QuotationDetails Success',
  props<{ updatedQuotation: Quotation }>()
);

export const updateQuotationDetailsFailure = createAction(
  '[Process Case] Update QuotationDetails Failure',
  props<{ errorMessage: string }>()
);

export const clearProcessCaseRowData = createAction(
  '[Process Case] Clear RowData'
);

export const addMaterials = createAction(
  '[Process Case] Add material to Quotation'
);

export const addMaterialsSuccess = createAction(
  '[Process Case] Add material to Quotation Success',
  props<{ updatedQuotation: Quotation }>()
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
  props<{ items: MaterialTableItem[] }>()
);

export const validateAddMaterialsFailure = createAction(
  '[Process Case] Get Validation for RowData Validation Failure',
  props<{ errorMessage: string }>()
);

export const validateAddMaterialsSuccess = createAction(
  '[Process Case] Get Validation for RowData Validation Success',
  props<{ materialValidations: MaterialValidation[] }>()
);

export const removePositions = createAction(
  '[Process Case] Remove positions from Quotation',
  props<{ gqPositionIds: string[] }>()
);

export const removePositionsSuccess = createAction(
  '[Process Case] Remove positions from Quotation Success',
  props<{ updatedQuotation: Quotation }>()
);

export const removePositionsFailure = createAction(
  '[Process Case] Remove positions from Quotation Failure',
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

export const uploadSelectionToSap = createAction(
  '[Process Case] Upload selection to Sap',
  props<{ gqPositionIds: string[] }>()
);

export const uploadSelectionToSapFailure = createAction(
  '[Process Case] Upload selection to Sap Failure',
  props<{ errorMessage: string }>()
);

export const uploadSelectionToSapSuccess = createAction(
  '[Process Case] Upload selection to Sap Success',
  props<{ updatedQuotation: Quotation }>()
);

export const refreshSapPricing = createAction(
  '[Process Case] Refresh SAP Pricing'
);

export const refreshSapPricingSuccess = createAction(
  '[Process Case] Refresh SAP Pricing Success',
  props<{ quotation: Quotation }>()
);
export const refreshSapPricingFailure = createAction(
  '[Process Case] Refresh SAP Pricing Failure',
  props<{ errorMessage: string }>()
);

export const updateQuotation = createAction(
  '[Process Case] Update Quotation',
  props<{ caseName?: string; currency?: string }>()
);

export const updateQuotationSuccess = createAction(
  '[Process Case] Update Quotation Success',
  props<{ quotation: Quotation }>()
);

export const updateQuotationFailure = createAction(
  '[Process Case] Update Quotation Failure',
  props<{ errorMessage: string }>()
);

export const addSimulatedQuotation = createAction(
  '[Process Case] Add Simulated Quotation',
  props<{ gqId: number; quotationDetails: QuotationDetail[] }>()
);

export const resetSimulatedQuotation = createAction(
  '[Process Case] Reset Simulated Quotation'
);

export const removeSimulatedQuotationDetail = createAction(
  '[Process Case] Remove simulated QuotationDetail',
  props<{ gqPositionId: string }>()
);

export const confirmSimulatedQuotation = createAction(
  '[Process Case] Confirm Simulated Quotation'
);

export const selectQuotationDetail = createAction(
  '[Process Case] Select a Quotation Detail',
  props<{ gqPositionId: string }>()
);

export const deselectQuotationDetail = createAction(
  '[Process Case] Deselect a Quotation Detail',
  props<{ gqPositionId: string }>()
);

export const createSapQuote = createAction(
  '[Process Cases] Create SAP Quote',
  props<{ gqPositionIds: string[] }>()
);

export const createSapQuoteSuccess = createAction(
  '[Process Cases] Create SAP Quote success',
  props<{ quotation: Quotation }>()
);

export const createSapQuoteFailure = createAction(
  '[Process Cases] Create SAP Quote Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  clearProcessCaseRowData,
  addMaterials,
  deleteAddMaterialRowDataItem,
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotation,
  loadQuotationInInterval,
  loadQuotationFailure,
  loadQuotationSuccess,
  loadQuotationSuccessFullyCompleted,
  removePositions,
  removePositionsFailure,
  removePositionsSuccess,
  selectQuotation,
  updateQuotationDetails,
  updateQuotationDetailsFailure,
  updateQuotationDetailsSuccess,
  validateAddMaterialsFailure,
  validateAddMaterialsSuccess,
  setSelectedQuotationDetail,
  loadSelectedQuotationDetailFromUrl,
  loadQuotationFromUrl,
  uploadSelectionToSap,
  uploadSelectionToSapSuccess,
  uploadSelectionToSapFailure,
  refreshSapPricing,
  refreshSapPricingSuccess,
  refreshSapPricingFailure,
  updateQuotation,
  updateQuotationSuccess,
  updateQuotationFailure,
  addSimulatedQuotation,
  resetSimulatedQuotation,
  removeSimulatedQuotationDetail,
  confirmSimulatedQuotation,
  selectQuotationDetail,
  deselectQuotationDetail,
  createSapQuote,
  createSapQuoteSuccess,
  createSapQuoteFailure,
});

export type CaseActions = typeof all;
