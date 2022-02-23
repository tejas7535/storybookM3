import { createAction, props, union } from '@ngrx/store';

import { ViewQuotation } from '../../../../case-view/models/view-quotation.model';

export const loadCases = createAction(
  '[View Cases] Get Cases For Authenticated User'
);
export const loadCasesSuccess = createAction(
  '[View Cases] Get Cases for Authenticated User Success',
  props<{ quotations: ViewQuotation[] }>()
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

const all = union({
  loadCases,
  loadCasesSuccess,
  loadCasesFailure,
  deleteCase,
  deleteCasesSuccess,
  deleteCasesFailure,
});

export type ViewCaseActions = typeof all;
