import { QuotationDetail } from '@gq/shared/models';

import {
  getMailBodyString,
  getMailSubjectString,
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
      const personA = 'John Doe';
      const personB = 'Jane Smith';
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
      const result = getMailBodyString(personA, personB, quotationDetail);
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
});
