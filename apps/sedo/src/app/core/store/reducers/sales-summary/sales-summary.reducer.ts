import { createReducer, on } from '@ngrx/store';

import {
  jumpToPage,
  loadSalesSummarySuccess,
  setPageSize,
} from '../../actions/sales-summary/sales-summary.actions';
import { SalesSummary } from './models/sales-summary.model';

// TODO the SalesSummaryState is currently not getting used but not deleted yet since it might be needed later

export interface SalesSummaryState {
  content: SalesSummary[];
  totalPageCount: number;
  totalItemsCount: number;
  pageNumber: number;
  pageSize: number;
}

export const initialState: SalesSummaryState = {
  content: undefined,
  totalPageCount: 0,
  totalItemsCount: 0,
  pageNumber: 1,
  pageSize: 25,
};

export const SalesSummaryReducer = createReducer(
  initialState,
  on(jumpToPage, (state: SalesSummaryState, { pageNumber }) => ({
    ...state,
    pageNumber,
  })),
  on(setPageSize, (state: SalesSummaryState, { pageSize }) => ({
    ...state,
    pageSize,
  })),
  on(
    loadSalesSummarySuccess,
    (_state: SalesSummaryState, { salesSummaryPage }) => ({
      ...salesSummaryPage,
    })
  )
);
