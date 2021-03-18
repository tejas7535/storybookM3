import { createAction, props, union } from '@ngrx/store';

import { Page } from '../../../../shared/models/page.model';
import { SalesSummary } from '../../reducers/sales-summary/models/sales-summary.model';

// TODO currently the sales summary action never get dispatched ... maybe needed in the future

export const setPageSize = createAction(
  '[SalesSummary] Set Page Size',
  props<{ pageSize: number }>()
);

export const jumpToPage = createAction(
  '[SalesSummary] Jump To Page',
  props<{ pageNumber: number }>()
);

export const loadSalesSummary = createAction(
  '[SalesSummary] Load Sales Summary'
);

export const loadSalesSummarySuccess = createAction(
  '[SalesSummary] Load Sales Summary Success',
  props<{ salesSummaryPage: Page<SalesSummary> }>()
);
export const loadSalesSummaryFailure = createAction(
  '[SalesSummary] Load Sales Summary Failure'
);

const all = union({
  setPageSize,
  jumpToPage,
  loadSalesSummary,
  loadSalesSummarySuccess,
  loadSalesSummaryFailure,
});

export type SalesSummaryActions = typeof all;
