import { createSelector } from '@ngrx/store';

import { getSalesSummaryState } from '../../reducers';
import { SalesSummaryState } from '../../reducers/sales-summary/sales-summary.reducer';

export const getItems = createSelector(
  getSalesSummaryState,
  (state: SalesSummaryState) => state.content
);
