import { QUOTATION_IDENTIFIER_MOCK } from '../../../../testing/mocks/models/quotation';
import * as processCaseUtils from './active-case.utils';

describe('ActiveCaseUtils', () => {
  describe('mapQueryParamsToIdentifier', () => {
    let queryParams;

    test('should return undefined, if mandatory params are missing', () => {
      queryParams = {};

      expect(
        processCaseUtils.mapQueryParamsToIdentifier(queryParams)
      ).toBeUndefined();
    });

    test('should return QuotationIdentifier', () => {
      queryParams = {
        quotation_number: QUOTATION_IDENTIFIER_MOCK.gqId,
        customer_number: QUOTATION_IDENTIFIER_MOCK.customerNumber,
        sales_org: QUOTATION_IDENTIFIER_MOCK.salesOrg,
      };

      expect(processCaseUtils.mapQueryParamsToIdentifier(queryParams)).toEqual(
        QUOTATION_IDENTIFIER_MOCK
      );
    });
  });

  describe('mapQuotationIdentifierToQueryParamsString', () => {
    test('should QuotationIdentifier to query params string', () => {
      const gqId = 999;
      const customerNumber = '20577';
      const salesOrg = '7895';

      const quotationIdentifier = {
        gqId,
        customerNumber,
        salesOrg,
      };

      expect(
        processCaseUtils.mapQuotationIdentifierToQueryParamsString(
          quotationIdentifier
        )
      ).toBe(
        `quotation_number=${gqId}&customer_number=${customerNumber}&sales_org=${salesOrg}`
      );
    });
  });

  describe('checkEqualityOfIdentifier', () => {
    let fromRoute;
    let current;
    let result;

    beforeEach(() => {
      fromRoute = undefined;
      current = undefined;
      result = undefined;
    });

    test('should return false, if current value is undefined', () => {
      fromRoute = QUOTATION_IDENTIFIER_MOCK;
      current = undefined;

      result = processCaseUtils.checkEqualityOfIdentifier(fromRoute, current);

      expect(result).toBeFalsy();
    });

    test('should return false, if one value differs', () => {
      fromRoute = QUOTATION_IDENTIFIER_MOCK;
      current = {
        ...QUOTATION_IDENTIFIER_MOCK,
        gqId: 62_456,
      };

      result = processCaseUtils.checkEqualityOfIdentifier(fromRoute, current);

      expect(result).toBeFalsy();
    });
    test('should return true, if all values are the same', () => {
      fromRoute = QUOTATION_IDENTIFIER_MOCK;
      current = fromRoute;

      result = processCaseUtils.checkEqualityOfIdentifier(fromRoute, current);

      expect(result).toBeTruthy();
    });
  });
});
