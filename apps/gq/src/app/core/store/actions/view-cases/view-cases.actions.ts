import { QuotationStatus } from '@gq/shared/models/quotation/quotation-status.enum';
import { GetQuotationsResponse } from '@gq/shared/services/rest/quotation/models/get-quotations-response.interface';
import { createAction, props, union } from '@ngrx/store';

export const loadCasesForView = createAction(
  '[View Cases] Get View Related Cases For Authenticated User',
  props<{ view: number }>()
);
export const loadCases = createAction(
  '[View Cases] Get Cases For Authenticated User',
  props<{ status: QuotationStatus }>()
);
export const loadCasesSuccess = createAction(
  '[View Cases] Get Cases for Authenticated User Success',
  props<{ response: GetQuotationsResponse }>()
);
export const loadCasesFailure = createAction(
  '[View Cases] Get Cases for Authenticated User Failure',
  props<{ errorMessage: string }>()
);
export const updateCaseStatus = createAction(
  '[View Cases] Update Status of Selected Cases For Authenticated User',
  props<{ gqIds: number[]; status: QuotationStatus }>()
);
export const updateCasesStatusSuccess = createAction(
  '[View Cases] Update Status of Selected Cases for Authenticated User Success',
  props<{ gqIds: number[] }>()
);
export const updateCasesStatusFailure = createAction(
  '[View Cases] Update Status of Selected Cases for Authenticated User Failure',
  props<{ errorMessage: string }>()
);
export const selectCase = createAction(
  '[View Cases] Select a Case',
  props<{ gqId: number }>()
);
export const deselectCase = createAction(
  '[View Cases] Deselect a Case',
  props<{ gqId: number }>()
);

const all = union({
  loadCasesForView,
  loadCases,
  loadCasesSuccess,
  loadCasesFailure,
  updateStatusCase: updateCaseStatus,
  updateStatusCasesSuccess: updateCasesStatusSuccess,
  updateStatusCasesFailure: updateCasesStatusFailure,
  selectCase,
  deselectCase,
});

export type ViewCaseActions = typeof all;
