import { HttpStatusCode } from '@angular/common/http';

import { createAction, props, union } from '@ngrx/store';

import { Comparison } from '@cdba/shared/models';

export const loadComparisonSummary = createAction(
  '[Compare] Load Comparison Summary'
);

export const loadComparisonSummarySuccess = createAction(
  '[Compare] Load Comparison Summary Success',
  props<{ comparison: Comparison }>()
);

export const loadComparisonSummaryFailure = createAction(
  '[Compare] Load Comparison Summary Failure',
  props<{ errorMessage: string; statusCode: HttpStatusCode }>()
);

const all = union({
  loadComparisonSummary,
  loadComparisonSummarySuccess,
  loadComparisonSummaryFailure,
});

export type ComparisonSummaryActions = typeof all;
