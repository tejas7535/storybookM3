import {
  getInitialData,
  jumpToPage,
  SalesSummaryDataActions,
  setPageSize,
} from './sales-summary-data.actions';

describe('SalesSummaryData Actions', () => {
  let action: SalesSummaryDataActions;

  beforeEach(() => {
    action = undefined;
  });

  test('setPageSize', () => {
    const newPageSize = 100;
    action = setPageSize({ pageSize: newPageSize });

    expect(action).toEqual({
      pageSize: newPageSize,
      type: '[SalesSummaryData] Set Page Size',
    });
  });

  test('jumpToPage', () => {
    const newCurrentPage = 42;
    action = jumpToPage({ currentPage: newCurrentPage });

    expect(action).toEqual({
      currentPage: newCurrentPage,
      type: '[SalesSummaryData] Jump To Page',
    });
  });

  test('getInitialData', () => {
    action = getInitialData();

    expect(action).toEqual({
      type: '[SalesSummaryData] Get Initial Data',
    });
  });
});
