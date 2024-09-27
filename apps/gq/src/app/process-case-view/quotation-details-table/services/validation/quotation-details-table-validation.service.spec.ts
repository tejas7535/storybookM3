import { QuotationDetailsTableValidationService } from './quotation-details-table-validation.service';

describe('QuotationDetailsTableValidationService', () => {
  describe('isOrderQuantityInvalid', () => {
    test('should return false if delivery unit not set', () => {
      const result =
        QuotationDetailsTableValidationService.isOrderQuantityInvalid(
          5,
          undefined as any
        );

      expect(result).toBeFalsy();
    });
    test('should return false if order quantity is a multiple of delivery unit', () => {
      const result =
        QuotationDetailsTableValidationService.isOrderQuantityInvalid(15, 5);

      expect(result).toBeFalsy();
    });
    test('should return true if order quantity is not a multiple of delivery unit', () => {
      const result =
        QuotationDetailsTableValidationService.isOrderQuantityInvalid(5, 3);

      expect(result).toBeTruthy();
    });
  });
});
