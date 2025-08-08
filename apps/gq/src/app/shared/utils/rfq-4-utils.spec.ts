import { QuotationDetail } from '../models';
import { Rfq4Status } from '../models/quotation-detail/cost';
import { isRfq4ProcessNotOpen } from './rfq-4-utils';

describe('Rfq4Utils', () => {
  describe('isRfq4ProcessOngoingForQuotationDetail', () => {
    test('should return true if sqvCheckStatus is IN_PROGRESS', () => {
      const result = isRfq4ProcessNotOpen({
        rfq4: {
          rfq4Status: Rfq4Status.IN_PROGRESS,
        },
      } as QuotationDetail);

      expect(result).toBe(true);
    });
    test('should return false if sqvCheckStatus is OPEN', () => {
      const result = isRfq4ProcessNotOpen({
        rfq4: {
          rfq4Status: Rfq4Status.OPEN,
        },
      } as QuotationDetail);

      expect(result).toBeFalsy();
    });

    test('should return true if sqvCheckStatus is CONFIRMED', () => {
      const result = isRfq4ProcessNotOpen({
        rfq4: {
          rfq4Status: Rfq4Status.CONFIRMED,
        },
      } as QuotationDetail);

      expect(result).toBeTruthy();
    });

    test('should return true if sqvCheckStatus is REOPEN', () => {
      const result = isRfq4ProcessNotOpen({
        rfq4: {
          rfq4Status: Rfq4Status.REOPEN,
        },
      } as QuotationDetail);

      expect(result).toBeTruthy();
    });

    test('should return true if sqvCheckStatus is CANCEL', () => {
      const result = isRfq4ProcessNotOpen({
        rfq4: {
          rfq4Status: Rfq4Status.CANCELLED,
        },
      } as QuotationDetail);

      expect(result).toBeTruthy();
    });
    test('should return false if detailsCosts is null', () => {
      const result = isRfq4ProcessNotOpen({
        rfq4: null,
      } as QuotationDetail);

      expect(result).toBeFalsy();
    });
  });
});
