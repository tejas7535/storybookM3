import { createSelector } from '@ngrx/store';
import { getSalesSummaryDataState } from '../../reducers';
import { SalesSummaryDataState } from '../../reducers/sales-summary-data/sales-summary-data.reducer';

export const getItems = createSelector(
  getSalesSummaryDataState,
  (state: SalesSummaryDataState) => state.items
);
