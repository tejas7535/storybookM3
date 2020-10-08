import { createAction, props, union } from '@ngrx/store';

export const setPageSize = createAction(
  '[SalesSummaryData] Set Page Size',
  props<{ pageSize: number }>()
);

export const jumpToPage = createAction(
  '[SalesSummaryData] Jump To Page',
  props<{ currentPage: number }>()
);

export const getInitialData = createAction(
  '[SalesSummaryData] Get Initial Data'
);

const all = union({
  setPageSize,
  jumpToPage,
  getInitialData,
});

export type SalesSummaryDataActions = typeof all;
