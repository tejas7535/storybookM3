import {
  initialState,
  SalesSummaryDataState,
} from '../../reducers/sales-summary-data/sales-summary-data.reducer';
import { getItems } from './sales-summary-data.selector';

describe('SalesSummaryData Selector', () => {
  const fakeState: { salesSummaryData: SalesSummaryDataState } = {
    salesSummaryData: {
      ...initialState,
    },
  };

  describe('getItems', () => {
    test('should return sales summary items', () => {
      expect(getItems(fakeState)).toEqual(fakeState.salesSummaryData.items);
    });
  });
});
