import { QuotationDetail } from '../models';
import {
  MaterialDetails,
  ProductType,
} from '../models/quotation-detail/material';
import {
  addNumbers,
  addTwoNumbers,
  calculateGpmValue,
  calculateThresholdForSanityChecks,
  divideNumbers,
  divideTwoNumbers,
  isFNumber,
  multiplyNumbers,
  multiplyTwoNumbers,
  subtractNumbers,
  subtractTwoNumbers,
} from './f-pricing.utils';

describe('f-pricing.utils', () => {
  describe('quotationDetailIsFNumber', () => {
    test('should return false when data is undefined', () => {
      expect(isFNumber(undefined as QuotationDetail)).toBe(false);
    });
    test('should return false, if materialDescription is not F-Number Description', () => {
      const detail = {
        material: {
          materialDescription: '12457#myfancyFNumber',
          productType: ProductType.CRB,
        } as MaterialDetails,
        fPricing: {
          referencePrice: 123,
        },
      } as QuotationDetail;

      expect(isFNumber(detail)).toBe(false);
    });

    test('should return true, if materialDescription is F-Number Description starting with F- and productType is set, and referencePrice', () => {
      const detail = {
        material: {
          materialDescription: 'F-myfancyFNumber',
          productType: ProductType.CRB,
        } as MaterialDetails,
        fPricing: {
          referencePrice: 123,
        },
      } as QuotationDetail;

      expect(isFNumber(detail)).toBe(true);
    });

    test('should return true, if materialDescription is F-Number Description starting with Z- and referencePrice', () => {
      const detail = {
        material: {
          materialDescription: 'Z-myfancyFNumber',
          productType: ProductType.CRB,
        } as MaterialDetails,
        fPricing: {
          referencePrice: 123,
        },
      } as QuotationDetail;

      expect(isFNumber(detail)).toBe(true);
    });
    test('should return false, if materialDescription is F-Number Description starting with Z- but no productType set', () => {
      const detail = {
        material: {
          materialDescription: 'Z-myfancyFNumber',
        } as MaterialDetails,
        fPricing: {
          referencePrice: 123,
        },
      } as QuotationDetail;

      expect(isFNumber(detail)).toBe(false);
    });
    test('should return false, when has Fnumber Desciption, productType but NOT referencePrice', () => {
      const detail = {
        material: {
          materialDescription: 'F-myfancyFNumber',
          productType: ProductType.CRB,
        } as MaterialDetails,
        fPricing: {
          referencePrice: undefined,
        },
      } as QuotationDetail;

      expect(isFNumber(detail)).toBe(false);
    });
  });
  describe('calculateThresholdForSanityChecks', () => {
    test('should calculate the margin with precision', () => {
      // 249.43 / ( 1 - 0.6) = 623.575 --> 623.58
      const result = calculateThresholdForSanityChecks(249.43, 0.6, 2);
      expect(result).toBe(623.58);
    });
    test('should calculate the margin without precision', () => {
      // 249.43 / ( 1 - 0.6) = 623.575
      const result = calculateThresholdForSanityChecks(249.43, 0.6);
      expect(result).toBe(623.575);
    });
  });

  describe('calculateGPmValue', () => {
    test('should calculate the GPm value', () => {
      // ((finalPrice - sqvValue) / finalPrice) * 100
      const result = calculateGpmValue(250, 25.555);
      expect(result).toBe(89.778);
    });
    test('should calculate the GPm value with precision', () => {
      // ((finalPrice - sqvValue) / finalPrice) * 100
      const result = calculateGpmValue(250, 25.555, 2);
      expect(result).toBe(89.78);
    });
  });

  describe('subtractTwoNumbers', () => {
    test('should subtract two numbers', () => {
      const result = subtractTwoNumbers(0.3, 0.1);
      expect(result).toBe(0.2);
    });
    test('should subtract two numbers with precision', () => {
      const result = subtractTwoNumbers(0.399_99, 0.1, 2);
      expect(result).toBe(0.3);
    });
  });

  describe('subtractMultipleNumbers', () => {
    test('should subtract multiple numbers', () => {
      const result = subtractNumbers([0.3, 0.1, 0.1]);
      expect(result).toBe(0.1);
    });
    test('should subtract multiple numbers with precision', () => {
      const result = subtractNumbers([0.399_99, 0.1, 0.1], 2);
      expect(result).toBe(0.2);
    });
  });

  describe('addTwoNumbers', () => {
    test('should add two numbers', () => {
      const result = addTwoNumbers(0.3, 0.1);
      expect(result).toBe(0.4);
    });

    test('should add two numbers with precision', () => {
      const result = addTwoNumbers(0.3, 0.1555, 2);
      expect(result).toBe(0.46);
    });
  });

  describe('addNumbers', () => {
    test('should add multiple numbers', () => {
      const result = addNumbers([0.3, 0.1, 0.1]);
      expect(result).toBe(0.5);
    });

    test('should add multiple numbers with precision', () => {
      const result = addNumbers([0.3, 0.1555, 0.1], 2);
      expect(result).toBe(0.56);
    });
  });

  describe('multiplyTwoNumbers', () => {
    test('should multiply two numbers', () => {
      const result = multiplyTwoNumbers(0.3, 0.1);
      expect(result).toBe(0.03);
    });

    test('should multiply two numbers with precision', () => {
      const result = multiplyTwoNumbers(0.3, 0.1555, 2);
      expect(result).toBe(0.05);
    });
  });

  describe('multiplyNumbers', () => {
    test('should multiply multiple numbers', () => {
      const result = multiplyNumbers([0.3, 0.1, 0.1]);
      expect(result).toBe(0.003);
    });

    test('should multiply multiple numbers with precision', () => {
      const result = multiplyNumbers([0.3, 0.1599, 2], 2);
      expect(result).toBe(0.1);
    });
  });

  describe('divideTwoNumbers', () => {
    test('should divide two numbers', () => {
      const result = divideTwoNumbers(0.3, 0.1);
      expect(result).toBe(3);
    });

    test('should divide two numbers with precision', () => {
      const result = divideTwoNumbers(0.3, 0.1555, 2);
      expect(result).toBe(1.93);
    });
  });

  describe('divideNumbers', () => {
    test('should divide multiple numbers', () => {
      const result = divideNumbers([0.3, 0.1, 0.1]);
      expect(result).toBe(30);
    });

    test('should divide multiple numbers with precision', () => {
      const result = divideNumbers([0.3, 0.1599, 2], 2);
      expect(result).toBe(0.94);
    });
  });
});
