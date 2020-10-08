import { createReducer, on } from '@ngrx/store';
// temporary workaround until we move to backend data
// tslint:disable-next-line: no-default-import
import dummyDataJson from '../../../../sales-summary/dummy data/dummy-data.json';
import {
  jumpToPage,
  setPageSize,
} from '../../actions/sales-summary-data/sales-summary-data.actions';
import { SalesSummaryData } from './models/sales-summary-data-model';

export interface SalesSummaryDataState {
  items: SalesSummaryData[];
  availablePages: number;
  currentPage: number;
  pageSize: number;
}

export const initialState: SalesSummaryDataState = {
  items: dummyDataJson as SalesSummaryData[],
  availablePages: 0,
  currentPage: 1,
  pageSize: 25,
};

export const SalesSummaryDataReducer = createReducer(
  initialState,
  on(jumpToPage, (state: SalesSummaryDataState, { currentPage }) => ({
    ...state,
    currentPage,
  })),
  on(setPageSize, (state: SalesSummaryDataState, { pageSize }) => ({
    ...state,
    pageSize,
  }))
);
