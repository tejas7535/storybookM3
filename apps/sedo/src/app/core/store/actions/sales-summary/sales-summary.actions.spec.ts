import { salesSummaryMock } from '../../../../../testing/mocks/sales-summary.mock';
import { Page } from '../../../../shared/models/page.model';
import {
  jumpToPage,
  loadSalesSummary,
  loadSalesSummaryFailure,
  loadSalesSummarySuccess,
  SalesSummaryActions,
  setPageSize,
} from './sales-summary.actions';

describe('SalesSummary Actions', () => {
  let action: SalesSummaryActions;

  beforeEach(() => {
    action = undefined;
  });

  test('setPageSize', () => {
    const newPageSize = 100;
    action = setPageSize({ pageSize: newPageSize });

    expect(action).toEqual({
      pageSize: newPageSize,
      type: '[SalesSummary] Set Page Size',
    });
  });

  test('jumpToPage', () => {
    const newCurrentPage = 42;
    action = jumpToPage({ pageNumber: newCurrentPage });

    expect(action).toEqual({
      pageNumber: newCurrentPage,
      type: '[SalesSummary] Jump To Page',
    });
  });

  describe('load sales summary actions', () => {
    test('loadSalesSummary', () => {
      action = loadSalesSummary();

      expect(action).toEqual({
        type: '[SalesSummary] Load Sales Summary',
      });
    });

    test('loadSalesSummarySuccess', () => {
      const salesSummaryPage = new Page(1, 1, 0, 25, [salesSummaryMock]);
      action = loadSalesSummarySuccess({ salesSummaryPage });

      expect(action).toEqual({
        salesSummaryPage,
        type: '[SalesSummary] Load Sales Summary Success',
      });
    });

    test('loadSalesSummaryFailure', () => {
      action = loadSalesSummaryFailure();

      expect(action).toEqual({
        type: '[SalesSummary] Load Sales Summary Failure',
      });
    });
  });
});
