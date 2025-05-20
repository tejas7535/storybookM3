import { QuotationDetail } from '../models';
import { Rfq4Status } from '../models/quotation-detail/cost';
import { isRfq4ProcessOngoingForQuotationDetail } from './rfq-4-utils';

describe('Rfq4Utils', () => {
  describe('isRfq4ProcessOngoingForQuotationDetail', () => {
    test('should return true if sqvCheckStatus is IN_PROGRESS', () => {
      const result = isRfq4ProcessOngoingForQuotationDetail({
        detailCosts: {
          rfq4Status: Rfq4Status.IN_PROGRESS,
        },
      } as QuotationDetail);

      expect(result).toBe(true);
    });
    test('should return false if sqvCheckStatus is NOT IN_PROGRESS', () => {
      const result = isRfq4ProcessOngoingForQuotationDetail({
        detailCosts: {
          rfq4Status: Rfq4Status.OPEN,
        },
      } as QuotationDetail);

      expect(result).toBe(false);
    });

    test('should return false if detailsCosts is null', () => {
      const result = isRfq4ProcessOngoingForQuotationDetail({
        detailCosts: null,
      } as QuotationDetail);

      expect(result).toBeFalsy();
    });
  });
});
