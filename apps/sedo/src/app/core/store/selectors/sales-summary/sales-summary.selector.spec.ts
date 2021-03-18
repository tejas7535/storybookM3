import {
  initialState,
  SalesSummaryState,
} from '../../reducers/sales-summary/sales-summary.reducer';
import { getItems } from './sales-summary.selector';

describe('SalesSummary Selector', () => {
  const fakeState: { salesSummary: SalesSummaryState } = {
    salesSummary: {
      ...initialState,
    },
  };

  describe('getItems', () => {
    test('should return sales summary items', () => {
      expect(getItems(fakeState)).toEqual(fakeState.salesSummary.content);
    });
  });
});
