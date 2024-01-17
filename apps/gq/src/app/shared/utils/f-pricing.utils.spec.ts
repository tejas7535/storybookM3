import { MaterialDetails, ProductType, QuotationDetail } from '../models';
import { isFNumber } from './f-pricing.utils';

describe('f-pricing.utils', () => {
  describe('quotationDetailIsFNumber', () => {
    test('should return false when data is undefined', () => {
      expect(isFNumber(undefined as QuotationDetail)).toBe(false);
    });
    test('should return false, if materialDescription is not F-Number Description', () => {
      const detail = {
        material: {
          materialDescription: '12457#myfancyFNumber',
        } as MaterialDetails,
      } as QuotationDetail;

      expect(isFNumber(detail)).toBe(false);
    });

    test('should return true, if materialDescription is F-Number Description starting with F- and productType is set', () => {
      const detail = {
        material: {
          materialDescription: 'F-myfancyFNumber',
          productType: ProductType.CRB,
        } as MaterialDetails,
      } as QuotationDetail;

      expect(isFNumber(detail)).toBe(true);
    });

    test('should return true, if materialDescription is F-Number Description starting with Z-', () => {
      const detail = {
        material: {
          materialDescription: 'Z-myfancyFNumber',
          productType: ProductType.CRB,
        } as MaterialDetails,
      } as QuotationDetail;

      expect(isFNumber(detail)).toBe(true);
    });
    test('should return false, if materialDescription is F-Number Description starting with Z- but no productType set', () => {
      const detail = {
        material: {
          materialDescription: 'Z-myfancyFNumber',
        } as MaterialDetails,
      } as QuotationDetail;

      expect(isFNumber(detail)).toBe(false);
    });
  });
});
