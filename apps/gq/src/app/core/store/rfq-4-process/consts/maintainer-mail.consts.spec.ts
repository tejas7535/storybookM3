import { QuotationDetail } from '@gq/shared/models';

import {
  getMailBodyString,
  getMailSubjectString,
  getSeperatedNamesOfMaintainers,
  mailFallback,
} from './maintainer-mail.consts';

describe('maintainerMail Constants', () => {
  describe('getMailSubjectString', () => {
    test('should format the input to string', () => {
      const quotationDetail = {
        productionPlant: {
          plantNumber: '12345',
        },
        material: {
          productLineId: 'PL123',
        },
      } as unknown as QuotationDetail;
      const result = getMailSubjectString(quotationDetail);
      expect(result).toBe('Missing Calculator User for 12345 / PL123');
    });
  });

  describe('getMailBodyString', () => {
    test('should format the input to string', () => {
      const persons = 'John Doe and Jane Smith';
      const quotationDetail = {
        material: {
          materialDescription: 'Test Material',
          productLineId: 'PL123',
          productHierarchyId: 'PH123',
        },
        productionPlant: {
          plantNumber: '12345',
          city: 'Test City',
        },
      } as unknown as QuotationDetail;
      const result = getMailBodyString(persons, quotationDetail);
      expect(result).toBe(`Dear John Doe and Jane Smith,
the routing to responsible calculation department failed. Please maintain the related SAP-table with the correct calculator(-pool) and inform Sales-User afterwards to start the workflow again.

Material Description: Test Material
Production Plant: 12345 Test City
Product Line: PL123
Product Hierarchy: PH123

Thank you very much

Guided Quoting`);
    });
  });

  describe('getSeperatedNamesOfMaintainers', () => {
    it('should return fallback when maintainerNames is an empty array', () => {
      const result = getSeperatedNamesOfMaintainers([], 'and');
      expect(result).toBe(mailFallback);
    });

    it('should return the single name when maintainerNames contains one name', () => {
      const result = getSeperatedNamesOfMaintainers(['Alice'], 'and');
      expect(result).toBe('Alice');
    });

    it('should return names separated by commas and the lastItemSeperator when maintainerNames contains multiple names', () => {
      const result = getSeperatedNamesOfMaintainers(
        ['Alice', 'Bob', 'Charlie'],
        'and'
      );
      expect(result).toBe('Alice, Bob and Charlie');
    });
  });
});
