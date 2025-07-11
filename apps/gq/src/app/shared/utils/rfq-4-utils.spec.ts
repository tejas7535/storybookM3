import { QuotationDetail } from '../models';
import { Rfq4Status } from '../models/quotation-detail/cost';
import { isRfq4ProcessInProgressOrCompletedForQuotationDetail } from './rfq-4-utils';

describe('Rfq4Utils', () => {
  describe('isRfq4ProcessOngoingForQuotationDetail', () => {
    test('should return true if sqvCheckStatus is IN_PROGRESS', () => {
      const result = isRfq4ProcessInProgressOrCompletedForQuotationDetail({
        detailCosts: {
          rfq4Status: Rfq4Status.IN_PROGRESS,
        },
      } as QuotationDetail);

      expect(result).toBe(true);
    });
    test('should return false if sqvCheckStatus is OPEN', () => {
      const result = isRfq4ProcessInProgressOrCompletedForQuotationDetail({
        detailCosts: {
          rfq4Status: Rfq4Status.OPEN,
        },
      } as QuotationDetail);

      expect(result).toBeFalsy();
    });

    test('should return true if sqvCheckStatus is CONFIRMED', () => {
      const result = isRfq4ProcessInProgressOrCompletedForQuotationDetail({
        detailCosts: {
          rfq4Status: Rfq4Status.CONFIRMED,
        },
      } as QuotationDetail);

      expect(result).toBeTruthy();
    });
    test('should return false if detailsCosts is null', () => {
      const result = isRfq4ProcessInProgressOrCompletedForQuotationDetail({
        detailCosts: null,
      } as QuotationDetail);

      expect(result).toBeFalsy();
    });
  });
});
