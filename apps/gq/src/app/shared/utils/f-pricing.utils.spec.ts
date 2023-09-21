import { MaterialDetails, QuotationDetail } from '../models';
import {
  quotationDetailIsFNumber,
  quotationDetailsHaveFNumberDetails,
} from './f-pricing.utils';

describe('f-pricing.utils', () => {
  describe('quotationDetailsHaveFNumberDetails', () => {
    test('should return false when data is undefined', () => {
      expect(
        quotationDetailsHaveFNumberDetails(undefined as QuotationDetail[])
      ).toBe(false);
    });
    test('should return false, if materialDescription is not F-Number Description', () => {
      const details = [
        {
          material: {
            materialDescription: '12457#myfancyFNumber',
          } as MaterialDetails,
        } as QuotationDetail,
      ];

      expect(quotationDetailsHaveFNumberDetails(details)).toBe(false);
    });
    test('should return true, if materialDescription is F-Number Description starting with F-', () => {
      const details = [
        {
          material: {
            materialDescription: 'F-myfancyFNumber',
          } as MaterialDetails,
        } as QuotationDetail,
        {
          material: {
            materialDescription: '12457#myfancyFNumber',
          } as MaterialDetails,
        } as QuotationDetail,
      ];

      expect(quotationDetailsHaveFNumberDetails(details)).toBe(true);
    });
    test('should return true, if materialDescription is F-Number Description starting with Z-', () => {
      const details = [
        {
          material: {
            materialDescription: 'Z-myfancyFNumber',
          } as MaterialDetails,
        } as QuotationDetail,
        {
          material: {
            materialDescription: '12457#myfancyFNumber',
          } as MaterialDetails,
        } as QuotationDetail,
      ];

      expect(quotationDetailsHaveFNumberDetails(details)).toBe(true);
    });
  });

  describe('quotationDetailIsFNumber', () => {
    test('should return false when data is undefined', () => {
      expect(quotationDetailIsFNumber(undefined as QuotationDetail)).toBe(
        false
      );
    });
    test('should return false, if materialDescription is not F-Number Description', () => {
      const detail = {
        material: {
          materialDescription: '12457#myfancyFNumber',
        } as MaterialDetails,
      } as QuotationDetail;

      expect(quotationDetailIsFNumber(detail)).toBe(false);
    });

    test('should return true, if materialDescription is F-Number Description starting with F-', () => {
      const detail = {
        material: {
          materialDescription: 'F-myfancyFNumber',
        } as MaterialDetails,
      } as QuotationDetail;

      expect(quotationDetailIsFNumber(detail)).toBe(true);
    });

    test('should return true, if materialDescription is F-Number Description starting with Z-', () => {
      const detail = {
        material: {
          materialDescription: 'Z-myfancyFNumber',
        } as MaterialDetails,
      } as QuotationDetail;

      expect(quotationDetailIsFNumber(detail)).toBe(true);
    });
  });
});
