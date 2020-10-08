import {
  jumpToPage,
  setPageSize,
} from '../../actions/sales-summary-data/sales-summary-data.actions';
import {
  initialState,
  SalesSummaryDataReducer,
} from './sales-summary-data.reducer';

describe('Sales Summary Data Reducer', () => {
  test('should jump to page', () => {
    const newPage = 42;
    const action = jumpToPage({ currentPage: newPage });
    const state = SalesSummaryDataReducer(initialState, action);

    expect(state.currentPage).toEqual(newPage);
  });

  test('should set the page size', () => {
    const newPageSize = 100;
    const action = setPageSize({ pageSize: newPageSize });
    const state = SalesSummaryDataReducer(initialState, action);

    expect(state.pageSize).toEqual(newPageSize);
  });
});
