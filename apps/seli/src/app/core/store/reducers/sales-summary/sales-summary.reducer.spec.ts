import { salesSummaryMock } from '../../../../../testing/mocks/sales-summary.mock';
import { Page } from '../../../../shared/models/page.model';
import {
  jumpToPage,
  loadSalesSummarySuccess,
  setPageSize,
} from '../../actions/sales-summary/sales-summary.actions';
import { initialState, SalesSummaryReducer } from './sales-summary.reducer';

describe('Sales Summary Data Reducer', () => {
  test('should jump to page', () => {
    const newPage = 42;
    const action = jumpToPage({ pageNumber: newPage });
    const state = SalesSummaryReducer(initialState, action);

    expect(state.pageNumber).toEqual(newPage);
  });

  test('should set the page size', () => {
    const newPageSize = 100;
    const action = setPageSize({ pageSize: newPageSize });
    const state = SalesSummaryReducer(initialState, action);

    expect(state.pageSize).toEqual(newPageSize);
  });

  test('should store sales summary', () => {
    const salesSummaryPage = new Page(1, 1, 0, 25, [salesSummaryMock]);
    const action = loadSalesSummarySuccess({ salesSummaryPage });
    const state = SalesSummaryReducer(initialState, action);

    expect(state).toEqual(salesSummaryPage);
  });
});
