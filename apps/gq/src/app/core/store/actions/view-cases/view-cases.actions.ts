import { createAction, props } from '@ngrx/store';

import { ViewQuotation } from '../../models';

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
