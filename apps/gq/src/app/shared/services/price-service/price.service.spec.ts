import {
  COMPARABLE_LINKED_TRANSACTION_MOCK,
  EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_DETAILS_MOCK,
} from '../../../../testing/mocks';
import {
  SapConditionType,
  SapPriceConditionDetail,
} from '../../../core/store/reducers/sap-price-details/models';
import { ColumnFields } from '../../ag-grid/constants/column-fields.enum';
import { KpiValue } from '../../components/modal/editing-modal/kpi-value.model';
import { StatusBarProperties } from '../../models';
import { QuotationDetail } from '../../models/quotation-detail';
import { PriceService } from './price.service';

describe('PriceService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addCalculationForDetail', () => {
    test('should return detail', () => {
      const detail: QuotationDetail = {
        ...QUOTATION_DETAIL_MOCK,
      };

      PriceService.addCalculationsForDetail(detail);

      expect(detail).toEqual(QUOTATION_DETAIL_MOCK);
    });
  });

  [
    { value: 20, roundedValue: 20 },
    { value: 20.01, roundedValue: 20.01 },
    { value: 20.012, roundedValue: 20.01 },
    { value: 20.018, roundedValue: 20.02 },
    { value: 20.016, roundedValue: 20.02 },
    { value: 20.024, roundedValue: 20.02 },
    { value: 20.0149, roundedValue: 20.01 },
    { value: 20.0144, roundedValue: 20.01 },
    { value: 20.014_56, roundedValue: 20.01 },
    { value: 20.014_423, roundedValue: 20.01 },
  ].forEach((testCase) => {
    test(`should correctly round all price values of ${testCase.value} to ${testCase.roundedValue}`, () => {
      const detail: QuotationDetail = {
        ...QUOTATION_DETAIL_MOCK,
        price: testCase.value,
        recommendedPrice: testCase.value,
        lastCustomerPrice: testCase.value,
        gpc: testCase.value,
        sqv: testCase.value,
      };

      PriceService.addCalculationsForDetail(detail);

      expect(detail.price).toEqual(testCase.roundedValue);
      expect(detail.recommendedPrice).toEqual(testCase.roundedValue);
      expect(detail.lastCustomerPrice).toEqual(testCase.roundedValue);
      expect(detail.gpc).toEqual(testCase.roundedValue);
      expect(detail.sqv).toEqual(testCase.roundedValue);
    });
  });

  // eslint-disable-next-line unicorn/no-null
  ['asd', undefined, null].forEach((val) => {
    test(`should not round invalid value ${val}`, () => {
      const spy = jest.spyOn(PriceService, 'roundValue');
      const detail: QuotationDetail = {
        ...QUOTATION_DETAIL_MOCK,
        price: val as any,
        recommendedPrice: val as any,
        lastCustomerPrice: val as any,
        gpc: val as any,
        sqv: val as any,
      };

      PriceService.addCalculationsForDetail(detail);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('multiplyAndRoundValues', () => {
    test('should return multiplied rounded value', () => {
      const result = PriceService.multiplyAndRoundValues(1.111_11, 100);
      expect(result).toEqual(111.11);
    });
    test('should return undefined', () => {
      const result = PriceService.multiplyAndRoundValues(undefined, 100);
      expect(result).toEqual(undefined);
    });
  });
  describe('addCalculationForDetails', () => {
    test('should call addCalculationForDetail', () => {
      const details = [QUOTATION_DETAIL_MOCK];
      PriceService.addCalculationsForDetail = jest.fn();

      PriceService.addCalculationsForDetails(details);
      expect(PriceService.addCalculationsForDetail).toHaveBeenCalledTimes(1);
    });
  });

  describe('calculatepriceDiff should', () => {
    test.each([
      { lastCustomerPrice: 110, price: 120, expected: 9.09 },
      { lastCustomerPrice: 100, price: 50, expected: -50 },
      { lastCustomerPrice: undefined, price: 100, expected: undefined },
      { lastCustomerPrice: 137, price: 137, expected: 0 },
      { lastCustomerPrice: 0.237, price: 0.237, expected: 0 },
    ])('calculate diff in %', ({ lastCustomerPrice, price, expected }) => {
      const detail = {
        lastCustomerPrice,
        price,
      } as any;

      const result = PriceService.calculatepriceDiff(detail);

      expect(result).toEqual(expected);
    });
  });

  describe('calculateNetValue', () => {
    test('should return NetValue', () => {
      const price = 10;
      const quantity = 5;

      const result = PriceService.calculateNetValue(price, quantity);
      expect(result).toEqual(50);
    });
    test('should return undefined', () => {
      const result = PriceService.calculateNetValue(undefined, 10);
      expect(result).toBeUndefined();
    });
  });
  describe('calculateMargin', () => {
    test('should return margin', () => {
      const price = 25;
      const margin = 20;

      const result = PriceService.calculateMargin(price, margin);

      expect(result).toEqual(20);
    });
    test('should return undefined', () => {
      const price = 25;
      const margin = undefined as any;

      const result = PriceService.calculateMargin(price, margin);

      expect(result).toEqual(undefined);
    });
  });

  describe('calculateDiscount', () => {
    test('should return discount', () => {
      const detail = {
        sapGrossPrice: 200,
        price: 100,
        material: { priceUnit: 1 },
      } as any;

      const result = PriceService.calculateDiscount(detail.price, detail);

      expect(result).toEqual(50);
    });
    test('should return undefined', () => {
      const detail = {
        sapGrossPrice: undefined,
        price: 100,
      } as any;

      const result = PriceService.calculateDiscount(detail.price, detail);

      expect(result).toEqual(undefined);
    });
  });

  describe('getManualPriceByDiscount', () => {
    test('should return manualPrice', () => {
      const manualPrice = PriceService.getManualPriceByDiscount(100, 20);

      expect(manualPrice).toEqual(80);
    });
  });
  describe('getManualPriceByMarginAndCost', () => {
    test('should return manualPrice', () => {
      const manualPrice = PriceService.getManualPriceByMarginAndCost(100, 20);

      expect(manualPrice).toEqual(125);
    });
  });
  describe('calculateStatusBarValues should', () => {
    test('return calculatedValues', () => {
      const details = [QUOTATION_DETAIL_MOCK];

      const result = PriceService.calculateStatusBarValues(details);

      expect(result).toEqual(
        new StatusBarProperties(
          QUOTATION_DETAIL_MOCK.netValue,
          QUOTATION_DETAIL_MOCK.gpi,
          QUOTATION_DETAIL_MOCK.gpm,
          QUOTATION_DETAIL_MOCK.priceDiff,
          details.length
        )
      );
    });
    test('only use max quantity to calculate StatusBarCalculation, if same materialNumber15 appear', () => {
      const result = PriceService.calculateStatusBarValues(
        QUOTATION_DETAILS_MOCK
      );
      expect(result).toEqual(
        new StatusBarProperties(2020.4, 24.74, 0.99, 0.2, 3)
      );
    });
  });

  describe('keepMaxQuantityIfDuplicate should', () => {
    test('only use max quantity to calculate StatusBarCalculation, if same materialNumber15 appear', () => {
      const result = PriceService.keepMaxQuantityIfDuplicate(
        QUOTATION_DETAILS_MOCK
      );

      expect(result.length).toEqual(2);
    });
  });

  describe('roundPercentageToTwoDecimals', () => {
    test('should round to two decimals', () => {
      const result = PriceService.roundPercentageToTwoDecimals(0.5555);
      expect(result).toEqual(55.55);
    });
  });
  describe('roundToTwoDecimals should round to', () => {
    test('two decimals', () => {
      const result = PriceService.roundToTwoDecimals(1.2222);
      expect(result).toEqual(1.22);
    });
    test('undefined', () => {
      const result = PriceService.roundToTwoDecimals(undefined as any);
      // eslint-disable-next-line unicorn/prefer-number-properties
      expect(result).toEqual(NaN);
    });
  });
  describe('executeTransactionComputations', () => {
    test('should return multipliedTransacitons', () => {
      const transactions = [
        { ...COMPARABLE_LINKED_TRANSACTION_MOCK, profitMargin: 0.511_11 },
      ];

      const result = PriceService.executeTransactionComputations(
        transactions,
        100
      );

      expect(result).toEqual([
        {
          ...COMPARABLE_LINKED_TRANSACTION_MOCK,
          price: 1000,
          profitMargin: 0.51,
        },
      ]);
    });
  });

  describe('multiplyExtendedComparableLinkedTransactionsWithPriceUnit', () => {
    test('should return multiplied ExtendedComparableLinkedTransactions', () => {
      const transactions = [EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK];
      const priceUnit = 100;
      const priceUnitsForQuotationItemIds = [
        { priceUnit, quotationItemId: 60 },
      ];

      const result =
        PriceService.multiplyExtendedComparableLinkedTransactionsWithPriceUnit(
          transactions,
          priceUnitsForQuotationItemIds
        );

      expect(result).toEqual([
        {
          ...EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK,
          price: EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK.price * priceUnit,
        },
      ]);
    });
  });
  describe('calculateMsp', () => {
    test('should return msp', () => {
      const result = PriceService.calculateMsp(100, 15);

      expect(result).toEqual(85);
    });
  });
  describe('calculateSapPriceValues', () => {
    test('should set msp & rsp', () => {
      const detail = {
        filteredSapConditionDetails: [
          {
            sapConditionType: SapConditionType.ZMIN,
            amount: 100,
          } as SapPriceConditionDetail,
          {
            sapConditionType: SapConditionType.ZRTU,
            amount: 15,
          } as SapPriceConditionDetail,
        ],
      } as QuotationDetail;
      PriceService.calculateMsp = jest.fn(() => 85);

      PriceService.calculateSapPriceValues(detail);
      expect(detail.msp).toEqual(85);
      expect(detail.rsp).toEqual(100);
    });
  });
  describe('calculateAffectedKPIs', () => {
    test('should return empty array for quantity', () => {
      const result = PriceService.calculateAffectedKPIs(
        1,
        ColumnFields.ORDER_QUANTITY,
        QUOTATION_DETAIL_MOCK
      );
      expect(result).toEqual([]);
    });
    test('should return kpis for price', () => {
      PriceService.multiplyAndRoundValues = jest.fn(() => 1);
      PriceService.calculateMargin = jest.fn(() => 2);
      PriceService.calculateDiscount = jest.fn(() => 3);
      const result = PriceService.calculateAffectedKPIs(
        1,
        ColumnFields.PRICE,
        QUOTATION_DETAIL_MOCK
      );

      expect(PriceService.multiplyAndRoundValues).toHaveBeenCalled();

      const expected: KpiValue[] = [
        { key: ColumnFields.PRICE, value: 1 },
        { key: ColumnFields.GPI, value: 2 },
        { key: ColumnFields.GPM, value: 2 },
        { key: ColumnFields.DISCOUNT, value: 3 },
      ];
      expect(result).toEqual(expected);
    });
    test('should return kpis for gpi', () => {
      PriceService.calculateMargin = jest.fn(() => 1);
      PriceService.getManualPriceByMarginAndCost = jest.fn(() => 23);
      PriceService.calculateDiscount = jest.fn(() => 3);
      const result = PriceService.calculateAffectedKPIs(
        1,
        ColumnFields.GPI,
        QUOTATION_DETAIL_MOCK
      );

      expect(PriceService.getManualPriceByMarginAndCost).toHaveBeenCalled();

      const expected: KpiValue[] = [
        { key: ColumnFields.PRICE, value: 23 },
        { key: ColumnFields.GPM, value: 1 },
        { key: ColumnFields.DISCOUNT, value: 3 },
      ];
      expect(result).toEqual(expected);
    });
    test('should return kpis for gpm', () => {
      PriceService.calculateMargin = jest.fn(() => 1);
      PriceService.getManualPriceByMarginAndCost = jest.fn(() => 23);
      PriceService.calculateDiscount = jest.fn(() => 3);
      const result = PriceService.calculateAffectedKPIs(
        1,
        ColumnFields.GPM,
        QUOTATION_DETAIL_MOCK
      );

      expect(PriceService.getManualPriceByMarginAndCost).toHaveBeenCalled();

      const expected: KpiValue[] = [
        { key: ColumnFields.PRICE, value: 23 },
        { key: ColumnFields.GPI, value: 1 },
        { key: ColumnFields.DISCOUNT, value: 3 },
      ];
      expect(result).toEqual(expected);
    });
    test('should return kpis for discount', () => {
      PriceService.calculateMargin = jest.fn(() => 1);
      PriceService.getManualPriceByDiscount = jest.fn(() => 23);
      PriceService.calculateDiscount = jest.fn(() => 3);
      const result = PriceService.calculateAffectedKPIs(
        1,
        ColumnFields.DISCOUNT,
        QUOTATION_DETAIL_MOCK
      );

      expect(PriceService.getManualPriceByDiscount).toHaveBeenCalled();

      const expected: KpiValue[] = [
        { key: ColumnFields.PRICE, value: 23 },
        { key: ColumnFields.GPI, value: 1 },
        { key: ColumnFields.GPM, value: 1 },
      ];
      expect(result).toEqual(expected);
    });
    test('should throw error for other columns', () => {
      expect(() =>
        PriceService.calculateAffectedKPIs(
          1,
          ColumnFields.FOLLOWING_TYPE,
          QUOTATION_DETAIL_MOCK
        )
      ).toThrowError(new Error('No matching Column Field for computation'));
    });
    test('should return kpis for absolute price', () => {
      PriceService.multiplyAndRoundValues = jest.fn(() => 1);
      PriceService.calculateMargin = jest.fn(() => 2);
      PriceService.calculateDiscount = jest.fn(() => 3);
      const result = PriceService.calculateAffectedKPIs(
        1,
        ColumnFields.PRICE,
        QUOTATION_DETAIL_MOCK,
        false
      );

      expect(PriceService.multiplyAndRoundValues).not.toHaveBeenCalled();

      const expected: KpiValue[] = [
        { key: ColumnFields.PRICE, value: 1 },
        { key: ColumnFields.GPI, value: 2 },
        { key: ColumnFields.GPM, value: 2 },
        { key: ColumnFields.DISCOUNT, value: 3 },
      ];
      expect(result).toEqual(expected);
    });
  });
});
