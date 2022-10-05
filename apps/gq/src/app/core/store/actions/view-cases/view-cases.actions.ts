import { createAction, props, union } from '@ngrx/store';

import { QuotationStatus } from '../../../../shared/models/quotation/quotation-status.enum';
import { GetQuotationsResponse } from '../../../../shared/services/rest-services/quotation-service/models/get-quotations-response.interface';

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
export const deleteCase = createAction(
  '[View Cases] Delete Selected Cases For Authenticated User',
  props<{ gqIds: number[] }>()
);
export const deleteCasesSuccess = createAction(
  '[View Cases] Delete Selected Cases for Authenticated User Success'
);
export const deleteCasesFailure = createAction(
  '[View Cases] Delete Selected Cases for Authenticated User Failure',
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
  loadCases,
  loadCasesSuccess,
  loadCasesFailure,
  deleteCase,
  deleteCasesSuccess,
  deleteCasesFailure,
  selectCase,
  deselectCase,
});

export type ViewCaseActions = typeof all;
